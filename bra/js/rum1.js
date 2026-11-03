/**
 * Konfiguration och logik för Planritning 1
 */
window.onload = function() {
    const plan = new FloorPlan('floorPlanCanvas', {
        scale: 2.85,
        offsetX: 40,
        offsetY: 40,
        refX: 10,
        refY: 12,
        bgImagePath: 'pictures/rum1.png',
        bgRect: { x1: 10, y1: 12, x2: 648, y2: 370 }
    });

    // --- OBJEKTLISTA ---
    plan.setObjects([
        { name: "BILJARDBORD",   x1: 40,  y1: 141, x2: 234, y2: 261 },
        { name: "BOKHYLLA 1",    x1: 443, y1: 21,  x2: 607, y2: 52 },
        { name: "BOKHYLLA 2",    x1: 443, y1: 70,  x2: 607, y2: 102 },
        { name: "BOKHYLLA 3",    x1: 402, y1: 217, x2: 566, y2: 248 },
        { name: "VÄXT 1",        x1: 392, y1: 23,  x2: 412, y2: 41 },
        { name: "VÄXT 2",        x1: 392, y1: 41,  x2: 412, y2: 59 },
        { name: "VÄXT 3",        x1: 392, y1: 62,  x2: 412, y2: 80 },
        { name: "VÄXT 4",        x1: 392, y1: 83,  x2: 412, y2: 101 },
        { name: "VÄXT 5",        x1: 392, y1: 269, x2: 412, y2: 287 }
    ]);

    // Koppla bilder till objekt
    plan.bindObjectImages({
        "BILJARDBORD": "biljard",
        "BOKHYLLA 1": "bokhylla",
        "BOKHYLLA 2": "bokhylla",
        "BOKHYLLA 3": "bokhylla",
        "VÄXT 1": "blomma",
        "VÄXT 2": "blomma",
        "VÄXT 3": "blomma",
        "VÄXT 4": "blomma",
        "VÄXT 5": "blomma"
    });

    // --- VÄGGAR ---
    const walls = [
        // Yttre ram
        [10, 12, 14, 370], [10, 366, 648, 370], [10, 12, 200, 16],
        [275, 12, 648, 16], [644, 12, 648, 143], [644, 200, 648, 370],
        [10, 12, 23, 24], [10, 357, 23, 370],
        // Inre väggar
        [369, 12, 383, 143], [369, 138, 385, 143], [438, 138, 648, 143],
        [369, 200, 648, 205], [369, 200, 376, 370], [376, 200, 383, 289],
        [376, 340, 383, 370]
    ];
    walls.forEach(w => plan.addWall(...w));

    // --- BADGES / KARAKTÄRER ---
    const mariaImage = new Image();
    mariaImage.onload = () => plan.draw();
    mariaImage.src = 'pictures/billys.png';

    plan.addBadge({ x: 234, y: 236, label: "VAKT", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 40 });
    plan.addBadge({ x: 407, y: 316, label: "MARIA", strokeColor: "#ec4899", fillColor: "#ffffff", radius: 40, backdropImg: mariaImage, backdropOffset: { x: 100, y: -40, w: 80, h: 80 } });

    // --- ANPASSAD RITNING (Exit, Entrance, Dörr, Vaktbana) ---
    plan.addCustomDraw((ctx, engine) => {
        // EXIT
        const x1 = engine.sx(200), x2 = engine.sx(275);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(x1, engine.sy(12) + 2, x2 - x1, 8);
        ctx.fillStyle = "#15803d";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("EXIT", (x1 + x2) / 2, engine.sy(12) - 4);

        // ENTRANCE
        const y1 = engine.sy(143), y2 = engine.sy(200);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(engine.sx(644), y1, 8, y2 - y1);
        ctx.save();
        ctx.translate(engine.sx(648) + 24, (y1 + y2) / 2);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Entrance", 0, 0);
        ctx.restore();

        // LÅST DÖRR
        const lx = engine.sx(385), lw = engine.sl(438 - 385);
        const cy = engine.sy(140.5), lh = 22;
        ctx.save();
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.roundRect(lx, cy - lh / 2, lw, lh, 4);
        ctx.fill();
        ctx.strokeStyle = "#7f1d1d";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Låst dörr / No access", lx + lw / 2, cy);
        ctx.restore();

        // VAKTBANA
        const L = engine.sx(234), R = engine.sx(324), T = engine.sy(117), B = engine.sy(279);
        const r = 26;
        ctx.save();
        ctx.strokeStyle = "#475569";
        ctx.fillStyle = "#475569";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.setLineDash([14, 8]);
        ctx.beginPath();
        ctx.moveTo(L + r, T);
        ctx.arcTo(R, T, R, B, r);
        ctx.arcTo(R, B, L, B, r);
        ctx.arcTo(L, B, L, T, r);
        ctx.arcTo(L, T, R, T, r);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);

        const midX = (L + R) / 2, midY = (T + B) / 2;
        FloorPlan.drawArrowHead(ctx, midX, T, 0);
        FloorPlan.drawArrowHead(ctx, R, midY, Math.PI / 2);
        FloorPlan.drawArrowHead(ctx, midX, B, Math.PI);
        FloorPlan.drawArrowHead(ctx, L, engine.sy(160), -Math.PI / 2);
        ctx.restore();
    });

    plan.draw();
};
