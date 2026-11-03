import { SuperClass } from "./superclass";
export class Enemy extends SuperClass {
    // Om waypoints är tom [] så står fienden helt stilla
    constructor(x, y, floor = 0, waypoints = [], facing = 0) {
        this.x = x;
        this.y = y;
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
}
