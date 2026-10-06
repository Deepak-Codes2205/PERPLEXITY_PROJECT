import React, { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../hook/useAuth'
import { setError } from '../auth.slice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  const { handleLogin } = useAuth()

  useEffect(() => {
    // Clear any previous error when entering login page
    dispatch(setError(null))
  }, [dispatch])

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim() || !password) return
    await handleLogin(email, password)
  }

  return (
    <div className="relative min-h-screen bg-[#0d0e11] text-[#f3f4f6] flex flex-col justify-between font-sans selection:bg-[#20c997] selection:text-[#0d0e11] overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 25%, rgba(32, 201, 151, 0.08) 0%, rgba(6, 182, 212, 0.03) 35%, transparent 70%)',
        }}
      />

      {/* Top minimal bar */}
      <header className="relative z-10 w-full px-6 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#f3f4f6] hover:opacity-90 transition-opacity"
        >
          {/* Perplexity Asterism Emblem */}
          <div className="w-8 h-8 rounded-lg bg-[#15181e] border border-[#232730] flex items-center justify-center shadow-[0_0_12px_rgba(32,201,151,0.2)]">
            <svg
              className="w-4 h-4 text-[#20c997]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-lg text-white">Perplexity</span>
        </Link>
      </header>

      {/* Centered Auth Card with ample breathing space */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:py-16">
        <div className="w-full max-w-[420px] bg-[#15181e]/90 border border-[#232730] rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
          {/* Brand header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a1e27] border border-[#2d3340] mb-4 shadow-[0_0_20px_rgba(32,201,151,0.18)]">
              <svg
                className="w-6 h-6 text-[#20c997]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="2" x2="12" y2="22" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-[#9ca3af]">
              Enter your details to access your account
            </p>
          </div>

          {/* Segmented Switcher Tab */}
          <div className="flex items-center p-1 bg-[#0f1115] rounded-xl border border-[#232730] mb-6 text-sm">
            <button
              type="button"
              className="flex-1 py-1.5 text-center font-medium rounded-lg bg-[#1f242d] text-[#20c997] shadow-sm transition-all"
            >
              Sign In
            </button>
            <Link
              to="/register"
              className="flex-1 py-1.5 text-center font-medium rounded-lg text-[#9ca3af] hover:text-white transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-[#2a1419]/90 border border-[#f43f5e]/30 text-[#ffb4ab] text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#f43f5e] shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => dispatch(setError(null))}
                className="text-[#ffb4ab]/70 hover:text-[#ffb4ab] ml-2 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-medium text-[#9ca3af]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@domain.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-[#101217] border border-[#2a2f3a] rounded-xl text-sm text-white placeholder-[#4b5563] outline-none transition-all duration-200 focus:border-[#20c997] focus:ring-2 focus:ring-[#20c997]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium text-[#9ca3af]">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-[#101217] border border-[#2a2f3a] rounded-xl text-sm text-white placeholder-[#4b5563] outline-none transition-all duration-200 focus:border-[#20c997] focus:ring-2 focus:ring-[#20c997]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6b7280] hover:text-[#9ca3af] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-full bg-[#20c997] text-[#0d0e11] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1db889] hover:shadow-[0_0_20px_rgba(32,201,151,0.3)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-[#0d0e11]" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Bottom helper */}
          <div className="mt-6 pt-5 border-t border-[#232730] text-center">
            <p className="text-xs text-[#9ca3af]">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-[#20c997] hover:underline ml-1">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-6 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7280]">
        <div className="flex items-center gap-2">
          <span>© 2025 Perplexity AI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20c997] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20c997]" />
          </span>
          <span className="text-[#9ca3af]">Systems Operational</span>
        </div>
      </footer>
    </div>
  )
}

export default Login