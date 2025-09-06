import { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Save, 
  X, 
  Globe, 
  Type, 
  Eye, 
  EyeSlash,
  TextB,
  TextItalic,
  TextUnderline,
  ListBullets,
  ListNumbers,
  Link,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface HtmlRichTextEditorProps {
  isOpen: boolean;
  onClose: () => void;
  englishContent: string;
  spanishContent: string;
  onSave: (englishContent: string, spanishContent: string) => Promise<void>;
  title: string;
  englishStatus?: string;
  spanishStatus?: string;
}

export function HtmlRichTextEditor({
  isOpen,
  onClose,
  englishContent,
  spanishContent,
  onSave,
  title,
  englishStatus,
  spanishStatus
}: HtmlRichTextEditorProps) {
  const englishEditorRef = useRef<HTMLDivElement>(null);
  const spanishEditorRef = useRef<HTMLDivElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeEditor, setActiveEditor] = useState<'english' | 'spanish'>('english');

  // Initialize editor content when dialog opens
  useEffect(() => {
    if (isOpen && englishEditorRef.current && spanishEditorRef.current) {
      englishEditorRef.current.innerHTML = englishContent || '';
      spanishEditorRef.current.innerHTML = spanishContent || '';
      setHasUnsavedChanges(false);
    }
  }, [isOpen, englishContent, spanishContent]);

  const executeCommand = useCallback((command: string, value?: string) => {
    const editorRef = activeEditor === 'english' ? englishEditorRef : spanishEditorRef;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setHasUnsavedChanges(true);
    }
  }, [activeEditor]);

  const createLink = useCallback(() => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  const handleContentChange = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const handleSave = async () => {
    if (!englishEditorRef.current || !spanishEditorRef.current) {
      toast.error('Editors are not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const englishText = englishEditorRef.current.innerHTML || '';
      const spanishText = spanishEditorRef.current.innerHTML || '';
      
      await onSave(englishText, spanishText);
      setHasUnsavedChanges(false);
      toast.success('Content saved successfully!');
    } catch (error) {
      toast.error('Failed to save content. Please try again.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Keyboard shortcut for saving (Ctrl+S / Cmd+S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (hasUnsavedChanges && !isLoading) {
          handleSave();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, hasUnsavedChanges, isLoading]);

  const getStatusBadge = (status: string | undefined, language: string) => {
    if (!status) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
    
    switch (status.toLowerCase()) {
      case 'complete':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ Complete</Badge>;
      case 'in progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">✓ Approved</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    icon: Icon, 
    title, 
    isActive = false 
  }: { 
    onClick: () => void; 
    icon: any; 
    title: string; 
    isActive?: boolean;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      title={title}
      className="p-2 h-8 w-8"
    >
      <Icon size={14} />
    </Button>
  );

  const Toolbar = () => (
    <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
      <ToolbarButton
        onClick={() => executeCommand('bold')}
        icon={TextB}
        title="Bold (Ctrl+B)"
      />
      <ToolbarButton
        onClick={() => executeCommand('italic')}
        icon={TextItalic}
        title="Italic (Ctrl+I)"
      />
      <ToolbarButton
        onClick={() => executeCommand('underline')}
        icon={TextUnderline}
        title="Underline (Ctrl+U)"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButton
        onClick={() => executeCommand('justifyLeft')}
        icon={TextAlignLeft}
        title="Align Left"
      />
      <ToolbarButton
        onClick={() => executeCommand('justifyCenter')}
        icon={TextAlignCenter}
        title="Align Center"
      />
      <ToolbarButton
        onClick={() => executeCommand('justifyRight')}
        icon={TextAlignRight}
        title="Align Right"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButton
        onClick={() => executeCommand('insertUnorderedList')}
        icon={ListBullets}
        title="Bullet List"
      />
      <ToolbarButton
        onClick={() => executeCommand('insertOrderedList')}
        icon={ListNumbers}
        title="Numbered List"
      />
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <ToolbarButton
        onClick={createLink}
        icon={Link}
        title="Insert Link"
      />
      
      <select
        className="ml-2 px-2 py-1 text-sm border rounded"
        onChange={(e) => {
          if (e.target.value) {
            executeCommand('formatBlock', e.target.value);
            e.target.value = '';
          }
        }}
      >
        <option value="">Format</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="p">Paragraph</option>
      </select>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] w-[95vw]">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Edit Content - {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2"
              >
                {isPreviewMode ? <EyeSlash size={14} /> : <Eye size={14} />}
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* English Editor */}
            <Card className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-blue-600" />
                  <span className="font-medium text-gray-900">English Content</span>
                </div>
                {getStatusBadge(englishStatus, 'English')}
              </div>
              
              {!isPreviewMode && <Toolbar />}
              
              <div className="flex-1 p-4">
                {isPreviewMode ? (
                  <div 
                    className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: englishEditorRef.current?.innerHTML || '<p><em>No content</em></p>' }}
                  />
                ) : (
                  <div
                    ref={englishEditorRef}
                    contentEditable
                    className="min-h-[300px] p-4 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px'
                    }}
                    onFocus={() => setActiveEditor('english')}
                    onInput={handleContentChange}
                    suppressContentEditableWarning={true}
                  />
                )}
              </div>
            </Card>

            {/* Spanish Editor */}
            <Card className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-amber-600" />
                  <span className="font-medium text-gray-900">Spanish Content</span>
                </div>
                {getStatusBadge(spanishStatus, 'Spanish')}
              </div>
              
              {!isPreviewMode && <Toolbar />}
              
              <div className="flex-1 p-4">
                {isPreviewMode ? (
                  <div 
                    className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: spanishEditorRef.current?.innerHTML || '<p><em>No content</em></p>' }}
                  />
                ) : (
                  <div
                    ref={spanishEditorRef}
                    contentEditable
                    className="min-h-[300px] p-4 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px'
                    }}
                    onFocus={() => setActiveEditor('spanish')}
                    onInput={handleContentChange}
                    suppressContentEditableWarning={true}
                  />
                )}
              </div>
            </Card>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <X size={14} />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !hasUnsavedChanges}
          >
            <Save size={14} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}