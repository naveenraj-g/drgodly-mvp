"use client";

import OpenAI from "openai";
import { get, set, del } from "idb-keyval";

export type DBMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  id?: string;
  timestamp?: number;
};

/**
 * Generate a key for storing messages for a specific user and thread
 */
const getThreadKey = (userId: string, threadId: string): string => {
  return `chat:${userId}:${threadId}`;
};

/**
 * Generate a key for storing list of thread IDs for a user
 */
const getUserThreadsKey = (userId: string): string => {
  return `threads:${userId}`;
};

/**
 * Get all messages for a specific thread and user
 */
export const getMessagesByThreadId = async (
  userId: string | null,
  threadId: string
): Promise<DBMessage[]> => {
  if (!userId) {
    return [];
  }

  try {
    const key = getThreadKey(userId, threadId);
    const messages = (await get<DBMessage[]>(key)) || [];

    // Sort by timestamp
    return messages.sort((a, b) => {
      const timeA = a.timestamp || 0;
      const timeB = b.timestamp || 0;
      return timeA - timeB;
    });
  } catch (error) {
    console.error("Error getting messages from IndexedDB:", error);
    return [];
  }
};

/**
 * Add a message to a thread for a specific user
 */
export const addMessage = async (
  userId: string | null,
  threadId: string,
  message: DBMessage
): Promise<void> => {
  if (!userId) {
    return;
  }

  try {
    const key = getThreadKey(userId, threadId);
    const existingMessages = (await get<DBMessage[]>(key)) || [];

    // Add timestamp and id if not present
    const messageWithMeta: DBMessage = {
      ...message,
      id: message.id || crypto.randomUUID(),
      timestamp: message.timestamp || Date.now(),
    };

    // Add message to array
    const updatedMessages = [...existingMessages, messageWithMeta];

    // Save updated messages array
    await set(key, updatedMessages);

    // Update user's thread list
    await updateUserThreads(userId, threadId);

    console.log("✅ Message saved to IndexedDB:", {
      userId,
      threadId,
      messageId: messageWithMeta.id,
    });
  } catch (error) {
    console.error("❌ Error saving message to IndexedDB:", error);
    throw error;
  }
};

/**
 * Add multiple messages to a thread for a specific user
 */
export const addMessages = async (
  userId: string | null,
  threadId: string,
  messages: DBMessage[]
): Promise<void> => {
  if (!userId || messages.length === 0) {
    return;
  }

  try {
    const key = getThreadKey(userId, threadId);
    const existingMessages = (await get<DBMessage[]>(key)) || [];

    // Add timestamp and id to each message if not present
    const messagesWithMeta: DBMessage[] = messages.map((msg) => ({
      ...msg,
      id: msg.id || crypto.randomUUID(),
      timestamp: msg.timestamp || Date.now(),
    }));

    // Merge with existing messages
    const updatedMessages = [...existingMessages, ...messagesWithMeta];

    // Save updated messages array
    await set(key, updatedMessages);

    // Update user's thread list
    await updateUserThreads(userId, threadId);

    console.log("✅ Messages saved to IndexedDB:", {
      userId,
      threadId,
      count: messagesWithMeta.length,
    });
  } catch (error) {
    console.error("❌ Error saving messages to IndexedDB:", error);
    throw error;
  }
};

/**
 * Update user's thread list (helper function)
 */
const updateUserThreads = async (
  userId: string,
  threadId: string
): Promise<void> => {
  try {
    const threadsKey = getUserThreadsKey(userId);
    const existingThreads = (await get<string[]>(threadsKey)) || [];

    if (!existingThreads.includes(threadId)) {
      await set(threadsKey, [...existingThreads, threadId]);
    }
  } catch (error) {
    console.error("Error updating user threads:", error);
  }
};

/**
 * Clear all messages for a specific thread and user
 */
export const clearThreadMessages = async (
  userId: string | null,
  threadId: string
): Promise<void> => {
  if (!userId) {
    return;
  }

  try {
    const key = getThreadKey(userId, threadId);
    await del(key);
    console.log("✅ Thread messages cleared from IndexedDB:", {
      userId,
      threadId,
    });
  } catch (error) {
    console.error("❌ Error clearing thread messages from IndexedDB:", error);
    throw error;
  }
};

/**
 * Get all thread IDs for a specific user
 */
export const getAllThreadIds = async (
  userId: string | null
): Promise<string[]> => {
  if (!userId) {
    return [];
  }

  try {
    const threadsKey = getUserThreadsKey(userId);
    const threadIds = (await get<string[]>(threadsKey)) || [];
    return threadIds;
  } catch (error) {
    console.error("Error getting thread IDs from IndexedDB:", error);
    return [];
  }
};

/**
 * Delete a thread and all its messages for a specific user
 */
export const deleteThread = async (
  userId: string | null,
  threadId: string
): Promise<void> => {
  if (!userId) {
    return;
  }

  try {
    // Delete thread messages
    await clearThreadMessages(userId, threadId);

    // Remove thread from user's thread list
    const threadsKey = getUserThreadsKey(userId);
    const existingThreads = (await get<string[]>(threadsKey)) || [];
    const updatedThreads = existingThreads.filter((id) => id !== threadId);
    await set(threadsKey, updatedThreads);

    console.log("✅ Thread deleted from IndexedDB:", { userId, threadId });
  } catch (error) {
    console.error("❌ Error deleting thread from IndexedDB:", error);
    throw error;
  }
};

/**
 * Get OpenAI compatible message list (without id and timestamp fields)
 */
export const getOpenAICompatibleMessages = async (
  userId: string | null,
  threadId: string
): Promise<OpenAI.Chat.ChatCompletionMessageParam[]> => {
  const messages = await getMessagesByThreadId(userId, threadId);
  return messages.map((m) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, timestamp, ...message } = m;
    return message;
  });
};
