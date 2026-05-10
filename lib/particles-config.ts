export const emberConfig = {
  particles: {
    number: { value: 40, density: { enable: true, area: 800 } },
    color: { value: '#C9A84C' },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: { enable: true, speed: 0.5, minimumValue: 0.1, sync: false },
    },
    size: {
      value: { min: 1.5, max: 4.5 },
      animation: { enable: true, speed: 2, minimumValue: 1, sync: false },
    },
    move: {
      enable: true,
      direction: 'top' as const,
      speed: { min: 0.3, max: 1.2 },
      outModes: { default: 'out' as const },
      random: true,
      warp: false,
    },
    shape: { type: 'circle' },
    twinkle: {
      particles: { enable: true, frequency: 0.05, opacity: 1 },
    },
  },
  background: { color: 'transparent' },
  detectRetina: true,
  fullScreen: { enable: false },
}
