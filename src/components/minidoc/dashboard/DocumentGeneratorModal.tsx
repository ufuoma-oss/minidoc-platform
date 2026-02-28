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
  FileSpreadsheet,
  File as FileIcon,
  Presentation,
  Download,
  Loader2,
  CheckCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  generatePdf,
  generateSpreadsheet,
  generateDocx,
  generatePptx,
} from '@/lib/api';
import type { GeneratedDocument } from '@/lib/minidoc/types';

interface DocumentGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function DocumentGeneratorModal({
  open,
  onOpenChange,
  userId = 'demo-user',
}: DocumentGeneratorModalProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; document?: GeneratedDocument; message?: string } | null>(null);
  
  // PDF state
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  
  // Spreadsheet state
  const [spreadsheetTitle, setSpreadsheetTitle] = useState('');
  const [spreadsheetHeaders, setSpreadsheetHeaders] = useState('Column 1, Column 2, Column 3');
  const [spreadsheetRows, setSpreadsheetRows] = useState('Row 1 Col 1, Row 1 Col 2, Row 1 Col 3\nRow 2 Col 1, Row 2 Col 2, Row 2 Col 3');
  
  // DOCX state
  const [docxTitle, setDocxTitle] = useState('');
  const [docxContent, setDocxContent] = useState('');
  
  // PPTX state
  const [pptxTitle, setPptxTitle] = useState('');
  const [pptxSlides, setPptxSlides] = useState<Array<{ title: string; content: string }>>([
    { title: 'Introduction', content: 'Welcome to the presentation' },
  ]);

  // Generate PDF
  const handleGeneratePdf = async () => {
    if (!pdfTitle || !pdfContent) {
      setResult({ success: false, message: 'Please provide title and content' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await generatePdf(pdfTitle, pdfContent, userId);
      setResult({ success: true, document: data.document as GeneratedDocument });
      setPdfTitle('');
      setPdfContent('');
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // Generate Spreadsheet
  const handleGenerateSpreadsheet = async () => {
    if (!spreadsheetTitle) {
      setResult({ success: false, message: 'Please provide a title' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const headers = spreadsheetHeaders.split(',').map(h => h.trim());
      const rows = spreadsheetRows.split('\n').map(row => {
        const values = row.split(',').map(v => v.trim());
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });
      
      const data = await generateSpreadsheet(spreadsheetTitle, rows, userId);
      setResult({ success: true, document: data.document as GeneratedDocument });
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // Generate DOCX
  const handleGenerateDocx = async () => {
    if (!docxTitle || !docxContent) {
      setResult({ success: false, message: 'Please provide title and content' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await generateDocx(docxTitle, docxContent, userId);
      setResult({ success: true, document: data.document as GeneratedDocument });
      setDocxTitle('');
      setDocxContent('');
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // Generate PPTX
  const handleGeneratePptx = async () => {
    if (!pptxTitle || pptxSlides.length === 0) {
      setResult({ success: false, message: 'Please provide title and at least one slide' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await generatePptx(pptxTitle, pptxSlides, userId);
      setResult({ success: true, document: data.document as GeneratedDocument });
    } catch (error) {
      setResult({ success: false, message: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  // Add slide
  const addSlide = () => {
    setPptxSlides([...pptxSlides, { title: '', content: '' }]);
  };

  // Remove slide
  const removeSlide = (index: number) => {
    setPptxSlides(pptxSlides.filter((_, i) => i !== index));
  };

  // Update slide
  const updateSlide = (index: number, field: 'title' | 'content', value: string) => {
    const updated = [...pptxSlides];
    updated[index][field] = value;
    setPptxSlides(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5" />
            Document Generator
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pdf" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pdf">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="spreadsheet">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </TabsTrigger>
            <TabsTrigger value="docx">
              <FileIcon className="h-4 w-4 mr-1" />
              Word
            </TabsTrigger>
            <TabsTrigger value="pptx">
              <Presentation className="h-4 w-4 mr-1" />
              PPT
            </TabsTrigger>
          </TabsList>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-4">
            <div className="space-y-2">
              <Label>Document Title</Label>
              <Input
                placeholder="My Report"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Enter your document content here...&#10;&#10;Use double line breaks for new paragraphs.&#10;# for headings"
                value={pdfContent}
                onChange={(e) => setPdfContent(e.target.value)}
                rows={10}
              />
            </div>
            <Button onClick={handleGeneratePdf} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              Generate PDF
            </Button>
          </TabsContent>

          {/* Spreadsheet Tab */}
          <TabsContent value="spreadsheet" className="space-y-4">
            <div className="space-y-2">
              <Label>Spreadsheet Title</Label>
              <Input
                placeholder="My Data"
                value={spreadsheetTitle}
                onChange={(e) => setSpreadsheetTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Headers (comma-separated)</Label>
              <Input
                placeholder="Name, Email, Phone"
                value={spreadsheetHeaders}
                onChange={(e) => setSpreadsheetHeaders(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rows (one per line, comma-separated values)</Label>
              <Textarea
                placeholder="John, john@example.com, 555-1234&#10;Jane, jane@example.com, 555-5678"
                value={spreadsheetRows}
                onChange={(e) => setSpreadsheetRows(e.target.value)}
                rows={6}
              />
            </div>
            <Button onClick={handleGenerateSpreadsheet} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
              Generate Excel
            </Button>
          </TabsContent>

          {/* DOCX Tab */}
          <TabsContent value="docx" className="space-y-4">
            <div className="space-y-2">
              <Label>Document Title</Label>
              <Input
                placeholder="My Document"
                value={docxTitle}
                onChange={(e) => setDocxTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Enter your document content...&#10;&#10;Use # for headings"
                value={docxContent}
                onChange={(e) => setDocxContent(e.target.value)}
                rows={10}
              />
            </div>
            <Button onClick={handleGenerateDocx} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileIcon className="h-4 w-4 mr-2" />}
              Generate Word Doc
            </Button>
          </TabsContent>

          {/* PPTX Tab */}
          <TabsContent value="pptx" className="space-y-4">
            <div className="space-y-2">
              <Label>Presentation Title</Label>
              <Input
                placeholder="My Presentation"
                value={pptxTitle}
                onChange={(e) => setPptxTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Slides</Label>
                <Button variant="outline" size="sm" onClick={addSlide}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slide
                </Button>
              </div>
              <div className="space-y-4">
                {pptxSlides.map((slide, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Slide {index + 1}</span>
                      {pptxSlides.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeSlide(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Slide Title"
                      value={slide.title}
                      onChange={(e) => updateSlide(index, 'title', e.target.value)}
                    />
                    <Textarea
                      placeholder="Slide content (bullet points, one per line)"
                      value={slide.content}
                      onChange={(e) => updateSlide(index, 'content', e.target.value)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleGeneratePptx} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Presentation className="h-4 w-4 mr-2" />}
              Generate PowerPoint
            </Button>
          </TabsContent>
        </Tabs>

        {/* Result Display */}
        {result && (
          <div className={`mt-4 p-4 rounded-lg ${result.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'}`}>
            <div className="flex items-start gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">Document Generated!</p>
                    {result.document && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {result.document.filename}
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href={result.document.url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-red-600 dark:text-red-400">{result.message}</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
