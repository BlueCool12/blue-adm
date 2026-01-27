import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsKeys } from "./analyticsKeys";
import { http } from "@/shared/api/http";
import type { TrafficRange } from "../types/analytics.types";
import type { TrafficData } from "../components/TrafficChart";
import type { StatCardProps } from "../components/StatSummaryCards";
import type { QuickPostRankingProps } from "../components/QuickPostRanking";
import type { PaginatedPostPerformance } from "../components/PostPerformanceTable";
import type { DistributionProps } from "../components/DistributionCharts";

export function useAnalyticsSummary(): UseQueryResult<StatCardProps[]> {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: async () => {
      const { data } = await http.get('/analytics/summary');
      return data;
    },
  });
}

export function useTrafficData(range: TrafficRange): UseQueryResult<TrafficData[]> {
  return useQuery({
    queryKey: analyticsKeys.traffic(range),
    queryFn: async () => {
      const { data } = await http.get('/analytics/traffic', {
        params: { range },
      });

      return data;
    },
  });
}

export function useTopPosts(limit: number = 5): UseQueryResult<QuickPostRankingProps[]> {
  return useQuery({
    queryKey: analyticsKeys.topPosts(limit),
    queryFn: async () => {
      const { data } = await http.get('/analytics/ranks/posts', {
        params: { limit },
      });

      return data;
    },
  });
}

export function useDistribution(type: 'referrer' | 'device'): UseQueryResult<DistributionProps[]> {
  return useQuery({
    queryKey: analyticsKeys.distribution(type),
    queryFn: async () => {
      const url = type === 'referrer'
        ? '/analytics/distribution/referrer'
        : '/analytics/distribution/device';

      const { data } = await http.get(url);
      return data;
    },
  });
}

export function usePostPerformance(page: number, limit: number): UseQueryResult<PaginatedPostPerformance> {
  return useQuery({
    queryKey: analyticsKeys.posts(page, limit),
    queryFn: async () => {
      const { data } = await http.get('/analytics/posts', {
        params: { page, limit },
      });

      return data;
    },
    placeholderData: keepPreviousData,
  });
}