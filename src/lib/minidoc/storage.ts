import { Document, ChatSession, Message, User } from './types';

// Keys
const DOCS_KEY = 'minidoc_documents';
const CHATS_KEY = 'minidoc_chats';
const MESSAGES_KEY = 'minidoc_messages';
const USER_KEY = 'minidoc_user';
const ONBOARDING_KEY = 'minidoc_onboarding_complete';

// --- Utilities ---

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
};

// --- User / Auth ---

export const getSession = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const createSession = (email: string): User => {
  const user = { email, name: email.split('@')[0], plan: 'free', joined: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return user;
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
};

// --- Documents ---

export const getDocuments = (): Document[] => {
  if (typeof window === 'undefined') return [];
  const docs = localStorage.getItem(DOCS_KEY);
  return docs ? JSON.parse(docs) : [];
};

export const saveDocument = (file: File, type: Document['type']): Promise<Document> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      
      const newDoc: Document = {
        id: generateId(),
        name: file.name,
        type: type,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        status: 'analyzed',
        date: formatDate(new Date()),
        folder: 'Uploads',
        content: base64String 
      };

      const docs = getDocuments();
      localStorage.setItem(DOCS_KEY, JSON.stringify([newDoc, ...docs]));
      resolve(newDoc);
    };
    reader.readAsDataURL(file);
  });
};

export const deleteDocument = (id: string) => {
  const docs = getDocuments().filter(d => d.id !== id);
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
};

// --- Chats ---

export const getChats = (): ChatSession[] => {
  if (typeof window === 'undefined') return [];
  const chats = localStorage.getItem(CHATS_KEY);
  return chats ? JSON.parse(chats) : [];
};

export const createChat = (title: string): ChatSession => {
  const newChat: ChatSession = {
    id: generateId(),
    title,
    date: formatDate(new Date())
  };
  const chats = getChats();
  localStorage.setItem(CHATS_KEY, JSON.stringify([newChat, ...chats]));
  return newChat;
};

export const deleteChat = (id: string) => {
  const chats = getChats().filter(c => c.id !== id);
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  // Cleanup messages
  const allMessages = getAllMessages();
  delete allMessages[id];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(allMessages));
};

// --- Messages ---

const getAllMessages = (): Record<string, Message[]> => {
  if (typeof window === 'undefined') return {};
  const msgs = localStorage.getItem(MESSAGES_KEY);
  return msgs ? JSON.parse(msgs) : {};
};

export const getMessages = (chatId: string): Message[] => {
  const all = getAllMessages();
  return all[chatId] || [];
};

export const saveMessage = (chatId: string, message: Message) => {
  const all = getAllMessages();
  const chatMsgs = all[chatId] || [];
  all[chatId] = [...chatMsgs, message];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
};

// --- Onboarding ---

export const hasCompletedOnboarding = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const completeOnboarding = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  }
};

export const resetOnboarding = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ONBOARDING_KEY);
  }
};
