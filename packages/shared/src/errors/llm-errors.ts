/**
 * Base error class for all LLM-related errors
 */
export class LLMClientError extends Error {
  public readonly timestamp: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    public readonly code: string = 'LLM_ERROR',
    public readonly statusCode: number = 500,
    public readonly provider?: string,
    public readonly retryable: boolean = false,
    details?: Record<string, unknown>,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'LLMClientError';
    this.timestamp = new Date().toISOString();
    this.details = details;

    // Maintain proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to a plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      provider: this.provider,
      retryable: this.retryable,
      timestamp: this.timestamp,
      details: this.details,
      // Only include stack in non-production environments
      ...(process.env.NODE_ENV !== 'production' && { stack: this.stack })
    };
  }

  /**
   * Create a client-safe version of the error
   */
  toClientError() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      retryable: this.retryable,
      timestamp: this.timestamp
    };
  }
}

/**
 * Thrown when there's a configuration issue with the LLM client
 */
export class LLMConfigurationError extends LLMClientError {
  constructor(
    message: string, 
    provider?: string,
    details?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(
      message, 
      'CONFIGURATION_ERROR', 
      400, 
      provider, 
      false, 
      details,
      cause
    );
    this.name = 'LLMConfigurationError';
  }
}

/**
 * Thrown when rate limits are exceeded
 */
export class LLMRateLimitError extends LLMClientError {
  constructor(
    message: string, 
    provider?: string,
    public readonly resetTime?: Date,
    details?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(
      message, 
      'RATE_LIMIT', 
      429, 
      provider, 
      true, 
      {
        ...details,
        ...(resetTime && { resetTime: resetTime.toISOString() })
      },
      cause
    );
    this.name = 'LLMRateLimitError';
  }
}

/**
 * Thrown when authentication fails
 */
export class LLMAuthenticationError extends LLMClientError {
  constructor(
    message: string, 
    provider?: string,
    details?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(
      message, 
      'AUTHENTICATION_ERROR', 
      401, 
      provider, 
      false, 
      details,
      cause
    );
    this.name = 'LLMAuthenticationError';
  }
}

/**
 * Thrown when a request times out
 */
export class LLMTimeoutError extends LLMClientError {
  constructor(
    message: string, 
    provider?: string,
    public readonly timeoutMs?: number,
    details?: Record<string, unknown>,
    cause?: unknown
  ) {
    super(
      message, 
      'TIMEOUT', 
      408, 
      provider, 
      true, 
      {
        ...details,
        ...(timeoutMs && { timeoutMs })
      },
      cause
    );
    this.name = 'LLMTimeoutError';
  }
}