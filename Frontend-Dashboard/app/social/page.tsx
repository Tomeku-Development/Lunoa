'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Search, 
  UserPlus,
  MessageSquare,
  Heart,
  Star,
  MapPin,
  Trophy,
  Coins,
  Camera,
  Send,
  MoreHorizontal,
  Filter,
  Compass,
  TrendingUp,
  Crown,
  Award,
  UserCheck,
  UserX,
  Share2,
  Bookmark
} from 'lucide-react';
import { useState } from 'react';

// Mock user data
const suggestedUsers = [
  {
    id: '1',
    username: 'AdventureSeeker_99',
    avatar: null,
    reputation: 850,
    questsCompleted: 34,
    location: 'San Francisco, CA',
    mutualFriends: 5,
    isFollowing: false,
    badges: ['Explorer', 'Photographer'],
    bio: 'Urban explorer and street photography enthusiast'
  },
  {
    id: '2',
    username: 'QuestMaster_42',
    avatar: null,
    reputation: 1250,
    questsCompleted: 67,
    location: 'New York, NY',
    mutualFriends: 12,
    isFollowing: false,
    badges: ['Quest Creator', 'Community Leader'],
    bio: 'Creating memorable experiences through innovative quests'
  },
  {
    id: '3',
    username: 'CityExplorer',
    avatar: null,
    reputation: 720,
    questsCompleted: 28,
    location: 'Los Angeles, CA',
    mutualFriends: 3,
    isFollowing: true,
    badges: ['Food Critic'],
    bio: 'Discovering hidden gems in the concrete jungle'
  },
];

const topCreators = [
  {
    id: '1',
    username: 'QuestGuru',
    reputation: 2450,
    questsCreated: 89,
    followers: 1240,
    rank: 1,
  },
  {
    id: '2',
    username: 'AdventureArchitect',
    reputation: 2100,
    questsCreated: 76,
    followers: 980,
    rank: 2,
  },
  {
    id: '3',
    username: 'ExplorationExpert',
    reputation: 1850,
    questsCreated: 65,
    followers: 820,
    rank: 3,
  },
];

const recentActivity = [
  {
    id: '1',
    user: 'PhotoNinja',
    action: 'completed',
    target: 'Street Art Discovery',
    type: 'quest',
    timestamp: '2 hours ago',
    details: {
      reward: 200,
      location: 'Arts Quarter'
    }
  },
  {
    id: '2',
    user: 'FoodieExplorer',
    action: 'created',
    target: 'Hidden Brunch Spots',
    type: 'quest',
    timestamp: '4 hours ago',
    details: {
      reward: 150,
      participants: 8
    }
  },
  {
    id: '3',
    user: 'CityWanderer',
    action: 'shared',
    target: 'Rooftop Sunset',
    type: 'vibe',
    timestamp: '6 hours ago',
    details: {
      likes: 24,
      location: 'Downtown'
    }
  }
];

const recentVibes = [
  {
    id: '1',
    user: 'SunsetChaser',
    image: '/api/placeholder/300/300',
    caption: 'Golden hour magic at the pier! 🌅 #SunsetVibes #LunoaLife',
    location: 'Santa Monica Pier',
    likes: 42,
    comments: 8,
    timestamp: '3 hours ago',
    tags: ['sunset', 'pier', 'golden hour']
  },
  {
    id: '2',
    user: 'StreetArtFan',
    image: '/api/placeholder/300/300',
    caption: 'Found this incredible mural during my quest! The colors are absolutely stunning 🎨',
    location: 'Arts District',
    likes: 35,
    comments: 12,
    timestamp: '5 hours ago',
    tags: ['street art', 'mural', 'colors']
  },
  {
    id: '3',
    user: 'CoffeeCritic',
    image: '/api/placeholder/300/300',
    caption: 'Perfect latte art at this hidden gem! Quest reward well earned ☕',
    location: 'Local Coffee Shop',
    likes: 28,
    comments: 6,
    timestamp: '8 hours ago',
    tags: ['coffee', 'latte art', 'hidden gem']
  }
];

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'feed', label: 'Feed', icon: Compass },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
    { id: 'friends', label: 'Friends', icon: Users },
  ];

  const renderFeedTab = () => (
    <div className="space-y-6">
      {/* Activity Feed */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {activity.user[0].toUpperCase()}
              </div>
              
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground"> {activity.action} </span>
                  <span className="font-medium">{activity.target}</span>
                </p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                  {activity.details.reward && (
                    <Badge variant="secondary" className="text-xs">
                      +{activity.details.reward} $LUNOA
                    </Badge>
                  )}
                  {activity.details.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {activity.details.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Vibes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Vibes</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentVibes.map((vibe) => (
            <div key={vibe.id} className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                      {vibe.user[0].toUpperCase()}
                    </div>
                    <span className="text-white text-sm font-medium">{vibe.user}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-sm mb-2 line-clamp-2">{vibe.caption}</p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {vibe.location}
                  </div>
                  <span>{vibe.timestamp}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{vibe.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-blue-500 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>{vibe.comments}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderDiscoverTab = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users, locations, or interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Suggested Users */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Suggested for You</h3>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{user.username}</h4>
                    {user.badges.includes('Community Leader') && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{user.bio}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {user.reputation} reputation
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-3 w-3 mr-1" />
                      {user.questsCompleted} quests
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {user.location}
                    </div>
                  </div>
                  {user.mutualFriends > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.mutualFriends} mutual connections
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant={user.isFollowing ? "outline" : "default"} 
                  size="sm"
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Quest Creators</h3>
        <div className="space-y-4">
          {topCreators.map((creator, index) => (
            <div key={creator.id} className="flex items-center space-x-4 p-4 rounded-lg border">
              <div className="flex items-center justify-center w-8 h-8">
                {creator.rank <= 3 ? (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    creator.rank === 1 ? 'bg-yellow-500' : 
                    creator.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {creator.rank}
                  </div>
                ) : (
                  <span className="text-lg font-bold text-muted-foreground">#{creator.rank}</span>
                )}
              </div>
              
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                {creator.username[0].toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">{creator.username}</h4>
                  {creator.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {creator.reputation.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1" />
                    {creator.questsCreated} created
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {creator.followers.toLocaleString()} followers
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Ranking */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Ranking</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-primary mb-2">#47</div>
            <p className="text-sm text-muted-foreground">Overall Rank</p>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-500 mb-2">#12</div>
            <p className="text-sm text-muted-foreground">In Your City</p>
          </div>
          <div className="text-center p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-500 mb-2">#8</div>
            <p className="text-sm text-muted-foreground">Among Friends</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFriendsTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-center">
          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">127</div>
          <p className="text-sm text-muted-foreground">Following</p>
        </Card>
        <Card className="p-4 text-center">
          <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">89</div>
          <p className="text-sm text-muted-foreground">Followers</p>
        </Card>
        <Card className="p-4 text-center">
          <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">23</div>
          <p className="text-sm text-muted-foreground">Collaborations</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Network</h3>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Friends
          </Button>
        </div>
        
        <div className="space-y-3">
          {suggestedUsers.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed': return renderFeedTab();
      case 'discover': return renderDiscoverTab();
      case 'leaderboard': return renderLeaderboardTab();
      case 'friends': return renderFriendsTab();
      default: return renderFeedTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Social</h1>
            <p className="text-muted-foreground mt-2">
              Connect with fellow adventurers and discover new experiences together
            </p>
          </div>
          <Button>
            <Camera className="h-4 w-4 mr-2" />
            Share Vibe
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}
