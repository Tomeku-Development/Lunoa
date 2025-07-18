'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { CameraCapture } from '@/components/vibes/camera-capture';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Play,
  Volume2,
  Camera,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  Users,
  Star,
  Eye,
  Video,
  Music,
  FileText,
  MessageSquare,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';

// Mock vibes data
const mockVibes = [
  {
    id: '1',
    user: {
      username: 'SunsetChaser',
      avatar: null,
      verified: true
    },
    type: 'image',
    content: {
      image: '/api/placeholder/600/600',
      caption: 'Golden hour magic at the pier! 🌅 This quest led me to the most incredible sunset spot. Sometimes the best rewards aren\'t tokens - they\'re moments like these. #SunsetVibes #LunoaLife #GoldenHour',
      location: 'Santa Monica Pier',
      tags: ['sunset', 'pier', 'golden hour', 'quest reward', 'peaceful']
    },
    stats: {
      likes: 142,
      comments: 28,
      shares: 15,
      views: 1240
    },
    engagement: {
      liked: false,
      bookmarked: true,
      commented: false
    },
    timestamp: '3 hours ago',
    questRelated: true,
    questId: 'quest_001',
    visibility: 'public'
  },
  {
    id: '2',
    user: {
      username: 'StreetArtFan',
      avatar: null,
      verified: false
    },
    type: 'image',
    content: {
      image: '/api/placeholder/600/600',
      caption: 'Found this incredible mural during my quest! 🎨 The colors are absolutely stunning and the message is so powerful. Street art like this makes exploring the city so much more meaningful. Who\'s the artist? Does anyone know?',
      location: 'Arts District, Downtown',
      tags: ['street art', 'mural', 'colors', 'urban exploration', 'quest discovery']
    },
    stats: {
      likes: 89,
      comments: 34,
      shares: 8,
      views: 892
    },
    engagement: {
      liked: true,
      bookmarked: false,
      commented: true
    },
    timestamp: '5 hours ago',
    questRelated: true,
    questId: 'quest_002',
    visibility: 'public'
  },
  {
    id: '3',
    user: {
      username: 'CoffeeCritic',
      avatar: null,
      verified: true
    },
    type: 'image',
    content: {
      image: '/api/placeholder/600/600',
      caption: 'Perfect latte art at this hidden gem! ☕ Quest reward well earned. The barista here is an absolute artist - look at that leaf design! This coffee shop discovery quest was totally worth it. Already planning my next caffeine adventure 😄',
      location: 'Bean There Coffee Co.',
      tags: ['coffee', 'latte art', 'hidden gem', 'barista skills', 'caffeine fix']
    },
    stats: {
      likes: 76,
      comments: 19,
      shares: 12,
      views: 654
    },
    engagement: {
      liked: false,
      bookmarked: true,
      commented: false
    },
    timestamp: '8 hours ago',
    questRelated: true,
    questId: 'quest_003',
    visibility: 'public'
  },
  {
    id: '4',
    user: {
      username: 'NightOwlExplorer',
      avatar: null,
      verified: false
    },
    type: 'image',
    content: {
      image: '/api/placeholder/600/600',
      caption: 'City lights never fail to amaze me ✨ Completed my night photography quest and captured this view from the rooftop. The urban landscape transforms completely after dark - it\'s like discovering a whole new city!',
      location: 'Downtown Rooftop',
      tags: ['night photography', 'city lights', 'rooftop', 'urban landscape', 'after dark']
    },
    stats: {
      likes: 203,
      comments: 45,
      shares: 31,
      views: 1876
    },
    engagement: {
      liked: true,
      bookmarked: true,
      commented: false
    },
    timestamp: '12 hours ago',
    questRelated: true,
    questId: 'quest_004',
    visibility: 'public'
  },
  {
    id: '5',
    user: {
      username: 'FoodieAdventurer',
      avatar: null,
      verified: true
    },
    type: 'image',
    content: {
      image: '/api/placeholder/600/600',
      caption: 'Taco Tuesday just got elevated! 🌮 This food truck quest introduced me to the most amazing Korean-Mexican fusion. The bulgogi tacos are incredible - crispy, savory, with just the right amount of spice. Innovation at its finest!',
      location: 'Seoul Kitchen Food Truck',
      tags: ['food truck', 'korean mexican fusion', 'bulgogi tacos', 'street food', 'culinary adventure']
    },
    stats: {
      likes: 156,
      comments: 67,
      shares: 23,
      views: 1123
    },
    engagement: {
      liked: false,
      bookmarked: false,
      commented: true
    },
    timestamp: '1 day ago',
    questRelated: true,
    questId: 'quest_005',
    visibility: 'public'
  },
  {
    id: '6',
    user: {
      username: 'MinimalistWanderer',
      avatar: null,
      verified: false
    },
    type: 'text',
    content: {
      text: 'Sometimes the best quests are the quiet ones. Spent the morning in the botanical gardens, no phone notifications, just me and nature. Found a secluded bench by the pond and watched the ducks for an hour. These mindful moments are becoming my favorite type of adventure. 🌿🦆',
      location: 'Botanical Gardens',
      tags: ['mindfulness', 'nature', 'quiet quest', 'botanical gardens', 'peaceful moments']
    },
    stats: {
      likes: 94,
      comments: 22,
      shares: 8,
      views: 432
    },
    engagement: {
      liked: true,
      bookmarked: true,
      commented: false
    },
    timestamp: '2 days ago',
    questRelated: true,
    questId: 'quest_006',
    visibility: 'public'
  }
];

const vibeTypes = ['All', 'Image', 'Video', 'Text', 'Audio'];
const sortOptions = ['Recent', 'Most Liked', 'Most Commented', 'Trending'];

export default function VibesPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [vibes, setVibes] = useState(mockVibes);

  const handleNewVibe = (media: any, metadata: any) => {
    const newVibe = {
      id: `new-${Date.now()}`,
      title: metadata.title,
      description: metadata.description,
      type: media.type,
      creator: 'You',
      avatar: '/api/placeholder/40/40',
      location: metadata.location?.address || 'Unknown location',
      timestamp: 'Just now',
      media: media.data,
      likes: 0,
      comments: 0,
      shares: 0,
      boosts: 0,
      tags: metadata.tags || [],
      isLiked: false,
      isBookmarked: false
    };

    setVibes((prev: any[]) => [newVibe, ...prev]);
    toast.success('Vibe created successfully!');
  };

  const filteredVibes = vibes.filter((vibe: any) => {
    const matchesType = selectedType === 'All' || 
      (selectedType === 'Image' && vibe.type === 'image') ||
      (selectedType === 'Text' && vibe.type === 'text') ||
      (selectedType === 'Video' && vibe.type === 'video') ||
      (selectedType === 'Audio' && vibe.type === 'audio');
    
    const matchesSearch = vibe.content.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vibe.content.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vibe.content.tags?.some((tag: string, index: number) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesQuest = selectedFilter === 'all' || (selectedFilter === 'quest' && vibe.questRelated);
    
    return matchesType && matchesSearch && matchesQuest;
  });

  const getVibeTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return Music;
      case 'text': return FileText;
      default: return Image;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vibes</h1>
            <p className="text-muted-foreground mt-2">
              Share your adventures and discover amazing moments from the community
            </p>
          </div>
          <CameraCapture onCapture={handleNewVibe} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Your Vibes</p>
                <p className="text-xl font-semibold">24</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                <p className="text-xl font-semibold">1,247</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-xl font-semibold">8,932</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-xl font-semibold">12.4%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search vibes, tags, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {vibeTypes.map(type => (
              <Button
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(type)}
              >
                {type}
              </Button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="quest-only"
              checked={selectedFilter === 'quest'}
              onChange={(e) => setSelectedFilter(e.target.checked ? 'quest' : 'all')}
              className="rounded border-gray-300"
            />
            <label htmlFor="quest-only" className="text-sm text-muted-foreground">
              Quest-related only
            </label>
          </div>
        </div>

        {/* Vibes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVibes.map((vibe: any) => {
            const getTypeIcon = () => {
              switch(vibe.type) {
                case 'image': return Camera;
                case 'video': return Video;
                case 'audio': return Music;
                case 'text': return FileText;
                default: return Camera;
              }
            };
            const TypeIcon = getTypeIcon();
            
            return (
              <Card key={vibe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Content Preview */}
                {vibe.type === 'image' && (
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                    {vibe.questRelated && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                          Quest
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                {vibe.type === 'text' && (
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 relative">
                    <div className="absolute top-3 left-3">
                      <TypeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    {vibe.questRelated && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary">Quest</Badge>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed mt-6 line-clamp-4">
                      {vibe.content.text}
                    </p>
                  </div>
                )}

                {/* Content Details */}
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                      {vibe.user.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <p className="font-medium text-sm">{vibe.user.username}</p>
                        {vibe.user.verified && (
                          <Badge variant="secondary" className="h-4 px-1 text-xs">✓</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{vibe.timestamp}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Caption */}
                  {vibe.content.caption && (
                    <p className="text-sm mb-3 line-clamp-3">{vibe.content.caption}</p>
                  )}

                  {/* Location */}
                  {vibe.content.location && (
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {vibe.content.location}
                    </div>
                  )}

                  {/* Tags */}
                  {vibe.content.tags && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {vibe.content.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {vibe.content.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vibe.content.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(vibe.stats.views)}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {vibe.stats.comments}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        {vibe.stats.shares}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`flex items-center space-x-1 ${
                          vibe.engagement.liked ? 'text-red-500' : 'text-muted-foreground'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${vibe.engagement.liked ? 'fill-current' : ''}`} />
                        <span>{formatNumber(vibe.stats.likes)}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{vibe.stats.comments}</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 w-8 p-0 ${
                          vibe.engagement.bookmarked ? 'text-yellow-500' : 'text-muted-foreground'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${vibe.engagement.bookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Load More */}
        {filteredVibes.length > 0 && (
          <div className="text-center">
            <Button variant="outline">Load More Vibes</Button>
          </div>
        )}

        {/* No Results */}
        {filteredVibes.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vibes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or be the first to share a vibe
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
