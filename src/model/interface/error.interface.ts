export interface ProcessedError {
  errorName: string;
  errorMessage: string;
  errorDigest: string;
}

/** Next.js only ever passes `error` and `reset` to an error boundary. */
export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}
