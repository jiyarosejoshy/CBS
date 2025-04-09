'use client'

import { useState } from 'react'
import { supabase } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error('Signup error:', error.message)
      setError(error.message)
    } else {
      alert('Check your email to confirm signup!')
    }
  }

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Login error:', error.message)
      setError(error.message)
    } else {
      alert('Login successful!')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login / Sign up</h1>
      <input
        className="border p-2 mb-2 w-full"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <button onClick={handleLogin} className="bg-green-600 text-white px-4 py-2 rounded">
          Login
        </button>
        <button onClick={handleSignup} className="bg-blue-600 text-white px-4 py-2 rounded">
          Sign up
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
