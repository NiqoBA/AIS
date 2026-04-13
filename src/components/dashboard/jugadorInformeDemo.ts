import type { JugadorMapa } from "@/components/dashboard/jugadoresMapaData";

export type PartidoAnalizado = {
  id: string;
  fecha: string;
  rival: string;
  competicion: string;
  resultado: string;
  minutos: number;
  ratingPartido: number;
  goles: number;
  pasesCompletados: number;
  pasesIntentados: number;
  recorridoMetros: number;
};

export type PieHabil = "Derecha" | "Izquierda" | "Ambidiestro";

/** Puntos { x, y, value } para `HeatmapJugador` (píxeles 0–700 / 0–460, intensidad 0–10). */
export type PosicionHeatmap = { x: number; y: number; value: number };

export function mapaCalorAPosiciones(
  mapaCalor: number[][],
  width = 700,
  height = 460,
): PosicionHeatmap[] {
  if (!mapaCalor.length || !mapaCalor[0]?.length) return [];
  const rows = mapaCalor.length;
  const cols = mapaCalor[0].length;
  const cw = width / cols;
  const ch = height / rows;
  const out: PosicionHeatmap[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = mapaCalor[r][c];
      out.push({
        x: Math.round(c * cw + cw / 2),
        y: Math.round(r * ch + ch / 2),
        value: Math.round(v * 10 * 10) / 10,
      });
    }
  }
  return out;
}

export type InformeJugadorDemo = {
  partidosAnalizados: number;
  golesTotal: number;
  pasesCompletadosTotal: number;
  pasesIntentadosTotal: number;
  recorridoTotalMetros: number;
  /** Promedio de rating por partido (lista ya calculada). */
  promedioRatingPartidos: number;
  partidos: PartidoAnalizado[];
  /** Matriz filas x columnas, valores 0–1 intensidad para mapa de calor. */
  mapaCalor: number[][];
  perfilDetalle: string;
  radar: { tecnica: number; tactica: number; fisico: number };
  /** Estimaciones demo para el CV (sin medición antropométrica real). */
  fisicoCv: {
    alturaCm: number;
    pesoEstimadoKg: number;
    imc: number;
    pieHabil: PieHabil;
  };
};

/** PRNG determinista por id para datos demo reproducibles. */
function seed(id: number, salt: number) {
  const x = Math.sin(id * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const RIVALES = [
  "Juventud de Las Piedras",
  "Nacional Juv.",
  "Defensor Sporting",
  "Danubio FC",
  "Peñarol Formativas",
  "Wanderers",
  "Racing Montevideo",
  "Boston River",
];

const COMP = ["Formativas A", "Copa Interior", "Liga regional", "Amistoso"];

export function getInformeJugadorDemo(jugador: JugadorMapa): InformeJugadorDemo {
  const id = jugador.id;
  const nPartidos = 6 + Math.floor(seed(id, 1) * 6);

  const partidos: PartidoAnalizado[] = [];
  let golesTotal = 0;
  let pasesC = 0;
  let pasesI = 0;
  let recTotal = 0;
  let sumRating = 0;

  for (let i = 0; i < nPartidos; i++) {
    const rPartido = Math.round(
      (jugador.rating + (seed(id, i + 10) - 0.5) * 1.4) * 10,
    ) / 10;
    const clamped = Math.min(10, Math.max(5, rPartido));
    const minutos = 70 + Math.floor(seed(id, i + 20) * 25);
    const goles =
      jugador.posicion === "Delantero" && seed(id, i + 30) > 0.72
        ? 1
        : jugador.posicion === "Delantero" && seed(id, i + 31) > 0.92
          ? 2
          : 0;
    const pI = 24 + Math.floor(seed(id, i + 40) * 28);
    const ratio = 0.72 + seed(id, i + 41) * 0.22;
    const pComp = Math.round(pI * ratio);
    const rec = 7800 + Math.floor(seed(id, i + 50) * 4200);

    golesTotal += goles;
    pasesC += pComp;
    pasesI += pI;
    recTotal += rec;
    sumRating += clamped;

    const day = 12 - Math.floor(i * 1.8);
    partidos.push({
      id: `${id}-${i}`,
      fecha: `2026-03-${String(Math.max(1, day)).padStart(2, "0")}`,
      rival: RIVALES[(id + i) % RIVALES.length],
      competicion: COMP[(id + i) % COMP.length],
      resultado: `${1 + Math.floor(seed(id, i + 60) * 3)}-${Math.floor(seed(id, i + 61) * 3)}`,
      minutos,
      ratingPartido: clamped,
      goles,
      pasesCompletados: pComp,
      pasesIntentados: pI,
      recorridoMetros: rec,
    });
  }

  const rows = 10;
  const cols = 14;
  const mapaCalor: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const centerDist = Math.hypot(c - cols / 2, r - rows / 2);
      const base = 1 - centerDist / (rows + cols);
      const noise = seed(id, r * 100 + c);
      row.push(
        Math.min(1, Math.max(0, base * 0.55 + noise * 0.5 + seed(id, r + c) * 0.15)),
      );
    }
    mapaCalor.push(row);
  }

  const perfilDetalle = `${jugador.nombre} es ${jugador.posicion.toLowerCase()} en ${jugador.club}. En el último ciclo de análisis se priorizó el registro de desplazamientos sin balón y la participación en transiciones. El rendimiento ofensivo ${jugador.posicion === "Delantero" ? "destaca en finalizaciones dentro del área" : "se equilibra con tareas tácticas de contención"}. Se recomienda seguimiento en partidos de mayor exigencia física para validar la tendencia del recorrido y la precisión de pase bajo presión.`;

  const radar = {
    tecnica: Math.round(
      Math.min(10, Math.max(5, jugador.rating + (seed(id, 70) - 0.5) * 1.2)) * 10,
    ) / 10,
    tactica: Math.round(
      Math.min(10, Math.max(5, jugador.rating + (seed(id, 71) - 0.5) * 1.2)) * 10,
    ) / 10,
    fisico: Math.round(
      Math.min(10, Math.max(5, jugador.rating + (seed(id, 72) - 0.5) * 1.2)) * 10,
    ) / 10,
  };

  /** Altura/peso estimados (modelo demo por edad, posición y semilla). */
  let alturaBase = 164 + seed(id, 80) * 24;
  if (jugador.posicion === "Arquero") alturaBase += 5;
  if (jugador.posicion === "Defensor") alturaBase += 3;
  if (jugador.posicion === "Delantero") alturaBase += 2;
  alturaBase += (jugador.edad - 15) * 0.9;
  const alturaCm = Math.round(Math.min(194, Math.max(152, alturaBase)));
  const alturaM = alturaCm / 100;
  const imcObjetivo = 20.2 + seed(id, 81) * 3.2;
  const pesoEstimadoKg = Math.round(alturaM * alturaM * imcObjetivo);
  const imc = Math.round((pesoEstimadoKg / (alturaM * alturaM)) * 10) / 10;

  const ph = seed(id, 82);
  const pieHabil: PieHabil =
    ph < 0.08 ? "Ambidiestro" : ph < 0.82 ? "Derecha" : "Izquierda";

  const fisicoCv = {
    alturaCm,
    pesoEstimadoKg,
    imc,
    pieHabil,
  };

  return {
    partidosAnalizados: nPartidos,
    golesTotal,
    pasesCompletadosTotal: pasesC,
    pasesIntentadosTotal: pasesI,
    recorridoTotalMetros: recTotal,
    promedioRatingPartidos:
      nPartidos > 0 ? Math.round((sumRating / nPartidos) * 10) / 10 : jugador.rating,
    partidos,
    mapaCalor,
    perfilDetalle,
    radar,
    fisicoCv,
  };
}

/** Físico / técnica / inteligencia (demo) para etiquetas en cards; inteligencia = lectura táctica. */
export type TriadaJugadorDemo = {
  fisico: number;
  tecnica: number;
  inteligencia: number;
};

export function jugadorTriadaDemo(jugador: JugadorMapa): TriadaJugadorDemo {
  const inf = getInformeJugadorDemo(jugador);
  return {
    fisico: inf.radar.fisico,
    tecnica: inf.radar.tecnica,
    inteligencia: inf.radar.tactica,
  };
}
