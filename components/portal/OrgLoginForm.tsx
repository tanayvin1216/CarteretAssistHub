'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export function OrgLoginForm() {
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
      // Whether this account actually represents an organization is settled by
      // the portal layout, which turns anyone else around at the door.
      router.push('/portal');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('Sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      <div>
        <p className="text-sm font-semibold text-primary mb-1">Organization sign-in</p>
        <h2 className="text-2xl font-bold text-ink">Your listing, your roles</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full h-11 px-3.5 bg-surface border border-divider rounded-lg text-sm text-ink focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-60 shadow-sm"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
