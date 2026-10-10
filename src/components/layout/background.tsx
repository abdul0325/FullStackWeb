// Static decorative background: a tiling SVG noise texture plus one radial
// accent glow. Replaces the WebGL starfield — no canvas, no animation loop,
// zero JS. The glow is sized in px and positioned without transforms or
// viewport-height units so it can never register as a layout shift.

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
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Single accent glow, static, behind the hero */}
      <div
        className="absolute rounded-full bg-brand/10 blur-3xl"
        style={{
          width: "min(90vw, 1100px)",
          height: "560px",
          top: "-160px",
          left: "max(5vw, calc(50% - 550px))",
        }}
      />
      {/* Noise layer */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_SVG}")`, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
