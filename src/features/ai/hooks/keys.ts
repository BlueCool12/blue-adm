export const AI_KEYS = {
  all: ['ai'] as const,
  chat: () => [...AI_KEYS.all, 'chat'] as const,
  topic: () => [...AI_KEYS.all, 'topic'] as const,
  slug: () => [...AI_KEYS.all, 'slug'] as const,
  summary: () => [...AI_KEYS.all, 'summary'] as const,
};
