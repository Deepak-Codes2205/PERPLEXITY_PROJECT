import React, { useState } from 'react'
import { Link } from 'react-router-dom'
//import { useAuth } from '../hook/useAuth'


const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //const { handleRegister } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    //handleRegister(username, email, password)
    console.log('Register submit:', { username, email, password })
    //add actual registration logic here
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-[2rem] border border-[#31b8c6]/20 bg-slate-950/95 p-8 shadow-2xl shadow-[#31b8c6]/20 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#31b8c6]">Create account</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Register a new account</h1>
          <p className="mt-2 text-sm text-slate-400">Use your details to start using the app.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-slate-200">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-[#31b8c6] focus:ring-4 focus:ring-[#31b8c6]/20"
              placeholder="Your username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-[#31b8c6] focus:ring-4 focus:ring-[#31b8c6]/20"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-[#31b8c6] focus:ring-4 focus:ring-[#31b8c6]/20"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#31b8c6] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#31b8c6]/30"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#31b8c6] hover:text-white">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
