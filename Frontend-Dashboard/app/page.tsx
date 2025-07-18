'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DashboardStatsCards } from '@/components/dashboard/stats-cards';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/lib/store';
import { 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar,
  Star,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { useEffect } from 'react';

// Mock data for recent activities
const recentActivities = [
  {
    id: '1',
    type: 'quest_completed',
    title: 'Downtown Food Tour',
    description: 'Completed quest and earned 150 $LUNOA',
    location: 'Downtown District',
    timestamp: '2 hours ago',
    reward: 150,
    participants: 1,
  },
  {
    id: '2',
    type: 'quest_joined',
    title: 'Street Art Discovery',
    description: 'Joined new quest in Arts Quarter',
    location: 'Arts Quarter',
    timestamp: '4 hours ago',
    reward: 200,
    participants: 8,
  },
  {
    id: '3',
    type: 'vibe_created',
    title: 'Amazing Sunset View',
    description: 'Created new vibe at Sunset Beach',
    location: 'Sunset Beach',
    timestamp: '1 day ago',
    likes: 24,
  },
];

// Mock upcoming quests
const upcomingQuests = [
  {
    id: '1',
    title: 'Coffee Shop Crawl',
    description: 'Visit 5 unique coffee shops in the city center',
    reward: 300,
    participants: 12,
    difficulty: 'Easy',
    timeLeft: '2 days',
    location: 'City Center',
  },
  {
    id: '2',
    title: 'Historical Walking Tour',
    description: 'Explore the old town and discover hidden historical gems',
    reward: 450,
    participants: 6,
    difficulty: 'Medium',
    timeLeft: '5 days',
    location: 'Old Town',
  },
  {
    id: '3',
    title: 'Night Photography Challenge',
    description: 'Capture the city\'s nightlife through your lens',
    reward: 600,
    participants: 3,
    difficulty: 'Hard',
    timeLeft: '1 week',
    location: 'Various Locations',
  },
];

function ActivityFeed() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="mt-1">
              {activity.type === 'quest_completed' && (
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600" />
                </div>
              )}
              {activity.type === 'quest_joined' && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              )}
              {activity.type === 'vibe_created' && (
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium truncate">{activity.title}</h4>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {activity.location}
                </div>
                {activity.reward && (
                  <Badge variant="secondary" className="text-xs">
                    +{activity.reward} $LUNOA
                  </Badge>
                )}
                {activity.participants && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    {activity.participants} participants
                  </div>
                )}
                {activity.likes && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    {activity.likes} likes
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function UpcomingQuests() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upcoming Quests</h3>
        <Button variant="ghost" size="sm">
          Browse All
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {upcomingQuests.map((quest) => (
          <div key={quest.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{quest.title}</h4>
              <Badge className={getDifficultyColor(quest.difficulty)}>
                {quest.difficulty}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {quest.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  {quest.participants}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {quest.timeLeft}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  +{quest.reward} $LUNOA
                </Badge>
                <Button size="sm">
                  Join Quest
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening in your Lunoa adventure today.
            </p>
          </div>

          {/* Stats Cards */}
          <DashboardStatsCards />

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Activity Feed - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            
            {/* Upcoming Quests - Takes 1 column */}
            <div className="lg:col-span-1">
              <UpcomingQuests />
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex flex-col items-center space-y-2">
                <Trophy className="h-6 w-6" />
                <span>Create Quest</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Star className="h-6 w-6" />
                <span>Share Vibe</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Find Friends</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
