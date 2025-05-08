"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Maximize2, Minimize2, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  userRole: "buyer" | "group" | "admin" | "farmer" | "transporter" | "grader"
  contextualHints?: string[]
}

export function AIAssistant({ userRole, contextualHints = [] }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initial greeting based on user role
  useEffect(() => {
    const initialGreeting = getInitialGreeting(userRole)
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: initialGreeting,
        timestamp: new Date(),
      },
    ])
  }, [userRole])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const getInitialGreeting = (role: string) => {
    switch (role) {
      case "buyer":
        return "Hello! I'm your Akulima AI assistant. I can help you create market requests, evaluate bids, and understand market prices. What would you like help with today?"
      case "group":
        return "Hello! I'm your Akulima AI assistant. I can help you find market opportunities, improve your bids, and manage your group. How can I assist you today?"
      case "farmer":
        return "Hello! I'm your Akulima AI assistant. I can help you understand market prices, find the best groups to join, and optimize your produce quality. What questions do you have?"
      default:
        return "Hello! I'm your Akulima AI assistant. How can I help you today?"
    }
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(
      () => {
        const aiResponse = generateAIResponse(input, userRole, contextualHints)
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    ) // Random delay between 1-3 seconds
  }

  const generateAIResponse = (query: string, role: string, contextualHints: string[]) => {
    // This is a mock function that would be replaced with actual AI in production
    const lowerQuery = query.toLowerCase()

    // Role-specific responses
    if (role === "buyer") {
      if (lowerQuery.includes("price") || lowerQuery.includes("fair")) {
        return "Our AI analyzes historical price data, seasonality, and market conditions to suggest fair prices. The green badge indicates a fair price that benefits both you and farmers. You can always adjust the price based on your specific requirements."
      }
      if (lowerQuery.includes("bid") || lowerQuery.includes("rank")) {
        return "When evaluating bids, our AI considers multiple factors: price competitiveness (35%), group rating (20%), reliability history (20%), distance (15%), and photo quality (10%). Groups with Trust Tokens have consistently delivered quality produce on time."
      }
      if (lowerQuery.includes("request") || lowerQuery.includes("rfq")) {
        return "To create an effective market request, be specific about quality requirements and provide clear delivery instructions. Our AI will suggest a fair market price based on current trends. Consider setting a reasonable deadline to get more competitive bids."
      }
    }

    if (role === "group") {
      if (lowerQuery.includes("improve") || lowerQuery.includes("bid")) {
        return "To improve your bid success rate: 1) Include high-quality photos of your produce, 2) Ensure competitive pricing (within 10% of the suggested fair price), 3) Maintain high reliability by fulfilling orders on time, and 4) Provide detailed notes about your produce quality."
      }
      if (lowerQuery.includes("trust") || lowerQuery.includes("token")) {
        return "Trust Tokens are awarded after successfully completing 5 orders. They increase your visibility to buyers and improve your AI ranking score. Each token represents a verified successful transaction recorded on the blockchain."
      }
      if (lowerQuery.includes("payment") || lowerQuery.includes("distribution")) {
        return "Payment distribution is handled automatically through our blockchain-based smart contracts. Each member's contribution is recorded, verified, and payments are distributed proportionally. The system ensures transparency and prevents disputes."
      }
    }

    // Generic responses
    if (lowerQuery.includes("blockchain") || lowerQuery.includes("smart contract")) {
      return "Our blockchain integration ensures transparency and trust in the marketplace. Every transaction, from farmer contributions to final payments, is recorded immutably. This creates a verifiable supply chain that buyers can audit through the 'Verified Trace' feature."
    }

    if (lowerQuery.includes("ai") || lowerQuery.includes("artificial intelligence")) {
      return "Akulima uses AI to make agricultural trading more fair and efficient. Our AI helps suggest fair prices, rank bids based on multiple factors, predict market trends, and provide personalized assistance to all platform users."
    }

    // Default responses based on contextual hints if available
    if (contextualHints.length > 0) {
      const randomHint = contextualHints[Math.floor(Math.random() * contextualHints.length)]
      return `${randomHint} Is there anything specific about this you'd like to know?`
    }

    // Fallback response
    return (
      "I understand you're asking about " +
      query.substring(0, 30) +
      "... To give you the best answer, could you provide a bit more detail about what you're looking for?"
    )
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  if (!isOpen) {
    return (
      <Button onClick={toggleOpen} className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
        <Bot className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed right-4 bottom-4 z-50 flex flex-col rounded-lg border bg-background shadow-xl transition-all duration-200",
        isMinimized ? "h-14 w-64" : "h-[500px] w-[350px] sm:w-[400px]",
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-medium">Akulima AI Assistant</span>
          <Badge className="bg-primary/20 text-primary text-xs">Beta</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8">
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleOpen} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      {!isMinimized && (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex items-start gap-3", message.role === "assistant" ? "flex-row" : "flex-row-reverse")}
              >
                <Avatar className={message.role === "assistant" ? "bg-primary/20" : "bg-muted"}>
                  <AvatarFallback>
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[85%]",
                    message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="bg-primary/20">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-3 py-2 bg-muted">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input area */}
      {!isMinimized && (
        <div className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Akulima AI
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Missing Badge component
function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  )
}
