import { useState } from 'react';
import { Document } from '@/types/game';
import { cn } from '@/lib/utils';
import { X, FileText, AlertTriangle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DocumentViewerProps {
  document: Document;
  open: boolean;
  onClose: () => void;
}

export function DocumentViewer({ document, open, onClose }: DocumentViewerProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0 bg-transparent border-0">
        <div className="document-paper rounded-lg overflow-hidden shadow-2xl">
          {/* Document Header */}
          <DialogHeader className="p-6 border-b border-document-accent/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-document-accent/70 mb-1">
                  {document.type === 'memo' && 'Official Memorandum'}
                  {document.type === 'email' && 'Intercepted Communication'}
                  {document.type === 'report' && 'Classified Report'}
                  {document.type === 'letter' && 'Personal Correspondence'}
                  {document.type === 'news' && 'Press Clipping'}
                </p>
                <DialogTitle className="font-narrative text-2xl text-document-text">
                  {document.title}
                </DialogTitle>
              </div>
              {document.classification !== 'public' && (
                <span className={cn(
                  "px-2 py-1 text-xs rounded border",
                  document.classification === 'confidential' && "bg-amber-100 text-amber-800 border-amber-300",
                  document.classification === 'secret' && "bg-red-100 text-red-800 border-red-300"
                )}>
                  {document.classification.toUpperCase()}
                </span>
              )}
            </div>
          </DialogHeader>

          {/* Document Meta */}
          <div className="px-6 py-3 bg-document-accent/5 border-b border-document-accent/10 text-sm">
            <div className="flex flex-wrap gap-4 text-document-text/70">
              {document.from && (
                <span><strong>From:</strong> {document.from}</span>
              )}
              {document.to && (
                <span><strong>To:</strong> {document.to}</span>
              )}
              {document.date && (
                <span><strong>Date:</strong> {document.date}</span>
              )}
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 max-h-[50vh] overflow-y-auto">
            <div className="font-narrative text-document-text leading-relaxed space-y-4">
              {document.content.map((paragraph, index) => (
                <p key={index} className={cn(
                  paragraph.startsWith('---') && "text-center text-document-accent/50 my-6",
                  paragraph.startsWith('[') && "italic text-document-text/70"
                )}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Annotations */}
            {document.annotations && document.annotations.length > 0 && (
              <div className="mt-6 pt-4 border-t border-document-accent/20">
                <p className="text-xs uppercase tracking-wide text-document-accent/70 mb-2">
                  Annotations
                </p>
                {document.annotations.map((note, index) => (
                  <p 
                    key={index}
                    className="text-sm italic text-document-accent/80 pl-3 border-l-2 border-document-accent/30"
                  >
                    {note}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Document Footer */}
          <div className="px-6 py-3 bg-document-accent/5 border-t border-document-accent/10 flex items-center justify-between">
            <span className="text-xs text-document-text/50">
              Document ID: {document.id}
            </span>
            <button
              onClick={onClose}
              className="text-sm text-document-accent hover:text-document-text transition-colors"
            >
              Close Document
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact document card for listing
interface DocumentCardProps {
  document: Document;
  onClick: () => void;
  isNew?: boolean;
}

export function DocumentCard({ document, onClick, isNew = false }: DocumentCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg",
        "bg-gradient-document border border-document-accent/30",
        "hover:shadow-lg hover:scale-[1.02] transition-all duration-200",
        "relative overflow-hidden"
      )}
    >
      {isNew && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 text-xs bg-accent text-accent-foreground rounded">
          NEW
        </span>
      )}
      
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-document-accent shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-document-text text-sm">
            {document.title}
          </h4>
          <p className="text-xs text-document-text/60 mt-1">
            {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            {document.date && ` • ${document.date}`}
          </p>
        </div>
      </div>
    </button>
  );
}
