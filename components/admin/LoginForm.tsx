'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success('Signed in.');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-text mb-2">
          · Admin sign-in
        </p>
        <h2 className="font-display text-3xl text-ink leading-tight">
          Welcome back.
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.18em] text-muted-text mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full h-11 px-4 bg-card border border-rule/60 rounded-sm text-sm text-ink focus:outline-none focus:border-ink"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-ink text-ivory text-sm font-medium rounded-full hover:bg-navy transition-colors disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-xs text-muted-text text-center">
        Accounts are managed by the county community-service committee.
      </p>
    </form>
  );
}
