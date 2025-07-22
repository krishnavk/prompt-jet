export class Prompt {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {}
}

export class ExecutionResult {
  constructor(
    public readonly id: string,
    public readonly promptId: string,
    public readonly provider: string,
    public readonly model: string,
    public readonly response: string,
    public readonly tokensUsed: number,
    public readonly executionTimeMs: number,
    public readonly cost?: number
  ) {}
}
