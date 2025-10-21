// GlobalErrorProvider.tsx

import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { FallbackProps } from "react-error-boundary";
import { ErrorBoundary } from "react-error-boundary";

import { PageErrorFallback } from "./ui/PageFallback";

const GlobalErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const queryClient = useQueryClient();

  const handleReset = () => {
    // TanStack Query의 모든 쿼리 캐시 초기화
    queryClient.resetQueries();
    // ErrorBoundary의 상태를 초기화하고 자식 컴포넌트를 다시 렌더링
    resetErrorBoundary();
  };

  return <PageErrorFallback error={error} reset={handleReset} />;
};

export const GlobalErrorProvider = ({ children }: { children: ReactNode }) => {
  // componentDidCatch에서 수행하던 로깅 로직
  const handleCatch = (error: Error, errorInfo: React.ErrorInfo) => {
    // Sentry, LogRocket 등 외부 서비스에 에러 전송
    console.error("Uncaught error:", error, errorInfo);
  };

  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback} onError={handleCatch}>
      {children}
    </ErrorBoundary>
  );
};
