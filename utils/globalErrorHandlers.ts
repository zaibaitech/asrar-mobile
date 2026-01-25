// Lightweight global error hooks for stability and future crash reporting.
// Keeps the app from silently dying on uncaught JS exceptions.

// @ts-ignore - __DEV__ is defined by React Native / Metro
declare const __DEV__: boolean;

type GlobalHandler = (error: unknown, isFatal?: boolean) => void;

type ErrorUtilsLike = {
  setGlobalHandler?: (handler: GlobalHandler) => void;
  getGlobalHandler?: () => GlobalHandler;
};

export function installGlobalErrorHandlers(options?: {
  onError?: (error: unknown, isFatal?: boolean) => void;
}) {
  const g = globalThis as unknown as { __asrarGlobalErrorHandlersInstalled?: boolean; ErrorUtils?: ErrorUtilsLike };

  if (g.__asrarGlobalErrorHandlersInstalled) return;
  g.__asrarGlobalErrorHandlersInstalled = true;

  const errorUtils = g.ErrorUtils;
  const prev = errorUtils?.getGlobalHandler?.();

  errorUtils?.setGlobalHandler?.((error, isFatal) => {
    try {
      options?.onError?.(error, isFatal);
    } catch {
      // ignore
    }

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('[GlobalErrorHandler]', { isFatal, error });
    }

    try {
      prev?.(error, isFatal);
    } catch {
      // ignore
    }
  });

  // Web: also catch unhandled promise rejections.
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('unhandledrejection', (event) => {
      try {
        options?.onError?.(event.reason, false);
      } catch {
        // ignore
      }

      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('[UnhandledRejection]', event.reason);
      }
    });
  }
}
