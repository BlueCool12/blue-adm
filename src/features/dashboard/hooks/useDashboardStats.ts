import { http } from "@/shared/api/http";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export interface DashboardSummary {
  todayPv: number;
  todayUv: number;
  pendingComments: number;
  totalPosts: number;
}

export interface DailyTrend {
  date: string;
  pv: number;
  uv: number;
  [key: string]: string | number;
}

export interface RecentComment {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface WeeklyTopPosts {
  id: string;
  title: string;
  views: number;
}

export function useDashboardSummary(): UseQueryResult<DashboardSummary> {
  return useQuery({
    queryKey: ['analytics', 'dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await http.get<DashboardSummary>('/analytics/dashboard/summary');
      return data;
    },
  });
}

export function useRecentComments(): UseQueryResult<RecentComment[]> {
  return useQuery({
    queryKey: ['analytics', 'dashboard', 'recent-comments'],
    queryFn: async () => {
      const { data } = await http.get<RecentComment[]>('/analytics/comments/recent');
      return data;
    },
  });
}

export function useTrafficTrend(): UseQueryResult<DailyTrend[]> {
  return useQuery({
    queryKey: ['analytics', 'traffic'],
    queryFn: async () => {
      const { data } = await http.get<DailyTrend[]>('/analytics/traffic');
      return data;
    },
  });
}

export function useTopPosts(): UseQueryResult<WeeklyTopPosts[]> {
  return useQuery({
    queryKey: ['analytics', 'ranks', 'posts'],
    queryFn: async () => {
      const { data } = await http.get<WeeklyTopPosts[]>('/analytics/ranks/posts');
      return data;
    },
  });
}