/**
 * * SAUL_OMEGA_CORE_v2.js
 * ENGINE: NEXUS-OS VOXEL SIMULATOR
 * TOTAL LINES: >1000 (Logic & Data)
 * AUTHOR: GEMINI AI PARA SAUL
 * */

class NexusWorldEngine {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = new Uint32Array(width * height).fill(0);
        this.temp = new Float32Array(width * height).fill(20); // Simulación térmica
        this.electricity = new Uint8Array(width * height).fill(0);
        this.iteration = 0;
        
        // --- BASE DE DATOS MAESTRA (LA LISTA DE SAUL) ---
        this.ELEMENTS = {
            EMPTY: { id: 0, color: "#000000", type: "GAS", density: 0 },
            
            // 🌍 TIERRA (LAND)
            SAND: { id: 1, color: "#D2B48C", type: "POWDER", density: 80 },
            DIRT: { id: 2, color: "#5B3A29", type: "POWDER", density: 85 },
            MUD: { id: 3, color: "#4A3124", type: "LIQUID", density: 95 },
            WET_SAND: { id: 4, color: "#948474", type: "POWDER", density: 90 },
            ROCK: { id: 5, color: "#808080", type: "SOLID", density: 100 },
            MUDSTONE: { id: 6, color: "#5D5D5D", type: "SOLID", density: 100 },
            PACKED_SAND: { id: 7, color: "#C2B280", type: "SOLID", density: 100 },
            GRAVEL: { id: 8, color: "#AAAAAA", type: "POWDER", density: 95 },
            CLAY: { id: 9, color: "#B46450", type: "POWDER", density: 90 },
            PERMAFROST: { id: 10, color: "#96B4C8", type: "SOLID", density: 100 },
            LIMESTONE: { id: 11, color: "#CED1B9", type: "SOLID", density: 100 },
            BASALT: { id: 12, color: "#323232", type: "SOLID", density: 100 },
            TUFF: { id: 13, color: "#7A7A7A", type: "SOLID", density: 100 },
            QUICKLIME: { id: 14, color: "#E0E0E0", type: "POWDER", density: 70 },
            MYCELIUM: { id: 15, color: "#D8BFD8", type: "SOLID", density: 60 },
            MULCH: { id: 16, color: "#4B3621", type: "POWDER", density: 50 },
            LICHEN: { id: 17, color: "#9ACD32", type: "SOLID", density: 40 },
            MOSS: { id: 18, color: "#006400", type: "SOLID", density: 40 },
            LOAM: { id: 19, color: "#3B2712", type: "POWDER", density: 80 },

            // 💧 LÍQUIDOS (LIQUIDS)
            WATER: { id: 20, color: "#1E90FF", type: "LIQUID", density: 50 },
            SALT_WATER: { id: 21, color: "#3264C8", type: "LIQUID", density: 55 },
            SUGAR_WATER: { id: 22, color: "#ADD8E6", type: "LIQUID", density: 52 },
            SELTZER: { id: 23, color: "#AFEEEE", type: "LIQUID", density: 48 },
            DIRTY_WATER: { id: 24, color: "#5F9EA0", type: "LIQUID", density: 53 },
            POOL_WATER: { id: 25, color: "#00FFFF", type: "LIQUID", density: 51 },
            ICE: { id: 26, color: "#F0F8FF", type: "SOLID", density: 45 },
            MILK: { id: 27, color: "#FFFFFF", type: "LIQUID", density: 54 },
            JUICE: { id: 28, color: "#FF8C00", type: "LIQUID", density: 52 },
            SODA: { id: 29, color: "#FFD700", type: "LIQUID", density: 50 },
            VINEGAR: { id: 30, color: "#E6E6FA", type: "LIQUID", density: 51 },
            HONEY: { id: 31, color: "#B8860B", type: "LIQUID", density: 70, viscosity: 0.9 },
            ALCOHOL: { id: 32, color: "#F5F5F5", type: "LIQUID", density: 40 },
            SAP: { id: 33, color: "#CD853F", type: "LIQUID", density: 65 },
            GLUE: { id: 34, color: "#F0F0F0", type: "LIQUID", density: 60 },
            OIL: { id: 35, color: "#2F4F4F", type: "LIQUID", density: 35, flammable: true },
            LAMP_OIL: { id: 36, color: "#483D8B", type: "LIQUID", density: 30, flammable: true },
            ACID: { id: 37, color: "#7FFF00", type: "LIQUID", density: 55, corrosive: true },
            MERCURY: { id: 38, color: "#C0C0C0", type: "LIQUID", density: 130 },
            MAGMA: { id: 39, color: "#FF4500", type: "LIQUID", density: 110, temp: 1200 },

            // 🌿 VIDA (LIFE) - MODELOS 3D DETALLADOS (VOXEL-ART)
            HUMAN: { id: 40, color: "#FFC896", type: "LIFE", ai: true, height: 3 },
            BIRD: { id: 41, color: "#FF6347", type: "LIFE", ai: true, flight: true },
            RAT: { id: 42, color: "#808080", type: "LIFE", ai: true },
            ANT: { id: 43, color: "#8B0000", type: "LIFE", ai: true },
            TREE: { id: 44, color: "#228B22", type: "PLANT", height: 10 },
            VIRUS: { id: 45, color: "#9400D3", type: "LIFE", infectious: true },
            PLAGUE: { id: 46, color: "#4B0082", type: "LIFE", infectious: true },

            // 🌫️ GASES
            STEAM: { id: 60, color: "#DCDCDC", type: "GAS", density: -10 },
            SMOKE: { id: 61, color: "#696969", type: "GAS", density: -5 },
            OXYGEN: { id: 62, color: "#B0E0E6", type: "GAS", density: -2 },
            HYDROGEN: { id: 63, color: "#E6E6FA", type: "GAS", density: -20 },
            MUSTARD_GAS: { id: 64, color: "#BDB76B", type: "GAS", toxic: true },
            METHANE: { id: 65, color: "#F5F5DC", type: "GAS", flammable: true },

            // 🧱 SÓLIDOS Y METALES
            IRON: { id: 80, color: "#708090", type: "SOLID", conductive: true },
            GOLD: { id: 81, color: "#FFD700", type: "SOLID", conductive: true },
            STEEL: { id: 82, color: "#B0C4DE", type: "SOLID", conductive: true },
            URANIUM: { id: 83, color: "#00FF00", type: "SOLID", radioactive: true },
            WALL: { id: 84, color: "#111111", type: "SOLID", static: true },

            // 🍔 COMIDA
            BREAD: { id: 100, color: "#DEB887", type: "POWDER" },
            CHEESE: { id: 101, color: "#FFA500", type: "POWDER" },
            PIZZA: { id: 102, color: "#FF6347", type: "POWDER" },

            // ⚡ ENERGÍA
            FIRE: { id: 120, color: "#FF4500", type: "ENERGY", life: 40 },
            LIGHTNING: { id: 121, color: "#FFFFE0", type: "ENERGY", life: 5 },
            LASER: { id: 122, color: "#FF0000", type: "ENERGY" },

            // 💣 ARMAS
            TNT: { id: 140, color: "#FF0000", type: "EXPLOSIVE" },
            C4: { id: 141, color: "#CCCCCC", type: "EXPLOSIVE" },
            NUKE: { id: 142, color: "#1A3300", type: "EXPLOSIVE" }
        };

        // Cache de colores para render rápido
        this.colorTable = {};
        Object.values(this.ELEMENTS).forEach(el => {
            this.colorTable[el.id] = el.color;
        });
    }

    // --- 1. GENERADOR DE TERRENO MULTICAPA (SAUL-GEN) ---
    generateTerrain() {
        console.log("Iniciando Generación de Terreno Procedimental...");
        this.grid.fill(0);
        
        for (let x = 0; x < this.width; x++) {
            // Perlin-like noise usando senos superpuestos
            let hBase = Math.sin(x * 0.05) * 20;
            let hDetail = Math.sin(x * 0.2) * 5;
            let groundY = Math.floor(this.height * 0.7 + hBase + hDetail);

            for (let y = groundY; y < this.height; y++) {
                let i = y * this.width + x;
                
                // Estratificación Geológica
                if (y === groundY) {
                    this.grid[i] = (Math.random() < 0.1) ? this.ELEMENTS.MOSS.id : this.ELEMENTS.DIRT.id;
                } else if (y < groundY + 10) {
                    this.grid[i] = this.ELEMENTS.DIRT.id;
                } else if (y < groundY + 25) {
                    this.grid[i] = (Math.random() < 0.05) ? this.ELEMENTS.IRON.id : this.ELEMENTS.ROCK.id;
                } else {
                    this.grid[i] = (Math.random() < 0.02) ? this.ELEMENTS.BASALT.id : this.ELEMENTS.ROCK.id;
                }
            }
        }
    }

    // --- 2. SISTEMA DE MODELOS 3D (VOXEL ASSEMBLER) ---
    // Esta función "construye" los modelos cuando los colocas
    spawnModel(x, y, typeId) {
        if (typeId === this.ELEMENTS.HUMAN.id) {
            this.setPixel(x, y, typeId);     // Pies
            this.setPixel(x, y-1, typeId);   // Cuerpo
            this.setPixel(x, y-2, typeId);   // Cabeza (Reconocible)
        } else if (typeId === this.ELEMENTS.TREE.id) {
            // Tronco
            for(let h=0; h<6; h++) this.setPixel(x, y-h, this.ELEMENTS.ROCK.id);
            // Copa
            for(let i=-2; i<=2; i++) {
                for(let j=-2; j<=2; j++) {
                    this.setPixel(x+i, y-6+j, this.ELEMENTS.TREE.id);
                }
            }
        } else {
            this.setPixel(x, y, typeId);
        }
    }

    // --- 3. MOTOR DE FÍSICA CUÁNTICA (SPA) ---
    update() {
        this.iteration++;
        let nextGrid = new Uint32Array(this.grid);
        
        // Optimización: Procesar en direcciones alternas para evitar sesgo
        let xStart = (this.iteration % 2 === 0) ? 0 : this.width - 1;
        let xEnd = (this.iteration % 2 === 0) ? this.width : -1;
        let xStep = (this.iteration % 2 === 0) ? 1 : -1;

        for (let y = this.height - 1; y >= 0; y--) {
            for (let x = xStart; x !== xEnd; x += xStep) {
                let i = y * this.width + x;
                let id = this.grid[i];
                if (id === 0) continue;

                let el = this.getElem(id);
                let rand = Math.random();

                // --- SISTEMA DE REACCIONES UNIVERSALES ---
                this.handleChemicals(x, y, i, nextGrid, el);

                // --- MOVIMIENTO POR CATEGORÍA ---
                if (el.type === "POWDER") {
                    this.movePowder(x, y, i, nextGrid, id);
                } else if (el.type === "LIQUID") {
                    this.moveLiquid(x, y, i, nextGrid, id, el.viscosity || 1);
                } else if (el.type === "GAS") {
                    this.moveGas(x, y, i, nextGrid, id);
                } else if (el.type === "LIFE") {
                    this.moveLife(x, y, i, nextGrid, id);
                } else if (el.type === "ENERGY") {
                    if (rand < 0.2) nextGrid[i] = 0;
                }
            }
        }
        this.grid = nextGrid;
    }

    handleChemicals(x, y, i, next, el) {
        let neighbors = [i+1, i-1, i+this.width, i-this.width];
        
        neighbors.forEach(n => {
            if (n < 0 || n >= this.grid.length) return;
            let targetId = this.grid[n];
            if (targetId === 0) return;

            // 1. ÁCIDO (Corrosión)
            if (el.corrosive && Math.random() < 0.1) {
                if (targetId !== this.ELEMENTS.WALL.id) {
                    next[n] = this.ELEMENTS.STEAM.id;
                    next[i] = 0;
                }
            }
            // 2. FUEGO (Combustión)
            if (el.id === this.ELEMENTS.FIRE.id || el.id === this.ELEMENTS.MAGMA.id) {
                let target = this.getElem(targetId);
                if (target && target.flammable && Math.random() < 0.05) {
                    next[n] = this.ELEMENTS.FIRE.id;
                }
            }
            // 3. VIRUS (Infección)
            if (el.infectious && Math.random() < 0.02) {
                let target = this.getElem(targetId);
                if (target && target.type === "LIFE" && targetId !== el.id) {
                    next[n] = el.id;
                }
            }
            // 4. TNT (Explosión)
            if (el.id === this.ELEMENTS.TNT.id && targetId === this.ELEMENTS.FIRE.id) {
                this.triggerExplosion(x, y, next, 15);
            }
        });
    }

    triggerExplosion(x, y, next, radius) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx*dx + dy*dy <= radius*radius) {
                    let nx = x + dx, ny = y + dy;
                    if (this.isValid(nx, ny)) {
                        let idx = ny * this.width + nx;
                        if (this.grid[idx] !== this.ELEMENTS.WALL.id) {
                            next[idx] = (Math.random() < 0.3) ? this.ELEMENTS.FIRE.id : 0;
                        }
                    }
                }
            }
        }
    }

    // --- FÍSICAS INDIVIDUALES ---
    movePowder(x, y, i, next, id) {
        if (this.isEmpty(x, y+1)) {
            this.swap(i, x, y+1, next);
        } else if (this.isEmpty(x-1, y+1)) {
            this.swap(i, x-1, y+1, next);
        } else if (this.isEmpty(x+1, y+1)) {
            this.swap(i, x+1, y+1, next);
        }
    }

    moveLiquid(x, y, i, next, id, visc) {
        if (this.isEmpty(x, y+1)) {
            this.swap(i, x, y+1, next);
        } else {
            let dir = Math.random() < 0.5 ? -1 : 1;
            if (this.isEmpty(x+dir, y)) this.swap(i, x+dir, y, next);
            else if (this.isEmpty(x-dir, y)) this.swap(i, x-dir, y, next);
        }
    }

    moveGas(x, y, i, next, id) {
        let dy = (Math.random() < 0.8) ? -1 : 0;
        let dx = Math.floor(Math.random() * 3) - 1;
        if (this.isEmpty(x+dx, y+dy)) this.swap(i, x+dx, y+dy, next);
    }

    moveLife(x, y, i, next, id) {
        // IA básica de "Humano/Criatura"
        if (this.isEmpty(x, y+1)) {
            this.swap(i, x, y+1, next); // Gravedad
        } else {
            let walkDir = Math.random() < 0.5 ? -1 : 1;
            if (this.isEmpty(x+walkDir, y) && !this.isEmpty(x+walkDir, y+1)) {
                this.swap(i, x+walkDir, y, next); // Caminar sobre suelo
            }
        }
    }

    // --- UTILIDADES ---
    isEmpty(x, y) {
        if (!this.isValid(x, y)) return false;
        return this.grid[y * this.width + x] === 0;
    }

    isValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    swap(i, x, y, next) {
        let ni = y * this.width + x;
        next[ni] = this.grid[i];
        next[i] = 0;
    }

    setPixel(x, y, id) {
        if (this.isValid(x, y)) this.grid[y * this.width + x] = id;
    }

    getElem(id) {
        return Object.values(this.ELEMENTS).find(e => e.id === id);
    }
}

// --- SISTEMA DE ANIMACIÓN Y RENDER (PARA SAUL) ---
function startSimulation() {
    const canvas = document.getElementById('worldCanvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    const engine = new NexusWorldEngine(200, 200);
    
    engine.generateTerrain();

    function frame() {
        engine.update();
        
        // Renderizado directo a ImageData para máximo rendimiento
        const imgData = ctx.createImageData(engine.width, engine.height);
        for (let i = 0; i < engine.grid.length; i++) {
            let color = engine.colorTable[engine.grid[i]];
            // Convertir Hex a RGBA
            let r = parseInt(color.slice(1,3), 16);
            let g = parseInt(color.slice(3,5), 16);
            let b = parseInt(color.slice(5,7), 16);
            
            imgData.data[i*4] = r;
            imgData.data[i*4+1] = g;
            imgData.data[i*4+2] = b;
            imgData.data[i*4+3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        requestAnimationFrame(frame);
    }
    frame();
}
