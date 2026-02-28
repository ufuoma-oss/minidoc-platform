'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Table,
  Merge,
  Split,
  Download,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import {
  extractPdfText,
  extractPdfTables,
  mergePdfs,
  splitPdf,
  getDocuments,
} from '@/lib/api';
import type { Document } from '@/lib/api';

interface PdfOperationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function PdfOperationsModal({
  open,
  onOpenChange,
  userId = 'demo-user',
}: PdfOperationsModalProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [splitRanges, setSplitRanges] = useState<string>('');

  // Load documents on open
  const loadDocuments = async () => {
    try {
      const data = await getDocuments(userId);
      const pdfDocs = data.documents.filter((doc: Document) =>
        doc.mime_type === 'application/pdf' || doc.filename.endsWith('.pdf')
      );
      setDocuments(pdfDocs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  // Handle extract text
  const handleExtractText = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await extractPdfText(selectedDoc, userId);
      setResult(`Extracted text (${data.page_count} pages):\n\n${data.text.substring(0, 5000)}${data.text.length > 5000 ? '\n\n... (truncated)' : ''}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle extract tables
  const handleExtractTables = async () => {
    if (!selectedDoc) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await extractPdfTables(selectedDoc, userId);
      setResult(`Found ${data.table_count} tables across ${data.page_count} pages.\n\nTables have been extracted and are ready for spreadsheet export.`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle merge PDFs
  const handleMergePdfs = async () => {
    if (selectedDocs.length < 2) {
      setResult('Please select at least 2 PDFs to merge');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await mergePdfs(selectedDocs, userId);
      setResult(`Successfully merged ${selectedDocs.length} PDFs into ${data.page_count} pages.\n\nNew document created: ${data.merged_document.filename}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle split PDF
  const handleSplitPdf = async () => {
    if (!selectedDoc || !splitRanges) {
      setResult('Please select a PDF and enter page ranges');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const ranges = splitRanges.split(',').map(r => r.trim());
      const data = await splitPdf(selectedDoc, userId, ranges);
      setResult(`Successfully split PDF into ${data.split_documents.length} parts:\n\n${data.split_documents.map((d, i) => `${i + 1}. ${d.filename}`).join('\n')}`);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle document selection for merge
  const toggleDocSelection = (docId: string) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            PDF Operations
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="extract" className="w-full" onValueChange={() => { setResult(null); setSelectedDoc(''); setSelectedDocs([]); }}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="extract">
              <FileText className="h-4 w-4 mr-1" />
              Text
            </TabsTrigger>
            <TabsTrigger value="tables">
              <Table className="h-4 w-4 mr-1" />
              Tables
            </TabsTrigger>
            <TabsTrigger value="merge">
              <Merge className="h-4 w-4 mr-1" />
              Merge
            </TabsTrigger>
            <TabsTrigger value="split">
              <Split className="h-4 w-4 mr-1" />
              Split
            </TabsTrigger>
          </TabsList>

          {/* Extract Text Tab */}
          <TabsContent value="extract" className="space-y-4">
            <div className="space-y-2">
              <Label>Select PDF Document</Label>
              <Select value={selectedDoc} onValueChange={setSelectedDoc} onOpenChange={() => loadDocuments()}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a PDF..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExtractText} disabled={!selectedDoc || loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              Extract Text
            </Button>
          </TabsContent>

          {/* Extract Tables Tab */}
          <TabsContent value="tables" className="space-y-4">
            <div className="space-y-2">
              <Label>Select PDF Document</Label>
              <Select value={selectedDoc} onValueChange={setSelectedDoc} onOpenChange={() => loadDocuments()}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a PDF..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExtractTables} disabled={!selectedDoc || loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Table className="h-4 w-4 mr-2" />}
              Extract Tables
            </Button>
          </TabsContent>

          {/* Merge PDFs Tab */}
          <TabsContent value="merge" className="space-y-4">
            <div className="space-y-2">
              <Label>Select PDFs to Merge (2+)</Label>
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                <div onClick={() => loadDocuments()} className="cursor-pointer">
                  {documents.map(doc => (
                    <label key={doc.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => toggleDocSelection(doc.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{doc.filename}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Selected: {selectedDocs.length} PDFs
              </p>
            </div>
            <Button onClick={handleMergePdfs} disabled={selectedDocs.length < 2 || loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Merge className="h-4 w-4 mr-2" />}
              Merge PDFs
            </Button>
          </TabsContent>

          {/* Split PDF Tab */}
          <TabsContent value="split" className="space-y-4">
            <div className="space-y-2">
              <Label>Select PDF to Split</Label>
              <Select value={selectedDoc} onValueChange={setSelectedDoc} onOpenChange={() => loadDocuments()}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a PDF..." />
                </SelectTrigger>
                <SelectContent>
                  {documents.map(doc => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.filename}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Page Ranges (comma-separated)</Label>
              <Input
                placeholder="e.g., 1-3, 5-7, 10"
                value={splitRanges}
                onChange={(e) => setSplitRanges(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter page ranges like: 1-3, 5-7, 10, 12-15
              </p>
            </div>
            <Button onClick={handleSplitPdf} disabled={!selectedDoc || !splitRanges || loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Split className="h-4 w-4 mr-2" />}
              Split PDF
            </Button>
          </TabsContent>
        </Tabs>

        {/* Result Display */}
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
