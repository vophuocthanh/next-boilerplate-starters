export interface ErrorInfo {
  name: string;
  message: string;
  digest?: string;
  stack?: string;
}

export interface ProcessedError {
  errorName: string;
  errorMessage: string;
  errorDigest: string;
}

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
  params?: { locale?: string };
}

export interface ErrorContentProps {
  error: Error & { digest?: string };
  reset: () => void;
  locale: string;
}
