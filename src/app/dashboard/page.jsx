'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/utils';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user ? (
        <p>Hi, {user.email}</p>
      ) : (
        <p>Please <a href="/login" className="text-blue-600 underline">login</a></p>
      )}
    </div>
  );
}
