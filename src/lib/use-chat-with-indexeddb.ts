"use client";

import { useEffect, useRef } from "react";
import {
  getOpenAICompatibleMessages,
  addMessage,
} from "./indexeddb-message-store";

/**
 * Hook to intercept C1Chat API calls and integrate with IndexedDB
 * This intercepts fetch calls to /api/chat and adds userId and messages from IndexedDB
 */
export function useChatWithIndexedDB(
  userId: string | null,
  threadId: string | null
) {
  const originalFetchRef = useRef<typeof fetch | null>(null);

  useEffect(() => {
    // Only require userId - threadId can be null initially and will come from request body
    if (!userId) {
      // Restore original fetch if userId is not available
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
        originalFetchRef.current = null;
      }
      return;
    }

    // Store original fetch
    if (!originalFetchRef.current) {
      originalFetchRef.current = window.fetch;
    }

    // Intercept fetch calls
    window.fetch = async (...args) => {
      const [url, options] = args;

      // Only intercept calls to /api/chat
      if (
        typeof url === "string" &&
        url.includes("/api/chat") &&
        options?.method === "POST"
      ) {
        try {
          // Parse the request body
          const body = options.body ? JSON.parse(options.body as string) : {};
          const { prompt, threadId: bodyThreadId } = body;

          // Use threadId from request body or from hook parameter
          const currentThreadId = bodyThreadId || threadId;

          // Get messages from IndexedDB for this thread (only if userId is available)
          let messages: any[] = [];
          if (userId && currentThreadId) {
            try {
              messages = await getOpenAICompatibleMessages(
                userId,
                currentThreadId
              );
              console.log("📥 Loaded messages from IndexedDB:", {
                userId,
                threadId: currentThreadId,
                count: messages.length,
              });
            } catch (error) {
              console.error("❌ Error loading messages from IndexedDB:", error);
            }
          }

          // Add userId and messages to the request
          // Always include messages array (even if empty) so server can use it
          const enhancedBody = {
            ...body,
            userId, // Include userId in the request (will be null if not logged in)
            messages: userId ? messages : undefined, // Include messages array if user is logged in
          };

          console.log("📤 Sending request with messages:", {
            userId,
            threadId: currentThreadId,
            messagesCount: messages?.length || 0,
            hasPrompt: !!prompt,
          });

          // Save user message to IndexedDB (only if user is logged in)
          if (prompt && userId && currentThreadId) {
            try {
              await addMessage(userId, currentThreadId, prompt);
              console.log("✅ User message saved to IndexedDB:", {
                userId,
                currentThreadId,
              });
            } catch (error) {
              console.error(
                "❌ Error saving user message to IndexedDB:",
                error
              );
            }
          }

          // Call original fetch with enhanced body
          const response = await originalFetchRef.current!(url, {
            ...options,
            body: JSON.stringify(enhancedBody),
          });

          // Intercept the response stream to save assistant messages to IndexedDB
          if (
            response.body &&
            userId &&
            currentThreadId &&
            response.headers.get("content-type")?.includes("text/event-stream")
          ) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";
            const responseId = body.responseId || crypto.randomUUID();

            const stream = new ReadableStream({
              async start(controller) {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                      // Save assistant message to IndexedDB when stream ends
                      if (assistantContent.trim()) {
                        try {
                          await addMessage(userId, currentThreadId, {
                            role: "assistant",
                            content: assistantContent,
                            id: responseId,
                          });
                          console.log(
                            "✅ Assistant message saved to IndexedDB:",
                            {
                              userId,
                              currentThreadId,
                              length: assistantContent.length,
                            }
                          );
                        } catch (error) {
                          console.error(
                            "❌ Error saving assistant message to IndexedDB:",
                            error
                          );
                        }
                      }
                      controller.close();
                      break;
                    }
                    // Decode and accumulate content
                    const chunk = decoder.decode(value, { stream: true });
                    assistantContent += chunk;
                    controller.enqueue(value);
                  }
                } catch (error) {
                  console.error("❌ Error reading response stream:", error);
                  controller.error(error);
                }
              },
            });

            // Return new response with intercepted stream
            return new Response(stream, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            });
          }

          return response;
        } catch (error) {
          console.error("Error in fetch interceptor:", error);
          // Fall back to original fetch on error
          return originalFetchRef.current!(...args);
        }
      }

      // For all other requests, use original fetch
      return originalFetchRef.current!(...args);
    };

    // Cleanup: restore original fetch when component unmounts or dependencies change
    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
        originalFetchRef.current = null;
      }
    };
  }, [userId, threadId]); // threadId is included but may be null - actual value comes from request body
}
