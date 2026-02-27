'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Image, FileSpreadsheet, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'ready' | 'error';
}

interface FileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const uploaded: UploadedFile[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', 'demo-user');
        formData.append('category', 'general');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          uploaded.push({
            id: data.document.id,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'ready'
          });
        } else {
          uploaded.push({
            id: `error_${Date.now()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'error'
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        uploaded.push({
          id: `error_${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'error'
        });
      }
    }

    setUploadedFiles(uploaded);
    setUploading(false);
    
    if (uploaded.every(f => f.status === 'ready')) {
      setTimeout(() => {
        onUploadComplete(uploaded);
      }, 1500);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (type.includes('spreadsheet') || type.includes('csv')) return <FileSpreadsheet className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-medium">Upload Files</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="m-4 p-8 border-2 border-dashed border-neutral-300 rounded-xl text-center hover:border-black transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 mx-auto mb-3 text-neutral-400" />
          <p className="text-neutral-600 mb-1">Drop files here or click to browse</p>
          <p className="text-xs text-neutral-400">
            PDF, Images, Documents, Spreadsheets (max 10MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-4 overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto space-y-2 pb-4">
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="p-2 bg-white rounded-lg border border-neutral-200">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-neutral-500">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Results */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="px-4 pb-4"
            >
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      file.status === 'ready' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {getFileIcon(file.type)}
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className={`text-xs ${
                      file.status === 'ready' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {file.status === 'ready' ? '✓ Ready' : '✗ Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-neutral-200">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 border border-neutral-300 rounded-xl font-medium hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className="flex-1 py-2.5 px-4 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FileUpload;
