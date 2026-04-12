"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getMessagesByThreadId,
  addMessage as addMessageToDB,
  addMessages as addMessagesToDB,
  clearThreadMessages,
  deleteThread,
  getAllThreadIds,
  getOpenAICompatibleMessages,
  type DBMessage,
} from "./indexeddb-message-store";

/**
 * Custom hook for managing chat messages with IndexedDB persistence
 * This hook can be used to integrate IndexedDB persistence with C1Chat
 * @param userId - The user ID (null for logged-out users)
 * @param threadId - The thread ID
 */
export function useIndexedDBChat(
  userId: string | null,
  threadId: string | null
) {
  const [messages, setMessages] = useState<DBMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load messages from IndexedDB when userId or threadId changes
  useEffect(() => {
    if (!threadId || !userId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    getMessagesByThreadId(userId, threadId)
      .then((loadedMessages) => {
        setMessages(loadedMessages);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading messages from IndexedDB:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });
  }, [userId, threadId]);

  // Add a single message to IndexedDB
  const addMessage = useCallback(
    async (message: DBMessage) => {
      if (!threadId || !userId) return;

      try {
        await addMessageToDB(userId, threadId, message);
        setMessages((prev) => [...prev, message]);
      } catch (err) {
        console.error("Error adding message to IndexedDB:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [userId, threadId]
  );

  // Add multiple messages to IndexedDB
  const addMessages = useCallback(
    async (newMessages: DBMessage[]) => {
      if (!threadId || !userId) return;

      try {
        await addMessagesToDB(userId, threadId, newMessages);
        setMessages((prev) => [...prev, ...newMessages]);
      } catch (err) {
        console.error("Error adding messages to IndexedDB:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [userId, threadId]
  );

  // Clear all messages for the current thread
  const clearMessages = useCallback(async () => {
    if (!threadId || !userId) return;

    try {
      await clearThreadMessages(userId, threadId);
      setMessages([]);
    } catch (err) {
      console.error("Error clearing messages from IndexedDB:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [userId, threadId]);

  // Get OpenAI compatible messages (without id and timestamp)
  const getOpenAICompatible = useCallback(async () => {
    if (!threadId || !userId) return [];
    return await getOpenAICompatibleMessages(userId, threadId);
  }, [userId, threadId]);

  return {
    messages,
    isLoading,
    error,
    addMessage,
    addMessages,
    clearMessages,
    getOpenAICompatible,
  };
}

/**
 * Hook to get all thread IDs from IndexedDB for a specific user
 * @param userId - The user ID (null for logged-out users)
 */
export function useAllThreadIds(userId: string | null) {
  const [threadIds, setThreadIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setThreadIds([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ids = await getAllThreadIds(userId);
      setThreadIds(ids);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading thread IDs from IndexedDB:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    threadIds,
    isLoading,
    error,
    refresh,
    deleteThread: async (threadId: string) => {
      if (!userId) return;

      try {
        await deleteThread(userId, threadId);
        await refresh();
      } catch (err) {
        console.error("Error deleting thread from IndexedDB:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
  };
}
