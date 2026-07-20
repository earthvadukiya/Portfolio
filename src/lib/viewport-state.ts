/**
 * Shared, mutable viewport state written by DOM listeners and read inside the
 * R3F render loop (useFrame) — no React re-renders, so it stays 60fps.
 */
export const viewport = {
  scroll: 0, // 0..1 total page progress
  heroProgress: 0, // 0..1 progress through the first viewport (hero -> dispersion)
  pointerX: 0, // smoothed -1..1
  pointerY: 0,
  targetPointerX: 0,
  targetPointerY: 0,
};

export function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** smooth 0..1 ramp */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}
