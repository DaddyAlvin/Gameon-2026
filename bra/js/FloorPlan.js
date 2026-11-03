/**
 * FloorPlan Engine - Object Oriented Canvas Floor Plan Renderer
 */

class FloorObject {
    constructor(config) {
        this.name = config.name;
        this.shape = config.shape || 'rect'; // 'rect', 'ellipse', 'key', 'circle'
        this.x1 = config.x1;
        this.y1 = config.y1;
        this.x2 = config.x2;
        this.y2 = config.y2;
        this.cx = config.cx;
        this.cy = config.cy;
        this.rx = config.rx;
        this.ry = config.ry;
        this.r = config.r;
        this.fill = config.fill || null;
        this.imageName = config.imageName || null;
        this.img = config.img || null;
    }

    draw(ctx, engine) {
        ctx.save();
        if (this.shape === 'key') {
            const x = engine.sx(this.cx), y = engine.sy(this.cy);
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                const boxW = engine.sl(33), boxH = engine.sl(18);
                const scale = Math.min(boxW / this.img.naturalWidth, boxH / this.img.naturalHeight);
                const width = this.img.naturalWidth * scale, height = this.img.naturalHeight * scale;
                ctx.drawImage(this.img, x - width / 2, y - height / 2, width, height);
            } else {
                ctx.strokeStyle = "#facc15";
                ctx.lineWidth = engine.sl(4);
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.arc(x, y, engine.sl(7), 0, Math.PI * 2);
                ctx.moveTo(x + engine.sl(7), y);
                ctx.lineTo(x + engine.sl(24), y);
                ctx.lineTo(x + engine.sl(24), y + engine.sl(5));
                ctx.moveTo(x + engine.sl(17), y);
                ctx.lineTo(x + engine.sl(17), y + engine.sl(5));
                ctx.stroke();
            }
        } else if (this.shape === 'ellipse') {
            const cx = engine.sx(this.cx), cy = engine.sy(this.cy);
            const rx = engine.sl(this.rx), ry = engine.sl(this.ry);
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                const boxW = rx * 2, boxH = ry * 2;
                const k = Math.min(boxW / this.img.width, boxH / this.img.height);
                const dw = this.img.width * k, dh = this.img.height * k;
                ctx.drawImage(this.img, cx - dw / 2, cy - dh / 2, dw, dh);
            } else {
                ctx.fillStyle = this.fill || "#000000";
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.fill();
                if (this.fill) {
                    ctx.strokeStyle = "#475569";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }
        } else if (this.shape === 'circle') {
            const cx = engine.sx(this.cx), cy = engine.sy(this.cy);
            const r = engine.sl(this.r);
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                ctx.drawImage(this.img, cx - r, cy - r, r * 2, r * 2);
            } else {
                ctx.fillStyle = this.fill || "#000000";
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }
        } else { // rect
            const x = engine.sx(this.x1), y = engine.sy(this.y1);
            const w = engine.sl(this.x2 - this.x1), h = engine.sl(this.y2 - this.y1);
            if (this.img && this.img.complete && this.img.naturalWidth > 0) {
                ctx.drawImage(this.img, x, y, w, h);
            } else {
                ctx.fillStyle = this.fill || "#000000";
                ctx.fillRect(x, y, w, h);
                if (this.fill && this.fill !== "#000000") {
                    ctx.strokeStyle = "#475569";
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, w, h);
                }
            }
        }
        ctx.restore();
    }
}

class Wall {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx, engine) {
        ctx.fillRect(engine.sx(this.x1), engine.sy(this.y1), engine.sl(this.x2 - this.x1), engine.sl(this.y2 - this.y1));
    }
}

class CharacterBadge {
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.label = config.label;
        this.strokeColor = config.strokeColor || "#2563eb";
        this.fillColor = config.fillColor || "#ffffff";
        this.fontSize = config.fontSize || 16;
        this.radius = config.radius || 40;
        this.backdropImg = config.backdropImg || null;
        this.backdropOffset = config.backdropOffset || { x: -40, y: -40, w: 80, h: 80 };
    }

    draw(ctx, engine) {
        ctx.save();
        const canvasX = engine.sx(this.x);
        const canvasY = engine.sy(this.y);

        if (this.backdropImg && this.backdropImg.complete && this.backdropImg.naturalWidth > 0) {
            ctx.drawImage(
                this.backdropImg,
                canvasX + this.backdropOffset.x,
                canvasY + this.backdropOffset.y,
                this.backdropOffset.w,
                this.backdropOffset.h
            );
        }

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.fillColor;
        ctx.fill();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = Math.max(3, this.radius / 12);
        ctx.stroke();

        if (this.label) {
            ctx.fillStyle = "#0f172a";
            ctx.font = `bold ${this.fontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.label, canvasX, canvasY);
        }
        ctx.restore();
    }
}

class FloorPlan {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) throw new Error(`Canvas med id '${canvasId}' hittades inte.`);
        this.ctx = this.canvas.getContext('2d');

        this.scale = options.scale || 3.0;
        this.offsetX = options.offsetX || 40;
        this.offsetY = options.offsetY || 40;
        this.refX = options.refX || 10;
        this.refY = options.refY || 12;

        this.bgImagePath = options.bgImagePath || null;
        this.bgRect = options.bgRect || null; // { x1, y1, x2, y2 }
        this.backgroundImage = new Image();

        this.objects = [];
        this.walls = [];
        this.badges = [];
        this.customDrawHandlers = [];

        this.picturesDir = options.picturesDir || "pictures";
        this.extensions = ["png", "jpg", "jpeg", "webp", "gif", "svg"];

        if (this.bgImagePath) {
            this.backgroundImage.onload = () => this.draw();
            this.backgroundImage.onerror = () => console.warn(`Hittade inte ${this.bgImagePath}`);
            this.backgroundImage.src = this.bgImagePath;
        }
    }

    // Coordinate conversion
    sx(x) { return this.offsetX + (x - this.refX) * this.scale; }
    sy(y) { return this.offsetY + (y - this.refY) * this.scale; }
    sl(l) { return l * this.scale; }

    addObject(objConfig) {
        const obj = new FloorObject(objConfig);
        this.objects.push(obj);
        return obj;
    }

    setObjects(objConfigs) {
        this.objects = objConfigs.map(c => new FloorObject(c));
    }

    addWall(x1, y1, x2, y2) {
        this.walls.push(new Wall(x1, y1, x2, y2));
    }

    addBadge(badgeConfig) {
        const badge = new CharacterBadge(badgeConfig);
        this.badges.push(badge);
        return badge;
    }

    addCustomDraw(handler) {
        this.customDrawHandlers.push(handler);
    }

    loadObjectImage(obj, baseName, extensionIndex = 0) {
        if (extensionIndex >= this.extensions.length) {
            console.warn(`Hittade ingen bild för "${baseName}" i mappen ${this.picturesDir}/`);
            return;
        }
        const img = new Image();
        img.onload = () => {
            obj.img = img;
            this.draw();
        };
        img.onerror = () => this.loadObjectImage(obj, baseName, extensionIndex + 1);
        img.src = `${this.picturesDir}/${encodeURIComponent(baseName)}.${this.extensions[extensionIndex]}`;
    }

    bindObjectImages(imageMapping) {
        this.objects.forEach(obj => {
            const imageName = imageMapping[obj.name] || obj.imageName;
            if (imageName) {
                this.loadObjectImage(obj, imageName);
            }
        });
    }

    drawBackground() {
        if (this.backgroundImage.complete && this.backgroundImage.naturalWidth > 0 && this.bgRect) {
            try {
                const left = this.sx(this.bgRect.x1), top = this.sy(this.bgRect.y1);
                const width = this.sx(this.bgRect.x2) - left, height = this.sy(this.bgRect.y2) - top;
                const scale = Math.max(width / this.backgroundImage.naturalWidth, height / this.backgroundImage.naturalHeight);
                const sourceWidth = width / scale, sourceHeight = height / scale;
                const sourceX = (this.backgroundImage.naturalWidth - sourceWidth) / 2;
                const sourceY = (this.backgroundImage.naturalHeight - sourceHeight) / 2;
                
                this.ctx.save();
                this.ctx.globalAlpha = 0.95;
                this.ctx.drawImage(this.backgroundImage, sourceX, sourceY, sourceWidth, sourceHeight, left, top, width, height);
                this.ctx.restore();
            } catch (err) {
                console.error("Kunde inte rita bakgrundsbilden:", err);
            }
        }
    }

    drawWalls() {
        this.ctx.fillStyle = "#000000";
        this.walls.forEach(w => w.draw(this.ctx, this));
    }

    drawObjects() {
        this.objects.forEach(o => o.draw(this.ctx, this));
    }

    drawBadges() {
        this.badges.forEach(b => b.draw(this.ctx, this));
    }

    draw() {
        // Clear background canvas floor
        this.ctx.fillStyle = "#e2e8f0";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawWalls();
        this.drawObjects();

        // Run room-specific custom elements (Exit, Entrance, Guard Paths, etc.)
        this.customDrawHandlers.forEach(handler => handler(this.ctx, this));

        this.drawBadges();
    }
}

// Arrow drawing utility function
FloorPlan.drawArrowHead = function(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -9);
    ctx.lineTo(-8, 9);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
