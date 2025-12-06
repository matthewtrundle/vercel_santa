'use client';

import type { ReactElement } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  BarChart3,
  Users,
  Gift,
  ShoppingCart,
  Share2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Star,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getAnalyticsOverview,
  getAgeGroupStats,
  getBudgetTierStats,
  getPopularInterests,
  getTopRecommendedGifts,
  getNicePointsDistribution,
  getRecentSessions,
  getAgentPerformanceStats,
  getSessionsOverTime,
} from '@/actions/analytics';

const ageGroupLabels: Record<string, string> = {
  toddler: 'Toddler (0-2)',
  preschool: 'Preschool (3-5)',
  early_school: 'Early School (6-9)',
  tween: 'Tween (10-12)',
  teen: 'Teen (13+)',
  adult: 'Adult (18+)',
};

const budgetLabels: Record<string, { label: string; color: string }> = {
  budget: { label: 'Budget', color: 'bg-green-500' },
  moderate: { label: 'Moderate', color: 'bg-blue-500' },
  premium: { label: 'Premium', color: 'bg-purple-500' },
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtext,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  subtext?: string;
}): ReactElement {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtext && (
              <p className="text-xs text-gray-400 mt-1">{subtext}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BarChartSimple({
  data,
  labelKey,
  valueKey,
  color = 'bg-red-500',
}: {
  data: Record<string, unknown>[];
  labelKey: string;
  valueKey: string;
  color?: string;
}): ReactElement {
  const maxValue = Math.max(...data.map((d) => Number(d[valueKey]) || 0));

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-32 text-sm text-gray-600 truncate">
            {String(item[labelKey])}
          </div>
          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${color} rounded-full`}
              initial={{ width: 0 }}
              animate={{
                width: `${maxValue > 0 ? (Number(item[valueKey]) / maxValue) * 100 : 0}%`,
              }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          </div>
          <div className="w-12 text-sm font-medium text-right">
            {String(item[valueKey])}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage(): ReactElement {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [overview, setOverview] = useState<Awaited<ReturnType<typeof getAnalyticsOverview>> | null>(null);
  const [ageStats, setAgeStats] = useState<Awaited<ReturnType<typeof getAgeGroupStats>>>([]);
  const [budgetStats, setBudgetStats] = useState<Awaited<ReturnType<typeof getBudgetTierStats>>>([]);
  const [interests, setInterests] = useState<Awaited<ReturnType<typeof getPopularInterests>>>([]);
  const [topGifts, setTopGifts] = useState<Awaited<ReturnType<typeof getTopRecommendedGifts>>>([]);
  const [nicePoints, setNicePoints] = useState<Awaited<ReturnType<typeof getNicePointsDistribution>>>([]);
  const [recentSessions, setRecentSessions] = useState<Awaited<ReturnType<typeof getRecentSessions>>>([]);
  const [agentStats, setAgentStats] = useState<Awaited<ReturnType<typeof getAgentPerformanceStats>>>([]);
  const [, setSessionsTrend] = useState<Awaited<ReturnType<typeof getSessionsOverTime>>>([]);

  const loadData = useCallback(async () => {
    try {
      const [
        overviewData,
        ageData,
        budgetData,
        interestsData,
        giftsData,
        pointsData,
        sessionsData,
        agentsData,
        trendData,
      ] = await Promise.all([
        getAnalyticsOverview(),
        getAgeGroupStats(),
        getBudgetTierStats(),
        getPopularInterests(),
        getTopRecommendedGifts(),
        getNicePointsDistribution(),
        getRecentSessions(15),
        getAgentPerformanceStats(),
        getSessionsOverTime(14),
      ]);

      setOverview(overviewData);
      setAgeStats(ageData);
      setBudgetStats(budgetData);
      setInterests(interestsData);
      setTopGifts(giftsData);
      setNicePoints(pointsData);
      setRecentSessions(sessionsData);
      setAgentStats(agentsData);
      setSessionsTrend(trendData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/inventory">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Inventory
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-red-600" />
                Workshop Analytics
              </h1>
              <p className="text-gray-500 mt-1">Track your workshop performance</p>
            </div>
          </div>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Sessions"
            value={overview?.totalSessions || 0}
            icon={Users}
            color="bg-blue-500"
            subtext={`${overview?.sessions24h || 0} in last 24h`}
          />
          <StatCard
            title="Completed Journeys"
            value={overview?.completedSessions || 0}
            icon={CheckCircle}
            color="bg-green-500"
            subtext={`${overview?.conversionRate} conversion`}
          />
          <StatCard
            title="Items Purchased"
            value={overview?.purchasedItems || 0}
            icon={ShoppingCart}
            color="bg-purple-500"
          />
          <StatCard
            title="Lists Shared"
            value={overview?.sharedLists || 0}
            icon={Share2}
            color="bg-amber-500"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Group Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Age Group Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ageStats.length > 0 ? (
                <BarChartSimple
                  data={ageStats.map((s) => ({
                    label: ageGroupLabels[s.ageGroup || ''] || s.ageGroup,
                    count: s.count,
                  }))}
                  labelKey="label"
                  valueKey="count"
                  color="bg-blue-500"
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Budget Tier Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Budget Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {budgetStats.length > 0 ? (
                <div className="space-y-4">
                  {budgetStats.map((stat) => {
                    const config = budgetLabels[stat.budgetTier] || {
                      label: stat.budgetTier,
                      color: 'bg-gray-500',
                    };
                    const total = budgetStats.reduce((sum, s) => sum + s.count, 0);
                    const percentage = total > 0 ? ((stat.count / total) * 100).toFixed(1) : 0;
                    return (
                      <div key={stat.budgetTier} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${config.color}`} />
                        <span className="w-24 font-medium">{config.label}</span>
                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${config.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="w-20 text-right text-sm">
                          {stat.count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Popular Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-600" />
                Top Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interests.length > 0 ? (
                <BarChartSimple
                  data={interests}
                  labelKey="interest"
                  valueKey="count"
                  color="bg-amber-500"
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Nice Points Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Nice Points (Spinner) Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nicePoints.some((p) => p.count > 0) ? (
                <BarChartSimple
                  data={nicePoints}
                  labelKey="range"
                  valueKey="count"
                  color="bg-purple-500"
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No spinner data yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Recommended Gifts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-red-600" />
              Most Recommended Gifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topGifts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {topGifts.slice(0, 5).map((gift, i) => (
                  <motion.div
                    key={gift.giftId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg border p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-red-600 mb-2">#{i + 1}</div>
                    <p className="font-medium text-gray-900 truncate">{gift.giftName}</p>
                    <p className="text-sm text-gray-500">{gift.category}</p>
                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
                      <span>{gift.count} times</span>
                      <span>|</span>
                      <span>Avg: {Number(gift.avgScore).toFixed(0)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recommendations yet</p>
            )}
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Elf (Agent) Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agentStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agentStats.map((agent) => (
                  <div
                    key={agent.agentName}
                    className="bg-gray-50 rounded-lg p-4 border"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">{agent.agentName}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Runs</span>
                        <span className="font-medium">{agent.totalRuns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Success Rate</span>
                        <span className="font-medium text-green-600">{agent.successRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg Duration</span>
                        <span className="font-medium">{(agent.avgDurationMs / 1000).toFixed(1)}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Failures</span>
                        <span className={`font-medium ${Number(agent.failureCount) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {agent.failureCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No agent data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-gray-500">Name</th>
                      <th className="pb-3 font-medium text-gray-500">Age</th>
                      <th className="pb-3 font-medium text-gray-500">Interests</th>
                      <th className="pb-3 font-medium text-gray-500">Status</th>
                      <th className="pb-3 font-medium text-gray-500">Nice Points</th>
                      <th className="pb-3 font-medium text-gray-500">Recs</th>
                      <th className="pb-3 font-medium text-gray-500">Saved</th>
                      <th className="pb-3 font-medium text-gray-500">Purchased</th>
                      <th className="pb-3 font-medium text-gray-500">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="py-3 font-medium">
                          {session.profile?.name || '-'}
                        </td>
                        <td className="py-3 text-gray-600">
                          {session.profile?.age || '-'}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(session.profile?.interests as string[] || []).slice(0, 3).map((i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-100 rounded text-xs"
                              >
                                {i}
                              </span>
                            ))}
                            {(session.profile?.interests as string[] || []).length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{(session.profile?.interests as string[]).length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              session.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : session.status === 'failed'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {session.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : session.status === 'failed' ? (
                              <XCircle className="h-3 w-3" />
                            ) : null}
                            {session.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {session.nicePoints !== undefined ? (
                            <span className="font-medium text-purple-600">
                              {session.nicePoints}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 text-gray-600">{session.recommendationCount}</td>
                        <td className="py-3 text-gray-600">{session.listItemCount}</td>
                        <td className="py-3">
                          {Number(session.purchasedCount) > 0 ? (
                            <span className="text-green-600 font-medium">
                              {session.purchasedCount}
                            </span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No sessions yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
