type ErrorIdProps = {
  digest?: string;
};

export const ErrorId = ({ digest }: ErrorIdProps) => {
  if (!digest) return null;

  return (
    <div className="text-xs text-muted-foreground animate-fade-in animation-delay-300">
      <code className="rounded bg-muted p-1 font-mono">Error ID: {digest}</code>
    </div>
  );
};
