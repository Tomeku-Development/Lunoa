'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Crown,
  Star,
  Medal,
  Award,
  Target,
  Zap,
  Shield,
  Heart,
  Camera,
  MapPin,
  Users,
  Coins,
  Calendar,
  Search,
  Filter,
  Lock,
  CheckCircle,
  ProgressIcon as Progress,
  TrendingUp,
  Gift,
  Flame
} from 'lucide-react';
import { useState } from 'react';

// Mock achievements data
const achievements = [
  {
    id: '1',
    title: 'Quest Master',
    description: 'Complete 50 quests to prove your dedication to exploration',
    category: 'Quests',
    tier: 'gold',
    points: 500,
    progress: 28,
    target: 50,
    unlocked: false,
    icon: Trophy,
    reward: {
      tokens: 1000,
      badge: 'Quest Master',
      title: 'Master Explorer'
    },
    requirements: ['Complete 50 quests', 'Maintain 80% success rate'],
    rarity: 'rare'
  },
  {
    id: '2',
    title: 'Social Butterfly',
    description: 'Connect with 100 fellow adventurers in the Lunoa community',
    category: 'Social',
    tier: 'silver',
    points: 300,
    progress: 67,
    target: 100,
    unlocked: false,
    icon: Users,
    reward: {
      tokens: 500,
      badge: 'Social Butterfly',
      title: 'Community Builder'
    },
    requirements: ['Follow 100 users', 'Get 50 followers'],
    rarity: 'uncommon'
  },
  {
    id: '3',
    title: 'First Steps',
    description: 'Complete your very first quest in the Lunoa universe',
    category: 'Getting Started',
    tier: 'bronze',
    points: 50,
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedAt: '2024-01-15T10:30:00Z',
    icon: Target,
    reward: {
      tokens: 100,
      badge: 'First Steps',
      title: 'Adventurer'
    },
    requirements: ['Complete 1 quest'],
    rarity: 'common'
  },
  {
    id: '4',
    title: 'Token Collector',
    description: 'Accumulate 10,000 $LUNOA tokens through various activities',
    category: 'Economics',
    tier: 'gold',
    points: 750,
    progress: 3450,
    target: 10000,
    unlocked: false,
    icon: Coins,
    reward: {
      tokens: 2000,
      badge: 'Token Collector',
      title: 'Crypto Enthusiast'
    },
    requirements: ['Earn 10,000 $LUNOA tokens', 'Complete 20 quests'],
    rarity: 'epic'
  },
  {
    id: '5',
    title: 'Photographer',
    description: 'Share 25 stunning vibes that capture the world around you',
    category: 'Content',
    tier: 'silver',
    points: 200,
    progress: 15,
    target: 25,
    unlocked: false,
    icon: Camera,
    reward: {
      tokens: 300,
      badge: 'Photographer',
      title: 'Visual Storyteller'
    },
    requirements: ['Share 25 vibes', 'Get 100 total likes'],
    rarity: 'uncommon'
  },
  {
    id: '6',
    title: 'City Explorer',
    description: 'Visit and complete quests in 10 different neighborhoods',
    category: 'Exploration',
    tier: 'silver',
    points: 400,
    progress: 6,
    target: 10,
    unlocked: false,
    icon: MapPin,
    reward: {
      tokens: 600,
      badge: 'City Explorer',
      title: 'Urban Navigator'
    },
    requirements: ['Visit 10 different areas', 'Complete quests in each area'],
    rarity: 'uncommon'
  },
  {
    id: '7',
    title: 'Streak Master',
    description: 'Complete at least one quest for 30 consecutive days',
    category: 'Consistency',
    tier: 'gold',
    points: 600,
    progress: 12,
    target: 30,
    unlocked: false,
    icon: Flame,
    reward: {
      tokens: 1500,
      badge: 'Streak Master',
      title: 'Dedicated Explorer'
    },
    requirements: ['30-day quest streak', 'No missed days'],
    rarity: 'rare'
  },
  {
    id: '8',
    title: 'Community Leader',
    description: 'Create 10 quests that other adventurers love to participate in',
    category: 'Leadership',
    tier: 'gold',
    points: 800,
    progress: 3,
    target: 10,
    unlocked: false,
    icon: Crown,
    reward: {
      tokens: 2500,
      badge: 'Community Leader',
      title: 'Quest Architect'
    },
    requirements: ['Create 10 quests', 'Average 4+ star rating'],
    rarity: 'legendary'
  }
];

const categories = ['All', 'Quests', 'Social', 'Economics', 'Content', 'Exploration', 'Consistency', 'Leadership', 'Getting Started'];
const tierColors = {
  bronze: 'from-amber-600 to-yellow-600',
  silver: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600'
};

const rarityColors = {
  common: 'border-gray-300 bg-gray-50',
  uncommon: 'border-green-300 bg-green-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-orange-300 bg-orange-50'
};

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'All' || achievement.category === selectedCategory;
    const matchesUnlocked = !showUnlockedOnly || achievement.unlocked;
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesUnlocked && matchesSearch;
  });

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const totalPossiblePoints = achievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and unlock rewards as you explore the Lunoa universe
            </p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">Achievements</h3>
            </div>
            <p className="text-2xl font-bold">{unlockedAchievements}/{totalAchievements}</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${(unlockedAchievements / totalAchievements) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Achievement Points</h3>
            </div>
            <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">of {totalPossiblePoints.toLocaleString()} possible</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Completion Rate</h3>
            </div>
            <p className="text-2xl font-bold">{Math.round((unlockedAchievements / totalAchievements) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Keep exploring!</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Rewards Earned</h3>
            </div>
            <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward.tokens, 0)}</p>
            <p className="text-sm text-muted-foreground">$LUNOA tokens</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unlocked-only"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="unlocked-only" className="text-sm text-muted-foreground">
              Show unlocked only
            </label>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercentage = (achievement.progress / achievement.target) * 100;
            const isNearCompletion = progressPercentage >= 80 && !achievement.unlocked;
            
            return (
              <Card 
                key={achievement.id} 
                className={`p-6 transition-all hover:shadow-lg ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50/50' 
                    : isNearCompletion 
                    ? 'border-yellow-200 bg-yellow-50/50' 
                    : rarityColors[achievement.rarity]
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`relative h-16 w-16 rounded-full bg-gradient-to-br ${tierColors[achievement.tier]} flex items-center justify-center`}>
                    <Icon className="h-8 w-8 text-white" />
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                    {!achievement.unlocked && progressPercentage < 100 && (
                      <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gray-400 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{achievement.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="capitalize">
                          {achievement.tier}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${
                            achievement.rarity === 'legendary' ? 'border-orange-400 text-orange-600' :
                            achievement.rarity === 'epic' ? 'border-purple-400 text-purple-600' :
                            achievement.rarity === 'rare' ? 'border-blue-400 text-blue-600' :
                            achievement.rarity === 'uncommon' ? 'border-green-400 text-green-600' :
                            'border-gray-400 text-gray-600'
                          }`}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3">{achievement.description}</p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          Progress: {achievement.progress}/{achievement.target}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            achievement.unlocked ? 'bg-green-500' :
                            isNearCompletion ? 'bg-yellow-500' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-yellow-600">
                          +{achievement.reward.tokens} $LUNOA
                        </Badge>
                        <Badge variant="outline">
                          {achievement.reward.badge} Badge
                        </Badge>
                        <Badge variant="outline">
                          "{achievement.reward.title}" Title
                        </Badge>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Requirements:</p>
                      <ul className="text-sm text-muted-foreground">
                        {achievement.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Status */}
                    {achievement.unlocked ? (
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          {achievement.points} points
                        </Badge>
                        {isNearCompletion && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <Zap className="h-3 w-3 mr-1" />
                            Almost there!
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or explore more to unlock achievements
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
