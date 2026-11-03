/**
 * Konfiguration och logik för Planritning 3
 */
window.onload = function() {
    const keyImage = new Image();
    keyImage.src = 'pictures/nyckel.png';
    keyImage.onload = () => plan.draw();

    const plan = new FloorPlan('floorPlanCanvas', {
        scale: 3.0,
        offsetX: 40,
        offsetY: 70,
        refX: 7,
        refY: 20,
        bgImagePath: 'pictures/background.png',
        bgRect: { x1: 7, y1: 19, x2: 1283, y2: 379 }
    });

    // --- OBJEKTLISTA ---
    plan.setObjects([
        { name: "STORT OMRÅDE (övre höger)",   x1: 570, y1: 20,  x2: 1112, y2: 158, shape: "rect" },
        { name: "TOPP-BLOCK",                  x1: 410, y1: 20,  x2: 570,  y2: 52,  shape: "rect" },
        { name: "STORT BORD",                  x1: 672, y1: 297, x2: 813,  y2: 347, shape: "rect" },
        { name: "LÅG Soffa nedre",             x1: 672, y1: 350, x2: 845,  y2: 380, shape: "rect" },
        { name: "Vägg",                        x1: 841, y1: 260, x2: 845,  y2: 377, shape: "rect" },
        { name: "RUNT OBJEKT 1",               cx: 559, cy: 357, rx: 12, ry: 11, shape: "ellipse" },
        { name: "RUNT OBJEKT 2",               cx: 594, cy: 357, rx: 12, ry: 11, shape: "ellipse" },
        { name: "RUNT OBJEKT 3",               cx: 631, cy: 357, rx: 12, ry: 11, shape: "ellipse" },
        { name: "HANDFAT 1",                   cx: 430, cy: 60,  rx: 10,  ry: 8,  shape: "ellipse", fill: "#ffffff" },
        { name: "HANDFAT 2",                   cx: 454, cy: 60,  rx: 10,  ry: 8,  shape: "ellipse", fill: "#ffffff" },
        { name: "HANDFAT 3",                   cx: 478, cy: 60,  rx: 10,  ry: 8,  shape: "ellipse", fill: "#ffffff" },
        { name: "HANDFAT 4",                   cx: 502, cy: 60,  rx: 10,  ry: 8,  shape: "ellipse", fill: "#ffffff" },
        { name: "NYCKEL",                      cx: 310, cy: 340, shape: "key", img: keyImage }
    ]);

    // Koppla bilder
    plan.bindObjectImages({
        "STORT BORD": "stenbord",
        "LÅG Soffa nedre": "soffa",
        "RUNT OBJEKT 1": "sacksack",
        "RUNT OBJEKT 2": "sacksack2",
        "RUNT OBJEKT 3": "sacksack",
        "HANDFAT 1": "handfat",
        "HANDFAT 2": "handfat",
        "HANDFAT 3": "handfat",
        "HANDFAT 4": "handfat"
    });

    // --- VÄGGAR ---
    const walls = [
        [7, 19, 1177, 23], [1233, 19, 1283, 23], [7, 375, 463, 379],
        [538, 375, 1283, 379], [7, 19, 11, 379], [1279, 19, 1283, 379],
        [1108, 23, 1112, 183], [1108, 208, 1112, 312],
        [109, 23, 113, 124], [109, 120, 138, 124], [200, 120, 520, 124],
        [559, 120, 570, 124], [264, 49, 389, 53], [403, 49, 410, 53],
        [264, 49, 268, 124], [327, 49, 331, 60], [327, 76, 331, 124],
        [264, 85, 331, 89], [80, 180, 363, 184], [359, 180, 363, 379],
        [843, 238, 864, 242], [900, 238, 1112, 242], [841, 238, 845, 262]
    ];
    walls.forEach(w => plan.addWall(...w));

    // --- BADGES ---
    plan.addBadge({ x: 306, y: 153, label: "VAKT", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 62, fontSize: 26 });
    plan.addBadge({ x: 918, y: 199, label: "VAKT", strokeColor: "#2563eb", fillColor: "#ffffff", radius: 62, fontSize: 26 });

    // Toalettbild
    const toiletImage = new Image();
    toiletImage.onload = () => plan.draw();
    toiletImage.src = 'pictures/toa.png';

    // --- ANPASSAD RITNING ---
    plan.addCustomDraw((ctx, engine) => {
        // ENTRANCE
        const ex1 = engine.sx(1177), ex2 = engine.sx(1233);
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(ex1, engine.sy(19) + 4, ex2 - ex1, 16);
        ctx.fillStyle = "#1d4ed8";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText("Entrance", (ex1 + ex2) / 2, engine.sy(19) - 12);

        // EXIT
        const xx1 = engine.sx(463), xx2 = engine.sx(538);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(xx1, engine.sy(379) - 20, xx2 - xx1, 16);
        ctx.fillStyle = "#15803d";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText("EXIT", (xx1 + xx2) / 2, engine.sy(395) + 12);

        // Toalettikoner
        [70, 102].forEach(y => {
            const x = engine.sx(267), top = engine.sy(y - 10);
            const width = engine.sl(20), height = engine.sl(20);
            if (toiletImage.complete && toiletImage.naturalWidth) {
                ctx.drawImage(toiletImage, x, top, width, height);
            } else {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x, top, width, height);
            }
        });

        // Dörr som knappen öppnar
        ctx.save();
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(engine.sx(389), engine.sy(51));
        ctx.lineTo(engine.sx(403), engine.sy(51));
        ctx.stroke();
        ctx.restore();
    });

    plan.draw();
};
