export class SuperClass {
    constructor(x, y, width, height, range = 180, fov = Math.PI / 3, direction = 0, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.range = range;
        this.fov = fov;
        this.direction = direction;
        this.lightRadius = 30;
        this.visionOverlay = null;

        this.img = new Image();
        this.img.src = img;

        this.img.onload = () => {

            this.width = this.img.naturalWidth;
            this.height = this.img.naturalHeight;
        };
    }

    vissionCone(ctx, camera = null, direction = this.direction, blockers = [], visionSources = [this]) {
        const cameraX = camera?.x ?? 0;
        const cameraY = camera?.y ?? 0;
        const { width, height } = ctx.canvas;
        if (!this.visionOverlay) {
            this.visionOverlay = ctx.canvas.ownerDocument.createElement("canvas");
        }
        const overlay = this.visionOverlay;
        if (overlay.width !== width || overlay.height !== height) {
            overlay.width = width;
            overlay.height = height;
        }

        const overlayCtx = overlay.getContext("2d");
        overlayCtx.globalCompositeOperation = "source-over";
        overlayCtx.clearRect(0, 0, width, height);
        overlayCtx.fillStyle = "rgba(0, 0, 0, 0.88)";
        overlayCtx.fillRect(0, 0, width, height);
        overlayCtx.globalCompositeOperation = "destination-out";

        for (const source of visionSources) {
            if (!source || !Number.isFinite(source.x) || !Number.isFinite(source.y)) continue;

            const sourceDirection = source === this
                ? direction
                : source.angle ?? source.facing ?? source.direction ?? 0;
            const sourceRange = source.range ?? this.range;
            const sourceFov = source.fov ?? this.fov;
            const halfFov = sourceFov / 2;
            const sourceBlockers = blockers.filter(blocker => blocker !== source);
            const rectangles = sourceBlockers
                .map(blocker => {
                    const bounds = typeof blocker.getBounds === "function"
                        ? blocker.getBounds()
                        : blocker;
                    if (
                        !bounds ||
                        !Number.isFinite(bounds.x) ||
                        !Number.isFinite(bounds.y) ||
                        !Number.isFinite(bounds.width) ||
                        !Number.isFinite(bounds.height)
                    ) {
                        return null;
                    }

                    return {
                        left: Math.min(bounds.x, bounds.x + bounds.width),
                        right: Math.max(bounds.x, bounds.x + bounds.width),
                        top: Math.min(bounds.y, bounds.y + bounds.height),
                        bottom: Math.max(bounds.y, bounds.y + bounds.height)
                    };
                })
                .filter(Boolean);
            const rayCount = Math.max(1, Math.ceil(sourceFov / (Math.PI / 90)));
            const angles = [];

            for (let i = 0; i <= rayCount; i++) {
                angles.push(sourceDirection - halfFov + (sourceFov * i) / rayCount);
            }

            for (const rectangle of rectangles) {
                for (const [x, y] of [
                    [rectangle.left, rectangle.top],
                    [rectangle.right, rectangle.top],
                    [rectangle.right, rectangle.bottom],
                    [rectangle.left, rectangle.bottom]
                ]) {
                    const angle = Math.atan2(y - source.y, x - source.x);
                    const offset = Math.atan2(
                        Math.sin(angle - sourceDirection),
                        Math.cos(angle - sourceDirection)
                    );
                    if (Math.abs(offset) <= halfFov) {
                        angles.push(sourceDirection + offset - 0.0001, sourceDirection + offset + 0.0001);
                    }
                }
            }

            angles.sort((a, b) => a - b);
            overlayCtx.beginPath();
            overlayCtx.moveTo(source.x - cameraX, source.y - cameraY);

            for (const angle of angles) {
                const rayX = Math.cos(angle);
                const rayY = Math.sin(angle);
                let distance = sourceRange;

                for (const rectangle of rectangles) {
                    let near = 0;
                    let far = distance;

                    for (const [origin, directionComponent, min, max] of [
                        [source.x, rayX, rectangle.left, rectangle.right],
                        [source.y, rayY, rectangle.top, rectangle.bottom]
                    ]) {
                        if (Math.abs(directionComponent) < 1e-8) {
                            if (origin < min || origin > max) {
                                far = -1;
                                break;
                            }
                            continue;
                        }

                        const first = (min - origin) / directionComponent;
                        const second = (max - origin) / directionComponent;
                        near = Math.max(near, Math.min(first, second));
                        far = Math.min(far, Math.max(first, second));
                    }

                    if (far >= near && far >= 0) {
                        distance = Math.min(distance, near >= 0 ? near : far);
                    }
                }

                overlayCtx.lineTo(
                    source.x + rayX * distance - cameraX,
                    source.y + rayY * distance - cameraY
                );
            }

            overlayCtx.closePath();
            overlayCtx.fill();
            overlayCtx.beginPath();
            overlayCtx.arc(
                source.x - cameraX,
                source.y - cameraY,
                source.lightRadius ?? this.lightRadius,
                0,
                Math.PI * 2
            );
            overlayCtx.fill();
        }

        ctx.drawImage(overlay, 0, 0);
    }
}