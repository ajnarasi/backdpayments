"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, User, Loader2, MessageSquare, Sparkles } from "lucide-react";
import type { CollectionCase, Buyer, Invoice, NetworkEdge, NetworkInsight } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AgentChatProps {
  collectionCase: CollectionCase;
  buyer: Buyer | null;
  invoices: Invoice[];
  networkEdges: NetworkEdge[];
  networkInsights: NetworkInsight[];
  sellers: { id: string; name: string }[];
}

const SUGGESTED_QUESTIONS = [
  "What's driving this buyer's risk level?",
  "Should we offer a payment plan or escalate?",
  "What does the network data tell us?",
  "How should we approach this case differently?",
];

export function AgentChat({
  collectionCase,
  buyer,
  invoices,
  networkEdges,
  networkInsights,
  sellers,
}: AgentChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLive, setIsLive] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const networkContext = {
    edges: networkEdges
      .filter((e) => e.source === buyer?.id || e.target === buyer?.id)
      .map((e) => {
        const sellerId = e.source === buyer?.id ? e.target : e.source;
        const seller = sellers.find((s) => s.id === sellerId);
        return {
          sellerName: seller?.name ?? sellerId,
          volume: e.volume,
          onTimeRate: e.onTimeRate,
          avgPaymentDays: e.avgPaymentDays,
        };
      }),
    insights: networkInsights
      .filter((i) => buyer && i.affectedNodes.includes(buyer.id))
      .map((i) => ({ title: i.title, description: i.description })),
  };

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming || !buyer) return;

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          buyer,
          collectionCase,
          invoices,
          networkContext,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);
          try {
            const event = JSON.parse(jsonStr);
            if (event.type === "metadata") {
              setIsLive(event.isLive);
            } else if (event.type === "content_block_delta" && event.text) {
              assistantText += event.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        {
          role: "assistant",
          content: "I encountered an error analyzing this case. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  if (messages.length === 0) {
    return (
      <Card className="border-2 border-dashed border-[#ff6b1a]/20 bg-[#161616]">
        <CardContent className="py-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff6b1a]/10">
              <MessageSquare className="h-6 w-6 text-[#ff6b1a]" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-white">
              Chat with CollectIQ Agent
            </h3>
            <p className="mt-1 text-xs text-[#9ca3af] max-w-xs">
              Ask questions about this case. The agent analyzes behavioral
              signals, network data, and collection history in real-time.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isStreaming || !buyer}
                  className="rounded-full border border-[#262626] bg-[#1c1c1c] px-3 py-1.5 text-xs text-[#9ca3af] transition-colors hover:border-[#ff6b1a]/30 hover:text-[#ff6b1a] disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[#ff6b1a]/30 bg-[#161616] flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-[#ff6b1a]">
            <MessageSquare className="h-4 w-4" />
            Agent Chat
          </CardTitle>
          {isLive !== null && (
            isLive ? (
              <Badge className="bg-[#ff6b1a] text-white text-[10px]">
                LIVE CLAUDE
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] border-[#f59e0b] text-[#f59e0b]">
                DEMO MODE
              </Badge>
            )
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6b1a]/10 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-[#ff6b1a]" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-[#ff6b1a] text-white"
                    : "bg-[#1c1c1c] border border-[#262626] text-[#d1d5db]"
                }`}
              >
                {msg.content || (
                  <span className="flex items-center gap-1.5 text-[#ff6b1a]">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing...
                  </span>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#262626] mt-0.5">
                  <User className="h-3.5 w-3.5 text-[#9ca3af]" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {messages.length >= 2 && !isStreaming && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Tell me more", "What about payment plans?", "Network risk?"].map(
              (q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="flex items-center gap-1 rounded-full border border-[#262626] bg-[#1c1c1c] px-2.5 py-1 text-[10px] text-[#9ca3af] transition-colors hover:border-[#ff6b1a]/30 hover:text-[#ff6b1a]"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {q}
                </button>
              )
            )}
          </div>
        )}

        <div className="flex items-end gap-2 pt-1 shrink-0">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this case..."
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none rounded-lg border border-[#262626] bg-[#1c1c1c] px-3 py-2 text-xs text-white placeholder:text-[#6b7280] focus:border-[#ff6b1a] focus:outline-none focus:ring-1 focus:ring-[#ff6b1a] disabled:opacity-50"
          />
          <Button
            size="sm"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="h-8 w-8 rounded-lg bg-[#ff6b1a] p-0 hover:bg-[#ff7f33] disabled:opacity-50"
          >
            {isStreaming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
