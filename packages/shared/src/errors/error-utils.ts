import { LLMClientError } from './llm-errors';

/**
 * Type guard to check if an error is an instance of LLMClientError
 */
export function isLLMClientError(error: unknown): error is LLMClientError {
  return error instanceof LLMClientError;
}

/**
 * Type guard to check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (isLLMClientError(error)) {
    return error.retryable;
  }
  
  // Default retryable status for unknown errors
  return false;
}

/**
 * Normalize any error to a standard format
 */
export function normalizeError(error: unknown, context: Record<string, unknown> = {}): LLMClientError {
  // If it's already one of our error types, just return it
  if (error instanceof LLMClientError) {
    // Add any additional context to the error
    if (Object.keys(context).length > 0) {
      return new LLMClientError(
        error.message,
        error.code,
        error.statusCode,
        error.provider,
        error.retryable,
        { ...error.details, ...context },
        error.cause
      );
    }
    return error;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return new LLMClientError(
      error.message,
      'UNKNOWN_ERROR',
      500,
      undefined,
      false,
      { ...context, originalError: error.name },
      error
    );
  }

  // Handle string errors
  if (typeof error === 'string') {
    return new LLMClientError(
      error,
      'UNKNOWN_ERROR',
      500,
      undefined,
      false,
      context
    );
  }

  // Handle any other type of error
  return new LLMClientError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    undefined,
    false,
    { ...context, originalError: error }
  );
}

/**
 * Create a client-safe version of an error
 */
export function toClientError(error: unknown) {
  const normalized = normalizeError(error);
  return normalized.toClientError();
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  context: Record<string, unknown> = {}
) {
  const normalized = normalizeError(error, context);
  return {
    error: normalized.toClientError(),
    success: false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Assert a condition, throwing a specific error type if the condition is false
 */
export function assert(
  condition: unknown,
  message: string,
  ErrorType: new (message: string, ...args: any[]) => Error = LLMClientError,
  ...errorArgs: any[]
): asserts condition {
  if (!condition) {
    throw new ErrorType(message, ...errorArgs);
  }
}

/**
 * Create a custom error factory for specific error types
 */
export function createErrorFactory<T extends Error>(
  ErrorType: new (message: string, ...args: any[]) => T
) {
  return (message: string, ...args: any[]): T => {
    return new ErrorType(message, ...args);
  };
}

// Export error creation helpers
export const createConfigurationError = createErrorFactory(LLMClientError);
export const createRateLimitError = createErrorFactory(LLMClientError);
export const createAuthError = createErrorFactory(LLMClientError);
export const createTimeoutError = createErrorFactory(LLMClientError);

export default {
  isLLMClientError,
  isRetryableError,
  normalizeError,
  toClientError,
  createErrorResponse,
  assert,
  createErrorFactory,
  createConfigurationError,
  createRateLimitError,
  createAuthError,
  createTimeoutError,
};
