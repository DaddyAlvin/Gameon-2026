window.onload = function() {
            const canvas = document.getElementById('floorPlanCanvas');
            const ctx = canvas.getContext('2d');
            const backgroundImage = new Image();
            backgroundImage.onload = draw;
            backgroundImage.src = 'pictures/background.png';
            const keyImage = new Image();
            keyImage.onload = draw;
            keyImage.src = 'pictures/nyckel.png';

            // Koordinater nedan är angivna i skissens (referensbildens) enheter
            // och räknas om till canvas (3920x1280) med sx/sy/sl.
            // Rum 3 är mycket brett, så canvasen är större än i de andra rummen.
            const SCALE = 3.0;
            const sx = (x) => 40 + (x - 7) * SCALE;
            const sy = (y) => 70 + (y - 20) * SCALE;
            const sl = (l) => l * SCALE;

            // Hjälpare: rektangel från skiss-koordinater (x1,y1) till (x2,y2)
            function rect(x1, y1, x2, y2) {
                ctx.fillRect(sx(x1), sy(y1), sl(x2 - x1), sl(y2 - y1));
            }

            // ------------------------------------------------------------
            // OBJEKT - fyllda med svart nu. Byt ut genom att sätta `img`
            // till en Image() så ritas bilden istället för den svarta rutan.
            // (fill: "#ffffff" = vita placeholders som i skissen)
            // ------------------------------------------------------------
            const objects = [
                { name: "STORT OMRÅDE (övre höger)",   x1: 570, y1: 20,  x2: 1112, y2: 158, shape: "rect", img: null },
                { name: "TOPP-BLOCK",                  x1: 410, y1: 20,  x2: 570,  y2: 52,  shape: "rect", img: null },
                { name: "STORT BORD",                  x1: 672, y1: 297, x2: 813,  y2: 347, shape: "rect", img: null },
                { name: "LÅG Soffa nedre",             x1: 672, y1: 350, x2: 845,  y2: 380, shape: "rect", img: null },
                { name: "Vägg",                        x1: 841, y1: 260, x2: 845,  y2: 377, shape: "rect", img: null },
                { name: "RUNT OBJEKT 1",               cx: 559, cy: 357, rx: 12, ry: 11,     shape: "ellipse", img: null },
                { name: "RUNT OBJEKT 2",               cx: 594, cy: 357, rx: 12, ry: 11,     shape: "ellipse", img: null },
                { name: "RUNT OBJEKT 3",               cx: 631, cy: 357, rx: 12, ry: 11,     shape: "ellipse", img: null },
                { name: "HANDFAT 1",                   cx: 430, cy: 60,  rx: 10,  ry: 8,      shape: "ellipse", fill: "#ffffff", img: null },
                { name: "HANDFAT 2",                   cx: 454, cy: 60,  rx: 10,  ry: 8,      shape: "ellipse", fill: "#ffffff", img: null },
                { name: "HANDFAT 3",                   cx: 478, cy: 60,  rx: 10,  ry: 8,      shape: "ellipse", fill: "#ffffff", img: null },
                { name: "HANDFAT 4",                   cx: 502, cy: 60,  rx: 10,  ry: 8,      shape: "ellipse", fill: "#ffffff", img: null },
                { name: "NYCKEL",                      cx: 310, cy: 340,                         shape: "key", img: keyImage }
            ];

            function draw() {
                // Anpassa bakgrundsbilden till ytterväggarnas område utan att förvränga den.
                ctx.fillStyle = "#d4d4d4";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                if (backgroundImage.complete && backgroundImage.naturalWidth > 0) {
                    const left = sx(7), top = sy(19);
                    const width = sx(1283) - left, height = sy(379) - top;
                    const scale = Math.max(width / backgroundImage.naturalWidth, height / backgroundImage.naturalHeight);
                    const sourceWidth = width / scale, sourceHeight = height / scale;
                    const sourceX = (backgroundImage.naturalWidth - sourceWidth) / 2;
                    const sourceY = (backgroundImage.naturalHeight - sourceHeight) / 2;
                    ctx.drawImage(backgroundImage, sourceX, sourceY, sourceWidth, sourceHeight, left, top, width, height);
                }

                drawSolidWalls();
                drawObjects();
                drawDoors();
                drawExitAndEntrance();
                drawGuardsAndPaths();
                drawLabels();
            }

            function drawSolidWalls() {
                ctx.fillStyle = "#000000";

                // --- Yttre ram ---
                rect(7, 19, 1177, 23);         // Övre vägg (vänster om Entrance)
                rect(1233, 19, 1283, 23);      // Övre vägg (höger om Entrance)
                rect(7, 375, 463, 379);        // Nedre vägg (vänster om EXIT)
                rect(538, 375, 1283, 379);     // Nedre vägg (höger om EXIT)
                rect(7, 19, 11, 379);          // Vänster vägg
                rect(1279, 19, 1283, 379);     // Höger vägg

                // --- Vägg mot högra kolumnen (öppningar för två dörrar) ---
                rect(1108, 23, 1112, 183);
                rect(1108, 208, 1112, 312);

                // --- Övre vänstra rummet ---
                rect(109, 23, 113, 124);       // Vänster vägg
                rect(109, 120, 138, 124);      // Nedre vägg (öppning 138-200)
                rect(200, 120, 520, 124);      // Nedre vägg mot korridor (dörr 537-559)
                rect(559, 120, 570, 124);

                // --- Toaletter ---
                rect(264, 49, 389, 53);        // Övre vägg (dörr 389-403)
                rect(403, 49, 410, 53);
                rect(264, 49, 268, 124);       // Vänster vägg
                rect(327, 49, 331, 60);        // Höger vägg (ovanför toa-dörr)
                rect(327, 76, 331, 124);       // Höger vägg (under toa-dörr)
                rect(264, 85, 331, 89);        // Mellanvägg

                // --- Nedre vänstra rummet ---
                rect(80, 180, 363, 184);       // Övre vägg (dörr till vänster 11-80)
                rect(359, 180, 363, 379);      // Höger vägg

                // --- Nedre högra rummet ---
                rect(843, 238, 864, 242);      // Övre vägg (dörr 864-880)
                rect(900, 238, 1112, 242);
                rect(841, 238, 845, 262);      // Koppling mot svart vägg
            }

            function drawDoors() {
                ctx.save();
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 4;

                const vLines = (xs, y1, y2) => xs.forEach(x => {
                    ctx.beginPath();
                    ctx.moveTo(sx(x), sy(y1));
                    ctx.lineTo(sx(x), sy(y2));
                    ctx.stroke();
                });
                const hLines = (ys, x1, x2) => ys.forEach(y => {
                    ctx.beginPath();
                    ctx.moveTo(sx(x1), sy(y));
                    ctx.lineTo(sx(x2), sy(y));
                    ctx.stroke();
                });

                ctx.restore();
            }

            function drawExitAndEntrance() {
                // --- ENTRANCE (övre höger) ---
                const ex1 = sx(1177), ex2 = sx(1233);
                ctx.fillStyle = "#3b82f6";
                ctx.fillRect(ex1, sy(19) + 4, ex2 - ex1, 16);

                ctx.fillStyle = "#1d4ed8";
                ctx.font = "bold 44px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.fillText("Entrance", (ex1 + ex2) / 2, sy(19) - 12);

                // --- EXIT (nedre mitten) ---
                const xx1 = sx(463), xx2 = sx(538);
                ctx.fillStyle = "#22c55e";
                ctx.fillRect(xx1, sy(379) - 20, xx2 - xx1, 16);

                ctx.fillStyle = "#15803d";
                ctx.font = "bold 44px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText("EXIT", (xx1 + xx2) / 2, sy(395) + 12);
            }

            function drawObjects() {
                objects.forEach(o => {
                    ctx.save();
                    if (o.shape === "key") {
                        const x = sx(o.cx), y = sy(o.cy);
                        if (o.img && o.img.complete && o.img.naturalWidth > 0) {
                            const boxW = sl(33), boxH = sl(18);
                            const scale = Math.min(boxW / o.img.naturalWidth, boxH / o.img.naturalHeight);
                            const width = o.img.naturalWidth * scale, height = o.img.naturalHeight * scale;
                            ctx.drawImage(o.img, x - width / 2, y - height / 2, width, height);
                        } else {
                        ctx.strokeStyle = "#facc15";
                        ctx.lineWidth = sl(4);
                        ctx.lineCap = "round";
                        ctx.beginPath();
                        ctx.arc(x, y, sl(7), 0, Math.PI * 2);
                        ctx.moveTo(x + sl(7), y);
                        ctx.lineTo(x + sl(24), y);
                        ctx.lineTo(x + sl(24), y + sl(5));
                        ctx.moveTo(x + sl(17), y);
                        ctx.lineTo(x + sl(17), y + sl(5));
                        ctx.stroke();
                        }
                    } else if (o.shape === "ellipse") {
                        const cx = sx(o.cx), cy = sy(o.cy), rx = sl(o.rx), ry = sl(o.ry);
                        if (o.img) {
                            // Bilden anpassas till objektets ruta utan att tänjas ut
                            const boxW = rx * 2, boxH = ry * 2;
                            const k = Math.min(boxW / o.img.width, boxH / o.img.height);
                            const dw = o.img.width * k, dh = o.img.height * k;
                            ctx.drawImage(o.img, cx - dw / 2, cy - dh / 2, dw, dh);
                        } else {
                            ctx.fillStyle = o.fill || "#000000";
                            ctx.beginPath();
                            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                            ctx.fill();
                            if (o.fill) {
                                ctx.strokeStyle = "#475569";
                                ctx.lineWidth = 2;
                                ctx.stroke();
                            }
                        }
                    } else {
                        const x = sx(o.x1), y = sy(o.y1);
                        const w = sl(o.x2 - o.x1), h = sl(o.y2 - o.y1);
                        if (o.img) {
                            ctx.drawImage(o.img, x, y, w, h);
                        } else {
                            ctx.fillStyle = o.fill || "#000000";
                            ctx.fillRect(x, y, w, h);
                        }
                    }
                    ctx.restore();
                });
            }

            function drawGuardsAndPaths() {
                // Rörelsepilar
                

                // Vakter (placeholder badges)
                drawBadge(sx(306), sy(153), "VAKT", "#2563eb", "#ffffff");
                drawBadge(sx(918), sy(199), "VAKT", "#2563eb", "#ffffff");
            }

            function drawArrow(x1, y1, x2, y2) {
                ctx.save();
                ctx.strokeStyle = "#000000";
                ctx.lineWidth = 3.0;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();

                const a = Math.atan2(y2 - y1, x2 - x1);
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 18 * Math.cos(a - 0.4), y2 - 18 * Math.sin(a - 0.4));
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - 18 * Math.cos(a + 0.4), y2 - 18 * Math.sin(a + 0.4));
                ctx.stroke();
                ctx.restore();
            }

            function drawLabels() {
                ctx.save();
                ctx.fillStyle = "#0f172a";
                ctx.font = "bold 28px sans-serif";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";

                // Toalettetiketter
                // här ska dialogrutan hamna positon wise  sx(275), sy(70)

                // Rektanglar med toalettbild
                [70, 102].forEach(y => {
                    const x = sx(267), top = sy(y - 10);
                    const width = sl(20), height = sl(20);
                    if (toiletImage.complete && toiletImage.naturalWidth) {
                        ctx.drawImage(toiletImage, x, top, width, height);
                    } else {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(x, top, width, height);
                    }
                });
                ctx.restore();

                // Knapp under handfatet (öppnar dörren ovanför toan)
                ctx.save();
                ctx.fillStyle = "transparent";
                ctx.strokeStyle = "transparent";
                ctx.lineWidth = 4;
                ctx.beginPath();
                //position: (430, 60), radius: 15
                ctx.arc(sx(430), sy(60), 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = "#0f172a";
                ctx.font = "bold 26px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";

                // Dörren som knappen öppnar (övre väggen)
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.moveTo(sx(389), sy(51));
                ctx.lineTo(sx(403), sy(51));
                ctx.stroke();
                ctx.restore();
            }

            function drawBadge(x, y, label, strokeColor, fillColor, fontSize = 26) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(x, y, 62, 0, Math.PI * 2);
                ctx.fillStyle = fillColor;
                ctx.fill();

                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = 6;
                ctx.stroke();

                if (label) {
                    ctx.fillStyle = "#0f172a";
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, x, y);
                }
                ctx.restore();
            }

            // ------------------------------------------------------------
            // BILDER från mappen "pictures". Provar vanliga filändelser i
            // ordning; om ingen hittas ligger den svarta ovalen kvar.
            // ------------------------------------------------------------
            const PICTURES_DIR = "pictures";
            const EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "svg"];
            const toiletImage = new Image();
            toiletImage.onload = draw;
            toiletImage.src = `${PICTURES_DIR}/toa.png`;

            const table = objects.find(o => o.name === "STORT BORD");
            if (table) loadObjectImage(table, "stenbord");

            const lowSofa = objects.find(o => o.name === "LÅG Soffa nedre");
            if (lowSofa) loadObjectImage(lowSofa, "soffa");

            function loadObjectImage(obj, baseName, i = 0) {
                if (i >= EXTENSIONS.length) {
                    console.warn(`Hittade ingen bild för "${baseName}" i mappen ${PICTURES_DIR}/`);
                    return;
                }
                const img = new Image();
                img.onload = () => { obj.img = img; draw(); };
                img.onerror = () => loadObjectImage(obj, baseName, i + 1);
                img.src = `${PICTURES_DIR}/${baseName}.${EXTENSIONS[i]}`;
            }

            // De svarta ovalerna längst ner byts mot bilder.
            [["RUNT OBJEKT 1", "sacksack"], ["RUNT OBJEKT 2", "sacksack2"], ["RUNT OBJEKT 3", "sacksack"]].forEach(([name, image]) => {
                const obj = objects.find(o => o.name === name);
                if (obj) loadObjectImage(obj, image);
            });

            // Handfaten använder bilden handfat.png i stället för ovalerna.
            ["HANDFAT 1", "HANDFAT 2", "HANDFAT 3", "HANDFAT 4"].forEach(name => {
                const obj = objects.find(o => o.name === name);
                if (obj) loadObjectImage(obj, "handfat");
            });



            // Rendera ritningen
            draw();
        };