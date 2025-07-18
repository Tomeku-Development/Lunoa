'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth/auth-guard';
import { SignUpPage } from '@/components/ui/sign-up';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function SignUpPageComponent() {
  const router = useRouter();
  const { register } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get('fullName') as string;
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const agreeToTerms = formData.get('agreeToTerms') === 'on';

    // Client-side validation
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        fullName,
        username,
        email,
        password,
      });
      toast.success('Account created successfully! Welcome to Lunoa!');
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Google OAuth not implemented as per user requirements
    toast.info('Google sign-up is not available. Please use email registration.');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  // Sample testimonials for the right panel
  const testimonials = [
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'Jamie Wilson',
      handle: '@jamiew',
      text: 'Just started my Lunoa journey and already discovered 3 hidden gems in my neighborhood!',
    },
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'David Kim',
      handle: '@davidk',
      text: 'The quest system is addictive! Earned my first 100 tokens this week.',
    },
    {
      avatarSrc: '/api/placeholder/40/40',
      name: 'Emma Thompson',
      handle: '@emmat',
      text: 'Love how Lunoa connects me with other adventurers. Made some great friends!',
    },
  ];

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen">
        <SignUpPage
        title={<span className="font-light text-foreground tracking-tighter">Join Lunoa</span>}
        description="Create your account and start exploring the world around you"
        heroImageSrc="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=1200&fit=crop&crop=center"
        testimonials={testimonials}
        onSignUp={handleSignUp}
        onGoogleSignUp={handleGoogleSignUp}
        onSignIn={handleSignIn}
      />
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Creating your account...</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
