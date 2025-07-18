'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/lib/store';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  Trophy,
  Users,
  Star,
  Coins,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  User
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock expanded notifications data
const allNotifications = [
  {
    id: '1',
    type: 'quest_completed',
    title: 'Quest Completed!',
    message: 'You completed "Explore Downtown" quest and earned 150 $LUNOA tokens',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    metadata: {
      questTitle: 'Explore Downtown',
      reward: 150,
      location: 'Downtown District'
    }
  },
  {
    id: '2',
    type: 'reward_received',
    title: 'Reward Received',
    message: 'You received 50 $LUNOA from quest verification by QuestMaster_42',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    metadata: {
      amount: 50,
      verifier: 'QuestMaster_42'
    }
  },
  {
    id: '3',
    type: 'new_follower',
    title: 'New Follower',
    message: 'AdventureSeeker_99 started following you',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    metadata: {
      follower: 'AdventureSeeker_99'
    }
  },
  {
    id: '4',
    type: 'quest_invitation',
    title: 'Quest Invitation',
    message: 'PhotoExplorer invited you to join "Street Art Photography" quest',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    metadata: {
      questTitle: 'Street Art Photography',
      inviter: 'PhotoExplorer',
      reward: 300
    }
  },
  {
    id: '5',
    type: 'vibe_liked',
    title: 'Vibe Liked',
    message: 'Your vibe "Sunset at the Beach" received 10 new likes',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    metadata: {
      vibeTitle: 'Sunset at the Beach',
      likes: 10
    }
  },
  {
    id: '6',
    type: 'quest_reminder',
    title: 'Quest Reminder',
    message: 'Your quest "Coffee Shop Discovery" expires in 2 days',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    metadata: {
      questTitle: 'Coffee Shop Discovery',
      expiresIn: '2 days'
    }
  },
  {
    id: '7',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: 'You unlocked the "Social Butterfly" achievement for connecting with 50 users',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    metadata: {
      achievement: 'Social Butterfly',
      milestone: 50
    }
  },
  {
    id: '8',
    type: 'comment_received',
    title: 'New Comment',
    message: 'CityExplorer commented on your quest "Historical Walking Tour"',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    metadata: {
      commenter: 'CityExplorer',
      questTitle: 'Historical Walking Tour'
    }
  }
];

const notificationTypes = ['All', 'Quest', 'Social', 'Achievement', 'Reward', 'System'];

export default function NotificationsPage() {
  const { notifications, unreadCount, markNotificationAsRead } = useDashboardStore();
  const [selectedType, setSelectedType] = useState('All');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Use expanded mock data for demo
  const displayNotifications = allNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quest_completed':
      case 'quest_invitation':
      case 'quest_reminder':
        return Trophy;
      case 'reward_received':
        return Coins;
      case 'new_follower':
        return Users;
      case 'vibe_liked':
        return Heart;
      case 'achievement_unlocked':
        return Star;
      case 'comment_received':
        return MessageSquare;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'quest_completed':
        return 'text-green-600 bg-green-100';
      case 'reward_received':
        return 'text-yellow-600 bg-yellow-100';
      case 'new_follower':
        return 'text-blue-600 bg-blue-100';
      case 'vibe_liked':
        return 'text-pink-600 bg-pink-100';
      case 'achievement_unlocked':
        return 'text-purple-600 bg-purple-100';
      case 'quest_invitation':
        return 'text-indigo-600 bg-indigo-100';
      case 'quest_reminder':
        return 'text-orange-600 bg-orange-100';
      case 'comment_received':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = displayNotifications.filter(notification => {
    if (showUnreadOnly && notification.read) return false;
    if (selectedType === 'All') return true;
    
    const typeMap = {
      'Quest': ['quest_completed', 'quest_invitation', 'quest_reminder'],
      'Social': ['new_follower', 'vibe_liked', 'comment_received'],
      'Achievement': ['achievement_unlocked'],
      'Reward': ['reward_received'],
      'System': ['system_update', 'maintenance']
    };
    
    return typeMap[selectedType]?.includes(notification.type) || false;
  });

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    displayNotifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  const unreadNotifications = displayNotifications.filter(n => !n.read);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground mt-2">
              Stay updated with your Lunoa activities and interactions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadNotifications.length === 0}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-semibold">{displayNotifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-xs text-white font-semibold">{unreadNotifications.length}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-xl font-semibold">{unreadNotifications.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Quest Related</p>
                <p className="text-xl font-semibold">
                  {displayNotifications.filter(n => n.type.includes('quest')).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Social</p>
                <p className="text-xl font-semibold">
                  {displayNotifications.filter(n => ['new_follower', 'vibe_liked', 'comment_received'].includes(n.type)).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex gap-2">
            {notificationTypes.map(type => (
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
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unread-only"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="unread-only" className="text-sm text-muted-foreground">
              Show unread only
            </label>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {showUnreadOnly ? 'You have no unread notifications.' : 'No notifications match your current filter.'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const colorClasses = getNotificationColor(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`p-4 transition-colors hover:bg-muted/50 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      {/* Metadata display */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {notification.metadata.reward && (
                            <Badge variant="secondary" className="text-xs">
                              +{notification.metadata.reward} $LUNOA
                            </Badge>
                          )}
                          {notification.metadata.location && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              {notification.metadata.location}
                            </Badge>
                          )}
                          {notification.metadata.questTitle && (
                            <Badge variant="outline" className="text-xs">
                              {notification.metadata.questTitle}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Mark as read
                          </Button>
                        )}
                        
                        {notification.type === 'quest_invitation' && (
                          <div className="flex space-x-2">
                            <Button size="sm">Accept</Button>
                            <Button variant="outline" size="sm">Decline</Button>
                          </div>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center">
            <Button variant="outline">
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
