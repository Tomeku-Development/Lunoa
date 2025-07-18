'use client';

import { Card } from '@/components/ui/card';
import { useDashboardStore } from '@/lib/store';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Map, 
  Trophy, 
  Coins,
  Star,
  Activity
} from 'lucide-react';
import { useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<any>;
  description?: string;
}

function StatCard({ title, value, change, changeLabel, icon: Icon, description }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
              {isNegative && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
              <span className={`text-sm ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-muted-foreground'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-muted-foreground ml-1">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="ml-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function DashboardStatsCards() {
  const { 
    user, 
    dashboardMetrics, 
    tokenBalance, 
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    if (user && !dashboardMetrics) {
      fetchDashboardData();
    }
  }, [user, dashboardMetrics, fetchDashboardData]);

  if (!user || !dashboardMetrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const personalStats = [
    {
      title: 'Your Reputation',
      value: user.reputation.toLocaleString(),
      change: 12.5,
      changeLabel: 'this month',
      icon: Star,
      description: 'Based on quest completions and community contributions',
    },
    {
      title: 'Quests Completed',
      value: user.questsCompleted,
      change: 8.2,
      changeLabel: 'this month',
      icon: Trophy,
      description: 'Total quests you\'ve successfully completed',
    },
    {
      title: 'Tokens Earned',
      value: `${user.tokensEarned.toLocaleString()} $LUNOA`,
      change: 15.3,
      changeLabel: 'this month',
      icon: Coins,
      description: 'Total tokens earned from all activities',
    },
    {
      title: 'Available Balance',
      value: tokenBalance ? `${tokenBalance.availableBalance.toFixed(2)} $LUNOA` : '0 $LUNOA',
      change: 5.7,
      changeLabel: 'this week',
      icon: Activity,
      description: 'Your current available token balance',
    },
  ];

  const platformStats = [
    {
      title: 'Total Users',
      value: dashboardMetrics.totalUsers.toLocaleString(),
      change: 2.1,
      changeLabel: 'vs last month',
      icon: Users,
      description: 'Active users on the platform',
    },
    {
      title: 'Active Quests',
      value: dashboardMetrics.totalQuests - dashboardMetrics.completedQuests,
      change: -1.2,
      changeLabel: 'vs last week',
      icon: Map,
      description: 'Currently available quests',
    },
    {
      title: 'Completed Quests',
      value: dashboardMetrics.completedQuests.toLocaleString(),
      change: 18.7,
      changeLabel: 'this month',
      icon: Trophy,
      description: 'Total completed quests',
    },
    {
      title: 'Total Rewards',
      value: `${(dashboardMetrics.totalRewards / 1000).toFixed(1)}K $LUNOA`,
      change: 25.4,
      changeLabel: 'distributed',
      icon: Coins,
      description: 'Total rewards distributed to users',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Personal Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {personalStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Platform Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {platformStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardStatsCards;
