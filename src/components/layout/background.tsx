// Static decorative background: a tiling SVG noise texture plus one radial accent
// glow. Replaces the WebGL starfield — no canvas, no animation loop, zero JS.

const NOISE_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/>` +
      `<feColorMatrix type='saturate' values='0'/></filter>` +
      `<rect width='100%' height='100%' filter='url(#n)'/></svg>`
  );

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Single accent glow, static, behind the hero */}
      <div
        className="absolute left-1/2 top-[-20%] h-[70vh] w-[90vw] max-w-[1100px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
      />
      {/* Noise layer */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
