'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Filter,
  Layers,
  Target,
  Zap,
  Trophy,
  Users,
  Star
} from 'lucide-react';

// Mapbox access token - you'll need to set this in your environment
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibHVub2EtZGV2IiwiYSI6ImNrZjJ3eDJxejBhZmIyeW50a2oxaWw2c2cifQ.example'; // Replace with your token

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

interface MapFilters {
  questTypes: string[];
  difficulty: string[];
  showQuests: boolean;
  showVibes: boolean;
  showCompleted: boolean;
  maxDistance: number;
}

interface InteractiveMapProps {
  className?: string;
  height?: number;
  showControls?: boolean;
  onQuestClick?: (quest: Quest) => void;
  onVibeClick?: (vibe: Vibe) => void;
}

export function InteractiveMap({ 
  className = '',
  height = 500,
  showControls = true,
  onQuestClick,
  onVibeClick
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<Vibe | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    questTypes: ['exploration', 'social', 'challenge', 'business'],
    difficulty: ['easy', 'medium', 'hard'],
    showQuests: true,
    showVibes: true,
    showCompleted: false,
    maxDistance: 10
  });

  // Mock data - replace with real data from your backend
  const mockQuests: Quest[] = [
    {
      id: '1',
      title: 'Discover Coffee Culture',
      description: 'Visit 3 local coffee shops and rate them',
      type: 'exploration',
      difficulty: 'easy',
      reward: 50,
      location: { latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' },
      status: 'available',
      participants: 12,
      timeLimit: '24h'
    },
    {
      id: '2',
      title: 'Street Art Photography',
      description: 'Capture 5 unique murals in the Mission District',
      type: 'challenge',
      difficulty: 'medium',
      reward: 100,
      location: { latitude: 37.7599, longitude: -122.4148, address: 'Mission District, SF' },
      status: 'active',
      participants: 8,
      timeLimit: '48h'
    },
    {
      id: '3',
      title: 'Business Networking Event',
      description: 'Attend the startup mixer and connect with 5 entrepreneurs',
      type: 'business',
      difficulty: 'hard',
      reward: 200,
      location: { latitude: 37.7849, longitude: -122.4094, address: 'SOMA, San Francisco' },
      status: 'available',
      participants: 25,
      timeLimit: '6h'
    }
  ];

  const mockVibes: Vibe[] = [
    {
      id: '1',
      title: 'Golden Gate Sunset',
      creator: 'photographer_jane',
      type: 'photo',
      location: { latitude: 37.8199, longitude: -122.4783, address: 'Golden Gate Bridge' },
      likes: 234,
      boosts: 12,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'Amazing Tacos!',
      creator: 'foodie_mike',
      type: 'photo',
      location: { latitude: 37.7749, longitude: -122.4294, address: 'Tenderloin, SF' },
      likes: 89,
      boosts: 5,
      timestamp: '4 hours ago'
    }
  ];

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 12,
      attributionControl: false
    });

    map.current.on('load', () => {
      setIsLoaded(true);
      addMarkersToMap();
    });

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];
          setUserLocation(coords);
          
          // Add user location marker
          if (map.current) {
            new mapboxgl.Marker({ color: '#3b82f6' })
              .setLngLat(coords)
              .addTo(map.current);
            
            map.current.flyTo({ center: coords, zoom: 14 });
          }
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Add markers to map
  const addMarkersToMap = useCallback(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.custom-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add quest markers
    if (filters.showQuests) {
      mockQuests.forEach((quest) => {
        const el = document.createElement('div');
        el.className = 'custom-marker quest-marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '16px';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';

        // Color based on quest type and difficulty
        const colors = {
          exploration: '#10b981',
          social: '#3b82f6',
          challenge: '#f59e0b',
          business: '#8b5cf6'
        };
        el.style.backgroundColor = colors[quest.type];

        // Icon based on quest type
        const icons = {
          exploration: '🗺️',
          social: '👥',
          challenge: '🏆',
          business: '💼'
        };
        el.innerHTML = icons[quest.type];

        el.addEventListener('click', () => {
          setSelectedQuest(quest);
          onQuestClick?.(quest);
        });

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-sm mb-1">${quest.title}</h3>
              <p class="text-xs text-gray-600 mb-2">${quest.description}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="bg-${quest.difficulty === 'easy' ? 'green' : quest.difficulty === 'medium' ? 'yellow' : 'red'}-100 text-${quest.difficulty === 'easy' ? 'green' : quest.difficulty === 'medium' ? 'yellow' : 'red'}-800 px-2 py-1 rounded">${quest.difficulty}</span>
                <span class="font-bold text-green-600">${quest.reward} $LUNOA</span>
              </div>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat([quest.location.longitude, quest.location.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }

    // Add vibe markers
    if (filters.showVibes) {
      mockVibes.forEach((vibe) => {
        const el = document.createElement('div');
        el.className = 'custom-marker vibe-marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '14px';
        el.style.backgroundColor = '#ec4899';
        el.style.color = 'white';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';

        const icons = {
          photo: '📸',
          video: '🎥',
          audio: '🎵',
          text: '📝'
        };
        el.innerHTML = icons[vibe.type];

        el.addEventListener('click', () => {
          setSelectedVibe(vibe);
          onVibeClick?.(vibe);
        });

        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-3 max-w-xs">
              <h3 class="font-bold text-sm mb-1">${vibe.title}</h3>
              <p class="text-xs text-gray-600 mb-2">by @${vibe.creator}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="flex items-center gap-1">❤️ ${vibe.likes}</span>
                <span class="flex items-center gap-1">⚡ ${vibe.boosts}</span>
                <span class="text-gray-500">${vibe.timestamp}</span>
              </div>
            </div>
          `);

        new mapboxgl.Marker(el)
          .setLngLat([vibe.location.longitude, vibe.location.latitude])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }
  }, [filters, isLoaded, onQuestClick, onVibeClick]);

  // Update markers when filters change
  useEffect(() => {
    addMarkersToMap();
  }, [addMarkersToMap]);

  const centerOnUser = () => {
    if (userLocation && map.current) {
      map.current.flyTo({ center: userLocation, zoom: 16 });
    }
  };

  const toggleFilter = (filterType: keyof MapFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full rounded-lg overflow-hidden"
        style={{ height: `${height}px` }}
      />

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 left-4 space-y-2">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-quests"
                  checked={filters.showQuests}
                  onChange={(e) => toggleFilter('showQuests', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="show-quests" className="text-xs">Show Quests</label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-vibes"
                  checked={filters.showVibes}
                  onChange={(e) => toggleFilter('showVibes', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="show-vibes" className="text-xs">Show Vibes</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-completed"
                  checked={filters.showCompleted}
                  onChange={(e) => toggleFilter('showCompleted', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="show-completed" className="text-xs">Show Completed</label>
              </div>
            </div>
          </Card>

          <Button
            onClick={centerOnUser}
            size="sm"
            variant="outline"
            className="w-full"
            disabled={!userLocation}
          >
            <Target className="h-4 w-4 mr-1" />
            Center on Me
          </Button>
        </div>
      )}

      {/* Legend */}
      {showControls && (
        <div className="absolute bottom-4 left-4">
          <Card className="p-3">
            <div className="text-xs font-medium mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">🗺️</div>
                <span>Exploration</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">👥</div>
                <span>Social</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">🏆</div>
                <span>Challenge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">💼</div>
                <span>Business</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs">📸</div>
                <span>Vibes</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
