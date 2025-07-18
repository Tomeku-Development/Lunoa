'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/lib/store';
import { 
  User, 
  Bell, 
  Shield, 
  Wallet,
  MapPin,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Upload,
  Settings as SettingsIcon,
  Palette,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Vibrate,
  Camera
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user } = useDashboardStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile settings
    username: user?.username || '',
    email: 'user@example.com',
    bio: 'Adventure seeker and quest enthusiast exploring the world one location at a time.',
    location: 'San Francisco, CA',
    website: '',
    
    // Privacy settings
    profileVisibility: 'public',
    showLocation: true,
    showActivity: true,
    showQuestHistory: true,
    allowDirectMessages: true,
    
    // Notification settings
    questNotifications: true,
    socialNotifications: true,
    rewardNotifications: true,
    marketingEmails: false,
    pushNotifications: true,
    emailDigest: 'weekly',
    
    // App preferences
    theme: 'system',
    language: 'en',
    timezone: 'America/Los_Angeles',
    soundEffects: true,
    hapticFeedback: true,
    autoLocation: true,
    
    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: '24h',
    loginAlerts: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
        
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium mb-2 block">Username</label>
            <Input
              value={settings.username}
              onChange={(e) => handleSettingChange('username', e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange('email', e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Location</label>
            <Input
              value={settings.location}
              onChange={(e) => handleSettingChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Website</label>
            <Input
              value={settings.website}
              onChange={(e) => handleSettingChange('website', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">Bio</label>
          <textarea
            className="w-full p-3 rounded-md border border-input bg-background text-sm"
            rows={3}
            value={settings.bio}
            onChange={(e) => handleSettingChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Primary Wallet</p>
              <p className="text-sm text-muted-foreground">
                {user?.walletAddress?.slice(0, 10)}...{user?.walletAddress?.slice(-6)}
              </p>
            </div>
            <Badge variant="secondary">Connected</Badge>
          </div>
          <Button variant="outline" className="w-full">
            <Wallet className="h-4 w-4 mr-2" />
            Connect Additional Wallet
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'questNotifications', label: 'Quest updates and completions', description: 'Get notified about quest progress and rewards' },
            { key: 'socialNotifications', label: 'Social interactions', description: 'New followers, likes, and comments' },
            { key: 'rewardNotifications', label: 'Rewards and tokens', description: 'Token earnings and reward distributions' },
            { key: 'pushNotifications', label: 'Mobile push notifications', description: 'Receive notifications on your mobile device' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Marketing emails</p>
              <p className="text-sm text-muted-foreground">Promotional content and updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
          
          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Email digest frequency</label>
            <select
              value={settings.emailDigest}
              onChange={(e) => handleSettingChange('emailDigest', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="never">Never</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
        <div className="space-y-4">
          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Profile visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="public">Public - Anyone can see your profile</option>
              <option value="friends">Friends only - Only friends can see your profile</option>
              <option value="private">Private - Only you can see your profile</option>
            </select>
          </div>

          {[
            { key: 'showLocation', label: 'Show location on profile', description: 'Display your location to other users' },
            { key: 'showActivity', label: 'Show activity status', description: 'Let others see when you\'re active' },
            { key: 'showQuestHistory', label: 'Show quest history', description: 'Display your completed quests publicly' },
            { key: 'allowDirectMessages', label: 'Allow direct messages', description: 'Let other users send you messages' },
          ].map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/New_York">Eastern Time</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {[
            { key: 'soundEffects', label: 'Sound effects', description: 'Play sounds for app interactions', icon: Volume2 },
            { key: 'hapticFeedback', label: 'Haptic feedback', description: 'Vibrate on interactions (mobile only)', icon: Vibrate },
            { key: 'autoLocation', label: 'Auto-detect location', description: 'Automatically detect your location for quests', icon: MapPin },
          ].map(({ key, label, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings[key as keyof typeof settings] as boolean}
                onChange={(e) => handleSettingChange(key, e.target.checked)}
                className="rounded border-gray-300"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Two-factor authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant={settings.twoFactorEnabled ? "destructive" : "default"} size="sm">
              {settings.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
            </Button>
          </div>

          <div className="p-3 rounded-lg border">
            <label className="font-medium mb-2 block">Session timeout</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="1h">1 hour</option>
              <option value="8h">8 hours</option>
              <option value="24h">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Login alerts</p>
              <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
            </div>
            <input
              type="checkbox"
              checked={settings.loginAlerts}
              onChange={(e) => handleSettingChange('loginAlerts', e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Current Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </Card>

      <Card className="p-6 border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-red-200">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'preferences': return renderPreferencesTab();
      case 'security': return renderSecurityTab();
      default: return renderProfileTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account preferences and security settings
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Navigation Tabs */}
          <Card className="p-4 lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
