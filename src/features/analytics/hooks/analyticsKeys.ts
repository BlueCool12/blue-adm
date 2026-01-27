export const analyticsKeys = {
  all: ['analytics'] as const,
  summary: () => [...analyticsKeys.all, 'summary'] as const,
  traffic: (range: string) => [...analyticsKeys.all, 'traffic', range] as const,
  topPosts: (limit: number) => [...analyticsKeys.all, 'topPosts', limit] as const,
  distribution: (type: string) => [...analyticsKeys.all, 'distribution', type] as const,
  posts: (page: number, limit: number) => [...analyticsKeys.all, 'posts', page, limit] as const,
};