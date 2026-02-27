import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export type Tab = 'assistant' | 'library' | 'settings';
export type MessageRole = 'user' | 'assistant';
export type SettingModalType = 'account' | 'billing' | 'support' | 'privacy' | 'messaging' | null;
export type SupportView = 'menu' | 'help' | 'feedback' | 'contact';
export type ContactPurpose = 'feature' | 'bug' | 'general' | 'support';

export interface Message {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  attachment?: { name: string; type: 'pdf' | 'img' };
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'mail' | 'image' | 'sheet';
  size: string;
  status: 'analyzed' | 'processing' | 'flagged';
  date: string;
  folder: string;
  content?: string; // Base64 content for RAG
}

export interface ChatSession {
  id: string;
  title: string;
  date: string;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  permissions: string[];
  category: 'communication' | 'productivity' | 'storage' | 'social';
}

export interface User {
  email: string;
  name: string;
  plan: string;
  joined: string;
}
