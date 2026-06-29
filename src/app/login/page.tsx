"use client";
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('salesperson@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) setError(res.error);
    else window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm">Email</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input className="mt-1 w-full border rounded px-3 py-2" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
