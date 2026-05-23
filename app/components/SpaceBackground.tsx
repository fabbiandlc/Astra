const PARALLAX_MOVE = 0.04;
const PARALLAX_ZOOM = 0.04;

type CameraParallax = {
  x: number;
  y: number;
  scale: number;
};

type SpaceBackgroundProps = {
  parallax?: CameraParallax;
};

export function SpaceBackground({ parallax }: SpaceBackgroundProps) {
  const moveX = (parallax?.x ?? 0) * PARALLAX_MOVE;
  const moveY = (parallax?.y ?? 0) * PARALLAX_MOVE;
  const zoom =
    1 + ((parallax?.scale ?? 1) - 1) * PARALLAX_ZOOM;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute -inset-[8%] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url(/fondo-espacio.jpg)",
          transform: `translate3d(${moveX}px, ${moveY}px, 0) scale(${zoom})`,
        }}
      />
      <div className="absolute inset-0 bg-[#050b16]/25" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b16]/50 via-transparent to-[#050b16]/70" />
    </div>
  );
}
