import OpenAI from "openai";

export type DBMessage = OpenAI.Chat.ChatCompletionMessageParam & {
  id?: string;
};

const messagesStore: {
  [threadId: string]: DBMessage[];
} = {};

export const getMessageStore = (threadId: string) => {
  if (!messagesStore[threadId]) {
    messagesStore[threadId] = [];
  }
  const messageList = messagesStore[threadId];
  return {
    addMessage: (message: DBMessage) => {
      messageList.push(message);
    },
    getOpenAICompatibleMessageList: () => {
      return messageList.map((m) => {
        const message = { ...m };
        delete message.id;
        return message;
      });
    },
  };
};
