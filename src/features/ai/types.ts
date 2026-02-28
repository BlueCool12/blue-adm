export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export enum AiTaskStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface AiJobResponse {
  jobId: string;
}

export interface GetJobStatusResponse<T = unknown> {
  jobId: string;
  status: AiTaskStatus;
  result: T | null;
  error: string | null;
}
