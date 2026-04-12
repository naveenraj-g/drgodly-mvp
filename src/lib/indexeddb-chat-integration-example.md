# IndexedDB Chat Integration Guide

This guide shows how to use IndexedDB to persist conversation history in your chat application.

## Overview

The IndexedDB utilities provide:

- **Client-side storage** for chat messages per thread
- **Automatic persistence** across browser sessions
- **Type-safe** message handling compatible with OpenAI/Thesys API

## Files Created

1. **`src/lib/indexeddb-message-store.ts`** - Core IndexedDB utilities
2. **`src/lib/use-indexeddb-chat.ts`** - React hooks for IndexedDB integration

## Basic Usage

### 1. Using the Hook in a Component

```tsx
"use client";

import { useIndexedDBChat } from "@/lib/use-indexeddb-chat";
import { useEffect } from "react";

export function ChatWithPersistence({ threadId }: { threadId: string }) {
  const { messages, addMessage, isLoading } = useIndexedDBChat(threadId);

  // Load messages from IndexedDB when component mounts
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Loaded messages from IndexedDB:", messages);
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      role: "user" as const,
      content,
      id: crypto.randomUUID(),
    };

    // Save to IndexedDB
    await addMessage(userMessage);

    // Send to API...
  };

  return <div>/* Your chat UI */</div>;
}
```

### 2. Integrating with API Route

The API route now accepts an optional `messages` parameter. When calling from the client, you can send the IndexedDB messages:

```tsx
// Client-side code
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: userMessage,
    threadId: currentThreadId,
    responseId: crypto.randomUUID(),
    messages: await getOpenAICompatibleMessages(currentThreadId), // Send IndexedDB messages
  }),
});
```

### 3. Manual IndexedDB Operations

If you prefer manual control:

```tsx
import {
  getMessagesByThreadId,
  addMessage,
  addMessages,
  deleteThread,
  getAllThreadIds,
} from "@/lib/indexeddb-message-store";

// Get all messages for a thread
const messages = await getMessagesByThreadId("thread-123");

// Add a single message
await addMessage("thread-123", {
  role: "user",
  content: "Hello!",
  id: crypto.randomUUID(),
});

// Add multiple messages
await addMessages("thread-123", [
  { role: "user", content: "Hello!", id: "msg-1" },
  { role: "assistant", content: "Hi there!", id: "msg-2" },
]);

// Get all thread IDs
const threadIds = await getAllThreadIds();

// Delete a thread
await deleteThread("thread-123");
```

## Integration with C1Chat

To fully integrate with C1Chat, you have two options:

### Option 1: Use Thesys Hooks Pattern (Recommended)

Use `useThreadManager` and `useThreadListManager` from `@thesysai/genui-sdk` with IndexedDB:

```tsx
"use client";

import { useThreadManager, useThreadListManager } from "@thesysai/genui-sdk";
import { useIndexedDBChat } from "@/lib/use-indexeddb-chat";

export function PersistentChat() {
  const threadListManager = useThreadListManager({
    // ... configuration
  });

  const { messages, addMessage } = useIndexedDBChat(
    threadListManager.selectedThreadId || null
  );

  const threadManager = useThreadManager({
    threadListManager,
    loadThread: async (threadId) => {
      // Load from IndexedDB
      const indexedMessages = await getMessagesByThreadId(threadId);
      return indexedMessages;
    },
    onUpdateMessage: async ({ message }) => {
      // Save to IndexedDB
      await addMessage(message);
    },
    apiUrl: "/api/chat",
  });

  return (
    <C1Chat
      threadManager={threadManager}
      threadListManager={threadListManager}
    />
  );
}
```

### Option 2: Intercept API Calls

If using `C1Chat` directly with `apiUrl`, you can intercept API calls and save messages:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { C1Chat } from "@thesysai/genui-sdk";
import { useIndexedDBChat } from "@/lib/use-indexeddb-chat";

export function ChatWithIndexedDB() {
  const threadIdRef = useRef<string | null>(null);
  const { addMessage } = useIndexedDBChat(threadIdRef.current);

  // Intercept fetch calls to /api/chat
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options] = args;

      if (url === "/api/chat" && options?.method === "POST") {
        const body = JSON.parse(options.body as string);
        threadIdRef.current = body.threadId;

        // Save user message to IndexedDB
        if (body.prompt) {
          await addMessage(body.prompt);
        }

        // Call original fetch
        const response = await originalFetch(...args);

        // After response, save assistant message
        // (This would need to be handled when the stream completes)
        return response;
      }

      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [addMessage]);

  return <C1Chat apiUrl="/api/chat" />;
}
```

## API Route Updates

The API route (`src/app/api/chat/route.ts`) has been updated to accept an optional `messages` parameter:

```typescript
const { prompt, threadId, responseId, messages } = await req.json();
// messages?: DBMessage[] - Optional messages from client-side IndexedDB

const messageStore = getMessageStore(threadId, messages);
```

This allows the server to use messages persisted in IndexedDB on the client side.

## Benefits

- ✅ **Persistent**: Messages survive page refreshes and browser restarts
- ✅ **Offline-first**: Messages stored locally before syncing
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Compatible**: Works with OpenAI/Thesys API format
- ✅ **Scalable**: IndexedDB can handle large amounts of data

## Next Steps

1. Integrate the hook into your chat component
2. Update API calls to include messages from IndexedDB
3. Handle message synchronization (loading saved messages on thread switch)
4. Optionally implement cleanup/archival for old threads
