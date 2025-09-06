import { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, X, Globe, Type, Eye, EyeSlash } from '@phosphor-icons/react';
import { toast } from 'sonner';
import './tinymce-custom.css';

interface TinyMCEEditorProps {
  isOpen: boolean;
  onClose: () => void;
  englishContent: string;
  spanishContent: string;
  onSave: (englishContent: string, spanishContent: string) => Promise<void>;
  title: string;
  englishStatus?: string;
  spanishStatus?: string;
}

export function TinyMCEEditor({
  isOpen,
  onClose,
  englishContent,
  spanishContent,
  onSave,
  title,
  englishStatus,
  spanishStatus
}: TinyMCEEditorProps) {
  const englishEditorRef = useRef<any>(null);
  const spanishEditorRef = useRef<any>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TinyMCE configuration optimized for document content with latest features
  const editorConfig = {
    height: 300,
    menubar: false,
    branding: false,
    promotion: false,
    license_key: 'gpl', // Use GPL license for open source projects
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount', 'paste',
      'autoresize', 'emoticons', 'powerpaste', 'advcode', 'quickbars'
    ],
    toolbar: [
      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | ',
      'align lineheight | numlist bullist indent outdent | ',
      'removeformat | link image media table emoticons | preview code fullscreen help'
    ].join(''),
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    quickbars_insert_toolbar: 'quickimage quicktable',
    contextmenu: 'link image table',
    content_style: `
      body { 
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
        font-size: 14px; 
        line-height: 1.6;
        color: #1f2937;
        margin: 12px;
        background-color: #ffffff;
      }
      p { margin: 0 0 12px 0; }
      ul, ol { margin: 0 0 12px 0; padding-left: 24px; }
      li { margin: 0 0 4px 0; }
      h1, h2, h3, h4, h5, h6 { margin: 0 0 16px 0; line-height: 1.4; color: #111827; }
      h1 { font-size: 2rem; font-weight: 700; }
      h2 { font-size: 1.5rem; font-weight: 600; }
      h3 { font-size: 1.25rem; font-weight: 600; }
      table { border-collapse: collapse; width: 100%; margin: 0 0 12px 0; }
      th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
      th { background-color: #f9fafb; font-weight: 600; }
      blockquote { 
        border-left: 4px solid #3b82f6; 
        padding-left: 16px; 
        margin: 0 0 12px 0; 
        font-style: italic; 
        color: #6b7280; 
      }
      code { 
        background-color: #f3f4f6; 
        padding: 2px 4px; 
        border-radius: 3px; 
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; 
        font-size: 0.875em;
      }
      a { color: #3b82f6; text-decoration: underline; }
      a:hover { color: #1d4ed8; }
    `,
    skin: 'oxide',
    promotion: false,
    resize: 'both',
    min_height: 200,
    max_height: 600,
    autoresize_bottom_margin: 16,
    paste_as_text: false,
    paste_auto_cleanup_on_paste: true,
    paste_remove_styles: false,
    paste_remove_styles_if_webkit: false,
    powerpaste_word_import: 'clean',
    powerpaste_html_import: 'clean',
    table_default_attributes: {
      border: '1'
    },
    table_default_styles: {
      'border-collapse': 'collapse'
    },
    link_default_target: '_blank',
    image_advtab: true,
    image_uploadtab: false,
    file_picker_types: 'image',
    automatic_uploads: false,
    elementpath: true,
    statusbar: true,
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.getContainer().style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
      });
      
      editor.on('focus', () => {
        editor.getContainer().style.borderColor = '#3b82f6';
        editor.getContainer().style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
      });
      
      editor.on('blur', () => {
        editor.getContainer().style.borderColor = '#d1d5db';
        editor.getContainer().style.boxShadow = 'none';
      });

      // Custom styles for better UI integration
      editor.on('init', () => {
        const container = editor.getContainer();
        container.style.borderRadius = '6px';
        container.style.overflow = 'hidden';
      });
    }
  };

  const handleSave = async () => {
    if (!englishEditorRef.current || !spanishEditorRef.current) {
      toast.error('Editors are not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const englishText = englishEditorRef.current?.getContent() || '';
      const spanishText = spanishEditorRef.current?.getContent() || '';
      
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

  const handleContentChange = () => {
    setHasUnsavedChanges(true);
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
              <div className="flex-1 p-4">
                {isPreviewMode ? (
                  <div 
                    className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: englishContent || '<p><em>No content</em></p>' }}
                  />
                ) : (
                  <Editor
                    onInit={(evt, editor) => {
                      englishEditorRef.current = editor;
                    }}
                    initialValue={englishContent}
                    init={editorConfig}
                    onEditorChange={handleContentChange}
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
              <div className="flex-1 p-4">
                {isPreviewMode ? (
                  <div 
                    className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded bg-white"
                    dangerouslySetInnerHTML={{ __html: spanishContent || '<p><em>No content</em></p>' }}
                  />
                ) : (
                  <Editor
                    onInit={(evt, editor) => {
                      spanishEditorRef.current = editor;
                    }}
                    initialValue={spanishContent}
                    init={editorConfig}
                    onEditorChange={handleContentChange}
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