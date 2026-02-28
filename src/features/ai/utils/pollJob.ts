import { http } from '@/shared/api/http';
import { AiTaskStatus } from '@/features/ai/types';
import type { GetJobStatusResponse } from '@/features/ai/types';

const POLL_INTERVAL_MS = 1000;
const POLL_TIMEOUT_MS = 60000;

export class AiJobTimeoutError extends Error {
  constructor(jobId: string) {
    super(`AI 작업 시간이 초과되었습니다. (jobId: ${jobId})`);
    this.name = 'AiJobTimeoutError';
  }
}

export class AiJobFailedError extends Error {
  constructor(jobId: string, reason: string | null) {
    super(reason ?? `AI 작업이 실패했습니다. (jobId: ${jobId})`);
    this.name = 'AiJobFailedError';
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function pollJob<T>(jobId: string): Promise<T> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const { data } = await http.get<GetJobStatusResponse<T>>(`/ai/jobs/${jobId}`);

    if (data.status === AiTaskStatus.COMPLETED) {
      if (data.result === null) {
        throw new AiJobFailedError(jobId, 'AI 작업이 완료되었지만 결과가 없습니다.');
      }
      return data.result;
    }

    if (data.status === AiTaskStatus.FAILED) {
      throw new AiJobFailedError(jobId, data.error);
    }

    await delay(POLL_INTERVAL_MS);
  }

  throw new AiJobTimeoutError(jobId);
}
