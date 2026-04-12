"use client";

import {
  PromptInput,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { useRef, useState } from "react";

const SUBMITTING_TIMEOUT = 200;
const STREAMING_TIMEOUT = 2000;

const UserPromptInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text?.trim();
    const hasAttachments = Boolean(message.files?.length);

    if (!(text || hasAttachments)) {
      return;
    }

    setStatus("submitted");

    console.log("Submitting message:", message);

    setTimeout(() => {
      setStatus("streaming");
    }, SUBMITTING_TIMEOUT);

    setTimeout(() => {
      setStatus("ready");
    }, STREAMING_TIMEOUT);

    if (text) {
      onSend(text);
      // clear textarea if ref available
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };

  return (
    <div className="grid shrink-0">
      <PromptInput onSubmit={handleSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            ref={textareaRef}
            className="p-4"
            placeholder="Enter your message"
          />
          <PromptInputSubmit status={status} />
        </PromptInputBody>
      </PromptInput>
    </div>
  );
};

export default UserPromptInput;
