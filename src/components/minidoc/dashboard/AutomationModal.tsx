'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Zap,
  Plus,
  Trash2,
  Play,
  Loader2,
  Clock,
  Mail,
  FileText,
  MessageSquare,
  Bot,
  Bell,
} from 'lucide-react';
import {
  getAutomations,
  createAutomation,
  deleteAutomation,
  runAutomation,
} from '@/lib/api';
import type { Automation } from '@/lib/minidoc/types';

interface AutomationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

const TRIGGER_TYPES = [
  { value: 'schedule', label: 'Scheduled', icon: Clock },
  { value: 'email_received', label: 'Email Received', icon: Mail },
  { value: 'document_uploaded', label: 'Document Uploaded', icon: FileText },
  { value: 'manual', label: 'Manual Only', icon: Play },
];

const ACTION_TYPES = [
  { value: 'send_email', label: 'Send Email', icon: Mail },
  { value: 'create_document', label: 'Create Document', icon: FileText },
  { value: 'send_message', label: 'Send Message', icon: MessageSquare },
  { value: 'ai_process', label: 'AI Process', icon: Bot },
  { value: 'notify_telegram', label: 'Telegram Notification', icon: Bell },
];

export function AutomationModal({
  open,
  onOpenChange,
  userId = 'demo-user',
}: AutomationModalProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  // New automation state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('schedule');
  const [triggerConfig, setTriggerConfig] = useState<Record<string, unknown>>({
    type: 'daily',
    hour: 9,
  });
  const [actions, setActions] = useState<Array<{ type: string; config: Record<string, unknown> }>>([]);
  const [enabled, setEnabled] = useState(true);

  // Load automations
  useEffect(() => {
    if (open) {
      loadAutomations();
    }
  }, [open]);

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const data = await getAutomations(userId);
      setAutomations(data.automations || []);
    } catch (error) {
      console.error('Failed to load automations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create automation
  const handleCreate = async () => {
    if (!name || actions.length === 0) {
      setResult('Please provide a name and at least one action');
      return;
    }
    setSaving(true);
    setResult(null);
    try {
      await createAutomation(name, triggerType, triggerConfig, actions, userId, description, enabled);
      setResult('Automation created successfully!');
      setName('');
      setDescription('');
      setActions([]);
      loadAutomations();
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete automation
  const handleDelete = async (id: string) => {
    try {
      await deleteAutomation(id, userId);
      loadAutomations();
    } catch (error) {
      console.error('Failed to delete automation:', error);
    }
  };

  // Run automation
  const handleRun = async (id: string) => {
    try {
      const result = await runAutomation(id, userId);
      setResult(result.success ? 'Automation started!' : 'Failed to start automation');
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Add action
  const addAction = () => {
    setActions([...actions, { type: 'send_email', config: {} }]);
  };

  // Remove action
  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  // Update action
  const updateAction = (index: number, field: 'type' | 'config', value: unknown) => {
    const updated = [...actions];
    if (field === 'type') {
      updated[index].type = value as string;
      updated[index].config = {};
    } else {
      updated[index].config = value as Record<string, unknown>;
    }
    setActions(updated);
  };

  // Render action config based on type
  const renderActionConfig = (index: number, action: typeof actions[0]) => {
    switch (action.type) {
      case 'send_email':
        return (
          <div className="space-y-2">
            <Input
              placeholder="To email"
              value={(action.config.to as string) || ''}
              onChange={(e) => updateAction(index, 'config', { ...action.config, to: e.target.value })}
            />
            <Input
              placeholder="Subject"
              value={(action.config.subject as string) || ''}
              onChange={(e) => updateAction(index, 'config', { ...action.config, subject: e.target.value })}
            />
            <Textarea
              placeholder="Body"
              value={(action.config.body as string) || ''}
              onChange={(e) => updateAction(index, 'config', { ...action.config, body: e.target.value })}
              rows={2}
            />
          </div>
        );
      case 'notify_telegram':
        return (
          <Textarea
            placeholder="Message to send"
            value={(action.config.message as string) || ''}
            onChange={(e) => updateAction(index, 'config', { ...action.config, message: e.target.value })}
            rows={2}
          />
        );
      case 'ai_process':
        return (
          <Textarea
            placeholder="Prompt for AI"
            value={(action.config.prompt as string) || ''}
            onChange={(e) => updateAction(index, 'config', { ...action.config, prompt: e.target.value })}
            rows={2}
          />
        );
      default:
        return (
          <Textarea
            placeholder="Configuration (JSON)"
            value={JSON.stringify(action.config)}
            onChange={(e) => {
              try {
                updateAction(index, 'config', JSON.parse(e.target.value));
              } catch {
                // Invalid JSON
              }
            }}
            rows={2}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Task Automations
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">My Automations</TabsTrigger>
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>

          {/* List Tab */}
          <TabsContent value="list" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : automations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No automations yet</p>
                <p className="text-sm">Create your first automation to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {automations.map((automation) => (
                  <div
                    key={automation.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{automation.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            automation.enabled
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {automation.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {automation.description || 'No description'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Trigger: {automation.trigger_type} | Actions: {automation.actions.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRun(automation.id)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(automation.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Daily Report"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Trigger</Label>
                <Select value={triggerType} onValueChange={setTriggerType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIGGER_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          <t.icon className="h-4 w-4" />
                          {t.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of what this automation does"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Trigger Config */}
            {triggerType === 'schedule' && (
              <div className="space-y-2 p-4 border rounded-lg">
                <Label>Schedule Configuration</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Frequency</Label>
                    <Select
                      value={(triggerConfig.type as string) || 'daily'}
                      onValueChange={(v) => setTriggerConfig({ ...triggerConfig, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="interval">Interval</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Hour (0-23)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={(triggerConfig.hour as number) || 9}
                      onChange={(e) => setTriggerConfig({ ...triggerConfig, hour: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Actions</Label>
                <Button variant="outline" size="sm" onClick={addAction}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Action
                </Button>
              </div>
              <div className="space-y-4">
                {actions.map((action, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Action {index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Select
                      value={action.type}
                      onValueChange={(v) => updateAction(index, 'type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTION_TYPES.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            <div className="flex items-center gap-2">
                              <a.icon className="h-4 w-4" />
                              {a.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {renderActionConfig(index, action)}
                  </div>
                ))}
              </div>
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Enable Automation</Label>
                <p className="text-sm text-muted-foreground">
                  Automation will run automatically based on trigger
                </p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>

            <Button onClick={handleCreate} disabled={saving || !name || actions.length === 0}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Create Automation
            </Button>
          </TabsContent>
        </Tabs>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm">{result}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
