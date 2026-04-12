"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { createMessageProcessor } from "../a2ui/rendering/processor";
import { Renderer } from "../a2ui/rendering/renderer";
import type { AnyComponentNode } from "../a2ui/types";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/utils";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  BotIcon,
  SparklesIcon,
  CopyIcon,
  ThumbsUpIcon,
  TrashIcon,
  RotateCcwIcon,
} from "lucide-react";
import { ChatInput } from "./ChatInput";
import { TSharedUser } from "@/modules/shared/types";

const processor = createMessageProcessor();

interface IChatProps {
  user: TSharedUser;
}

export default function Chat({ user }: IChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const { messages, status, sendMessage, error, stop, regenerate } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/a2ui",
    }),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseUI = (text: string): AnyComponentNode | null => {
    try {
      return JSON.parse(text) as AnyComponentNode;
    } catch {
      return null;
    }
  };

  const handleCopy = (text: string, messageId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleLike = (messageId: string) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleDelete = (messageId: string) => {
    // Implement delete functionality
    console.log("Delete message:", messageId);
  };

  // Suggested prompts for empty state
  // const suggestedPrompts = [
  //   { icon: "🎨", text: "Create a dashboard UI" },
  //   { icon: "📊", text: "Build a data table" },
  //   { icon: "🎯", text: "Design a form" },
  //   { icon: "✨", text: "Generate card layout" },
  //   { icon: "🔥", text: "Create widgets" },
  //   { icon: "🚀", text: "Build navigation" },
  // ];

  const suggestedPrompts = [
    { icon: "🩺", text: "Check my symptoms" },
    { icon: "💊", text: "Explain this medication" },
    { icon: "🧪", text: "Explain my test report" },
    { icon: "📋", text: "Prepare for doctor visit" },
    { icon: "❤️", text: "Health tips" },
  ];

  const handleSuggestedPrompt = (text: string) => {
    sendMessage({ text });
  };

  return (
    <div className="h-[calc(100vh-152px)] flex flex-col">
      {messages.length === 0 ? (
        // Centered Empty State
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-3xl w-full flex flex-col items-center gap-6">
            {/* Welcome Message */}
            <div className="text-start space-y-4 w-full">
              <div className="flex items-center justify-start gap-2 text-muted-foreground">
                <SparklesIcon className="size-6" />
                <span className="text-lg">Hi {user.name}</span>
              </div>
              <h1 className="text-4xl font-medium">Where should we start?</h1>
            </div>

            {/* Chat Input */}
            <div className="w-full">
              <ChatInput
                onSubmit={(message: { text: string; files: any[] }) => {
                  if (message.text.trim()) {
                    sendMessage({ text: message.text });
                  }
                }}
                onStop={stop}
                isStreaming={status === "streaming"}
                disabled={status === "streaming"}
              />
            </div>

            {/* Suggested Prompts */}
            <div className="w-full flex flex-wrap gap-4 justify-center">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt.text)}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors text-sm"
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Normal Chat View
        <>
          <Conversation className="flex-1">
            <ConversationContent className="p-4">
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  from={msg.role}
                  className="animate-in fade-in-50 duration-500"
                >
                  <MessageContent
                    className={
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-lg p-3"
                        : "text-foreground"
                    }
                  >
                    {msg.parts.map((part, index) => {
                      if (part.type !== "text") return null;

                      if (msg.role === "user") {
                        return (
                          <MessageResponse
                            key={`${msg.id}-${index}`}
                            className="whitespace-pre-wrap"
                          >
                            {part.text}
                          </MessageResponse>
                        );
                      }

                      const ui = parseUI(part.text);

                      return (
                        <div key={`${msg.id}-${index}`} className="my-2">
                          {ui ? (
                            <Renderer
                              processor={processor}
                              surfaceId={`chat-surface-${msg.id}-${index}`}
                              component={ui}
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </MessageContent>

                  {/* Message Actions Footer for AI responses */}
                  {msg.role === "assistant" && status !== "streaming" && (
                    <MessageActions className="opacity-50 hover:opacity-100 transition-opacity">
                      <MessageAction
                        tooltip="Copy"
                        onClick={() => {
                          const text = msg.parts
                            .filter((p) => p.type === "text")
                            .map((p) => (p.type === "text" ? p.text : ""))
                            .join("\n");
                          handleCopy(text, msg.id);
                        }}
                      >
                        <CopyIcon className="size-4" />
                      </MessageAction>

                      <MessageAction
                        tooltip={likedMessages.has(msg.id) ? "Unlike" : "Like"}
                        onClick={() => handleLike(msg.id)}
                      >
                        <ThumbsUpIcon
                          className={cn(
                            "size-4",
                            likedMessages.has(msg.id) && "fill-current",
                          )}
                        />
                      </MessageAction>

                      <MessageAction
                        tooltip="Regenerate"
                        onClick={() => regenerate({ messageId: msg.id })}
                      >
                        <RotateCcwIcon className="size-4" />
                      </MessageAction>

                      <MessageAction
                        tooltip="Delete"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <TrashIcon className="size-4" />
                      </MessageAction>
                    </MessageActions>
                  )}
                </Message>
              ))}

              {status === "streaming" && (
                <Message
                  from="assistant"
                  className="animate-in fade-in-50 duration-300"
                >
                  <MessageContent>
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <BotIcon className="size-4 animate-pulse" />
                        <span className="text-sm text-muted-foreground animate-pulse">
                          Generating UI…
                        </span>
                      </div>
                    </div>
                  </MessageContent>
                </Message>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <p className="text-sm text-destructive">{error.message}</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </ConversationContent>

            <ConversationScrollButton />
          </Conversation>

          {/* Chat Input with all features */}
          <div className="w-full">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSubmit={(message: { text: string; files: any[] }) => {
                  if (message.text.trim()) {
                    sendMessage({ text: message.text });
                  }
                }}
                onStop={stop}
                isStreaming={status === "streaming"}
                disabled={status === "streaming"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
