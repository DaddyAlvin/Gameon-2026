/**
 * Konfiguration och logik för Planritning 2
 */
window.onload = function() {
    const plan = new FloorPlan('floorPlanCanvas', {
        scale: 3.8,
        offsetX: 40,
        offsetY: 40,
        refX: 10,
        refY: 18,
        bgImagePath: 'pictures/rum1.png',
        bgRect: { x1: 10, y1: 18, x2: 481, y2: 283 }
    });

    // --- OBJEKTLISTA ---
    plan.setObjects([
        { name: "STORT OBJEKT (övre mitten)", x1: 172, y1: 22,  x2: 328, y2: 105, shape: "rect" },
        { name: "BILJARDBORD",                 x1: 97,  y1: 154, x2: 156, y2: 246, shape: "rect" },
        { name: "SKÅP",                        x1: 12,  y1: 205, x2: 62,  y2: 279, shape: "rect" },
        { name: "BÄNK 1 (höger rum)",          x1: 353, y1: 63,  x2: 401, y2: 78,  shape: "rect" },
        { name: "BÄNK 2 (höger rum)",          x1: 419, y1: 123, x2: 467, y2: 137, shape: "rect" },
        { name: "BÄNK 3 (höger rum)",          x1: 351, y1: 180, x2: 398, y2: 195, shape: "rect" },
        { name: "TAVLA",                       x1: 343, y1: 273, x2: 467, y2: 279, shape: "rect", fill: "#ffffff" },
        { name: "BORD (lilla rummet)",         x1: 270, y1: 221, x2: 288, y2: 263, shape: "rect" }
    ]);

    // Koppla bilder
    plan.bindObjectImages({
        "SKÅP": "Skåp",
        "BILJARDBORD": "bord",
        "BORD (lilla rummet)": "bord",
        "BÄNK 1 (höger rum)": "bord",
        "BÄNK 2 (höger rum)": "bord",
        "BÄNK 3 (höger rum)": "bord"
    });

    // --- VÄGGAR ---
    const walls = [
        [10, 18, 14, 283], [10, 279, 481, 283], [477, 18, 481, 283],
        [10, 18, 60, 22], [115, 18, 415, 22], [470, 18, 481, 22],
        [326, 22, 330, 125], [326, 146, 330, 279],
        [204, 168, 243, 172], [265, 168, 326, 172], [203, 168, 207, 279]
    ];
    walls.forEach(w => plan.addWall(...w));

    // --- BADGES ---
    plan.addBadge({ x: 134, y: 135, label: "VAKT", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 40 });
    plan.addBadge({ x: 79, y: 255, label: "VAKT EFTER", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 40, fontSize: 13 });
    plan.addBadge({ x: 407, y: 243, label: "VAKT", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 40 });

    // Ficklampa bild
    const flashlightImage = new Image();
    flashlightImage.onload = () => plan.draw();
    flashlightImage.src = 'pictures/ficklampa.png';

    // --- ANPASSAD RITNING ---
    plan.addCustomDraw((ctx, engine) => {
        // ENTRANCE
        const ex1 = engine.sx(60), ex2 = engine.sx(115);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(ex1, engine.sy(18) + 4, ex2 - ex1, 8);
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Entrance", (ex1 + ex2) / 2, engine.sy(18) - 4);

        // EXIT
        const xx1 = engine.sx(415), xx2 = engine.sx(470);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(xx1, engine.sy(18) + 4, xx2 - xx1, 8);
        ctx.fillStyle = "#15803d";
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("EXIT", (xx1 + xx2) / 2, engine.sy(18) - 4);

        // Ficklampa
        if (flashlightImage.complete && flashlightImage.naturalWidth > 0) {
            ctx.drawImage(flashlightImage, engine.sx(148) - 40, engine.sy(42) - 40, 120, 100);
        }
    });

    plan.draw();
};
