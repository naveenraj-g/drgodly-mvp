"use client";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Avatar } from "@/components/ui/avatar";
import { TSharedUser } from "@/modules/shared/types";
import { Brain, MessageSquareIcon, User } from "lucide-react";
import { useEffect, useState } from "react";

type TMessageItem = {
  key: string;
  from: "user" | "assistant";
  versions?: { id: string; content: string }[];
  content?: string;
  attachments?: {
    type: "file";
    url: string;
    mediaType: string;
    filename?: string;
  }[];
};

const ConversationChat = ({
  messages,
  liveTranscript,
  liveRole,
  user,
}: {
  messages: TMessageItem[];
  liveTranscript: string;
  liveRole: "user" | "assistant" | null;
  user: TSharedUser;
}) => {
  const [visibleMessages, setVisibleMessages] = useState<TMessageItem[]>([]);

  useEffect(() => {
    setVisibleMessages(messages);
  }, [messages]);

  return (
    <Conversation className="relative flex-1 pb-14 border rounded-2xl">
      <ConversationContent>
        {visibleMessages.length === 0 && !liveTranscript ? (
          <ConversationEmptyState
            description="Messages will appear here as the conversation progresses."
            icon={<MessageSquareIcon className="size-6" />}
            title="Start the Call"
          />
        ) : (
          <>
            {visibleMessages.map((message) => (
              <Message key={message.key} from={message.from}>
                <MessageContent>
                  <div className="flex gap-2 items-center">
                    {message.from === "assistant" ? (
                      <div className={`bg-secondary w-fit rounded-full p-2`}>
                        <Brain className="size-6" />
                      </div>
                    ) : (
                      <div className="bg-primary/50 flex-1 w-fit rounded-full p-2">
                        <User className="size-6" />
                      </div>
                    )}
                    <MessageResponse>{message.content}</MessageResponse>
                  </div>
                </MessageContent>
              </Message>
            ))}

            {/* Live partial transcript */}
            {liveTranscript && liveRole && (
              <Message from={liveRole} key="live-transcript">
                <div>
                  <MessageContent>
                    <div className="flex gap-2 items-center">
                      {liveRole === "assistant" ? (
                        <div className={`bg-secondary w-fit rounded-full p-2`}>
                          <Brain className="size-6" />
                        </div>
                      ) : (
                        <div className="bg-primary h-6 w-6 flex items-center justify-center rounded-full text-secondary">
                          {user.name[0]}
                        </div>
                      )}
                      <MessageResponse>{liveTranscript}</MessageResponse>
                    </div>
                  </MessageContent>
                </div>
              </Message>
            )}
          </>
        )}
      </ConversationContent>

      <ConversationScrollButton />
    </Conversation>
  );
};

export default ConversationChat;
