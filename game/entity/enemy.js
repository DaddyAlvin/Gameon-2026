import { SuperClass } from "./superclass.js";

export class Enemy extends SuperClass {
    // Om waypoints är tom [] så står fienden helt stilla
    constructor(x, y, width, height, range, fov, direction, img, floor = 0, waypoints = [], facing = 0) {
        super(x, y, width, height, range, fov, direction, img);
        this.radius = 15;
        this.floor = floor;
        this.facing = facing; // Vinkel i radianer (0 = höger)

        this.waypoints = waypoints;
        this.currentWaypoint = 0;
        this.walkSpeed = 90;

        this.state = "patrol"; // "patrol", "investigate" eller "caught"
        this.waitTimer = 0;

        this.targetX = 0;
        this.targetY = 0;

        this.isCaught = false;
    }

    // Returns box/circle size for the enemy
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
            radius: this.radius
        };
    }

    // Enemy-specific intersection check
    intersects(other) {
        if (other.radius !== undefined) {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const r = this.radius + other.radius;
            return (dx * dx + dy * dy) < (r * r);
        }

        if (other.width !== undefined && other.height !== undefined) {
            const closestX = Math.max(other.x, Math.min(this.x, other.x + other.width));
            const closestY = Math.max(other.y, Math.min(this.y, other.y + other.height));

            const dx = this.x - closestX;
            const dy = this.y - closestY;
            return (dx * dx + dy * dy) < (this.radius * this.radius);
        }

        return false;
    }

    // Individual detectCollision method for Enemy
    detectCollision(entityList) {
        entityList.forEach(other => {
            if (other === this) return;

            if (this.intersects(other)) {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.hypot(dx, dy);
                const minDist = this.radius + (other.radius || 15);

                if (distance < minDist && distance > 0) {
                    const overlap = minDist - distance;
                    const angle = Math.atan2(dy, dx);
                    
                    // Push enemy back
                    this.x += Math.cos(angle) * overlap;
                    this.y += Math.sin(angle) * overlap;
                }
            }
        });
    }

    update(dt) {
        if (this.state === "caught") return;

        // 1. Om fienden står stilla och väntar (vid waypoint eller ljud)
        if (this.waitTimer > 0) {
            this.waitTimer -= dt;

            if (this.waitTimer <= 0) {
                if (this.state === "investigate") {
                    this.state = "patrol"; // Klar med att leta -> tillbaka till patrull
                } else {
                    // Välj nästa waypoint
                    this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                }
            }
            return;
        }

        // 2. Undersök ljud
        if (this.state === "investigate") {
            if (this.walkTo(this.targetX, this.targetY, dt)) {
                this.waitTimer = 2; // Stanna i 2 sekunder
            }
        }

        // 3. Vanlig patrull (går bara om det finns waypoints, annars står den still)
        else if (this.state === "patrol" && this.waypoints.length > 0) {
            let wp = this.waypoints[this.currentWaypoint];
            if (this.walkTo(wp.x, wp.y, dt)) {
                this.waitTimer = 2; // Stanna vid waypoint i 2 sekunder
            }
        }
    }

    // Går rakt mot (targetX, targetY). Returnerar true när fienden är framme.
    walkTo(targetX, targetY, dt) {
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < 4) return true; // Framme!

        // Peka direkt mot målet och gå framåt
        this.facing = Math.atan2(dy, dx);
        this.x += Math.cos(this.facing) * this.walkSpeed * dt;
        this.y += Math.sin(this.facing) * this.walkSpeed * dt;
        return false;
    }

    // Be fienden gå till ett ljud
    investigateAt(x, y) {
        if (this.isCaught) return;
        this.state = "investigate";
        this.targetX = x;
        this.targetY = y;
        this.waitTimer = 0;
    }

    // Kallas när spelaren blir upptäckt
    catchPlayer() {
        this.state = "caught";
        this.isCaught = true;
    }

    draw(ctx, camera) {
        ctx.save();
        // Adjust for camera offset if your camera tracks the player
        const renderX = this.x - (camera ? camera.x : 0);
        const renderY = this.y - (camera ? camera.y : 0);

        ctx.translate(renderX, renderY);
        ctx.rotate(this.facing);

        // Draw enemy placeholder rectangle or image
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            ctx.fillStyle = 'red'; // Fallback color if image isn't loaded yet
            ctx.fillRect(-15, -15, 30, 30);
        }

        ctx.restore();
    }
}
