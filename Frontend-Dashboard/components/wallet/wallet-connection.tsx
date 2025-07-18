'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Loader2,
  Zap,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface WalletConnectionProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export function WalletConnection({ 
  className = '', 
  showBalance = true, 
  compact = false 
}: WalletConnectionProps) {
  const {
    connect,
    disconnect,
    connected,
    connecting,
    account,
    wallet,
    wallets,
    signAndSubmitTransaction,
  } = useWallet();

  const [balance, setBalance] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch wallet balance when connected
  useEffect(() => {
    if (connected && account?.address) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [connected, account]);

  const fetchBalance = async () => {
    if (!account?.address) return;
    
    try {
      // Fetch APT balance - replace with actual API call
      // This is a mock implementation
      const mockBalance = 1250.75;
      setBalance(mockBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      toast.error('Failed to fetch wallet balance');
    }
  };

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName);
      setIsModalOpen(false);
      toast.success(`Connected to ${walletName}!`);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error(`Failed to connect to ${walletName}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      toast.success('Address copied to clipboard');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openExplorer = () => {
    if (account?.address) {
      // Open in Aptos Explorer
      window.open(`https://explorer.aptoslabs.com/account/${account.address}?network=devnet`, '_blank');
    }
  };

  if (compact) {
    return (
      <div className={className}>
        {connected ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Connected
            </Badge>
            {showBalance && balance !== null && (
              <span className="text-sm font-medium">{balance.toFixed(2)} APT</span>
            )}
          </div>
        ) : (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-1" />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect Wallet</DialogTitle>
                <DialogDescription>
                  Choose a wallet to connect to Lunoa
                </DialogDescription>
              </DialogHeader>
              <WalletList onConnect={handleConnect} connecting={connecting} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your Aptos wallet to interact with Lunoa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connected ? (
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium text-green-800">Connected</div>
                  <div className="text-sm text-green-600">{wallet?.name}</div>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>

            {/* Account Info */}
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                    {account?.address && formatAddress(account.address)}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={openExplorer}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {showBalance && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Balance</label>
                  <div className="text-2xl font-bold mt-1">
                    {balance !== null ? `${balance.toFixed(4)} APT` : 'Loading...'}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={fetchBalance} variant="outline" className="flex-1">
                <Zap className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              <Button onClick={handleDisconnect} variant="outline" className="flex-1">
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Not Connected State */}
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium text-yellow-800">Not Connected</div>
                  <div className="text-sm text-yellow-600">Connect wallet to unlock features</div>
                </div>
              </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" disabled={connecting}>
                  {connecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription>
                    Choose a wallet to connect to Lunoa
                  </DialogDescription>
                </DialogHeader>
                <WalletList onConnect={handleConnect} connecting={connecting} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Wallet Selection List Component
function WalletList({ 
  onConnect, 
  connecting 
}: { 
  onConnect: (walletName: string) => void;
  connecting: boolean;
}) {
  const { wallets } = useWallet();

  return (
    <div className="space-y-3">
      {wallets.map((wallet) => (
        <Button
          key={wallet.name}
          variant="outline"
          className="w-full h-auto p-4 flex items-center justify-start gap-3"
          onClick={() => onConnect(wallet.name)}
          disabled={connecting}
        >
          <img 
            src={wallet.icon} 
            alt={wallet.name} 
            className="w-8 h-8 rounded"
          />
          <div className="text-left">
            <div className="font-medium">{wallet.name}</div>
            <div className="text-sm text-muted-foreground">
              {wallet.name === 'Petra' ? 'Most popular Aptos wallet' : 
               wallet.name === 'Martian' ? 'Advanced features and tools' : 
               'Secure wallet for Aptos'}
            </div>
          </div>
          {connecting && <Loader2 className="h-4 w-4 ml-auto animate-spin" />}
        </Button>
      ))}
      
      <div className="text-center text-sm text-muted-foreground mt-4">
        Don't have a wallet? Download{' '}
        <a 
          href="https://petra.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Petra Wallet
        </a>
      </div>
    </div>
  );
}
