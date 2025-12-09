import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, Flame, Snowflake, Droplets, Cloud, Heart, Zap, Monitor, Music,
  Skull, MousePointer2, Bomb, Activity, Triangle, Hexagon, X, Smile, Divide,
  Code2, Globe, Rocket, Gem, Disc, Clock, Settings, Cookie, Atom, Biohazard,
  User, Plus, Trash2, LogOut, Bot, MessageSquare, Trophy, Medal, Crown, Star,
  Target, ZapOff, Shield, Gift, Mic, MicOff
} from 'lucide-react';

// --- CONFIGURACIÓN GEMINI API ---
const apiKey = "AIzaSyCQ0xvdX16Z6Rd12G2gyLvoBXTrb-qOKuE"; // La clave se inyectará en tiempo de ejecución

// --- DATOS Y CONSTANTES ---
const COLORS = {
  'C': '#ff3333', 'D': '#ff9933', 'E': '#ffcc00', 'F': '#66ff66',
  'G': '#008000', 'A': '#9933ff', 'B': '#ff66b2'
};

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const NOTES_DATA = [
  // --- CLAVE DE SOL (Treble) ---
  { note: 'C', colorKey: 'C', freq: 261.63, top: 90, ledger: true, stemUp: true, clef: 'treble' },
  { note: 'D', colorKey: 'D', freq: 293.66, top: 83, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'E', colorKey: 'E', freq: 329.63, top: 70, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'F', colorKey: 'F', freq: 349.23, top: 62, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'G', colorKey: 'G', freq: 392.00, top: 50, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'A', colorKey: 'A', freq: 440.00, top: 42, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'B', colorKey: 'B', freq: 493.88, top: 30, ledger: false, stemUp: true, clef: 'treble' },
  { note: 'C2', colorKey: 'C', noteBase: 'C', freq: 523.25, top: 22, ledger: false, stemUp: false, clef: 'treble' },
  { note: 'D2', colorKey: 'D', noteBase: 'D', freq: 587.33, top: 10, ledger: false, stemUp: false, clef: 'treble' },
  { note: 'E2', colorKey: 'E', noteBase: 'E', freq: 659.25, top: 2, ledger: false, stemUp: false, clef: 'treble' },
  { note: 'F2', colorKey: 'F', noteBase: 'F', freq: 698.46, top: -10, ledger: false, stemUp: false, clef: 'treble' },
  { note: 'G2', colorKey: 'G', noteBase: 'G', freq: 783.99, top: -18, ledger: false, stemUp: false, clef: 'treble' },

  // --- CLAVE DE FA (Bass) ---
  { note: 'E2', colorKey: 'E', noteBase: 'E', freq: 82.41, top: 90, ledger: true, stemUp: true, clef: 'bass' },
  { note: 'F2', colorKey: 'F', noteBase: 'F', freq: 87.31, top: 83, ledger: false, stemUp: true, clef: 'bass' },
  { note: 'G2', colorKey: 'G', noteBase: 'G', freq: 98.00, top: 70, ledger: false, stemUp: true, clef: 'bass' },
  { note: 'A2', colorKey: 'A', noteBase: 'A', freq: 110.00, top: 60, ledger: false, stemUp: true, clef: 'bass' },
  { note: 'B2', colorKey: 'B', noteBase: 'B', freq: 123.47, top: 50, ledger: false, stemUp: true, clef: 'bass' },
  { note: 'C3', colorKey: 'C', noteBase: 'C', freq: 130.81, top: 40, ledger: false, stemUp: true, clef: 'bass' },
  { note: 'D3', colorKey: 'D', noteBase: 'D', freq: 146.83, top: 30, ledger: false, stemUp: false, clef: 'bass' },
  { note: 'E3', colorKey: 'E', noteBase: 'E', freq: 164.81, top: 20, ledger: false, stemUp: false, clef: 'bass' },
  { note: 'F3', colorKey: 'F', noteBase: 'F', freq: 174.61, top: 10, ledger: false, stemUp: false, clef: 'bass' },
  { note: 'G3', colorKey: 'G', noteBase: 'G', freq: 196.00, top: 0, ledger: false, stemUp: false, clef: 'bass' },
  { note: 'A3', colorKey: 'A', noteBase: 'A', freq: 220.00, top: -10, ledger: false, stemUp: false, clef: 'bass' },
  { note: 'B3', colorKey: 'B', noteBase: 'B', freq: 246.94, top: -20, ledger: false, stemUp: false, clef: 'bass' },
];

// --- LOGROS (20 TOTAL) ---
const ACHIEVEMENTS = [
  { id: 'first_win', name: 'Primeros Pasos', desc: 'Completa el Nivel 1', icon: '🎓' },
  { id: 'streak_20', name: 'En Racha', desc: 'Racha de 20 notas', icon: '🔥' },
  { id: 'streak_50', name: 'Imparable', desc: 'Racha de 50 notas', icon: '⚡' },
  { id: 'streak_100', name: 'Leyenda', desc: 'Racha de 100 notas', icon: '🌟' },
  { id: 'rich', name: 'Ahorrador', desc: 'Ten 100 monedas', icon: '💰' },
  { id: 'millionaire', name: 'Millonario', desc: 'Ten 500 monedas', icon: '💎' },
  { id: 'spender', name: 'Comprador', desc: 'Compra tu primera Skin', icon: '🛍️' },
  { id: 'survivor_novice', name: 'Sobreviviente', desc: 'Llega a 30s en Supervivencia', icon: '🛡️' },
  { id: 'survivor_master', name: 'Inmortal', desc: 'Llega a 120s en Supervivencia', icon: '🏰' },
  { id: 'speedster', name: 'Velocista', desc: 'Nivel Sayoya: 100 notas hit', icon: '🏎️' },
  { id: 'bass_player', name: 'Bajista', desc: 'Desbloquea Clave de Fa', icon: '🎸' },
  { id: 'mid_game', name: 'Medio Camino', desc: 'Llega al Nivel 10', icon: '🏁' },
  { id: 'game_complete', name: 'Maestro Musical', desc: 'Desbloquea Nivel 20', icon: '👑' },
  { id: 'pro_unlock', name: 'Oído Absoluto', desc: 'Desbloquea Nivel 5 en Pro', icon: '🎵' },
  { id: 'pro_master', name: 'Virtuoso', desc: 'Completa Nivel 20 en Pro', icon: '🎹' },
  { id: 'persistent', name: 'Persistente', desc: 'Juega 50 partidas totales', icon: '🔄' },
  { id: 'sniper', name: 'Francotirador', desc: 'Nivel con 100% precisión (Arcade)', icon: '🎯' },
  { id: 'clumsy', name: 'Aprendiz', desc: 'Pierde 3 veces seguidas', icon: '🤕' },
  { id: 'night_owl', name: 'Nocturno', desc: 'Juega con skin Dark o Noir', icon: '🦉' },
  { id: 'customizer', name: 'Estilista', desc: 'Cambia Fondo, Skin y Sonido', icon: '🎨' },
];

// --- CONFIGURACIÓN DE EFECTOS ---
const EFFECTS = {
  fireworks: { name: 'Fuegos Artificiales', icon: Sparkles, color: '#fca5a5' },
  confetti: { name: 'Confeti', icon: Sparkles, color: '#fcd34d' },
  fire: { name: 'Fuego', icon: Flame, color: '#ef4444' },
  snow: { name: 'Nieve', icon: Snowflake, color: '#e0f2fe' },
  rain: { name: 'Lluvia', icon: Droplets, color: '#3b82f6' },
  bubbles: { name: 'Burbujas', icon: Cloud, color: '#bae6fd' },
  hearts: { name: 'Corazones', icon: Heart, color: '#f43f5e' },
  stars: { name: 'Estrellas', icon: Sparkles, color: '#fbbf24' },
  smoke: { name: 'Humo', icon: Cloud, color: '#9ca3af' },
  coins: { name: 'Monedas', icon: Sparkles, color: '#fbbf24' },
  leaves: { name: 'Hojas', icon: Cloud, color: '#4ade80' },
  electric: { name: 'Electricidad', icon: Zap, color: '#60a5fa' },
  magic: { name: 'Polvo Mágico', icon: Sparkles, color: '#d8b4fe' },
  pixels: { name: 'Píxeles', icon: Monitor, color: '#22c55e' },
  notes: { name: 'Música', icon: Music, color: '#818cf8' },
  cosmos: { name: 'Cosmos', icon: Sparkles, color: '#6366f1' },
  slime: { name: 'Slime', icon: Droplets, color: '#84cc16' },
  petals: { name: 'Pétalos', icon: Cloud, color: '#f9a8d4' },
  ghosts: { name: 'Fantasmas', icon: Skull, color: '#f3f4f6' },
  fireflies: { name: 'Luciérnagas', icon: Sparkles, color: '#fde047' },
  ripple: { name: 'Ondas', icon: Droplets, color: '#38bdf8' },
  graffiti: { name: 'Graffiti', icon: MousePointer2, color: '#f472b6' },
  glitch: { name: 'Glitch', icon: Monitor, color: '#2dd4bf' },
  pop: { name: 'Pop Art', icon: Sparkles, color: '#f87171' },
  feathers: { name: 'Plumas', icon: Cloud, color: '#f1f5f9' },
  balls: { name: 'Rebotonas', icon: MousePointer2, color: '#a78bfa' },
  matrix: { name: 'Matrix', icon: Code2, color: '#22c55e' },
  vortex: { name: 'Vórtice', icon: Zap, color: '#c084fc' },
  bats: { name: 'Murciélagos', icon: Skull, color: '#1f2937' },
  sonic: { name: 'Explosión Sónica', icon: Activity, color: '#facc15' },
  explosion: { name: 'Explosión', icon: Bomb, color: '#f97316' },
  laser: { name: 'Láser', icon: Zap, color: '#ef4444' },
  spiral: { name: 'Espiral', icon: Activity, color: '#a855f7' },
  triangles: { name: 'Triángulos', icon: Triangle, color: '#14b8a6' },
  hexagons: { name: 'Hexágonos', icon: Hexagon, color: '#ec4899' },
  crosses: { name: 'Cruces', icon: X, color: '#6366f1' },
  smileys: { name: 'Caritas', icon: Smile, color: '#eab308' },
  math: { name: 'Matemáticas', icon: Divide, color: '#3b82f6' },
  code: { name: 'Código', icon: Code2, color: '#10b981' },
  planets: { name: 'Planetas', icon: Globe, color: '#38bdf8' },
  balloons: { name: 'Globos', icon: Cloud, color: '#f43f5e' },
  rockets: { name: 'Cohetes', icon: Rocket, color: '#f97316' },
  diamonds: { name: 'Diamantes', icon: Gem, color: '#06b6d4' },
  blackhole: { name: 'Agujero Negro', icon: Disc, color: '#111827' },
  waves: { name: 'Olas', icon: Activity, color: '#60a5fa' },
  time: { name: 'Tiempo', icon: Clock, color: '#94a3b8' },
  gears: { name: 'Engranajes', icon: Settings, color: '#64748b' },
  candy: { name: 'Dulces', icon: Cookie, color: '#f472b6' },
  atoms: { name: 'Átomos', icon: Atom, color: '#8b5cf6' },
  virus: { name: 'Virus', icon: Biohazard, color: '#84cc16' },
};

// --- FUNCIÓN DE PRECIOS AUXILIAR ---
const getPrice = (index) => {
  if (index < 10) return 25;
  if (index < 20) return 35;
  return 50;
};

const SKINS = [
  { id: 'skin-1', name: 'Clásico', fx: 'notes' },
  { id: 'skin-2', name: 'Hacker', fx: 'code' },
  { id: 'skin-3', name: 'Midas', fx: 'coins' },
  { id: 'skin-4', name: 'Cian', fx: 'laser' },
  { id: 'skin-5', name: 'Magma', fx: 'fire' },
  { id: 'skin-6', name: 'Terminal', fx: 'pixels' },
  { id: 'skin-7', name: 'Noir', fx: 'smoke' },
  { id: 'skin-8', name: 'Candy', fx: 'candy' },
  { id: 'skin-9', name: 'Realeza', fx: 'diamonds' },
  { id: 'skin-10', name: 'Tóxico', fx: 'virus' },
  { id: 'skin-11', name: 'Océano', fx: 'bubbles' },
  { id: 'skin-12', name: 'Sunset', fx: 'fireflies' },
  { id: 'skin-13', name: 'Cítrico', fx: 'ripple' },
  { id: 'skin-14', name: 'Plano', fx: 'triangles' },
  { id: 'skin-15', name: 'Retro GB', fx: 'pixels' },
  { id: 'skin-16', name: 'Dark', fx: 'bats' },
  { id: 'skin-17', name: 'Villano', fx: 'electric' },
  { id: 'skin-18', name: 'Pergamino', fx: 'feathers' },
  { id: 'skin-19', name: 'Sith', fx: 'laser' },
  { id: 'skin-20', name: 'Arcoíris', fx: 'confetti' },
  { id: 'skin-21', name: 'Matrix', fx: 'matrix' },
  { id: 'skin-22', name: 'Bosque', fx: 'leaves' },
  { id: 'skin-23', name: 'Madera', fx: 'gears' },
  { id: 'skin-24', name: 'Glitch', fx: 'glitch' },
  { id: 'skin-25', name: 'Cosmos', fx: 'planets' },
  { id: 'skin-26', name: 'Horror', fx: 'ghosts' },
  { id: 'skin-27', name: 'Sakura', fx: 'petals' },
  { id: 'skin-28', name: 'Militar', fx: 'explosion' },
  { id: 'skin-29', name: 'Divino', fx: 'magic' },
  { id: 'skin-30', name: 'Supernova', fx: 'stars' }
].map((s, i) => ({ ...s, price: getPrice(i) }));

const SOUNDS = [
  { id: 'wood', name: 'Madera' }, { id: 'click', name: 'Click' },
  { id: '8bit', name: '8-Bit' }, { id: 'zap', name: 'Zap' },
  { id: 'magma', name: 'Magma' }, { id: 'matrix', name: 'Matrix' },
  { id: 'noir', name: 'Noir' }, { id: 'bubble', name: 'Burbuja' },
  { id: 'royal', name: 'Royal' }, { id: 'toxic', name: 'Tóxico' },
  { id: 'ocean', name: 'Océano' }, { id: 'sunset', name: 'Sunset' },
  { id: 'candy', name: 'Candy' }, { id: 'blueprint', name: 'Plano' },
  { id: 'gameboy', name: 'Gameboy' }, { id: 'void', name: 'Vacío' },
  { id: 'plasma', name: 'Plasma' }, { id: 'paper', name: 'Papel' },
  { id: 'vampire', name: 'Vampiro' }, { id: 'ultimate', name: 'Ultimate' },
  { id: 'cyber', name: 'Cyber' }, { id: 'nature', name: 'Naturaleza' },
  { id: 'steampunk', name: 'Steam' }, { id: 'glitch_hit', name: 'Glitch' },
  { id: 'space', name: 'Espacio' }, { id: 'horror', name: 'Terror' },
  { id: 'cute', name: 'Cute' }, { id: 'drum', name: 'Tambor' },
  { id: 'angel', name: 'Angel' }, { id: 'god', name: 'Dios' }
].map((s, i) => ({ ...s, price: getPrice(i) }));

const WALLPAPERS = [
  // --- GRUPO 1: FLUJOS DE COLOR (Gradients) ---
  { id: 1, name: "Amanecer Vivo", css: "background: linear-gradient(270deg, #ff9a9e, #fad0c4, #fad0c4); background-size: 600% 600%; animation: gradientFlow 16s ease infinite;" },
  { id: 2, name: "Aurora Boreal", css: "background: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%); background-size: 200% 200%; animation: gradientFlow 5s ease infinite;" },
  { id: 3, name: "Espacio profundo", css: "background: linear-gradient(270deg, #0f2027, #203a43, #2c5364); background-size: 400% 400%; animation: gradientFlow 10s ease infinite;" },
  { id: 4, name: "Rio Arcoiris", css: "background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000); background-size: 400%; animation: gradientFlow 20s linear infinite;" },
  { id: 5, name: "Oro puro", css: "background: linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); background-size: 400% 400%; animation: gradientFlow 6s linear infinite;" },
  { id: 6, name: "Squishi rosa", css: "background: radial-gradient(circle at 50% 50%, #f472b6 20%, #be185d 80%); background-size: 200% 200%; animation: panDiagonal 6s ease infinite alternate;" },
  { id: 7, name: "Riesgo Tóxico", css: "background: linear-gradient(to bottom, #d9f99d, #3f6212); background-size: 100% 200%; animation: verticalFlow 4s ease infinite alternate;" },
  { id: 8, name: "Anochecer ligero", css: "background: linear-gradient(180deg, #020024 0%, #090979 35%, #00d4ff 100%); background-size: 100% 200%; animation: verticalFlow 5s ease infinite alternate;" },
  { id: 9, name: "Atardecer", css: "background: linear-gradient(to top, #2b002b 0%, #680068 50%, #ff00ff 100%); background-size: 100% 200%; animation: verticalFlow 8s ease infinite;" },
  { id: 10, name: "Brisa Fría", css: "background: linear-gradient(to right, #2980b9, #6dd5fa, #ffffff); background-size: 200% 100%; animation: gradientFlow 6s linear infinite;" },


  // --- GRUPO 2: ROTACIONES ILUSORIAS (Conic Gradients) ---
  { id: 11, name: "Escaner Radar", css: "background: conic-gradient(from var(--spin-angle), rgba(0,255,0,0.5), transparent 60%); background-color: #002200; animation: colorSpin 3s linear infinite;" },
  { id: 12, name: "Espiral hipnosis", css: "background: repeating-conic-gradient(#000 0% 5%, #fff 5% 10%); background-position: center; animation: illusionSpin 10s linear infinite;" },
  { id: 13, name: "Rueda arcoiris", css: "background: conic-gradient(from var(--spin-angle), red, orange, yellow, green, blue, indigo, violet, red); animation: colorSpin 5s linear infinite;" },
  { id: 14, name: "Rayos de Luz", css: "background: repeating-conic-gradient(from var(--spin-angle), #fbbf24 0deg 15deg, #f59e0b 15deg 30deg); animation: colorSpin 10s linear infinite;" },
  { id: 15, name: "Abanico", css: "background: conic-gradient(from var(--spin-angle), #333 0deg 90deg, transparent 90deg 180deg, #333 180deg 270deg, transparent 270deg 360deg); background-color: #eee; animation: colorSpin 2s linear infinite;" },
  { id: 16, name: "Cargando", css: "background: conic-gradient(from var(--spin-angle), transparent 0%, #3b82f6 100%); border-radius: 50%; animation: colorSpin 1.5s linear infinite;" },
  { id: 17, name: "Vortex", css: "background: conic-gradient(from var(--spin-angle) at 50% 50%, #4c1d95, #c4b5fd, #4c1d95); animation: colorSpin 3s ease-in-out infinite;" },
  { id: 18, name: "Faro", css: "background: conic-gradient(from var(--spin-angle), rgba(255,255,255,0.8) 0deg 30deg, transparent 30deg 360deg); background-color: #000; animation: colorSpin 4s linear infinite;" },
  { id: 19, name: "Dulce", css: "background: repeating-conic-gradient(from var(--spin-angle), #fca5a5 0deg 20deg, #fff 20deg 40deg); animation: colorSpin 8s linear infinite;" },
  { id: 20, name: "Polka", css: "background-image: radial-gradient(#fff 20%, transparent 20%); background-color: #3b82f6; background-size: 40px 40px; animation: panDiagonal 4s linear infinite;" },
  { id: 21, name: "Carrera", css: "background-image: repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc); background-position: 0 0, 10px 10px; background-size: 20px 20px; animation: panRight 1s linear infinite;" },
  { id: 22, name: "ZigZag Retro", css: "background: linear-gradient(135deg, #ff6b6b 25%, transparent 25%) -25px 0, linear-gradient(225deg, #ff6b6b 25%, transparent 25%) -25px 0, linear-gradient(315deg, #ff6b6b 25%, transparent 25%), linear-gradient(45deg, #ff6b6b 25%, transparent 25%); background-size: 50px 50px; background-color: #4ecdc4; animation: panRight 2s linear infinite;" },
  { id: 23, name: "Fibra de carbón", css: "background: radial-gradient(black 15%, transparent 16%) 0 0, radial-gradient(black 15%, transparent 16%) 8px 8px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 0 1px, radial-gradient(rgba(255,255,255,.1) 15%, transparent 20%) 8px 9px; background-color: #282828; background-size: 16px 16px; animation: panRight 5s linear infinite;" },
  { id: 24, name: "Huellas", css: "background-color: #1e3a8a; background-image: linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px); background-size: 20px 20px; animation: subtleZoom 5s ease-in-out infinite;" },
  // --- GRUPO 4: SIMULACIONES (Naturaleza y Tech) ---
  { id: 25, name: "Matrix", css: "background: linear-gradient(0deg, transparent 20%, #0f0 100%); background-size: 100% 200%; background-color: #000; animation: verticalFlowDown 1.5s linear infinite;" },
  { id: 26, name: "Lava Lamp", css: "background: radial-gradient(circle at 50% 50%, #ff5722 20%, #ff9800 50%, #795548 100%); background-size: 150% 150%; animation: morphBlob 8s ease-in-out infinite;" },
  { id: 27, name: "Underwater", css: "background: linear-gradient(to top, #001f3f, #0074D9); background-size: 100% 200%; animation: breathe 6s ease-in-out infinite alternate;" },
  { id: 28, name: "Espacio", css: "background: radial-gradient(1px 1px at 10% 10%, #fff, transparent), radial-gradient(1px 1px at 20% 20%, #fff, transparent), radial-gradient(2px 2px at 30% 60%, #fff, transparent), radial-gradient(2px 2px at 60% 30%, #fff, transparent); background-color: #000; background-size: 200% 200%; animation: panDiagonal 60s linear infinite;" },
  { id: 29, name: "Nevado", css: "background-image: radial-gradient(2px 2px at 20px 30px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 50px 160px, #fff, rgba(0,0,0,0)), radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)); background-size: 200px 200px; background-color: #0f172a; animation: verticalFlowDown 4s linear infinite;" },
  { id: 30, name: "Fogata", css: "background: radial-gradient(circle at 50% 100%, #facc15 0%, #ef4444 30%, #450a0a 80%); background-size: 100% 150%; animation: firePulse 0.2s ease-in-out infinite alternate;" },
  { id: 31, name: "Pulse Heart", css: "background: radial-gradient(circle, #be185d 20%, #831843 80%); background-size: 120% 120%; animation: pulseSize 1s ease-in-out infinite;" },
  { id: 32, name: "Scanner", css: "background: linear-gradient(to bottom, transparent 49%, #0f0 50%, transparent 51%); background-color: #000; background-size: 100% 200%; animation: verticalFlow 2s linear infinite;" },
  { id: 33, name: "Bokeh", css: "background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 20%), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 0%, transparent 20%); background-color: #6366f1; background-size: 100% 100%; animation: panDiagonal 10s ease-in-out infinite alternate;" },


  // --- GRUPO 5: EFECTOS SUAVES Y ELEGANTES ---
  { id: 34, name: "Colores", css: "background: #2193b0; animation: hueRotate 10s infinite linear;" },
  { id: 35, name: "Twilight", css: "background: linear-gradient(to bottom, #2c3e50, #fd746c); background-size: 100% 200%; animation: verticalFlow 10s ease infinite alternate;" },
  { id: 36, name: "Disco", css: "background: radial-gradient(circle, #ff0000, #00ff00, #0000ff); background-size: 200% 200%; animation: panDiagonal 2s linear infinite;" },
  { id: 37, name: "Neon", css: "background: #000; box-shadow: inset 0 0 50px #0f0; animation: pulseBoxShadow 1s ease-in-out infinite alternate;" },
  { id: 38, name: "Alerta roja", css: "background: repeating-linear-gradient(0deg, #500, #500 10px, #a00 10px, #a00 20px); animation: verticalFlow 0.5s linear infinite;" },


  // --- GRUPO 6: GEOMETRÍA ACTIVA ---
  { id: 39, name: "Rejilla", css: "background-color: #333; background-image: linear-gradient(30deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444), linear-gradient(150deg, #444 12%, transparent 12.5%, transparent 87%, #444 87.5%, #444); background-size: 30px 52px; animation: subtleZoom 3s ease-in-out infinite;" },
  { id: 40, name: "Anillos", css: "background: repeating-radial-gradient(circle, #ec4899, #ec4899 10px, #db2777 10px, #db2777 20px); animation: illusionSpin 5s linear infinite;" },
  { id: 41, name: "Lluvia diagonal", css: "background: linear-gradient(60deg, transparent 20%, #6366f1 100%); background-color: #0f172a; background-size: 20px 20px; animation: panDiagonal 0.5s linear infinite;" },
  { id: 42, name: "Metal líquido", css: "background: linear-gradient(135deg, #9ca3af 0%, #d1d5db 50%, #9ca3af 100%); background-size: 400% 400%; animation: gradientFlow 3s ease infinite;" },
  { id: 43, name: "Radio", css: "background: repeating-radial-gradient(#22c55e, #22c55e 5px, #14532d 5px, #14532d 15px); animation: subtleZoom 2s linear infinite;" },
  { id: 44, name: "Caleidoscópio", css: "background: conic-gradient(from var(--spin-angle), #eab308, #a855f7, #3b82f6, #eab308); background-size: 50% 50%; animation: colorSpin 4s linear infinite;" },
];

const DEFAULT_PROFILE_DATA = {
  name: "Invitado",
  coins: 0,
  ownedSkins: ["skin-1"],
  ownedSounds: ["wood"],
  currentSkin: "skin-1",
  currentSound: "wood",
  currentWallpaper: 38,
  maxLevelNoob: 1,
  maxLevelPro: 1,
  showParticles: true,
  highScore: 0,
  unlockedAchievements: [],
  gamesPlayed: 0,
  totalLosses: 0
};

export default function App() {
  // --- GESTIÓN DE PERFILES Y ESTADOS ---
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('mb_profiles_v3');
    if (saved) return JSON.parse(saved);

    const legacyCoins = parseInt(localStorage.getItem('mb_coins') || '0');
    const legacySkins = JSON.parse(localStorage.getItem('mb_owned_skins') || '["skin-1"]');
    const legacyMax = parseInt(localStorage.getItem('mb_max_unlocked') || '1');

    return {
      'guest': {
        ...DEFAULT_PROFILE_DATA,
        coins: legacyCoins,
        ownedSkins: legacySkins,
        maxLevelNoob: legacyMax,
        maxLevelPro: legacyMax,
      }
    };
  });

  const [activeProfileId, setActiveProfileId] = useState(() => localStorage.getItem('mb_active_profile_id') || 'guest');
  const activeProfile = profiles[activeProfileId] || DEFAULT_PROFILE_DATA;

  const [coins, setCoins] = useState(activeProfile.coins);
  const [ownedSkins, setOwnedSkins] = useState(activeProfile.ownedSkins);
  const [ownedSounds, setOwnedSounds] = useState(activeProfile.ownedSounds);
  const [currentSkin, setCurrentSkin] = useState(activeProfile.currentSkin);
  const [currentSound, setCurrentSound] = useState(activeProfile.currentSound);
  const [currentWallpaper, setCurrentWallpaper] = useState(activeProfile.currentWallpaper);
  const [maxLevelNoob, setMaxLevelNoob] = useState(activeProfile.maxLevelNoob);
  const [maxLevelPro, setMaxLevelPro] = useState(activeProfile.maxLevelPro);
  const [showParticles, setShowParticles] = useState(activeProfile.showParticles);
  const [highScore, setHighScore] = useState(activeProfile.highScore || 0);
  const [unlockedAchievements, setUnlockedAchievements] = useState(activeProfile.unlockedAchievements || []);
  const [gamesPlayed, setGamesPlayed] = useState(activeProfile.gamesPlayed || 0);
  const [totalLosses, setTotalLosses] = useState(activeProfile.totalLosses || 0);

  const [newProfileName, setNewProfileName] = useState("");

  useEffect(() => {
    setProfiles(prev => {
      const updated = {
        ...prev,
        [activeProfileId]: {
          ...prev[activeProfileId],
          coins,
          ownedSkins,
          ownedSounds,
          currentSkin,
          currentSound,
          currentWallpaper,
          maxLevelNoob,
          maxLevelPro,
          showParticles,
          highScore,
          unlockedAchievements,
          gamesPlayed,
          totalLosses
        }
      };
      localStorage.setItem('mb_profiles_v3', JSON.stringify(updated));
      return updated;
    });
  }, [coins, ownedSkins, ownedSounds, currentSkin, currentSound, currentWallpaper, maxLevelNoob, maxLevelPro, showParticles, highScore, unlockedAchievements, gamesPlayed, totalLosses]);

  useEffect(() => {
    localStorage.setItem('mb_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  const handleSwitchProfile = (id) => {
    const profile = profiles[id];
    if (profile) {
      setActiveProfileId(id);
      setCoins(profile.coins);
      setOwnedSkins(profile.ownedSkins);
      setOwnedSounds(profile.ownedSounds);
      setCurrentSkin(profile.currentSkin);
      setCurrentSound(profile.currentSound);
      setCurrentWallpaper(profile.currentWallpaper);
      setMaxLevelNoob(profile.maxLevelNoob);
      setMaxLevelPro(profile.maxLevelPro);
      setShowParticles(profile.showParticles);
      setHighScore(profile.highScore || 0);
      setUnlockedAchievements(profile.unlockedAchievements || []);
      setGamesPlayed(profile.gamesPlayed || 0);
      setTotalLosses(profile.totalLosses || 0);
      setScreen('modeSelect');
    }
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newId = `user_${Date.now()}`;
    const newProfile = { ...DEFAULT_PROFILE_DATA, name: newProfileName.trim() };

    setProfiles(prev => {
      const updated = { ...prev, [newId]: newProfile };
      localStorage.setItem('mb_profiles_v3', JSON.stringify(updated));
      return updated;
    });
    setNewProfileName("");
    handleSwitchProfile(newId);
  };

  const handleDeleteProfile = (id, e) => {
    e.stopPropagation();
    if (Object.keys(profiles).length <= 1) {
      // Usar un modal o un mensaje personalizado en lugar de alert
      console.warn("No puedes borrar el último perfil.");
      return;
    }
    // Usar un modal o un mensaje personalizado en lugar de confirm
    if (window.confirm("¿Borrar este perfil y todo su progreso?")) {
      const newProfiles = { ...profiles };
      delete newProfiles[id];
      setProfiles(newProfiles);
      localStorage.setItem('mb_profiles_v3', JSON.stringify(newProfiles));

      if (activeProfileId === id) {
        handleSwitchProfile(Object.keys(newProfiles)[0]);
      }
    }
  };

  const [screen, setScreen] = useState('intro');
  const [gameState, setGameState] = useState('ready');
  const [gameMode, setGameMode] = useState('arcade');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(3);
  const [lives, setLives] = useState(3);
  const [notesHit, setNotesHit] = useState(0);
  const [currentNote, setCurrentNote] = useState(NOTES_DATA[0]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [message, setMessage] = useState("");
  const [showStoreConfirm, setShowStoreConfirm] = useState(null);
  const [explosions, setExplosions] = useState([]);
  const [noteEffects, setNoteEffects] = useState([]);
  const [screenEffect, setScreenEffect] = useState(null);
  const [fxParticles, setFxParticles] = useState([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState(null);

  const [aiFeedback, setAiFeedback] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const missedNotesRef = useRef([]);

  const audioCtxRef = useRef(null);
  const lastInputRef = useRef(0);
  const timerIntervalRef = useRef(null);
  const [colorMode, setColorMode] = useState(false);
  const [detectedPitch, setDetectedPitch] = useState(null); // Estado para mostrar la nota detectada en UI

  // --- MIC STATES & REFS ---
  const [isMicActive, setIsMicActive] = useState(false);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const micStreamRef = useRef(null);
  const lastPitchTimeRef = useRef(0);
  const micLockRef = useRef(0);

  // --- AUDIO ENGINE ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  // --- REFERENCIA DE ESTADO PARA EL BUCLE DE AUDIO (FIX STALE CLOSURE) ---
  // Esto permite que el bucle updatePitch lea siempre el valor más reciente
  // de currentNote y handleInput, sin quedar atrapado en el cierre inicial.
  const stateRef = useRef({}); // Init empty to avoid ReferenceError (handleInput defined below)


  // --- MIC PITCH DETECTION FIX ---

  // Mapea la frecuencia a la nota diatónica más cercana (C, D, E, F, G, A, B),
  // independientemente de la octava o si es ligeramente # o b.
  const getDiatonicNoteFromPitch = (frequency) => {
    if (frequency <= 0) return null;

    const A4 = 440; // Referencia estándar

    // 1. Convertir la frecuencia a un número de nota MIDI (69 = A4)
    // Formula: MIDI = 12 * log2(freq / A4) + 69
    const midiNote = 12 * (Math.log2(frequency / A4)) + 69;

    // 2. Redondear al número de nota MIDI más cercano (ej: 60=C4, 61=C#4)
    const roundedMidi = Math.round(midiNote);

    // 3. Obtener el índice de la nota (0=C, 1=C#, 2=D, etc.)
    const noteIndex = (roundedMidi % 12 + 12) % 12;

    // 4. Obtener el nombre cromático (ej: "C", "C#", "D")
    const chromaticNote = NOTE_STRINGS[noteIndex];

    // 5. Devolver la nota cromática completa para mayor precisión en piano.
    // Ej: Si tocan C#, devuelve "C#".
    return chromaticNote;
  };


  const autoCorrelate = (buf, sampleRate) => {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.05)
      return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    let c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++)
        c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;
    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    const ac = autoCorrelate(buffer, audioCtxRef.current.sampleRate);

    // LEER DESDE LA REF PARA OBTENER EL ESTADO MÁS RECIENTE
    const { gameState: currentGameState, currentNote: latestNote, handleInput: latestHandleInput } = stateRef.current;

    if (ac > -1) {
      // Usar la nueva función para obtener la nota diatónica (C, D, E, F, G, A, B)
      const noteName = getDiatonicNoteFromPitch(ac);

      setDetectedPitch(noteName); // Actualizar UI con la nota detectada

      const now = Date.now();
      // Se redujo el tiempo de cooldown a 250ms para mayor respuesta
      if (noteName && now > micLockRef.current && now - lastPitchTimeRef.current > 250) {
        if (currentGameState === 'playing') {
          // USAR latestNote (del Ref) EN LUGAR DE currentNote (del closure)
          const targetBase = latestNote.noteBase || latestNote.note.charAt(0); // Tomar solo la nota base (ej: 'C' de 'C2')

          // Lógica estricta: La nota detectada debe ser IGUAL a la nota objetivo.
          if (noteName === targetBase) {
            latestHandleInput(targetBase); // Usar la función handleInput más reciente
            lastPitchTimeRef.current = now;
            micLockRef.current = now + 400; // Agregar 400ms de enfriamiento después de un acierto
          }
        }
      }
    } else {
      setDetectedPitch(null);
    }
    rafRef.current = requestAnimationFrame(updatePitch);
  };

  const toggleMic = async () => {
    if (isMicActive) {
      // Stop
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsMicActive(false);
    } else {
      // Start
      try {
        initAudio();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;

        const source = audioCtxRef.current.createMediaStreamSource(stream);
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);
        analyserRef.current = analyser;

        setIsMicActive(true);
        updatePitch();
      } catch (err) {
        console.error("Mic Error:", err);
        // Usar console.error en lugar de alert
        console.error("Error: No se pudo acceder al micrófono. Asegúrate de que tienes permiso.");
      }
    }
  };

  // Cleanup mic on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);


  const playTone = (freq, forceSoundId = null) => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.frequency.value = 22050;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      let dur = 0.5;
      const selectedSound = forceSoundId || currentSound;

      switch (selectedSound) {
        case 'wood': osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); gain.gain.setValueAtTime(0.7, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05); dur = 0.05; break;
        case 'click': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq * 2, t); gain.gain.setValueAtTime(0.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03); dur = 0.03; break;
        case '8bit': osc.type = 'square'; osc.frequency.setValueAtTime(freq, t); osc.frequency.setValueAtTime(freq * 1.5, t + 0.05); gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0, t + 0.1); dur = 0.1; break;
        case 'zap': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq * 3, t); osc.frequency.exponentialRampToValueAtTime(100, t + 0.15); gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0, t + 0.15); dur = 0.15; break;
        case 'magma': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 2, t); osc.frequency.linearRampToValueAtTime(freq / 4, t + 0.2); filter.type = 'lowpass'; filter.frequency.setValueAtTime(500, t); gain.gain.setValueAtTime(0.6, t); gain.gain.linearRampToValueAtTime(0, t + 0.2); dur = 0.2; break;
        case 'matrix': osc.type = 'square'; osc.frequency.setValueAtTime(freq * 2, t); osc.frequency.linearRampToValueAtTime(freq / 2, t + 0.05); osc.frequency.linearRampToValueAtTime(freq * 2, t + 0.1); gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0, t + 0.1); dur = 0.1; break;
        case 'noir': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t); filter.type = 'lowpass'; filter.frequency.setValueAtTime(400, t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.6, t + 0.02); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3); dur = 0.3; break;
        case 'bubble': osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.exponentialRampToValueAtTime(freq * 3, t + 0.1); gain.gain.setValueAtTime(0.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); dur = 0.1; break;
        case 'royal': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq, t); filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, t); filter.frequency.linearRampToValueAtTime(2000, t + 0.05); gain.gain.setValueAtTime(0.4, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2); dur = 0.2; break;
        case 'toxic': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 2, t); filter.type = 'bandpass'; filter.Q.value = 10; filter.frequency.setValueAtTime(200, t); filter.frequency.linearRampToValueAtTime(1500, t + 0.2); gain.gain.setValueAtTime(0.5, t); gain.gain.linearRampToValueAtTime(0, t + 0.2); dur = 0.2; break;
        case 'ocean': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 4, t); filter.type = 'lowpass'; filter.frequency.setValueAtTime(1000, t); filter.frequency.exponentialRampToValueAtTime(100, t + 0.4); gain.gain.setValueAtTime(0.3, t); gain.gain.linearRampToValueAtTime(0, t + 0.4); dur = 0.4; break;
        case 'sunset': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t); gain.gain.setValueAtTime(0.4, t); gain.gain.linearRampToValueAtTime(0, t + 0.4); dur = 0.4; break;
        case 'candy': osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 2, t); gain.gain.setValueAtTime(0.3, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3); dur = 0.3; break;
        case 'blueprint': osc.type = 'square'; osc.frequency.setValueAtTime(freq * 4, t); gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.02); dur = 0.02; break;
        case 'gameboy': osc.type = 'square'; osc.frequency.setValueAtTime(freq, t); osc.frequency.setValueAtTime(freq * 1.25, t + 0.03); osc.frequency.setValueAtTime(freq * 1.5, t + 0.06); gain.gain.setValueAtTime(0.15, t); gain.gain.linearRampToValueAtTime(0, t + 0.15); dur = 0.15; break;
        case 'void': osc.type = 'sine'; osc.frequency.setValueAtTime(freq / 4, t); gain.gain.setValueAtTime(0.8, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4); dur = 0.4; break;
        case 'plasma': osc.type = 'square'; osc.frequency.setValueAtTime(freq * 4, t); osc.frequency.exponentialRampToValueAtTime(freq, t + 0.1); gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0, t + 0.1); dur = 0.1; break;
        case 'paper': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq / 2, t); gain.gain.setValueAtTime(0.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05); dur = 0.05; break;
        case 'vampire': osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); filter.type = 'peaking'; filter.frequency.value = freq * 2; filter.gain.value = 10; gain.gain.setValueAtTime(0.4, t); gain.gain.linearRampToValueAtTime(0, t + 0.3); dur = 0.3; break;
        case 'ultimate': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq, t); gain.gain.setValueAtTime(0.4, t); gain.gain.linearRampToValueAtTime(0, t + 0.5); osc.detune.setValueAtTime(0, t); osc.detune.linearRampToValueAtTime(20, t + 0.3); dur = 0.5; break;
        case 'cyber': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 4, t); filter.type = 'lowpass'; filter.frequency.setValueAtTime(2000, t); filter.frequency.exponentialRampToValueAtTime(100, t + 0.2); gain.gain.setValueAtTime(0.7, t); gain.gain.linearRampToValueAtTime(0, t + 0.25); dur = 0.25; break;
        case 'nature': osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 2, t); osc.frequency.exponentialRampToValueAtTime(freq, t + 0.1); gain.gain.setValueAtTime(0.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); dur = 0.1; break;
        case 'steampunk': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t); const mod = ctx.createOscillator(); mod.type = 'square'; mod.frequency.value = 400; const modGain = ctx.createGain(); modGain.gain.value = 5000; mod.connect(modGain); modGain.connect(osc.frequency); mod.start(t); mod.stop(t + 0.2); gain.gain.setValueAtTime(0.3, t); gain.gain.linearRampToValueAtTime(0, t + 0.2); dur = 0.2; break;
        case 'glitch_hit': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 2, t); osc.frequency.setValueAtTime(freq * 2, t + 0.05); osc.frequency.setValueAtTime(freq, t + 0.1); gain.gain.setValueAtTime(0.4, t); gain.gain.linearRampToValueAtTime(0, t + 0.15); dur = 0.15; break;
        case 'space': osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 1.5, t); gain.gain.setValueAtTime(0.3, t); gain.gain.setValueAtTime(0.1, t + 0.1); gain.gain.setValueAtTime(0.05, t + 0.2); gain.gain.linearRampToValueAtTime(0, t + 0.3); dur = 0.3; break;
        case 'horror': osc.type = 'sine'; osc.frequency.setValueAtTime(freq, t); osc.frequency.linearRampToValueAtTime(freq - 20, t + 0.1); osc.frequency.linearRampToValueAtTime(freq, t + 0.2); gain.gain.setValueAtTime(0.3, t); gain.gain.linearRampToValueAtTime(0, t + 0.4); dur = 0.4; break;
        case 'cute': osc.type = 'sine'; osc.frequency.setValueAtTime(freq * 4, t); osc.frequency.linearRampToValueAtTime(freq * 5, t + 0.1); gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15); dur = 0.15; break;
        case 'drum': osc.type = 'triangle'; osc.frequency.setValueAtTime(150, t); filter.type = 'highpass'; filter.frequency.value = 200; gain.gain.setValueAtTime(0.8, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); dur = 0.1; break;
        case 'angel': osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t); gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.4, t + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.6); dur = 0.6; break;
        case 'god': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(freq / 2, t); filter.type = 'lowpass'; filter.frequency.setValueAtTime(300, t); filter.Q.value = 15; gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(0.6, t + 0.2); gain.gain.linearRampToValueAtTime(0, t + 1.0); dur = 1.0; break;
        default: osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, t); gain.gain.setValueAtTime(0.5, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1); dur = 0.1;
      }
      if (selectedSound !== 'steampunk') {
        osc.start(t); osc.stop(t + dur);
      }
    } catch (e) { console.error(e); }
  };

  const spawnEffectParticles = (x, y, fxId) => {
    if (!showParticles) return;
    const effectConfig = EFFECTS[fxId] || EFFECTS['notes'];
    const IconComponent = effectConfig.icon;
    const color = effectConfig.color;

    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      angle: (i / 8) * 360,
      speed: 2 + Math.random() * 2,
      icon: IconComponent,
      color: color
    }));

    const explosionId = Date.now();
    setFxParticles(prev => [...prev, { id: explosionId, x, y, particles: newParticles }]);

    setTimeout(() => {
      setFxParticles(prev => prev.filter(e => e.id !== explosionId));
    }, 800);
  };

  const callGeminiCoach = async () => {
    setIsLoadingAI(true);
    setAiFeedback(null);

    const missedUnique = [...new Set(missedNotesRef.current)];
    const prompt = `Act as a fun and encouraging music teacher for a student playing a note identification game. 
    Mode: ${gameMode}. Score: ${score}. Streak: ${streak}. 
    Missed Notes: ${missedUnique.length > 0 ? missedUnique.join(', ') : 'None! Perfect game!'}.
    Give a short (max 2 sentences) feedback in Spanish. If they missed specific notes, give a tiny tip to remember them. If perfect, praise them enthusiastically. Use emojis.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      // Check for safe access to response data
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        setAiFeedback(data.candidates[0].content.parts[0].text);
      } else {
        setAiFeedback("¡El Coach AI está descansando! Sigue practicando. 🎵");
      }
    } catch (error) {
      console.error("Error AI:", error);
      setAiFeedback("Error de conexión con el Coach AI. ¡Tú puedes! 🎸");
    }
    setIsLoadingAI(false);
  };

  const spawnNote = useCallback(() => {
    let min = 0;
    let max = 0;

    if (gameMode === 'arcade') {
      if (level <= 10) {
        max = 2 + (level - 1);
        if (max > 11) max = 11;
        min = 0;
      } else {
        const bassStartIndex = 12;
        const count = 3 + (level - 11);
        min = bassStartIndex;
        max = bassStartIndex + count - 1;
        if (max >= NOTES_DATA.length) max = NOTES_DATA.length - 1;
      }
    } else {
      max = NOTES_DATA.length - 1;
    }

    const idx = Math.floor(Math.random() * (max - min + 1)) + min;
    setCurrentNote(NOTES_DATA[idx]);
  }, [gameMode, level]);

  const startGame = (customLvl) => {
    initAudio();
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setLives(3);
    setNotesHit(0);
    setConfetti([]);
    setMessage("¡VAMOS!");
    setAiFeedback(null);
    missedNotesRef.current = [];
    if (customLvl) setLevel(customLvl);

    if (gameMode === 'arcade') setTimer(60);
    else if (gameMode === 'survival') setTimer(0);
    else setTimer(0);
    spawnNote();

    setGamesPlayed(prev => prev + 1);
  };

  const togglePause = () => {
    if (gameState === 'playing') setGameState('paused');
    else if (gameState === 'paused') setGameState('playing');
  };

  const quitGame = () => {
    setGameState('ready');
    setScreen('modeSelect');
  };

  const checkAchievements = (currentScore, currentStreak, isWin) => {
    const newUnlocked = [];

    if (level === 1 && isWin && !unlockedAchievements.includes('first_win')) newUnlocked.push('first_win');
    if (currentStreak >= 20 && !unlockedAchievements.includes('streak_20')) newUnlocked.push('streak_20');
    if (currentStreak >= 50 && !unlockedAchievements.includes('streak_50')) newUnlocked.push('streak_50');
    if (coins >= 100 && !unlockedAchievements.includes('rich')) newUnlocked.push('rich');

    if (gameMode === 'survival' && timer >= 30 && !unlockedAchievements.includes('survivor_novice')) newUnlocked.push('survivor_novice');
    if (gameMode === 'survival' && timer >= 120 && !unlockedAchievements.includes('survivor_master')) newUnlocked.push('survivor_master');

    if (!colorMode && maxLevelPro >= 5 && !unlockedAchievements.includes('pro_unlock')) newUnlocked.push('pro_unlock');

    if (currentStreak >= 100 && !unlockedAchievements.includes('streak_100')) newUnlocked.push('streak_100');
    if (coins >= 500 && !unlockedAchievements.includes('millionaire')) newUnlocked.push('millionaire');
    if (ownedSkins.length > 1 && !unlockedAchievements.includes('spender')) newUnlocked.push('spender');

    if (gameMode === 'sayoya' && notesHit >= 100 && !unlockedAchievements.includes('speedster')) newUnlocked.push('speedster');

    if (maxLevelNoob >= 11 && !unlockedAchievements.includes('bass_player')) newUnlocked.push('bass_player');
    if (maxLevelNoob >= 10 && !unlockedAchievements.includes('mid_game')) newUnlocked.push('mid_game');
    if (maxLevelNoob >= 20 && !unlockedAchievements.includes('game_complete')) newUnlocked.push('game_complete');

    if (!colorMode && maxLevelPro >= 20 && !unlockedAchievements.includes('pro_master')) newUnlocked.push('pro_master');

    if (gamesPlayed >= 50 && !unlockedAchievements.includes('persistent')) newUnlocked.push('persistent');

    if (gameMode === 'arcade' && isWin && currentStreak === notesHit && !unlockedAchievements.includes('sniper')) newUnlocked.push('sniper');
    if (!isWin && lives === 0 && totalLosses >= 3 && !unlockedAchievements.includes('clumsy')) newUnlocked.push('clumsy');
    if ((currentSkin === 'skin-16' || currentSkin === 'skin-7') && !unlockedAchievements.includes('night_owl')) newUnlocked.push('night_owl');
    if (currentWallpaper !== 38 && currentSkin !== 'skin-1' && currentSound !== 'wood' && !unlockedAchievements.includes('customizer')) newUnlocked.push('customizer');

    if (newUnlocked.length > 0) {
      const achievementObj = ACHIEVEMENTS.find(a => a.id === newUnlocked[0]);
      if (achievementObj) {
        const achievementName = achievementObj.name;
        setAchievementUnlocked(achievementName);
        setTimeout(() => setAchievementUnlocked(null), 3000);
        setUnlockedAchievements(prev => [...prev, ...newUnlocked]);
      }
    }
  };

  const triggerNoteEffect = (type) => {
    const newId = Date.now();
    let animationClass = '';

    if (currentSkin === 'skin-2') animationClass = 'pixel-explode';
    else if (currentSkin === 'skin-3') animationClass = 'flip-vanish';
    else if (currentSkin === 'skin-6') animationClass = 'shoot-right';
    else if (currentSkin === 'skin-9') animationClass = 'glow-vanish';
    else if (currentSkin === 'skin-10') animationClass = 'green-pulse';
    else if (currentSkin === 'skin-11') animationClass = 'blue-wave';
    else if (currentSkin === 'skin-14') animationClass = 'shoot-down';
    else if (currentSkin === 'skin-15') animationClass = 'split-half';
    else if (currentSkin === 'skin-21') { animationClass = 'pixel-explode'; setScreenEffect('screen-matrix'); setTimeout(() => setScreenEffect(null), 300); }
    else if (currentSkin === 'skin-24') { animationClass = 'glitch-death'; setScreenEffect('screen-glitch'); setTimeout(() => setScreenEffect(null), 300); }
    else if (currentSkin === 'skin-25') { animationClass = 'color-pulse'; }
    else if (currentSkin === 'skin-26') animationClass = 'rapid-expand';
    else if (currentSkin === 'skin-27') animationClass = 'petals';
    else if (currentSkin === 'skin-28') animationClass = 'explode';
    else if (currentSkin === 'skin-29') animationClass = 'white-glow';
    else if (currentSkin === 'skin-30') animationClass = 'color-glitch-vanish';
    else if (currentSkin === 'skin-5') animationClass = 'melt';
    else animationClass = 'pop';

    if (type === 'miss') animationClass = 'shake-fade';

    const effect = {
      id: newId,
      top: currentNote.top,
      colorKey: currentNote.colorKey,
      stemUp: currentNote.stemUp,
      ledger: currentNote.ledger,
      anim: animationClass
    };

    setNoteEffects(prev => [...prev, effect]);
    setTimeout(() => {
      setNoteEffects(prev => prev.filter(e => e.id !== newId));
    }, 600);

    if (type === 'hit') {
      const skinConfig = SKINS.find(s => s.id === currentSkin);
      if (skinConfig && skinConfig.fx) {
        spawnEffectParticles(0, currentNote.top, skinConfig.fx);
      }
    }
  };

  const handleInput = (noteInput) => {
    if (gameState !== 'playing') return;
    const now = Date.now();
    if (now - lastInputRef.current < 150) return;
    lastInputRef.current = now;

    const correctNote = currentNote.noteBase || currentNote.note.charAt(0); // Asegurar que solo sea la nota base (C, D, E, etc.)

    if (noteInput === correctNote) {
      playTone(currentNote.freq);
      setFeedback('correct');
      triggerNoteEffect('hit');
      setCoins(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (gameMode === 'arcade' || gameMode === 'survival') setScore(prev => prev + 100 + (newStreak * 10));
      if (gameMode === 'sayoya') setNotesHit(prev => { const newVal = prev + 1; if (newVal >= 50) endGame(true); return newVal; });
      spawnNote();
    } else {
      playTone(150);
      setFeedback('wrong');
      triggerNoteEffect('miss');

      missedNotesRef.current.push(currentNote.note);

      setStreak(0);
      if (gameMode === 'arcade') setScore(prev => Math.max(0, prev - 50));
      if (gameMode === 'survival') setLives(prev => { const newLives = prev - 1; if (newLives <= 0) endGame(false); return newLives; });
    }
    setTimeout(() => setFeedback(null), 200);
  };

  // --- SYNC REF AFTER DEFINITIONS (Fix ReferenceError) ---
  useEffect(() => {
    stateRef.current = { gameState, currentNote, handleInput };
  }, [gameState, currentNote, handleInput]);

  const endGame = (win) => {
    setGameState('gameOver');
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    let endMsg = win ? "¡GANASTE!" : "FIN DEL JUEGO";

    if (!win) setTotalLosses(prev => prev + 1);

    if (gameMode === 'arcade' && score > highScore) {
      setHighScore(score);
    }

    checkAchievements(score, streak, win);

    if (gameMode === 'arcade' && score >= 8500) {
      if (colorMode) {
        if (level === maxLevelNoob && maxLevelNoob < 20) {
          const newMax = maxLevelNoob + 1;
          setMaxLevelNoob(newMax);
          endMsg = `¡NIVEL ${newMax} DESBLOQUEADO (NOOB)!`;
          triggerConfetti();
        } else {
          endMsg = "¡NIVEL SUPERADO!";
          triggerConfetti();
        }
      } else {
        if (level === maxLevelPro && maxLevelPro < 20) {
          const newMax = maxLevelPro + 1;
          setMaxLevelPro(newMax);
          endMsg = `¡NIVEL ${newMax} DESBLOQUEADO (PRO)!`;
          triggerConfetti();
        } else {
          endMsg = "¡NIVEL SUPERADO!";
          triggerConfetti();
        }
      }
    } else if (win) {
      triggerConfetti();
    }
    setMessage(endMsg);
  };

  const handleNextLevel = () => {
    if (level < 20) {
      setLevel(prev => prev + 1);
      startGame(level + 1);
    } else {
      setScreen('modeSelect');
    }
  };

  const triggerConfetti = () => {
    const pieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i, left: Math.random() * 100, animDuration: Math.random() + 1, color: Object.values(COLORS)[Math.floor(Math.random() * 7)]
    }));
    setConfetti(pieces);
  };

  const addExplosion = (x, y) => {
    const newId = Date.now();
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    }));

    setExplosions(prev => [...prev, { id: newId, x, y, particles }]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== newId));
    }, 1000);
  };

  const handleButtonClick = (e, cb) => {
    const x = e.clientX;
    const y = e.clientY;
    addExplosion(x, y);
    if (cb) cb();
  };

  const buyItem = (type, item) => {
    if (coins >= item.price) {
      setCoins(prev => prev - item.price);
      if (type === 'skin') {
        setOwnedSkins(prev => [...prev, item.id]);
        setCurrentSkin(item.id);
      } else {
        setOwnedSounds(prev => [...prev, item.id]);
        setCurrentSound(item.id);
      }
      setShowStoreConfirm(null);
    } else {
      setMessage("¡FALTAN MONEDAS!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleStoreClick = (type, item) => {
    if (type === 'skin') {
      if (ownedSkins.includes(item.id)) {
        // Visual only
      } else {
        setShowStoreConfirm({ type: 'skin', item });
      }
    } else {
      if (ownedSounds.includes(item.id)) {
        setCurrentSound(item.id);
        initAudio();
        playTone(261.63, item.id);
      } else {
        setShowStoreConfirm({ type: 'sound', item });
      }
    }
  };

  const handleSelectWallpaper = (id) => {
    setCurrentWallpaper(id);
  };

  const handleSelectSkin = (item) => {
    setCurrentSkin(item.id);
  };

  const handleSelectSound = (item) => {
    setCurrentSound(item.id);
    initAudio();
    playTone(261.63, item.id);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        if (gameMode === 'arcade') {
          setTimer(prev => Math.max(0, prev - 1));
        } else if (gameMode === 'survival') {
          setTimer(prev => prev + 1);
        } else if (gameMode === 'sayoya') {
          setTimer(prev => prev + 0.1);
        }
      }, gameMode === 'sayoya' ? 100 : 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [gameState, gameMode]);

  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'arcade' && timer === 0) {
      const isWin = score >= 8500;
      endGame(isWin);
    }
  }, [timer, gameState, gameMode, score]);

  const wallpaperStyles = WALLPAPERS.map(w => `.wp-${w.id} { ${w.css} }`).join('\n');

  return (
    <div className={`app-container wp-${currentWallpaper} ${currentSkin}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Stencil&display=swap');
        
        :root { --neon-blue: #00f3ff; --neon-pink: #ff00ff; --neon-green: #00ff00; --dark-bg: #121220; --panel-bg: rgba(20, 20, 35, 0.9); }
        
        .app-container { font-family: 'Press Start 2P', cursive; color: #fff; display: flex; flex-direction: column; height: 100dvh; width: 100%; margin: 0; overflow: hidden; background-color: var(--dark-bg); user-select: none; touch-action: manipulation; justify-content: space-between; transition: background 0.5s; overscroll-behavior: none; }
        
        /* ANIMATIONS */
        /* ANIMARIONS REPLACED IN INDEX.CSS */
        @keyframes pulseBtn { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        @keyframes particleExplosion { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; } }
        @keyframes achievementPop { 0% { transform: scale(0) translateY(50px); opacity: 0; } 50% { transform: scale(1.1) translateY(0); opacity: 1; } 100% { transform: scale(1); } }
        
        /* NOTE DEATH ANIMATIONS */
        @keyframes pop { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
        @keyframes melt { 0% { transform: scale(1); border-radius: 50%; } 100% { transform: scaleX(1.5) scaleY(0.2) translateY(10px); opacity: 0; } }
        @keyframes freeze { 0% { background-color: currentColor; } 100% { background-color: #fff; box-shadow: 0 0 15px #0ff; transform: scale(1.1); opacity: 0; } }
        @keyframes glitch-death { 0% { transform: translate(0); } 25% { transform: translate(-5px, 5px); } 50% { transform: translate(5px, -5px); opacity: 0.5; } 100% { transform: translate(0); opacity: 0; } }
        @keyframes implode { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(0); opacity: 0; } }
        @keyframes shake-fade { 0% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } 100% { transform: translateX(0); opacity: 0; } }
        @keyframes pixel-explode { 0% { transform: scale(1); opacity: 1; filter: blur(0px); } 50% { transform: scale(1.5); opacity: 0.5; filter: blur(2px); } 100% { transform: scale(2); opacity: 0; filter: blur(4px); } }
        @keyframes flip-vanish { 0% { transform: rotateY(0); opacity: 1; } 100% { transform: rotateY(180deg) scale(0.5); opacity: 0; } }
        @keyframes shoot-right { 0% { transform: translateX(0); opacity: 1; } 100% { transform: translateX(200px); opacity: 0; } }
        @keyframes shoot-down { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(200px); opacity: 0; } }
        @keyframes glow-vanish { 0% { box-shadow: 0 0 0 currentColor; opacity: 1; } 100% { box-shadow: 0 0 50px currentColor; opacity: 0; } }
        @keyframes green-pulse { 0% { box-shadow: 0 0 0 0 rgba(0,255,0,0.7); } 100% { box-shadow: 0 0 0 30px rgba(0,255,0,0); opacity: 0; } }
        @keyframes blue-wave { 0% { box-shadow: 0 0 0 0 rgba(0,0,255,0.7); } 100% { box-shadow: 0 0 0 40px rgba(0,0,255,0); opacity: 0; } }
        @keyframes split-half { 0% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 50% 0 50%); opacity: 0; } }
        @keyframes color-pulse { 0% { transform: scale(1); } 50% { transform: scale(1.3); box-shadow: 0 0 20px currentColor; } 100% { transform: scale(0); opacity: 0; } }
        @keyframes rapid-expand { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }
        @keyframes petals { 0% { transform: scale(1); box-shadow: 0 0 0 transparent; } 100% { transform: scale(0); box-shadow: 10px -10px 0 #ffc0cb, -10px -10px 0 #ffc0cb, 10px 10px 0 #ffc0cb, -10px 10px 0 #ffc0cb; opacity: 0; } }
        @keyframes explode { 0% { transform: scale(1); } 50% { transform: scale(1.5); background: orange; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes white-glow { 0% { background-color: currentColor; } 50% { background-color: white; box-shadow: 0 0 40px white; } 100% { opacity: 0; } }
        @keyframes color-glitch-vanish { 0% { background-color: red; } 25% { background-color: blue; transform: translate(2px, -2px); } 50% { background-color: green; transform: translate(-2px, 2px); } 100% { opacity: 0; } }
        @keyframes particleFly { 
            0% { transform: translate(0, 0) scale(0.5); opacity: 1; } 
            100% { transform: translate(var(--tx), var(--ty)) scale(1.5) rotate(var(--r)); opacity: 0; } 
        }

        /* --- WALLPAPERS --- */
        ${wallpaperStyles}

        /* --- SKINS CONFIGURATION --- */
        .skin-1 .game-area-bg { background: #f4f6f7; border-color: #2c3e50; } .skin-1 .font-music { color: #000; }
        .skin-3 .note-head { background: radial-gradient(circle at 30% 30%, #ffd700, #b8860b) !important; border: 1px solid #fff; box-shadow: 0 2px 0 #8a6e05; }
        .skin-3 .game-area-bg { background: #222; border-color: gold; box-shadow: 0 0 20px gold; } .skin-3 .font-music { color: #ffd700; }
        .skin-8 .note-head { background: repeating-linear-gradient(45deg, currentColor, currentColor 5px, #fff 5px, #fff 10px) !important; }
        .skin-8 .game-area-bg { background: #fce4ec; border-color: #ff4081; } .skin-8 .font-music { color: #e91e63; }
        .skin-15 .note-head { border-radius: 0 !important; width: 18px !important; height: 18px !important; }
        .skin-15 .game-area-bg { background: #8bac0f; border-color: #306230; } .skin-15 .font-music { color: #0f380f; }
        .skin-24 .note-head { clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%); }
        .skin-24 .game-area-bg { background: #121212; border-color: #ff00ff; } .skin-24 .font-music { color: #fff; text-shadow: 2px 0 red, -2px 0 blue; }
        .skin-2 .game-area-bg { background: #000; border-color: #0f0; } .skin-2 .font-music { color: #fff; text-shadow: 0 0 10px #0f0; }
        .skin-4 .game-area-bg { background: #e0f7fa; border-color: #00e5ff; } .skin-4 .font-music { color: #006064; }
        .skin-5 .game-area-bg { background: #210000; border-color: #ff3d00; } .skin-5 .font-music { color: #ffab00; }
        .skin-6 .game-area-bg { background: #000; border-color: #00ff00; } .skin-6 .font-music { color: #00ff00; font-family: monospace; }
        .skin-7 .game-area-bg { background: #333; border-color: #fff; } .skin-7 .font-music { color: #fff; filter: grayscale(100%); }
        .skin-9 .game-area-bg { background: #311b92; border-color: #ffd700; } .skin-9 .font-music { color: #ffd700; }
        .skin-10 .game-area-bg { background: #1b5e20; border-color: #76ff03; } .skin-10 .font-music { color: #c6ff00; }
        .skin-11 .game-area-bg { background: #01579b; border-color: #4fc3f7; } .skin-11 .font-music { color: #e1f5fe; }
        .skin-12 .game-area-bg { background: linear-gradient(#bf360c, #311b92); border-color: #ffab00; } .skin-12 .font-music { color: #ffab00; }
        .skin-13 .game-area-bg { background: #fff3e0; border-color: #ff9100; } .skin-13 .font-music { color: #d500f9; }
        .skin-14 .game-area-bg { background: #0d47a1; border-color: #fff; } .skin-14 .font-music { color: #fff; opacity: 0.9; }
        .skin-16 .game-area-bg { background: #000; border-color: #333; } .skin-16 .font-music { color: #333; text-shadow: 0 0 2px #fff; }
        .skin-17 .game-area-bg { background: #200; border-color: #d500f9; } .skin-17 .font-music { color: #00e5ff; }
        .skin-18 .game-area-bg { background: #fff8e1; border-color: #5d4037; } .skin-18 .font-music { color: #3e2723; font-family: serif; }
        .skin-19 .game-area-bg { background: #1a1a1a; border-color: #b71c1c; } .skin-19 .font-music { color: #ff1744; }
        .skin-20 .game-area-bg { border-color: #fff; animation: rainbow-border 2s linear infinite; } .skin-20 .font-music { animation: rainbow-text 2s linear infinite; }
        .skin-21 .game-area-bg { background: #000; border-color: #0ff; } .skin-21 .font-music { color: #0ff; }
        .skin-22 .game-area-bg { background: #1b4d3e; border-color: #8d6e63; } .skin-22 .font-music { color: #a5d6a7; }
        .skin-23 .game-area-bg { background: #3e2723; border-color: #d7ccc8; } .skin-23 .font-music { color: #ffccbc; }
        .skin-25 .game-area-bg { background: #240046; border-color: #e0aaff; } .skin-25 .font-music { color: #e0aaff; }
        .skin-26 .game-area-bg { background: #2b0000; border-color: #500; } .skin-26 .font-music { color: #ff0000; font-family: 'Creepster', cursive; }
        .skin-27 .game-area-bg { background: #ffebee; border-color: #ff80ab; } .skin-27 .font-music { color: #ff4081; }
        .skin-28 .game-area-bg { background: #33691e; border-color: #1b5e20; } .skin-28 .font-music { color: #dcedc8; font-family: 'Stencil', sans-serif; }
        .skin-29 .game-area-bg { background: #fff; border-color: #ffd700; } .skin-29 .font-music { color: #ffd700; }
        .skin-30 .game-area-bg { background: radial-gradient(circle, #ffd700, #ff6f00); border-color: #fff; animation: glow 2s infinite alternate; } .skin-30 .font-music { color: #fff; }

        /* UI ELEMENTS */
        .full-screen-menu { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; z-index: 50; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 20px; }
        .menu-btn { background: rgba(0, 0, 0, 0.7); border: 2px solid var(--neon-blue); border-bottom: 6px solid var(--neon-blue); color: #fff; padding: 20px; font-family: 'Press Start 2P'; font-size: 18px; cursor: pointer; width: 350px; text-align: center; transition: all 0.1s; border-radius: 8px; text-shadow: 2px 2px #000; position: relative; animation: pulseBtn 3s infinite ease-in-out; }
        .menu-btn:active { transform: translateY(4px); border-bottom-width: 2px; box-shadow: none; }
        .score-badge { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 10px; border: 2px solid gold; color: gold; border-radius: 20px; display: flex; gap: 10px; align-items: center; font-size: 12px; z-index: 100; box-shadow: 0 0 10px gold; }
        .profile-badge { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 10px; border: 2px solid var(--neon-blue); color: var(--neon-blue); border-radius: 20px; display: flex; gap: 10px; align-items: center; font-size: 12px; z-index: 100; box-shadow: 0 0 10px var(--neon-blue); cursor: pointer; }
        
        /* SCOREBOARD & GAME */
        .scoreboard-container { width: 95%; margin: 10px auto 5px auto; border: 3px solid var(--neon-pink); background: var(--panel-bg); border-radius: 10px; padding: 10px; box-shadow: 0 0 15px var(--neon-pink), inset 0 0 20px rgba(255, 0, 255, 0.2); display: flex; justify-content: space-around; align-items: center; flex: 0 0 auto; z-index: 10; position: relative; }
        .stat-box { text-align: center; } .stat-label { font-size: 10px; color: var(--neon-blue); margin-bottom: 5px; text-transform: uppercase; text-shadow: 0 0 5px var(--neon-blue); } .stat-val { font-size: 16px; color: #fff; text-shadow: 2px 2px #000; }
        .pause-btn { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: 1px solid #fff; color: #fff; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .game-wrapper { flex: 1; width: 95%; margin: 0 auto; position: relative; display: flex; justify-content: center; align-items: center; border-radius: 15px; overflow: hidden; background: transparent; }
        .staff-card { width: 100%; height: 100%; background-color: #fff; border: 4px solid #fff; border-radius: 20px; position: relative; box-shadow: 0 0 30px rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center; transition: background-color 0.3s, border-color 0.3s; overflow: hidden; }
        .staff-scaler { width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; transform: scale(2.8); transform-origin: center center; }
        .staff-system { position: relative; width: 340px; height: 100px; }
        .line { position: absolute; width: 100%; height: 3px; background-color: currentColor; left: 0; opacity: 0.8; }
        
        /* CLEF STYLES - ADJUST INDEPENDENTLY */
        .clef { position: absolute; left: 0px; font-size: 95px; color: currentColor; font-family: inherit; line-height: 1; }
        .clef-treble { top: -18px; } /* Ajustar altura Clave de SOL aquí */
        .clef-bass { top: -30px; }    /* Ajustar altura Clave de FA aquí */

        .note-group { position: absolute; left: 160px; z-index: 10; transition: top 0.1s; }
        .note-head { width: 20px; height: 20px; background-color: currentColor; border-radius: 50%; transform: rotate(-20deg); position: absolute; top: 0; left: 0; }
        .note-stem { position: absolute; width: 3px; height: 50px; background-color: currentColor; display: block; }
        .ledger-line { position: absolute; width: 40px; height: 3px; background-color: currentColor; left: 150px; z-index: 5; }
        .controls-container { width: 98%; margin: 0 auto 10px auto; display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; flex: 0 0 auto; min-height: 80px; }
        .key-btn { background: rgba(0,0,0,0.5); border: 3px solid #fff; color: #fff; height: 100%; font-size: 14px; cursor: pointer; border-radius: 10px; font-family: 'Press Start 2P'; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 0 #000; transition: transform 0.1s, background 0.1s; text-shadow: 1px 1px 2px #000; }
        .key-btn:active, .key-btn.active { transform: translateY(4px); box-shadow: 0 0 0 #000; background: rgba(255,255,255,0.2); }
        
        /* FX ELEMENTS */
        .note-fx { position: absolute; left: 160px; pointer-events: none; }
        .note-fx-head { width: 20px; height: 20px; background-color: currentColor; border-radius: 50%; transform: rotate(-20deg); position: absolute; top: 0; left: 0; }
        .note-fx.melt .note-fx-head { animation: melt 0.5s forwards; }
        .note-fx.freeze .note-fx-head { animation: freeze 0.5s forwards; }
        .note-fx.glitch-death .note-fx-head { animation: glitch-death 0.4s forwards; }
        .note-fx.implode .note-fx-head { animation: implode 0.4s forwards; }
        .note-fx.pop .note-fx-head { animation: pop 0.3s forwards; }
        .note-fx.shake-fade .note-fx-head { animation: shake-fade 0.4s forwards; background-color: #f00 !important; }
        
        .note-fx.pixel-explode .note-fx-head { animation: pixel-explode 0.5s forwards; }
        .note-fx.flip-vanish .note-fx-head { animation: flip-vanish 0.5s forwards; }
        .note-fx.shoot-right .note-fx-head { animation: shoot-right 0.5s forwards; }
        .note-fx.glow-vanish .note-fx-head { animation: glow-vanish 0.5s forwards; }
        .note-fx.green-pulse .note-fx-head { animation: green-pulse 0.5s forwards; }
        .note-fx.blue-wave .note-fx-head { animation: blue-wave 0.5s forwards; }
        .note-fx.shoot-down .note-fx-head { animation: shoot-down 0.5s forwards; }
        .note-fx.split-half .note-fx-head { animation: split-half 0.5s forwards; }
        .note-fx.color-pulse .note-fx-head { animation: color-pulse 0.5s forwards; }
        .note-fx.rapid-expand .note-fx-head { animation: rapid-expand 0.3s forwards; }
        .note-fx.petals .note-fx-head { animation: petals 0.5s forwards; }
        .note-fx.explode .note-fx-head { animation: explode 0.3s forwards; }
        .note-fx.white-glow .note-fx-head { animation: white-glow 0.5s forwards; }
        .note-fx.color-glitch-vanish .note-fx-head { animation: color-glitch-vanish 0.4s forwards; }

        /* SCREEN EFFECTS */
        .screen-matrix {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 900;
            background: radial-gradient(circle at center, transparent 50%, rgba(0, 255, 0, 0.3) 100%);
            box-shadow: inset 0 0 50px #0f0;
            animation: pop 0.2s;
        }
        .screen-glitch {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 900;
            background: linear-gradient(45deg, rgba(255,0,0,0.2), rgba(0,0,255,0.2));
            box-shadow: inset 0 0 50px white;
            animation: pop 0.2s;
        }

        /* FX PARTICLES */
        .fx-particle {
            position: absolute;
            width: 20px; height: 20px;
            pointer-events: none;
            animation: particleFly 0.8s ease-out forwards;
            z-index: 100;
        }

        .explosion-particle { position: absolute; width: 6px; height: 6px; border-radius: 50%; pointer-events: none; animation: particleExplosion 0.8s ease-out forwards; z-index: 999; }

        /* TIENDA & CUSTOM */
        .custom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; width: 100%; }
        .custom-item { background: rgba(0,0,0,0.5); border: 2px solid #555; padding: 10px; text-align: center; cursor: pointer; border-radius: 8px; font-size: 10px; color: #fff; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:5px; }
        .custom-item.owned { border-color: var(--neon-green); }
        .custom-item.selected { background: rgba(0,255,0,0.2); border-color: #fff; box-shadow: 0 0 15px var(--neon-green); }
        .custom-item.locked { opacity: 0.7; border-color: #555; }
        .scroll-area { width: 90%; max-height: 60vh; overflow-y: auto; background: rgba(0,0,0,0.8); padding: 15px; border-radius: 10px; border: 1px solid #333; }
        .price-tag { background: gold; color: #000; padding: 2px 5px; border-radius: 4px; font-size: 8px; font-weight: bold; }
        
        /* AI FEEDBACK BOX */
        .ai-box {
          background: linear-gradient(135deg, rgba(100,0,255,0.2), rgba(0,200,255,0.2));
          border: 2px solid var(--neon-blue);
          border-radius: 10px;
          padding: 15px;
          margin: 10px 0 20px 0;
          font-size: 10px;
          line-height: 1.5;
          color: #fff;
          width: 80%;
          text-align: center;
          box-shadow: 0 0 20px rgba(0,200,255,0.2);
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        /* ACHIEVEMENT NOTIFICATION */
        .achievement-notify {
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(45deg, #FFD700, #FFA500);
            color: #000; padding: 10px 20px; border-radius: 20px;
            font-size: 12px; z-index: 9999;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            animation: achievementPop 3s forwards;
            display: flex; align-items: center; gap: 10px;
        }

        /* RESPONSIVE SCALING */
        @media (max-width: 1024px) {
            .staff-scaler { transform: scale(2.2); }
            .menu-btn { width: 80%; }
        }

        @media (max-width: 768px) {
            .staff-scaler { transform: scale(1.8); }
            .menu-btn { width: 90%; }
        }

        @media (max-width: 480px) {
            .staff-scaler { transform: scale(1.1); }
        }
      `}</style>

      {/* ACHIEVEMENT NOTIFICATION */}
      {achievementUnlocked && (
        <div className="achievement-notify">
          <Trophy size={16} />
          <span>¡LOGRO DESBLOQUEADO: {achievementUnlocked}!</span>
        </div>
      )}

      {/* SCREEN EFFECTS OVERLAY */}
      {screenEffect === 'screen-matrix' && <div className="screen-matrix"></div>}
      {screenEffect === 'screen-glitch' && <div className="screen-glitch"></div>}

      {/* EXPLOSIONES CLIC (GLOBAL) */}
      {explosions.map(exp => (
        <div key={exp.id} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
          {exp.particles.map(p => (
            <div key={p.id} className="explosion-particle" style={{
              left: exp.x, top: exp.y,
              backgroundColor: p.color,
              '--x': `${Math.cos(p.angle * Math.PI / 180) * 100}px`,
              '--y': `${Math.sin(p.angle * Math.PI / 180) * 100}px`
            }}></div>
          ))}
        </div>
      ))}

      {/* HEADER GLOBALES */}
      {screen !== 'game' && (
        <>
          <div className="score-badge">
            <span>🪙 {coins}</span>
          </div>
          <div className="profile-badge" onClick={() => setScreen('profiles')}>
            <User size={14} /> {activeProfileId === 'guest' ? 'Invitado' : profiles[activeProfileId]?.name}
          </div>
        </>
      )}

      {/* --- PANTALLAS --- */}
      {screen === 'intro' && (
        <div className="full-screen-menu">
          <h1 style={{ fontSize: '40px', color: 'var(--neon-blue)', textShadow: '0 0 20px var(--neon-blue)', textAlign: 'center', lineHeight: '1.5' }}>MUSIC<br />BLASTER</h1>
          <button className="menu-btn" style={{ borderColor: '#ffcc00', color: '#ffcc00' }} onClick={(e) => handleButtonClick(e, () => { initAudio(); setScreen('initial'); })}>INICIAR</button>
          <p style={{ fontSize: '10px', color: '#aaa', marginTop: '20px' }}>v18.1 Mic Sustain Fix</p>
        </div>
      )}


      {screen === 'initial' && (
        <div className="full-screen-menu">
          <h1 style={{ fontSize: '18px', marginBottom: '30px', color: '#fff', textShadow: '0 0 10px #fff' }}>VISUALIZACIÓN</h1>
          <button className="menu-btn" style={{ borderColor: '#aaa', color: '#aaa' }} onClick={(e) => handleButtonClick(e, () => { setColorMode(false); setScreen('modeSelect'); })}>MODO PRO 😎🎶 (B/N)</button>
          <button className="menu-btn" style={{ borderColor: '#ffcc00', color: '#ffcc00' }} onClick={(e) => handleButtonClick(e, () => { setColorMode(true); setScreen('modeSelect'); })}>MODO NOOB 😋🎶 (COLORES)</button>
        </div>
      )}

      {screen === 'profiles' && (
        <div className="full-screen-menu" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '20px', color: '#fff' }}>SELECCIONAR PERFIL</h1>

          <div className="scroll-area" style={{ maxHeight: '30vh' }}>
            <div className="custom-grid">
              {Object.entries(profiles).map(([id, p]) => (
                <div key={id} className={`custom-item ${activeProfileId === id ? 'selected' : ''}`}
                  onClick={() => handleSwitchProfile(id)}
                  style={{ position: 'relative' }}>
                  <span style={{ fontSize: '12px' }}>{p.name}</span>
                  {id !== 'guest' && (
                    <button style={{ position: 'absolute', top: 5, right: 5, background: 'none', border: 'none', color: '#f00' }}
                      onClick={(e) => handleDeleteProfile(id, e)}>
                      <Trash2 size={12} />
                    </button>
                  )}
                  <span style={{ fontSize: '8px', color: '#aaa', marginTop: 5 }}>Nvl: {p.maxLevelNoob}/{p.maxLevelPro}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <input type="text"
              placeholder="Nombre Nuevo..."
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              style={{ padding: 10, borderRadius: 5, border: 'none', background: '#fff', color: '#000', fontFamily: 'inherit' }}
            />
            <button className="menu-btn" style={{ width: 'auto', padding: '10px' }} onClick={handleCreateProfile}><Plus size={16} /></button>
          </div>

          <div style={{ display: 'flex', gap: 10, width: '100%', justifyContent: 'center', marginTop: 20 }}>
            <button className="menu-btn" style={{ width: 'auto', borderColor: '#ffd700', color: '#ffd700', fontSize: '10px' }} onClick={(e) => handleButtonClick(e, () => setScreen('achievements'))}>
              <Trophy size={14} /> MIS LOGROS
            </button>
          </div>

          <button className="menu-btn" style={{ borderColor: '#555', color: '#aaa', marginTop: '20px', width: '200px' }}
            onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
        </div>
      )}

      {screen === 'achievements' && (
        <div className="full-screen-menu" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '20px', color: '#ffd700' }}>🏆 LOGROS</h1>
          <div className="scroll-area">
            <div className="custom-grid">
              {ACHIEVEMENTS.map(ach => {
                const isUnlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div key={ach.id} className={`custom-item`} style={{ borderColor: isUnlocked ? '#ffd700' : '#333', opacity: isUnlocked ? 1 : 0.5 }}>
                    <span style={{ fontSize: '24px' }}>{isUnlocked ? ach.icon : '🔒'}</span>
                    <span style={{ fontSize: '10px', color: isUnlocked ? '#fff' : '#aaa' }}>{ach.name}</span>
                    <span style={{ fontSize: '8px', color: '#aaa' }}>{ach.desc}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff', marginTop: '20px', width: '200px' }} onClick={(e) => handleButtonClick(e, () => setScreen('profiles'))}>VOLVER</button>
        </div>
      )}

      {screen === 'leaderboard' && (
        <div className="full-screen-menu" style={{ background: 'rgba(0,0,0,0.9)' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '20px', color: '#0f0' }}>🥇 LÍDERES</h1>
          <div className="scroll-area">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', color: '#aaa' }}>
                  <th style={{ padding: 10 }}>#</th>
                  <th style={{ padding: 10 }}>NOMBRE</th>
                  <th style={{ padding: 10 }}>SCORE</th>
                  <th style={{ padding: 10 }}>NVL</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(profiles).sort((a, b) => (b.highScore || 0) - (a.highScore || 0)).map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #222', color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#fff' }}>
                    <td style={{ padding: 10, textAlign: 'center' }}>{i + 1}</td>
                    <td style={{ padding: 10 }}>{p.name}</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>{p.highScore || 0}</td>
                    <td style={{ padding: 10, textAlign: 'center' }}>{p.maxLevelNoob + p.maxLevelPro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff', marginTop: '20px', width: '200px' }} onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
        </div>
      )}

      {screen === 'modeSelect' && (
        <div className="full-screen-menu">
          <h1 style={{ fontSize: '22px', marginBottom: '30px', color: '#fff', textShadow: '0 0 10px #fff' }}>MODO DE JUEGO</h1>

          <div style={{ maxHeight: '60vh', overflowY: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
            <button className="menu-btn" style={{ borderColor: '#0f0', color: '#0f0', marginBottom: 5 }} onClick={(e) => handleButtonClick(e, () => setScreen('levelSelect'))}>ARCADE</button>
            <div style={{ fontSize: '9px', color: '#aaa', marginBottom: 15 }}>PROGRESO: {colorMode ? 'MODO NOOB' : 'MODO PRO'}</div>

            <button className="menu-btn" style={{ borderColor: '#f00', color: '#f00' }} onClick={(e) => handleButtonClick(e, () => { setGameMode('survival'); setScreen('game'); setGameState('ready'); })}>SUPERVIVENCIA</button>
            <button className="menu-btn" style={{ borderColor: '#0ff', color: '#0ff' }} onClick={(e) => handleButtonClick(e, () => { setGameMode('sayoya'); setScreen('game'); setGameState('ready'); })}>RETO SAYOYA</button>
            <div style={{ borderTop: '2px solid #333', width: '80%', margin: '15px 0' }}></div>

            <div style={{ display: 'flex', gap: 10, width: window.innerWidth > 768 ? '350px' : '90%' }}>
              <button className="menu-btn" style={{ borderColor: '#ff0', color: '#ff0', flex: 1 }} onClick={(e) => handleButtonClick(e, () => setScreen('store'))}>TIENDA</button>
              <button className="menu-btn" style={{ borderColor: '#0f0', color: '#0f0', flex: 1 }} onClick={(e) => handleButtonClick(e, () => setScreen('leaderboard'))}>RANKING</button>
            </div>

            <div style={{ display: 'flex', gap: 10, width: window.innerWidth > 768 ? '350px' : '90%', marginTop: 10 }}>
              <button className="menu-btn" style={{ borderColor: '#b0f', color: '#b0f', flex: 1 }} onClick={(e) => handleButtonClick(e, () => setScreen('customize'))}>🎒</button>
              <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff', flex: 1 }} onClick={(e) => handleButtonClick(e, () => setScreen('profiles'))}>👤 PERFILES</button>
            </div>
          </div>
          <button className="menu-btn" style={{ borderColor: '#555', color: '#aaa', marginTop: '15px' }} onClick={(e) => handleButtonClick(e, () => setScreen('initial'))}>VOLVER</button>
        </div>
      )}

      {screen === 'levelSelect' && (
        <div className="full-screen-menu">
          <h1 style={{ fontSize: '18px', marginBottom: '5px' }}>SELECCIONA NIVEL</h1>
          <h2 style={{ fontSize: '10px', marginBottom: '15px', color: colorMode ? '#ffcc00' : '#aaa' }}>
            {colorMode ? 'RUTA: MODO NOOB (COLOR)' : 'RUTA: MODO PRO (B/N)'}
          </h2>

          <div className="custom-grid" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '10px', width: '90%' }}>
            {Array.from({ length: 20 }).map((_, i) => { // Increased to 20 levels
              const lvlNum = i + 1;
              // Check lock status based on current colorMode
              const currentMax = colorMode ? maxLevelNoob : maxLevelPro;
              const locked = currentMax < lvlNum;
              const isBass = lvlNum > 10;

              return (
                <div key={lvlNum}
                  onClick={() => { if (!locked) { setGameMode('arcade'); setLevel(lvlNum); setScreen('game'); setGameState('ready'); } }}
                  className={`custom-item ${!locked ? 'unlocked' : ''}`}
                  style={{ background: locked ? '#222' : (isBass ? '#2c0b0e' : '#000'), opacity: locked ? 0.5 : 1 }}>
                  NIVEL {lvlNum}<br />
                  <span style={{ fontSize: '8px', color: '#aaa' }}>{isBass ? '(Clave Fa)' : '(Clave Sol)'}</span><br />
                  {locked ? '🔒' : 'JUGAR'}
                </div>
              )
            })}
          </div>
          <button className="menu-btn" style={{ marginTop: '20px', width: '200px', borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
        </div>
      )}

      {screen === 'store' && (
        <div className="full-screen-menu" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '15px', color: '#ff0' }}>TIENDA DE ÍTEMS</h1>

          {showStoreConfirm && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <h2 style={{ color: 'gold', marginBottom: '20px' }}>¿COMPRAR?</h2>
              <p style={{ marginBottom: '20px' }}>{showStoreConfirm.item.name}</p>
              <p style={{ marginBottom: '20px', color: 'gold' }}>Precio: {showStoreConfirm.item.price} Monedas</p>
              <button className="menu-btn" style={{ borderColor: 'gold', color: 'gold' }} onClick={(e) => handleButtonClick(e, () => buyItem(showStoreConfirm.type, showStoreConfirm.item))}>SI, COMPRAR</button>
              <button className="menu-btn" style={{ marginTop: '10px', borderColor: '#aaa', color: '#aaa' }} onClick={(e) => handleButtonClick(e, () => setShowStoreConfirm(null))}>CANCELAR</button>
            </div>
          )}

          <div className="scroll-area">
            <div style={{ fontSize: '12px', color: '#ffcc00', margin: '15px 0', textShadow: '0 0 5px #ffcc00' }}>SKINS</div>
            <div className="custom-grid">
              {SKINS.map(s => {
                const owned = ownedSkins.includes(s.id);
                return (
                  <div key={s.id} className={`custom-item ${owned ? 'owned' : 'locked'}`}
                    onClick={() => handleStoreClick('skin', s)}>
                    <span>{s.name}</span>
                    {owned ? <span style={{ color: 'var(--neon-green)' }}>EN POSESIÓN</span> : <span className="price-tag">{s.price} 🪙</span>}
                  </div>
                )
              })}
            </div>

            <div style={{ fontSize: '12px', color: '#ffcc00', margin: '15px 0', textShadow: '0 0 5px #ffcc00' }}>SONIDOS</div>
            <div className="custom-grid">
              {SOUNDS.map(s => {
                const owned = ownedSounds.includes(s.id);
                return (
                  <div key={s.id} className={`custom-item ${owned ? 'owned' : 'locked'}`}
                    onClick={() => handleStoreClick('sound', s)}>
                    <span>{s.name}</span>
                    {owned ? <span style={{ color: 'var(--neon-green)' }}>EN POSESIÓN</span> : <span className="price-tag">{s.price} 🪙</span>}
                  </div>
                )
              })}
            </div>
          </div>
          <button className="menu-btn" style={{ marginTop: '20px', width: '200px', borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
        </div>
      )}

      {screen === 'customize' && (
        <div className="full-screen-menu" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <h1 style={{ fontSize: '18px', marginBottom: '15px', color: '#b0f' }}>MOCHILA Y FONDO</h1>

          <div className="scroll-area">
            <div style={{ fontSize: '12px', color: '#fff', margin: '15px 0', textShadow: '0 0 5px #fff' }}>EFECTOS VISUALES</div>
            <button className="menu-btn" style={{ borderColor: showParticles ? '#0f0' : '#f00', color: showParticles ? '#0f0' : '#f00', width: '100%', fontSize: '12px', padding: '10px' }} onClick={() => setShowParticles(!showParticles)}>
              PARTÍCULAS: {showParticles ? 'SÍ' : 'NO'}
            </button>

            <div style={{ fontSize: '12px', color: '#fff', margin: '15px 0', textShadow: '0 0 5px #fff' }}>FONDOS (GRATIS)</div>
            <div className="custom-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              {WALLPAPERS.map(w => (
                <div key={w.id}
                  className={`custom-item ${currentWallpaper === w.id ? 'selected' : ''}`}
                  style={{ fontSize: '8px', padding: '15px 5px' }}
                  onClick={() => handleSelectWallpaper(w.id)}>
                  {w.name}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#ffcc00', margin: '15px 0', textShadow: '0 0 5px #ffcc00' }}>MIS SKINS</div>
            <div className="custom-grid">
              {SKINS.filter(s => ownedSkins.includes(s.id)).map(s => (
                <div key={s.id} className={`custom-item ${currentSkin === s.id ? 'selected' : ''}`}
                  onClick={() => handleSelectSkin(s)}>
                  <span>{s.name}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#ffcc00', margin: '15px 0', textShadow: '0 0 5px #ffcc00' }}>MIS SONIDOS (CLICK PREVIEW)</div>
            <div className="custom-grid">
              {SOUNDS.filter(s => ownedSounds.includes(s.id)).map(s => (
                <div key={s.id} className={`custom-item ${currentSound === s.id ? 'selected' : ''}`}
                  onClick={() => handleSelectSound(s)}>
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
          <button className="menu-btn" style={{ marginTop: '20px', width: '200px', borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
        </div>
      )}

      {/* --- GAME SCREEN --- */}
      {screen === 'game' && (
        <>
          <div className="scoreboard-container">
            <div className="stat-box">
              <div className="stat-label">{gameMode === 'arcade' ? 'TIEMPO' : gameMode === 'survival' ? 'VIDAS' : 'META'}</div>
              <div className="stat-val">{gameMode === 'arcade' ? timer : gameMode === 'survival' ? '❤️'.repeat(lives) : `${notesHit}/50`}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">PUNTOS</div>
              <div className="stat-val" style={{ color: 'var(--neon-green)' }}>{gameMode === 'sayoya' ? timer.toFixed(1) : score}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">MONEDAS</div>
              <div className="stat-val" style={{ color: 'gold' }}>🪙 {coins}</div>
            </div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <button className="pause-btn" style={{ position: 'relative', right: 'auto', transform: 'none', borderColor: isMicActive ? '#0f0' : '#fff', color: isMicActive ? '#0f0' : '#fff' }} onClick={toggleMic}>
                {isMicActive ? <Mic size={14} /> : <MicOff size={14} />}
              </button>
              <button className="pause-btn" style={{ position: 'relative', right: 'auto', transform: 'none' }} onClick={togglePause}>⏸</button>
            </div>
          </div>

          {/* VISUALIZADOR DE NOTA DETECTADA (TUNER) */}
          {isMicActive && (
            <div style={{
              position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,0.7)', padding: '5px 15px', borderRadius: '15px',
              border: '1px solid #0f0', color: '#0f0', fontSize: '10px', zIndex: 20
            }}>
              MIC: {detectedPitch || '...'}
            </div>
          )}

          <div className="game-wrapper">
            <div className={`staff-card game-area-bg`}>
              <div className="staff-scaler">
                <div className="staff-system">
                  <div className={`clef font-music ${currentNote.clef === 'bass' ? 'clef-bass' : 'clef-treble'}`}>
                    {currentNote.clef === 'bass' ? '𝄢' : '𝄞'}
                  </div>

                  {[0, 20, 40, 60, 80].map(top => <div key={top} className="line font-music" style={{ top: `${top}px` }}></div>)}

                  <div className="ledger-line font-music" style={{ display: currentNote.ledger ? 'block' : 'none', top: `${currentNote.top + 9}px` }}></div>

                  {/* ANIMACIONES DE MUERTE (FX) */}
                  {noteEffects.map(fx => (
                    <div key={fx.id} className={`note-fx font-music ${fx.anim}`} style={{ top: `${fx.top}px` }}>
                      <div className="note-fx-head" style={{
                        backgroundColor: colorMode ? COLORS[fx.colorKey] : 'currentColor'
                      }}></div>
                    </div>
                  ))}

                  {/* ANIMACIONES DE PARTICULAS (ICONOS) */}
                  {fxParticles.map(fx => (
                    <div key={fx.id} style={{ position: 'absolute', left: 160, top: fx.y }}>
                      {fx.particles.map(p => {
                        const Icon = p.icon;
                        return (
                          <div key={p.id} className="fx-particle" style={{
                            color: p.color,
                            '--tx': `${Math.cos(p.angle * Math.PI / 180) * 100}px`,
                            '--ty': `${Math.sin(p.angle * Math.PI / 180) * 100}px`,
                            '--r': `${Math.random() * 360}deg`,
                            animationDuration: `${p.speed * 0.2}s`
                          }}>
                            <Icon size={20} />
                          </div>
                        )
                      })}
                    </div>
                  ))}

                  <div className="note-group font-music" style={{ top: `${currentNote.top}px` }}>
                    <div className="note-head" style={{
                      backgroundColor: colorMode ? COLORS[currentNote.colorKey] : 'currentColor',
                      color: colorMode ? COLORS[currentNote.colorKey] : undefined,
                      boxShadow: colorMode ? `0 0 10px ${COLORS[currentNote.colorKey]}` : undefined
                    }}></div>
                    <div className="note-stem" style={{
                      backgroundColor: colorMode ? COLORS[currentNote.colorKey] : 'currentColor',
                      top: currentNote.stemUp ? '-38px' : '8px',
                      left: currentNote.stemUp ? '17px' : '1px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            {gameState === 'paused' && (
              <div className="full-screen-menu" style={{ borderRadius: '0', background: 'rgba(0,0,0,0.85)' }}>
                <h2 style={{ color: '#fff', textShadow: '0 0 10px #fff', marginBottom: '20px' }}>PAUSA</h2>
                <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, togglePause)}>CONTINUAR</button>
                <button className="menu-btn" style={{ borderColor: '#f00', color: '#f00' }} onClick={(e) => handleButtonClick(e, quitGame)}>SALIR AL MENÚ</button>
              </div>
            )}

            {(gameState === 'ready' || gameState === 'gameOver') && (
              <div className="full-screen-menu" style={{ borderRadius: '0', background: 'rgba(0,0,0,0.85)' }}>
                <h2 style={{ color: gameState === 'ready' ? '#fff' : (message.includes('DESBLOQUEADO') ? '#0f0' : '#f00'), textShadow: '0 0 10px currentColor', fontSize: '24px', marginBottom: '20px' }}>
                  {gameState === 'ready' ? '¿LISTO?' : (message && (message.includes('DESBLOQUEADO') || message.includes('SUPERADO')) ? '¡NIVEL SUPERADO!' : 'FIN DEL JUEGO')}
                </h2>
                <p style={{ color: '#fff', fontSize: '12px', marginBottom: '30px', textTransform: 'uppercase' }}>
                  {gameState === 'ready' ?
                    (gameMode === 'arcade' ? 'Meta: 8500 Pts' : gameMode === 'survival' ? `Récord: ${localStorage.getItem('mb_hs_survival') || 0}` : 'Velocidad pura') :
                    (message || `Puntuación Final: ${score}`)
                  }
                </p>

                {/* AI COACH DISPLAY */}
                {aiFeedback && gameState === 'gameOver' && (
                  <div className="ai-box">
                    <Bot size={20} style={{ marginBottom: 5 }} /> <br />
                    {aiFeedback}
                  </div>
                )}

                {gameState === 'ready' ? (
                  <>
                    <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, () => startGame())}>JUGAR</button>
                    <button className="menu-btn" style={{ borderColor: '#555', color: '#aaa', marginTop: '10px' }} onClick={(e) => handleButtonClick(e, () => setScreen('modeSelect'))}>VOLVER</button>
                  </>
                ) : (
                  <>
                    {/* AI COACH BUTTON */}
                    {gameState === 'gameOver' && !aiFeedback && !isLoadingAI && (
                      <button className="menu-btn" style={{ borderColor: '#9933ff', color: '#9933ff', marginBottom: '10px', fontSize: '12px' }} onClick={(e) => handleButtonClick(e, callGeminiCoach)}>
                        <Sparkles size={14} /> CONSEJO DEL COACH AI
                      </button>
                    )}

                    {isLoadingAI && <div style={{ color: '#9933ff', marginBottom: '10px' }}>Analizando partida... 🤖</div>}

                    {gameState === 'gameOver' && gameMode === 'arcade' && score >= 8500 && (
                      <button className="menu-btn" style={{ borderColor: '#0f0', color: '#0f0', marginBottom: '10px' }} onClick={(e) => handleButtonClick(e, handleNextLevel)}>SIGUIENTE NIVEL</button>
                    )}
                    <button className="menu-btn" style={{ borderColor: '#fff', color: '#fff' }} onClick={(e) => handleButtonClick(e, () => startGame())}>REINTENTAR</button>
                    <button className="menu-btn" style={{ borderColor: '#555', color: '#aaa', marginTop: '10px' }} onClick={(e) => handleButtonClick(e, quitGame)}>SALIR</button>
                  </>
                )}
              </div>
            )}

            {confetti.map(p => (
              <div key={p.id} className="confetti-piece" style={{
                left: `${p.left}%`,
                backgroundColor: p.color,
                animationDuration: `${p.animDuration}s`
              }}></div>
            ))}
          </div>

          <div className="controls-container">
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map((key) => (
              <button key={key}
                className="key-btn hit-zone-color"
                style={{
                  borderColor: !colorMode ? 'currentColor' : COLORS[key],
                  color: !colorMode ? 'inherit' : COLORS[key],
                  boxShadow: `0 4px 0 ${!colorMode ? '#000' : COLORS[key]}`
                }}
                onMouseDown={(e) => { handleInput(key); e.currentTarget.classList.add('active'); setTimeout(() => e.target.classList.remove('active'), 100); }}
                onTouchStart={(e) => { e.preventDefault(); handleInput(key); e.currentTarget.classList.add('active'); setTimeout(() => e.target.classList.remove('active'), 100); }}
              >
                {key === 'C' ? 'Do' : key === 'D' ? 'Re' : key === 'E' ? 'Mi' : key === 'F' ? 'Fa' : key === 'G' ? 'Sol' : key === 'A' ? 'La' : 'Si'}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}