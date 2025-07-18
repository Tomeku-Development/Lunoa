'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { InteractiveMap } from '@/components/map/interactive-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  Filter, 
  Navigation,
  Clock,
  Users,
  Zap,
  Trophy,
  Target,
  Route,
  Share
} from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'exploration' | 'social' | 'challenge' | 'business';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'available' | 'active' | 'completed';
  participants: number;
  timeLimit?: string;
}

interface Vibe {
  id: string;
  title: string;
  creator: string;
  type: 'photo' | 'video' | 'audio' | 'text';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  likes: number;
  boosts: number;
  timestamp: string;
}

export default function MapPage() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleQuestClick = (quest: Quest) => {
    setSelectedQuest(quest);
    setSelectedVibe(null);
  };

  const handleVibeClick = (vibe: Vibe) => {
    setSelectedVibe(vibe);
    setSelectedQuest(null);
  };

  const getDirections = (location: { latitude: number; longitude: number }) => {
    // Open directions in user's default map app
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`);
  };

  const shareLocation = (item: Quest | Vibe) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${selectedQuest ? 'quest' : 'vibe'} on Lunoa!`,
        url: window.location.href
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Explore Map</h1>
            <p className="text-muted-foreground mt-2">
              Discover quests and vibes around you. Click on markers to see details.
            </p>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search locations, quests, or vibes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button className="flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Find Nearby
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Quest Types</h4>
                      <div className="space-y-2">
                        {['exploration', 'social', 'challenge', 'business'].map(type => (
                          <label key={type} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Difficulty</h4>
                      <div className="space-y-2">
                        {['easy', 'medium', 'hard'].map(difficulty => (
                          <label key={difficulty} className="flex items-center gap-2 text-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="capitalize">{difficulty}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Distance</h4>
                      <Input type="range" min="1" max="50" defaultValue="10" className="w-full" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1km</span>
                        <span>50km</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content - Map and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <InteractiveMap 
                    height={600}
                    onQuestClick={handleQuestClick}
                    onVibeClick={handleVibeClick}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Selected Item Details */}
            <div className="space-y-4">
              {selectedQuest && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedQuest.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {selectedQuest.location.address}
                        </CardDescription>
                      </div>
                      <Badge variant={selectedQuest.status === 'available' ? 'default' : 'secondary'}>
                        {selectedQuest.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedQuest.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Trophy className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                        <div className="text-lg font-bold">{selectedQuest.reward}</div>
                        <div className="text-xs text-muted-foreground">$LUNOA</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                        <div className="text-lg font-bold">{selectedQuest.participants}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Time limit: {selectedQuest.timeLimit || 'No limit'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {selectedQuest.type}
                      </Badge>
                      <Badge 
                        variant={selectedQuest.difficulty === 'easy' ? 'default' : 
                                selectedQuest.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      >
                        {selectedQuest.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        {selectedQuest.status === 'available' ? 'Join Quest' : 'Continue Quest'}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => getDirections(selectedQuest.location)}
                        >
                          <Route className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => shareLocation(selectedQuest)}
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedVibe && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedVibe.title}</CardTitle>
                        <CardDescription className="mt-1">
                          by @{selectedVibe.creator}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {selectedVibe.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {selectedVibe.location.address}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-red-500">{selectedVibe.likes}</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-yellow-500">{selectedVibe.boosts}</div>
                        <div className="text-xs text-muted-foreground">Boosts</div>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Posted {selectedVibe.timestamp}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        <Zap className="h-4 w-4 mr-1" />
                        Boost this Vibe
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => getDirections(selectedVibe.location)}
                        >
                          <Route className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => shareLocation(selectedVibe)}
                        >
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!selectedQuest && !selectedVibe && (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">Select a marker</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any quest or vibe marker on the map to see details and take action.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nearby Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Available Quests</span>
                    <Badge>12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Vibes</span>
                    <Badge variant="secondary">8</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Nearby Users</span>
                    <Badge variant="outline">24</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
