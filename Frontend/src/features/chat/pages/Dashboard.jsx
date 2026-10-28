import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { setCurrentChatId } from '../chat.slice'
import remarkGfm from 'remark-gfm'

/**
 * Dashboard Page - Main Chat Interface for the AI Chat Application
 * Designed with QueryMind dark theme: #0d0e11 background, #15181e cards, and #20c997 (mint/teal) accents.
 * 
 * Features:
 * 1. Left sidebar: List of previous chats, New Chat button, and user profile
 * 2. Main chat area: Interactive conversation feed with Markdown & Code formatting
 * 3. Bottom dock: Sleek input bar with glow focus effects
 * 4. Starter prompts: Helpful query chips when starting a fresh chat
 */
const Dashboard = () => {
  const dispatch = useDispatch()
  const chat = useChat()

  // Local state
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer toggle
  const messagesEndRef = useRef(null)

  // Redux state
  const chats = useSelector((state) => state.chat.chats || {})
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const authUser = useSelector((state) => state.auth.user)

  // Extract logged-in user details (supports nested user object from backend)
  const user = authUser?.user || authUser
  const username = user?.username || (user?.email ? user.email.split('@')[0] : 'Explorer')
  const email = user?.email || 'Active Session'

  // Current chat messages (safe fallback if messages array is empty or differently keyed)
  const currentChat = currentChatId ? chats[currentChatId] : null
  const messages = currentChat?.messages || currentChat?.message || []

  // Initialize socket and fetch chats on mount
  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  // Auto-scroll to the latest message whenever messages change or when waiting for AI
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Handle sending a message
  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  // Open an existing chat from the sidebar
  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false) // Close sidebar on mobile after selecting
  }

  // Start a new chat thread
  const handleNewChat = () => {
    dispatch(setCurrentChatId(null))
    setSidebarOpen(false)
  }

  // Quick starter prompts for empty state
  const starterPrompts = [
    { title: 'Explain MERN Stack', query: 'Explain how MongoDB, Express, React, and Node.js work together in simple terms.' },
    { title: 'Redux vs Context', query: 'What is the main difference between Redux Toolkit and React Context API?' },
    { title: 'Async/Await in JS', query: 'How does async/await work behind the scenes in JavaScript with examples?' },
    { title: 'Debug REST API', query: 'What are the best practices for handling errors in an Express REST API?' },
  ]

  return (
    <div className="relative h-screen w-full bg-[#0d0e11] text-[#f3f4f6] flex overflow-hidden font-sans selection:bg-[#20c997] selection:text-[#0d0e11]">
      {/* Ambient background glow matching Login/Register theme */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 12%, rgba(32, 201, 151, 0.08) 0%, rgba(6, 182, 212, 0.03) 40%, transparent 75%)',
        }}
      />

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      {/* ========================================================= */}
      {/* LEFT SIDEBAR: Chat History & User Profile                */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[#0d0e11] md:bg-transparent border-r border-[#232730] flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top Header / App Branding */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* QueryMind Asterism Emblem */}
            <div className="w-8 h-8 rounded-lg bg-[#15181e] border border-[#232730] flex items-center justify-center shadow-[0_0_12px_rgba(32,201,151,0.2)] shrink-0">
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
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-white text-base">QUERYMIND</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#20c997]/10 text-[#20c997] border border-[#20c997]/25">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#808998]">Conversational Engine</p>
            </div>
          </div>

          {/* Close Sidebar button on mobile */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a1e27] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Action: New Chat Thread */}
        <div className="p-3">
          <button
            type="button"
            onClick={handleNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#181b22] hover:bg-[#1f242d] border border-[#2d3340] hover:border-[#20c997]/50 text-white font-medium text-sm transition-all duration-200 shadow-sm group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-[#20c997]/10 border border-[#20c997]/20 flex items-center justify-center text-[#20c997] group-hover:scale-110 transition-transform">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <span>New Thread</span>
            </div>
            <span className="text-[11px] font-mono text-[#808998] bg-[#121419] px-1.5 py-0.5 rounded border border-[#232730]">
              +
            </span>
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="flex items-center justify-between px-2 py-1 mb-1">
            <span className="text-[11px] font-semibold text-[#808998] tracking-wider uppercase">
              Recent Chats
            </span>
            <span className="text-[10px] text-[#808998] font-mono">
              {Object.keys(chats).length}
            </span>
          </div>

          {Object.values(chats).length === 0 ? (
            <div className="px-3 py-8 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-[#15181e] border border-[#232730] flex items-center justify-center text-[#6b7280] mb-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p className="text-xs text-[#9ca3af]">No conversations yet</p>
              <p className="text-[11px] text-[#6b7280] mt-0.5">Start a new thread to begin</p>
            </div>
          ) : (
            Object.values(chats).map((chatItem) => {
              const isActive = chatItem.id === currentChatId
              return (
                <button
                  key={chatItem.id}
                  onClick={() => openChat(chatItem.id)}
                  type="button"
                  className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 cursor-pointer ${isActive
                    ? 'bg-[#1f242d] text-white border border-[#20c997]/40 shadow-[0_0_15px_rgba(32,201,151,0.08)]'
                    : 'text-[#9ca3af] hover:text-white hover:bg-[#181b22] border border-transparent'
                    }`}
                >
                  <svg
                    className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#20c997]' : 'text-[#6b7280] group-hover:text-[#9ca3af]'
                      }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="truncate flex-1 font-normal">
                    {chatItem.title || 'Untitled Chat'}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#20c997] shadow-[0_0_6px_#20c997]" />
                  )}
                </button>
              )
            })
          )}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 bg-transparent">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#15181e] border border-[#232730]">
            {/* User Avatar with Initials */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#20c997]/20 to-[#06b6d4]/20 border border-[#20c997]/30 flex items-center justify-center text-[#20c997] font-semibold text-sm shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-white truncate">{username}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#20c997]" title="Online" />
              </div>
              <p className="text-[11px] text-[#808998] truncate">{email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CHAT AREA: Top Bar, Conversation, Bottom Input       */}
      {/* ========================================================= */}
      <main className="relative z-10 flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 px-4 sm:px-6 flex items-center justify-between bg-transparent shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1a1e27] border border-[#232730] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Current Active Thread Title */}
            <div className="flex items-center gap-2 truncate">
              <h2 className="text-sm font-medium text-white truncate">
                {currentChat?.title || 'New Search & Intelligence Thread'}
              </h2>
            </div>
          </div>

          {/* Right Header Status / Mode */}
          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15181e] border border-[#232730] text-[#9ca3af]">
              <span className="w-2 h-2 rounded-full bg-[#20c997] animate-pulse" />
              <span className="text-[11px] font-mono text-[#20c997]">Pro Search</span>
            </div>
          </div>
        </header>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Empty State / Welcome Screen when no messages in thread */}
          {messages.length === 0 ? (
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-center items-center text-center py-12">
              {/* Emblem Glow */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#15181e] border border-[#232730] flex items-center justify-center shadow-[0_0_30px_rgba(32,201,151,0.25)]">
                  <svg
                    className="w-8 h-8 text-[#20c997]"
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
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-2">
                Where knowledge begins.
              </h1>
              <p className="text-sm text-[#9ca3af] max-w-md leading-relaxed mb-8">
                Ask questions, explore complex topics, or debug code with conversational intelligence.
              </p>

              {/* Starter Query Suggestions */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {starterPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setChatInput(prompt.query)}
                    className="p-3.5 rounded-xl bg-[#15181e]/80 hover:bg-[#1a1f29] border border-[#232730] hover:border-[#20c997]/40 text-left transition-all duration-200 group cursor-pointer"
                  >
                    <p className="text-xs font-semibold text-white group-hover:text-[#20c997] transition-colors flex items-center justify-between">
                      <span>{prompt.title}</span>
                      <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[#20c997]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </p>
                    <p className="text-[11px] text-[#808998] mt-1 line-clamp-2 leading-relaxed">
                      {prompt.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Message List */
            <div className="max-w-6xl xl:max-w-7xl mx-auto space-y-6 pb-28">
              {messages.map((message, index) => {
                const isUser = message.role === 'user'

                return (
                  <div
                    key={message.id || index}
                    className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start w-full'}`}
                  >
                    {/* AI Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-[#15181e] border border-[#232730] flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(32,201,151,0.15)] mt-1">
                        <svg
                          className="w-4 h-4 text-[#20c997]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                        </svg>
                      </div>
                    )}

                    {/* Message Card */}
                    <div
                      className={`rounded-2xl px-4 py-3.5 text-sm sm:text-[15px] leading-relaxed bg-transparent ${isUser
                        ? 'max-w-[95%] sm:max-w-[88%] border border-[#2d3748] text-[#f3f4f6] rounded-tr-sm'
                        : 'flex-1 min-w-0 border-none text-[#e5e7eb] rounded-tl-sm'
                        }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="prose prose-invert max-w-none text-sm sm:text-[15px]">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-2.5 last:mb-0 text-[#e2e8f0] leading-relaxed">{children}</p>,
                              ul: ({ children }) => <ul className="mb-2.5 list-disc pl-5 space-y-1 text-[#d1d5db]">{children}</ul>,
                              ol: ({ children }) => <ol className="mb-2.5 list-decimal pl-5 space-y-1 text-[#d1d5db]">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                              a: ({ href, children }) => (
                                <a href={href} target="_blank" rel="noreferrer" className="text-[#20c997] hover:underline font-medium">
                                  {children}
                                </a>
                              ),
                              code: ({ inline, children }) =>
                                inline ? (
                                  <code className="rounded bg-[#1b1f27] border border-[#2d3340] px-1.5 py-0.5 font-mono text-xs text-[#20c997]">
                                    {children}
                                  </code>
                                ) : (
                                  <code className="font-mono text-xs text-[#20c997]">{children}</code>
                                ),
                              pre: ({ children }) => (
                                <pre className="my-3 overflow-x-auto rounded-xl bg-[#0a0c10] border border-[#232730] p-3.5 font-mono text-xs leading-normal shadow-inner">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-lg bg-[#20c997]/15 border border-[#20c997]/30 flex items-center justify-center shrink-0 text-[#20c997] font-semibold text-xs mt-1">
                        {username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Waiting for response typing state */}
              {isLoading && (
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#15181e] border border-[#232730] flex items-center justify-center shrink-0 text-[#20c997]">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <line x1="12" y1="2" x2="12" y2="6" />
                      <line x1="12" y1="18" x2="12" y2="22" />
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                      <line x1="2" y1="12" x2="6" y2="12" />
                      <line x1="18" y1="12" x2="22" y2="12" />
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                    </svg>
                  </div>
                  <div className="bg-transparent border border-[#232730] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                    <span className="text-xs text-[#9ca3af]">QueryMind is searching and thinking</span>
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20c997] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20c997] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20c997] animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible anchor to scroll into view */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* BOTTOM INPUT DOCK                                        */}
        {/* ========================================================= */}
        <div className="relative shrink-0 p-4 sm:p-6 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/95 to-transparent">
          <div className="max-w-6xl xl:max-w-7xl mx-auto">
            <form
              onSubmit={handleSubmitMessage}
              className="relative bg-[#15181e] border border-[#232730] rounded-2xl shadow-2xl focus-within:border-[#20c997] focus-within:shadow-[0_0_20px_rgba(32,201,151,0.2)] transition-all duration-200"
            >
              <div className="flex items-center px-4 py-3 gap-2">
                {/* Search / Brain Icon */}
                <div className="text-[#6b7280]">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>

                {/* Main Text Input */}
                <input
                  type="text"
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder="Ask anything, search topics or debug code..."
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-[#6b7280] outline-none border-none py-1"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isLoading}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${chatInput.trim() && !isLoading
                    ? 'bg-[#20c997] text-[#0d0e11] hover:bg-[#1ab887] shadow-[0_0_12px_rgba(32,201,151,0.35)] scale-100'
                    : 'bg-[#1b1f27] text-[#4b5563] cursor-not-allowed scale-95'
                    }`}
                  title="Send message"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>

              {/* Bottom Subtle Micro-Footer */}
              <div className="px-4 pb-2.5 pt-1 flex items-center justify-between text-[11px] text-[#6b7280] border-t border-[#232730]/50">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20c997]/70" />
                  <span>QueryMind Synthesized Intelligence</span>
                </span>
                <span className="hidden sm:inline">Press Enter ↵ to send</span>
              </div>
            </form>

            <p className="text-[11px] text-center text-[#6b7280] mt-2">
              QueryMind can generate inaccurate information. Always verify important facts.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard