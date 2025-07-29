import { LLMClientError } from './llm-errors';

export type ErrorType = new (
  message: string,
  ...args: any[]
) => LLMClientError;

export interface ClientErrorResponse {
  name: string;
  message: string;
  code: string;
  statusCode: number;
  retryable: boolean;
  timestamp: string;
}

export interface ErrorResponse {
  error: ClientErrorResponse;
  success: boolean;
  timestamp: string;
}

// Error codes for common error scenarios
export const ERROR_CODES = {
  // Configuration errors (4xx)
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // Rate limiting and throttling (429)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  
  // Server errors (5xx)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  
  // LLM-specific errors
  MODEL_OVERLOADED: 'MODEL_OVERLOADED',
  CONTENT_FILTERED: 'CONTENT_FILTERED',
  INVALID_REQUEST: 'INVALID_REQUEST',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Unknown error
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
