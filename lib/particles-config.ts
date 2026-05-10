export const emberConfig = {
  particles: {
    // Reduced from 40 — 20 particles is still visually rich but half the GPU cost
    number: { value: 20, density: { enable: true, area: 800 } },
    color: { value: '#C9A84C' },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
    },
    size: {
      value: { min: 1.5, max: 4 },
      animation: { enable: true, speed: 1.5, minimumValue: 1, sync: false },
    },
    move: {
      enable: true,
      direction: 'top' as const,
      speed: { min: 0.3, max: 1.0 },
      outModes: { default: 'out' as const },
      random: true,
      warp: false,
    },
    shape: { type: 'circle' },
    twinkle: {
      // Reduced frequency to lighten per-frame computation
      particles: { enable: true, frequency: 0.02, opacity: 1 },
    },
  },
  background: { color: 'transparent' },
  // false = use CSS pixel density, not physical — prevents 2× particle count on retina
  detectRetina: false,
  fullScreen: { enable: false },
  // Soft FPS cap — lets the browser stay responsive during scroll
  fpsLimit: 60,
}
