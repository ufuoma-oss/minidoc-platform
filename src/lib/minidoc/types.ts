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
  citations?: Citation[];
}

export interface Citation {
  document_id: string;
  document_name: string;
  page_number?: number;
  text_snippet: string;
  relevance_score?: number;
  url?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'mail' | 'image' | 'sheet';
  size: string;
  status: 'analyzed' | 'processing' | 'flagged';
  date: string;
  folder: string;
  content?: string;
  url?: string;
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

// Integration types
export interface IntegrationStatus {
  connected: boolean;
  provider: string;
  connected_at?: string;
  scopes?: string[];
}

export interface Email {
  id: string;
  from: string;
  to: string | string[];
  subject: string;
  body?: string;
  snippet: string;
  date: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  attendees?: string[];
}

// Automation types
export interface Automation {
  id: string;
  user_id: string;
  name: string;
  description: string;
  trigger_type: 'schedule' | 'email_received' | 'document_uploaded' | 'webhook' | 'manual';
  trigger_config: TriggerConfig;
  actions: AutomationAction[];
  enabled: boolean;
  last_run_at?: string;
  created_at: string;
}

export interface TriggerConfig {
  type?: string;
  interval?: number;
  unit?: 'minutes' | 'hours' | 'days';
  hour?: number;
  minute?: number;
  day_of_week?: string;
}

export interface AutomationAction {
  type: 'send_email' | 'create_document' | 'send_message' | 'ai_process' | 'notify_telegram' | 'webhook';
  config: Record<string, unknown>;
}

// PDF Operation types
export interface PdfOperation {
  type: 'extract-text' | 'extract-tables' | 'merge' | 'split' | 'info';
  document_id?: string;
  document_ids?: string[];
  ranges?: string[];
}

// Document Generation types
export interface DocumentGenerationRequest {
  type: 'pdf' | 'xlsx' | 'docx' | 'pptx';
  title: string;
  content?: string;
  data?: Array<Record<string, unknown>>;
  slides?: Array<{ title: string; content: string }>;
  sections?: Array<{ heading: string; content: string }>;
  template?: string;
  filename?: string;
}

export interface GeneratedDocument {
  id: string;
  filename: string;
  url: string;
  type: string;
  created_at: string;
}
