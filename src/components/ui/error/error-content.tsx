type ErrorContentProps = {
  title: string;
  message: string;
};

export const ErrorContent = ({ title, message }: ErrorContentProps) => {
  const lines = message.includes("\n") ? message.split("\n") : null;

  return (
    <>
      <div className="animate-fade-in-up">
        <h1 className="bg-linear-to-r from-red-600 to-amber-600 bg-clip-text text-4xl font-bold leading-[70px]! text-transparent sm:text-5xl">
          {title}
        </h1>
      </div>

      <div className="mx-auto mb-8 mt-2 h-1 w-3/5 max-w-xs bg-linear-to-r from-red-600 to-amber-600 animate-fade-in" />

      <div className="animate-fade-in-up animation-delay-100">
        <p className="mb-8 text-muted-foreground">
          {lines
            ? lines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < lines.length - 1 && <br />}
                </span>
              ))
            : message}
        </p>
      </div>
    </>
  );
};
