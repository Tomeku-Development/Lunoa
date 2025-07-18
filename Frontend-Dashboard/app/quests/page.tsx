'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Users, 
  Clock, 
  Trophy, 
  Search,
  Filter,
  Plus,
  Star,
  Calendar,
  Coins
} from 'lucide-react';
import { useState } from 'react';

// Mock quests data
const quests = [
  {
    id: '1',
    title: 'Downtown Food Adventure',
    description: 'Discover hidden culinary gems in the downtown area. Visit 3 different local restaurants and try their signature dishes.',
    creator: 'FoodieExplorer',
    location: 'Downtown District',
    participants: 12,
    maxParticipants: 20,
    reward: 250,
    difficulty: 'Easy',
    duration: '2-3 hours',
    status: 'active',
    category: 'Food & Drink',
    tags: ['Food', 'Local', 'Social'],
    expiresIn: '5 days',
    image: '/api/placeholder/400/200',
    requirements: ['Photo verification', 'Location check-in'],
  },
  {
    id: '2',
    title: 'Street Art Photography Hunt',
    description: 'Capture the vibrant street art scene across the city. Find and photograph 5 different murals or street art pieces.',
    creator: 'ArtLover42',
    location: 'Arts Quarter',
    participants: 8,
    maxParticipants: 15,
    reward: 400,
    difficulty: 'Medium',
    duration: '3-4 hours',
    status: 'active',
    category: 'Art & Culture',
    tags: ['Photography', 'Art', 'Creative'],
    expiresIn: '3 days',
    image: '/api/placeholder/400/200',
    requirements: ['Photo submission', 'GPS verification'],
  },
  {
    id: '3',
    title: 'Historic Walking Tour',
    description: 'Explore the rich history of the old town. Visit 6 historical landmarks and learn about their significance.',
    creator: 'HistoryBuff',
    location: 'Old Town',
    participants: 5,
    maxParticipants: 10,
    reward: 350,
    difficulty: 'Medium',
    duration: '4-5 hours',
    status: 'active',
    category: 'History & Education',
    tags: ['History', 'Walking', 'Educational'],
    expiresIn: '1 week',
    image: '/api/placeholder/400/200',
    requirements: ['Knowledge quiz', 'Location verification'],
  },
  {
    id: '4',
    title: 'Nightlife Photography Challenge',
    description: 'Capture the energy of the city at night. Take stunning photos of the nightlife scene across various locations.',
    creator: 'NightOwl_Photographer',
    location: 'City Center',
    participants: 3,
    maxParticipants: 8,
    reward: 600,
    difficulty: 'Hard',
    duration: '5-6 hours',
    status: 'active',
    category: 'Photography',
    tags: ['Photography', 'Nightlife', 'Advanced'],
    expiresIn: '10 days',
    image: '/api/placeholder/400/200',
    requirements: ['High-quality photos', 'Night timing', 'Portfolio submission'],
  },
  {
    id: '5',
    title: 'Local Coffee Shop Discovery',
    description: 'Find and review 4 independent coffee shops. Support local businesses while discovering great coffee.',
    creator: 'CoffeeCritic',
    location: 'Various Locations',
    participants: 15,
    maxParticipants: 25,
    reward: 180,
    difficulty: 'Easy',
    duration: '2-3 hours',
    status: 'active',
    category: 'Food & Drink',
    tags: ['Coffee', 'Local Business', 'Reviews'],
    expiresIn: '2 weeks',
    image: '/api/placeholder/400/200',
    requirements: ['Written reviews', 'Receipt photos'],
  },
];

const categories = ['All', 'Food & Drink', 'Art & Culture', 'History & Education', 'Photography', 'Social', 'Adventure'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quest.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || quest.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || quest.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quests</h1>
            <p className="text-muted-foreground mt-2">
              Discover and join exciting location-based adventures
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Quest</span>
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search quests, locations, or creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Quests</p>
                <p className="text-xl font-semibold">{quests.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Participants</p>
                <p className="text-xl font-semibold">{quests.reduce((sum, q) => sum + q.participants, 0)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Rewards</p>
                <p className="text-xl font-semibold">{quests.reduce((sum, q) => sum + q.reward, 0)} $LUNOA</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Your Completed</p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quest Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredQuests.map((quest) => (
            <Card key={quest.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">
                    {quest.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{quest.title}</h3>
                  <p className="text-sm opacity-90">by {quest.creator}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {quest.description}
                </p>
                
                {/* Quest Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {quest.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {quest.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {quest.participants}/{quest.maxParticipants} joined
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {quest.expiresIn} left
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {quest.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-1">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-sm">{quest.reward} $LUNOA</span>
                  </div>
                  <Button size="sm">
                    Join Quest
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredQuests.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quests found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or create a new quest
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
