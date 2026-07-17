export const AnimatedErrorLines = () => (
  <div className="absolute -right-8 top-0 -z-10" aria-hidden>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="absolute w-px h-16 bg-red-500/30 animate-soft-pulse"
        style={{ left: i * 8, animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export const AnimatedParticles = () => (
  <div className="absolute inset-0 -z-20" aria-hidden>
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute size-1 rounded-full bg-red-500/25 animate-soft-pulse"
        style={{
          left: `${(i * 17 + 10) % 100}%`,
          top: `${(i * 23 + 5) % 80}%`,
          animationDelay: `${i * 0.35}s`,
        }}
      />
    ))}
  </div>
);
