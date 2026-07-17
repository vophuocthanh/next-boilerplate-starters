export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute left-1/4 top-1/3 size-40 rounded-full bg-red-500/10 animate-soft-pulse" />
      <div className="absolute right-1/4 top-2/3 size-32 rounded-full bg-amber-500/10 animate-soft-pulse animation-delay-300" />
      <div className="absolute bottom-1/4 left-1/3 size-36 rounded-full bg-red-800/10 animate-soft-pulse animation-delay-500" />
    </div>
  );
};
