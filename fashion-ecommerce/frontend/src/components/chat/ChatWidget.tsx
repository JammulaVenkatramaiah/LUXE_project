import React, { useState, useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client, over } from 'stompjs'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface ChatMessage {
  sender: string
  content: string
  type: 'CHAT' | 'JOIN' | 'LEAVE'
}

const ChatWidget = () => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typedMessage, setTypedMessage] = useState('')
  const [connected, setConnected] = useState(false)
  const stompClient = useRef<Client | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !connected) {
      connect()
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {})
      }
    }
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connect = () => {
    const socket = new SockJS('http://localhost:8080/ws')
    stompClient.current = over(socket)
    stompClient.current.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    setConnected(true)
    if (stompClient.current) {
      stompClient.current.subscribe('/topic/public', onMessageReceived)
      stompClient.current.send('/app/chat.addUser', {}, JSON.stringify({
        sender: user?.name || 'Guest',
        type: 'JOIN'
      }))
    }
  }

  const onError = (err: any) => {
    console.error('WebSocket Error:', err)
  }

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body)
    setMessages(prev => [...prev, message])
  }

  const QUICK_REPLIES = [
    { id: 'TRACK', text: '📦 Track My Order' },
    { id: 'RETURN', text: '🔄 Return/Refund' },
    { id: 'PROD', text: '👗 Product Inquiry' },
    { id: 'AGENT', text: '👤 Talk to Agent' }
  ]

  const handleQuickReply = (reply: typeof QUICK_REPLIES[0]) => {
    if (stompClient.current) {
      const chatMessage: ChatMessage = {
        sender: user?.name || 'Guest',
        content: `I need help with: ${reply.text}`,
        type: 'CHAT'
      }
      stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
      
      // Auto-bot response
      setTimeout(() => {
        const botResponse: ChatMessage = {
          sender: 'LUXE Bot',
          content: getBotResponse(reply.id),
          type: 'CHAT'
        }
        stompClient.current?.send('/app/chat.sendMessage', {}, JSON.stringify(botResponse))
      }, 500)
    }
  }

  const getBotResponse = (id: string) => {
    switch(id) {
      case 'TRACK': return 'To track your order, please go to "My Orders" in your profile and select the active order. You will find the real-time tracking link there.'
      case 'RETURN': return 'Our return policy is 30 days. You can initiate a return by selecting "Return Order" on your delivered orders. Refund is processed within 3-5 business days.'
      case 'PROD': return 'We source premium materials for all our collections. If you have specific questions about sizing, please check our Size Guide on the product page.'
      case 'AGENT': return 'Transferring you to a live agent... Please wait while we connect you to our next available support member.'
      default: return 'How else can I help you today?'
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (typedMessage.trim() && stompClient.current) {
      const chatMessage: ChatMessage = {
        sender: user?.name || 'Guest',
        content: typedMessage,
        type: 'CHAT'
      }
      stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage))
      setTypedMessage('')
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 group"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Live Chat</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-slate-900 w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-serif font-bold text-xl border border-slate-700">L</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base leading-none">LUXE Support</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Always Active</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.length === 0 && connected && (
              <div className="text-center py-8">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 inline-block">
                  <p className="text-sm font-medium mb-3">Welcome! How can we help today?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_REPLIES.map(reply => (
                      <button
                        key={reply.id}
                        onClick={() => handleQuickReply(reply)}
                        className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-3 py-2 rounded-full transition-all border border-slate-200 dark:border-slate-700 font-medium"
                      >
                        {reply.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === (user?.name || 'Guest') ? 'items-end' : 'items-start'}`}
              >
                {msg.type === 'JOIN' ? (
                  <span className="text-[10px] text-slate-400 italic w-full text-center py-2">
                    {msg.sender} joined the chat
                  </span>
                ) : (
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.sender === (user?.name || 'Guest')
                        ? 'bg-black text-white rounded-tr-none'
                        : msg.sender === 'LUXE Bot'
                          ? 'bg-blue-600 text-white rounded-tl-none font-medium'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none border border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-[10px] font-bold mb-1 opacity-70 uppercase tracking-tighter">
                      {msg.sender}
                    </p>
                    {msg.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {/* Quick Reply Bar (if not empty) */}
          {messages.length > 0 && (
            <div className="px-4 pb-2 bg-slate-50 dark:bg-slate-950/50 flex gap-2 overflow-x-auto no-scrollbar py-2 border-t border-slate-100 dark:border-slate-900">
               {QUICK_REPLIES.map(reply => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className="whitespace-nowrap text-[10px] bg-white dark:bg-slate-800 hover:bg-black hover:text-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 shadow-inner">
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Reply to LUXE Support..."
              className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 focus:ring-1 focus:ring-black outline-none"
            />
            <button
              type="submit"
              disabled={!typedMessage.trim()}
              className="bg-black text-white p-2.5 rounded-full hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatWidget
