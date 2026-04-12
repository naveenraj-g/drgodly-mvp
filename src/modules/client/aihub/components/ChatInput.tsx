"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PromptInput,
  PromptInputHeader,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputSelect,
  PromptInputSelectTrigger,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectValue,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputSpeechButton,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import {
  PlusIcon,
  Volume2Icon,
  StopCircleIcon,
  AudioLines,
} from "lucide-react";
import type { ResponseMode, ChatInputProps } from "../types/chat-types";

export function ChatInput({
  onSubmit,
  onStop,
  isStreaming = false,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [responseMode, setResponseMode] = useState<ResponseMode>("ask");

  const handleSubmit = async (message: PromptInputMessage) => {
    if (onSubmit) {
      // PromptInputMessage has files property, not attachments
      onSubmit({ text: message.text, files: message.files || [] });
    } else {
      // Fallback for testing
      console.log("Message submitted:", message);
      toast.info("Message sent!", {
        description: `Mode: ${responseMode} - ${message.text}`,
      });
    }
  };

  const handleVoiceToVoice = () => {
    toast.info("Voice-to-voice coming soon!", {
      description: "This feature requires backend streaming support.",
    });
  };

  return (
    <div className="relative w-full">
      <PromptInput
        onSubmit={handleSubmit}
        accept="image/*"
        multiple
        className="bg-zinc-50 dark:bg-zinc-800/80 rounded-3xl overflow-hidden border border-zinc-700/50 ring-0 focus-visible:ring-0"
      >
        <PromptInputBody className="px-2">
          <PromptInputAttachments className="px-2 pt-2">
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>

          <div className="flex items-center gap-2 px-3 w-full">
            <PromptInputTextarea
              ref={textareaRef}
              placeholder="Type or ask anything..."
              disabled={disabled}
              className="flex-1"
            />
            {isStreaming && onStop ? (
              <PromptInputSubmit
                onClick={(e) => {
                  e.preventDefault();
                  onStop();
                }}
                className="bg-destructive hover:bg-destructive/90"
              >
                <StopCircleIcon className="size-4" />
              </PromptInputSubmit>
            ) : (
              <PromptInputSubmit />
            )}
          </div>
        </PromptInputBody>

        <PromptInputFooter className="px-3 pb-2 pt-1">
          <div className="flex items-center gap-1 w-full">
            {/* Left side: File Upload and Selectors */}
            <div className="flex items-center gap-2">
              {/* File Upload */}
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger>
                  <PlusIcon />
                </PromptInputActionMenuTrigger>
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              {/* Response Mode Selector */}
              <PromptInputSelect
                value={responseMode}
                onValueChange={(value) =>
                  setResponseMode(value as ResponseMode)
                }
              >
                <PromptInputSelectTrigger size="sm">
                  <PromptInputSelectValue placeholder="Mode" />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  <PromptInputSelectItem value="ask">Ask</PromptInputSelectItem>
                  <PromptInputSelectItem value="actions">
                    Actions
                  </PromptInputSelectItem>
                  <PromptInputSelectItem value="analytics">
                    Analytics
                  </PromptInputSelectItem>
                </PromptInputSelectContent>
              </PromptInputSelect>

              {/* AI Agent Selector */}
              <PromptInputSelect value="default" onValueChange={() => {}}>
                <PromptInputSelectTrigger size="sm">
                  <PromptInputSelectValue placeholder="Select a agent" />
                </PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  <PromptInputSelectItem value="default">
                    Default Agent
                  </PromptInputSelectItem>
                </PromptInputSelectContent>
              </PromptInputSelect>
            </div>

            <div className="flex-1" />

            {/* Right side: Voice Controls */}
            <div className="flex items-center gap-1">
              {/* Speech to Text */}
              <PromptInputSpeechButton textareaRef={textareaRef} />

              {/* Voice to Voice */}
              <PromptInputButton
                variant="ghost"
                size="icon-sm"
                onClick={handleVoiceToVoice}
              >
                <AudioLines className="size-4" />
              </PromptInputButton>
            </div>
          </div>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
