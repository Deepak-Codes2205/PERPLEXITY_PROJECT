import React, { useState, useEffect } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useAuth } from '../hook/useAuth'
import { setError } from '../auth.slice'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  const error = useSelector((state) => state.auth.error)

  const { handleRegister } = useAuth()

  useEffect(() => {
    // Clear previous error on page load
    dispatch(setError(null))
  }, [dispatch])

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  // Calculate simple password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: 'bg-transparent' }
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) || /[A-Z]/.test(password)) score += 1

    if (score <= 1) return { level: 1, text: 'Weak', color: 'bg-[#f43f5e]' }
    if (score === 2) return { level: 2, text: 'Fair', color: 'bg-[#f59e0b]' }
    if (score === 3) return { level: 3, text: 'Good', color: 'bg-[#06b6d4]' }
    return { level: 4, text: 'Strong', color: 'bg-[#20c997]' }
  }

  const strength = getPasswordStrength()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username.trim() || !email.trim() || !password) return

    setSuccessMessage('')
    const ok = await handleRegister(username, email, password)
    if (ok) {
      setSuccessMessage('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1200)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0d0e11] text-[#f3f4f6] flex flex-col justify-between font-sans selection:bg-[#20c997] selection:text-[#0d0e11] overflow-x-hidden">
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, rgba(32, 201, 151, 0.08) 0%, rgba(6, 182, 212, 0.03) 40%, transparent 75%)',
        }}
      />

      {/* Top minimal header */}
      <header className="relative z-10 w-full px-6 sm:px-10 py-6 max-w-7xl mx-auto flex items-center justify-between">
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

        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
          <span>Already registered?</span>
          <Link
            to="/login"
            className="text-[#20c997] hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Main Canvas: Responsive Horizontal Flow on Large Displays */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="w-full max-w-md lg:max-w-4xl bg-[#15181e]/90 border border-[#232730] rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl overflow-hidden transition-all duration-300">
          <div className="flex flex-col lg:flex-row">
            {/* Left Column (Desktop Hero / Brand Showcase with Ample Breathing Space) */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#121419] to-[#181b22] border-b lg:border-b-0 lg:border-r border-[#232730] p-10 flex-col justify-between relative overflow-hidden">
              {/* Subtle ambient light pool in brand column */}
              <div
                className="absolute top-0 right-0 w-64 h-64 pointer-events-none rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(32, 201, 151, 0.12) 0%, transparent 70%)',
                }}
              />

              {/* Top brand header */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#1b1f27] border border-[#2d3340] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(32,201,151,0.22)]">
                  <svg
                    className="w-6 h-6 text-[#20c997]"
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
                <h2 className="text-2xl font-semibold text-white tracking-tight leading-snug">
                  Unlock the next generation of search.
                </h2>
                <p className="mt-3 text-sm text-[#9ca3af] leading-relaxed">
                  Join researchers, builders, and learners exploring knowledge without algorithmic noise.
                </p>
              </div>

              {/* Value propositions */}
              <div className="relative z-10 space-y-4 my-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#20c997]/10 border border-[#20c997]/20 flex items-center justify-center text-[#20c997] shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Unlimited Knowledge Threads</p>
                    <p className="text-[11px] text-[#808998] mt-0.5">Organize searches and collections seamlessly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#20c997]/10 border border-[#20c997]/20 flex items-center justify-center text-[#20c997] shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Custom AI Personas</p>
                    <p className="text-[11px] text-[#808998] mt-0.5">Tailor responses for code, writing, or analysis</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#20c997]/10 border border-[#20c997]/20 flex items-center justify-center text-[#20c997] shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">Privacy First</p>
                    <p className="text-[11px] text-[#808998] mt-0.5">Your research queries remain confidential</p>
                  </div>
                </div>
              </div>

              {/* Bottom Quote / Badge */}
              <div className="relative z-10 pt-4 border-t border-[#232730]/70 flex items-center justify-between text-xs text-[#808998]">
                <span>Free to get started</span>
                <span className="font-mono text-[#20c997]">v2.5</span>
              </div>
            </div>

            {/* Right Column: Registration Form (with Ample Breathing Space) */}
            <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              {/* Mobile emblem (only visible on small screens) */}
              <div className="lg:hidden text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#1a1e27] border border-[#2d3340] mb-3 shadow-[0_0_20px_rgba(32,201,151,0.18)]">
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
              </div>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-[26px] font-semibold text-white tracking-tight">
                  Create an account
                </h1>
                <p className="mt-1.5 text-sm text-[#9ca3af]">
                  Use your details to start using Perplexity.
                </p>
              </div>

              {/* Segmented Switcher Tab */}
              <div className="flex items-center p-1 bg-[#0f1115] rounded-xl border border-[#232730] mb-6 text-sm">
                <Link
                  to="/login"
                  className="flex-1 py-1.5 text-center font-medium rounded-lg text-[#9ca3af] hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  className="flex-1 py-1.5 text-center font-medium rounded-lg bg-[#1f242d] text-[#20c997] shadow-sm transition-all cursor-default"
                >
                  Create Account
                </button>
              </div>

              {/* Success Banner */}
              {successMessage && (
                <div className="mb-5 p-3 rounded-lg bg-[#0e2a22]/90 border border-[#20c997]/30 text-[#4de6b1] text-xs flex items-center gap-2 animate-fadeIn">
                  <svg className="w-4 h-4 shrink-0 text-[#20c997]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

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

              {/* Register Form: Username, email, password */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Horizontal flow for Username & Email on sm/md viewports */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Username Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="block text-xs font-medium text-[#9ca3af]">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="username"
                        className="w-full h-11 pl-10 pr-3.5 bg-[#101217] border border-[#2a2f3a] rounded-xl text-sm text-white placeholder-[#4b5563] outline-none transition-all duration-200 focus:border-[#20c997] focus:ring-2 focus:ring-[#20c997]/20"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-medium text-[#9ca3af]">
                      Email address
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
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-[#9ca3af]">
                    Password
                  </label>
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
                      placeholder="Min. 8 characters"
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

                  {/* Minimal Password Strength Meter */}
                  {password && (
                    <div className="pt-1.5 space-y-1">
                      <div className="flex gap-1.5 h-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              strength.level >= step ? strength.color : 'bg-[#232730]'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
                        <span>Password complexity</span>
                        <span className="font-medium text-[#9ca3af]">{strength.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-3 rounded-full bg-[#20c997] text-[#0d0e11] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#1db889] hover:shadow-[0_0_20px_rgba(32,201,151,0.3)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-[#0d0e11]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#20c997] hover:underline ml-1">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-6 sm:px-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6b7280]">
        <div className="flex items-center gap-2">
          <span>© 2025 Perplexity AI, Inc.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20c997] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20c997]" />
          </span>
          <span className="text-[#9ca3af]">All Systems Operational</span>
        </div>
      </footer>
    </div>
  )
}

export default Register