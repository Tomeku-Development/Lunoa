'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Trophy, 
  Coins,
  Star,
  MapPin,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { useState } from 'react';

// Mock analytics data
const questCompletionData = [
  { month: 'Jan', completed: 12, joined: 18, created: 3 },
  { month: 'Feb', completed: 15, joined: 22, created: 2 },
  { month: 'Mar', completed: 18, joined: 25, created: 4 },
  { month: 'Apr', completed: 22, joined: 28, created: 5 },
  { month: 'May', completed: 25, joined: 32, created: 3 },
  { month: 'Jun', completed: 28, joined: 35, created: 6 },
];

const tokenEarningsData = [
  { week: 'Week 1', earnings: 450, spent: 120 },
  { week: 'Week 2', earnings: 380, spent: 200 },
  { week: 'Week 3', earnings: 520, spent: 150 },
  { week: 'Week 4', earnings: 610, spent: 300 },
  { week: 'Week 5', earnings: 480, spent: 180 },
  { week: 'Week 6', earnings: 720, spent: 250 },
];

const questCategoryData = [
  { name: 'Food & Drink', value: 35, color: '#8884d8' },
  { name: 'Art & Culture', value: 25, color: '#82ca9d' },
  { name: 'History', value: 20, color: '#ffc658' },
  { name: 'Photography', value: 15, color: '#ff7c7c' },
  { name: 'Adventure', value: 5, color: '#8dd1e1' },
];

const locationActivityData = [
  { location: 'Downtown', quests: 45, vibes: 28, popularity: 85 },
  { location: 'Arts Quarter', quests: 32, vibes: 42, popularity: 78 },
  { location: 'Old Town', quests: 28, vibes: 18, popularity: 65 },
  { location: 'Beach Area', quests: 22, vibes: 35, popularity: 70 },
  { location: 'University District', quests: 18, vibes: 22, popularity: 60 },
];

const timeRanges = ['7 days', '30 days', '90 days', '1 year'];

export default function AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30 days');

  const StatCard = ({ title, value, change, changeLabel, icon: Icon, color = 'primary' }) => {
    const isPositive = change > 0;
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-muted-foreground ml-1">{changeLabel}</span>
            </div>
          </div>
          <div className="ml-4">
            <div className={`h-12 w-12 rounded-lg bg-${color}/10 flex items-center justify-center`}>
              <Icon className={`h-6 w-6 text-${color}`} />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and discover insights about your Lunoa journey
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {timeRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Reputation"
            value="1,247"
            change={12.5}
            changeLabel="this month"
            icon={Star}
            color="yellow-500"
          />
          <StatCard
            title="Quests Completed"
            value="28"
            change={18.2}
            changeLabel="this month"
            icon={Trophy}
            color="green-500"
          />
          <StatCard
            title="Tokens Earned"
            value="3,450"
            change={23.1}
            changeLabel="this month"
            icon={Coins}
            color="blue-500"
          />
          <StatCard
            title="Vibes Created"
            value="15"
            change={-5.2}
            changeLabel="this month"
            icon={Users}
            color="purple-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quest Activity Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Quest Activity</h3>
              <Badge variant="secondary">Last 6 months</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={questCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                <Bar dataKey="joined" fill="#82ca9d" name="Joined" />
                <Bar dataKey="created" fill="#ffc658" name="Created" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Token Earnings Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Token Flow</h3>
              <Badge variant="secondary">Last 6 weeks</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tokenEarningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="earnings" 
                  stackId="1" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  name="Earned"
                />
                <Area 
                  type="monotone" 
                  dataKey="spent" 
                  stackId="2" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  name="Spent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quest Categories Pie Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quest Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={questCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {questCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {questCategoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Location Activity */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Location Activity</h3>
            <div className="space-y-4">
              {locationActivityData.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{location.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.quests} quests • {location.vibes} vibes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{location.popularity}%</p>
                      <p className="text-xs text-muted-foreground">popularity</p>
                    </div>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${location.popularity}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Achievement Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Achievement Progress</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Quest Master</span>
                </div>
                <span className="text-sm text-muted-foreground">28/50</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '56%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Complete 50 quests</p>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Vibe Creator</span>
                </div>
                <span className="text-sm text-muted-foreground">15/25</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Create 25 vibes</p>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Token Collector</span>
                </div>
                <span className="text-sm text-muted-foreground">3,450/5,000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '69%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Earn 5,000 $LUNOA</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
