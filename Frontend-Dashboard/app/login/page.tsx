'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { SignInPage } from '@/components/ui/sign-in';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('rememberMe') === 'on';

    try {
      await login(email, password, rememberMe);
      toast.success('Welcome back! Login successful.');
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    // TODO: Implement password reset functionality
    toast.info('Password reset functionality coming soon!');
  };

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  // Sample testimonials for the right panel
  const testimonials = [
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'Sarah Chen',
      handle: '@sarahc',
      text: 'Lunoa has transformed how I explore my city. Found amazing local quests!',
    },
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'Alex Rodriguez',
      handle: '@alexr',
      text: 'The token rewards make every adventure worthwhile. Love this platform!',
    },
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'Maya Patel',
      handle: '@mayap',
      text: 'Connected with so many like-minded explorers. The community is amazing!',
    },
  ];

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen">
        <SignInPage
        title={<span className="font-light text-foreground tracking-tighter">Welcome Back</span>}
        description="Sign in to your Lunoa account and continue your adventure"
        heroImageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center"
        testimonials={testimonials}
        onSignIn={handleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Signing you in...</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
