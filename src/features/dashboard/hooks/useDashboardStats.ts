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

export interface DashboardStatsResponse {
  summary: DashboardSummary;
  trend: DailyTrend[];
  recentComments: RecentComment[];
  weeklyTopPosts: WeeklyTopPosts[];
}

export function useDashboardStats(): UseQueryResult<DashboardStatsResponse> {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      const { data } = await http.get<DashboardStatsResponse>('/analytics/dashboard');
      return data;
    },
  });
}