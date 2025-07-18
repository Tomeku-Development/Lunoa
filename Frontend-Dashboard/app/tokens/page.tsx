'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/lib/store';
import { 
  Coins, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Lock,
  Unlock,
  Gift,
  Trophy,
  Users,
  Calendar,
  Filter,
  Download,
  Send,
  Repeat,
  PiggyBank,
  Target,
  Star,
  Clock
} from 'lucide-react';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState } from 'react';

// Mock token data
const tokenHistory = [
  { date: '2024-01-01', balance: 1200, earned: 150, spent: 50 },
  { date: '2024-01-02', balance: 1350, earned: 200, spent: 50 },
  { date: '2024-01-03', balance: 1500, earned: 180, spent: 30 },
  { date: '2024-01-04', balance: 1650, earned: 220, spent: 70 },
  { date: '2024-01-05', balance: 1800, earned: 250, spent: 100 },
  { date: '2024-01-06', balance: 1950, earned: 200, spent: 50 },
  { date: '2024-01-07', balance: 2100, earned: 300, spent: 150 },
];

const recentTransactions = [
  {
    id: '1',
    type: 'earned',
    amount: 250,
    source: 'Quest Completion',
    description: 'Downtown Food Adventure quest completed',
    timestamp: '2 hours ago',
    status: 'completed',
    questId: 'quest_001'
  },
  {
    id: '2',
    type: 'earned',
    amount: 50,
    source: 'Quest Verification',
    description: 'Verified completion by QuestMaster_42',
    timestamp: '4 hours ago',
    status: 'completed',
    questId: 'quest_002'
  },
  {
    id: '3',
    type: 'spent',
    amount: -100,
    source: 'Quest Creation',
    description: 'Created "Street Art Photography" quest',
    timestamp: '1 day ago',
    status: 'completed',
    questId: 'quest_003'
  },
  {
    id: '4',
    type: 'earned',
    amount: 75,
    source: 'Social Reward',
    description: 'Bonus for reaching 100 followers',
    timestamp: '2 days ago',
    status: 'completed',
    questId: null
  },
  {
    id: '5',
    type: 'staked',
    amount: -500,
    source: 'Staking Pool',
    description: 'Staked tokens for 30-day yield farming',
    timestamp: '3 days ago',
    status: 'locked',
    questId: null
  },
  {
    id: '6',
    type: 'earned',
    amount: 180,
    source: 'Quest Completion',
    description: 'Historical Walking Tour completed',
    timestamp: '4 days ago',
    status: 'completed',
    questId: 'quest_004'
  }
];

const stakingPools = [
  {
    id: '1',
    name: 'Quest Creator Pool',
    apy: 12.5,
    duration: '30 days',
    minStake: 100,
    totalStaked: 45000,
    yourStake: 500,
    rewards: 6.25,
    description: 'Earn rewards by staking tokens to support quest creators'
  },
  {
    id: '2',
    name: 'Community Governance',
    apy: 8.75,
    duration: '90 days',
    minStake: 250,
    totalStaked: 125000,
    yourStake: 0,
    rewards: 0,
    description: 'Participate in platform governance and earn rewards'
  },
  {
    id: '3',
    name: 'Vibe Creator Fund',
    apy: 15.0,
    duration: '60 days',
    minStake: 50,
    totalStaked: 28000,
    yourStake: 200,
    rewards: 2.5,
    description: 'Support content creators and earn higher yields'
  }
];

const earningSourcesData = [
  { name: 'Quest Completion', value: 65, color: '#8884d8' },
  { name: 'Quest Creation', value: 20, color: '#82ca9d' },
  { name: 'Social Rewards', value: 10, color: '#ffc658' },
  { name: 'Staking Rewards', value: 5, color: '#ff7c7c' },
];

export default function TokensPage() {
  const { user, tokenBalance } = useDashboardStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Coins },
    { id: 'transactions', label: 'Transactions', icon: ArrowUpRight },
    { id: 'staking', label: 'Staking', icon: PiggyBank },
    { id: 'earn', label: 'Earn More', icon: Target },
  ];

  const timeRanges = ['24h', '7d', '30d', '90d', '1y'];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">{tokenBalance?.availableBalance.toFixed(2) || '0'}</p>
              <p className="text-xs text-muted-foreground mt-1">$LUNOA</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Staked Balance</p>
              <p className="text-2xl font-bold">{tokenBalance?.lockedBalance.toFixed(2) || '0'}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% APY
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold">{tokenBalance?.balance.toFixed(2) || '0'}</p>
              <p className="text-xs text-muted-foreground mt-1">All holdings</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Coins className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Earnings</p>
              <p className="text-2xl font-bold">1,245</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +23% vs last month
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Balance History Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Balance History</h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm"
              >
                {timeRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={tokenHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
                formatter={(value, name) => [`${value} $LUNOA`, name === 'balance' ? 'Balance' : name === 'earned' ? 'Earned' : 'Spent']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                name="balance"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Earning Sources Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Earning Sources</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={earningSourcesData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {earningSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {earningSourcesData.map((item, index) => (
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
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="h-auto p-4 flex flex-col items-center space-y-2">
            <Send className="h-6 w-6" />
            <span>Send Tokens</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <PiggyBank className="h-6 w-6" />
            <span>Stake Tokens</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Repeat className="h-6 w-6" />
            <span>Swap Tokens</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
            <Gift className="h-6 w-6" />
            <span>Claim Rewards</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderTransactionsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="all">All Types</option>
            <option value="earned">Earned</option>
            <option value="spent">Spent</option>
            <option value="staked">Staked</option>
          </select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Transaction List */}
      <Card className="p-6">
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'earned' ? 'bg-green-100' :
                  transaction.type === 'spent' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'earned' && <ArrowUpRight className="h-5 w-5 text-green-600" />}
                  {transaction.type === 'spent' && <ArrowDownLeft className="h-5 w-5 text-red-600" />}
                  {transaction.type === 'staked' && <Lock className="h-5 w-5 text-blue-600" />}
                </div>
                
                <div>
                  <p className="font-medium">{transaction.source}</p>
                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} $LUNOA
                </p>
                <Badge 
                  variant={transaction.status === 'completed' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderStakingTab = () => (
    <div className="space-y-6">
      {/* Staking Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Lock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Total Staked</h3>
          </div>
          <p className="text-2xl font-bold">700 $LUNOA</p>
          <p className="text-sm text-muted-foreground">Across 2 pools</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Est. Monthly Rewards</h3>
          </div>
          <p className="text-2xl font-bold">8.75 $LUNOA</p>
          <p className="text-sm text-green-600">+1.25% monthly</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h3 className="font-semibold">Pending Rewards</h3>
          </div>
          <p className="text-2xl font-bold">2.14 $LUNOA</p>
          <Button size="sm" className="mt-2">Claim</Button>
        </Card>
      </div>

      {/* Staking Pools */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Staking Pools</h3>
        <div className="space-y-4">
          {stakingPools.map((pool) => (
            <div key={pool.id} className="p-4 rounded-lg border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{pool.name}</h4>
                  <p className="text-sm text-muted-foreground">{pool.description}</p>
                </div>
                <Badge variant="secondary" className="text-green-600">
                  {pool.apy}% APY
                </Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">{pool.duration}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Min. Stake</p>
                  <p className="font-medium">{pool.minStake} $LUNOA</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Staked</p>
                  <p className="font-medium">{pool.totalStaked.toLocaleString()} $LUNOA</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Stake</p>
                  <p className="font-medium">{pool.yourStake} $LUNOA</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {pool.yourStake > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-600">
                      Earning: +{pool.rewards} $LUNOA/month
                    </Badge>
                    <Button variant="outline" size="sm">Unstake</Button>
                  </div>
                ) : (
                  <Button size="sm">Stake Tokens</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderEarnTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ways to Earn $LUNOA</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <h4 className="font-medium">Complete Quests</h4>
                <p className="text-sm text-muted-foreground">Earn 50-500 tokens per quest</p>
              </div>
            </div>
            <Button size="sm" className="w-full">Browse Quests</Button>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="font-medium">Create Quests</h4>
                <p className="text-sm text-muted-foreground">Earn from quest participation fees</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Create Quest</Button>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="h-6 w-6 text-purple-500" />
              <div>
                <h4 className="font-medium">Share Vibes</h4>
                <p className="text-sm text-muted-foreground">Get rewarded for popular content</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Share Vibe</Button>
          </div>

          <div className="p-4 rounded-lg border">
            <div className="flex items-center space-x-3 mb-3">
              <PiggyBank className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-medium">Stake Tokens</h4>
                <p className="text-sm text-muted-foreground">Earn up to 15% APY on staked tokens</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="w-full">Start Staking</Button>
          </div>
        </div>
      </Card>

      {/* Daily Challenges */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Challenges</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Complete 2 quests today</p>
              <p className="text-sm text-muted-foreground">Progress: 1/2</p>
            </div>
            <Badge variant="secondary">+25 $LUNOA</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Share 1 vibe</p>
              <p className="text-sm text-muted-foreground">Progress: 0/1</p>
            </div>
            <Badge variant="secondary">+15 $LUNOA</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">Follow 3 new users</p>
              <p className="text-sm text-muted-foreground">Progress: 2/3</p>
            </div>
            <Badge variant="secondary">+10 $LUNOA</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'transactions': return renderTransactionsTab();
      case 'staking': return renderStakingTab();
      case 'earn': return renderEarnTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tokens</h1>
            <p className="text-muted-foreground mt-2">
              Manage your $LUNOA tokens, view transactions, and maximize your earnings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button>
              <Wallet className="h-4 w-4 mr-2" />
              Receive
            </Button>
          </div>
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
