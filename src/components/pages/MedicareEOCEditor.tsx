import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Search, FileText, Pencil, Lock, MoreHorizontal } from '@phosphor-icons/react';

interface MedicareEOCEditorProps {
  onNavigate: (page: string) => void;
}

export function MedicareEOCEditor({ onNavigate }: MedicareEOCEditorProps) {
  const [selectedView, setSelectedView] = useState('Medicare EOC');
  const [selectedInstance, setSelectedInstance] = useState('Medicare EOC');
  const [selectedSection, setSelectedSection] = useState('Medicare EOC Cover Page');
  const [editorContent, setEditorContent] = useKV('medicare-eoc-content', `{{ELSE}} {{IF:[GlobalRule[GR157]=true]}}
Medicare Advantage with prescription drugs

{{ELSE}}
{{IF:[Medicare[DoesyourPlanofferaPrescritionPartDbenefit]=YES]}}
Medicare Advantage plan with prescription drugs

{{ELSE}} {{IF:[Medicare[PlanType]=Medicare Prescription Drug Plan]}}
`);

  const sectionOptions = [
    'Medicare EOC Cover Page',
    'Chapter 1',
    'Chapter 2', 
    'Chapter 3',
    'Chapter 4',
    'Medical Benefit chart',
    'Chapter 5',
    'Chapter 6',
    'Chapter 7',
    'Chapter 8',
    'Chapter 9',
    'Chapter 10',
    'Chapter 11',
    'Chapter 12',
    'Back Cover',
    'Riders & Dental Chart',
    'ENC'
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
  };

  const formatText = (command: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    let newText = '';
    switch (command) {
      case 'bold':
        newText = `**${selectedText}**`;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        break;
      case 'underline':
        newText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        newText = `~~${selectedText}~~`;
        break;
      default:
        return;
    }

    const before = editorContent.substring(0, start);
    const after = editorContent.substring(end);
    setEditorContent(before + newText + after);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate('medicare-eoc')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Global Template</h1>
            <p className="text-sm text-muted-foreground">Medicare EOC 1/1/2026, Version No. 2026_1.01</p>
          </div>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground">
          Get Help?
        </Button>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center px-4 py-2 bg-card border-b">
        <div className="flex items-center gap-1">
          <div className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-t border-b-2 border-primary">
            Medicare EOC
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <MoreHorizontal size={16} />
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <Lock size={16} />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-4 p-4 bg-card border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">View</span>
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicare EOC">Medicare EOC</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm">
            <Search size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Instances</span>
          <Select value={selectedInstance} onValueChange={setSelectedInstance}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Medicare EOC">Medicare EOC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Section</span>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto">
          <div className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded border">
            Logo
          </div>
        </div>
      </div>

      {/* Content Title */}
      <div className="px-4 py-3 bg-card border-b">
        <h2 className="text-lg font-semibold text-foreground">{selectedSection}</h2>
      </div>

      {/* Rich Text Editor */}
      <div className="flex-1 flex flex-col bg-background">
        <Card className="m-4 flex-1 flex flex-col">
          <CardHeader className="pb-0">
            {/* Editor Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-slate-700 text-white rounded-t">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-600 flex items-center gap-1"
              >
                <FileText size={16} />
                File
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                Insert
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                View
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                Format
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                Table
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-600">
                Tools
              </Button>
            </div>
            
            {/* Format Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <FileText size={16} />
                AI Rewrite
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="ghost" size="sm">
                ↶
              </Button>
              <Button variant="ghost" size="sm">
                ↷
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => formatText('bold')}
                className="font-bold"
              >
                B
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => formatText('italic')}
                className="italic"
              >
                I
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => formatText('underline')}
                className="underline"
              >
                U
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => formatText('strikethrough')}
              >
                S
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Select defaultValue="sans-serif">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">sans-serif</SelectItem>
                  <SelectItem value="serif">serif</SelectItem>
                  <SelectItem value="monospace">monospace</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="12pt">
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10pt">10pt</SelectItem>
                  <SelectItem value="12pt">12pt</SelectItem>
                  <SelectItem value="14pt">14pt</SelectItem>
                  <SelectItem value="16pt">16pt</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="Paragraph">
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paragraph">Paragraph</SelectItem>
                  <SelectItem value="Heading 1">Heading 1</SelectItem>
                  <SelectItem value="Heading 2">Heading 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-0">
            <textarea
              value={editorContent}
              onChange={handleTextChange}
              className="w-full h-full min-h-96 p-4 border-0 resize-none focus:outline-none font-mono text-sm"
              placeholder="Enter your content here..."
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Tabs */}
      <div className="flex items-center px-4 py-2 bg-slate-700 text-white">
        <div className="flex gap-4">
          <button className="text-white hover:text-blue-300">Errors</button>
          <button className="text-white hover:text-blue-300">Activity Log</button>
          <button className="text-white hover:text-blue-300">Journal</button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm">Section</span>
          <div className="px-2 py-1 bg-blue-600 text-white text-sm rounded">
            Medicare EOC Cover Page
          </div>
        </div>
      </div>
    </div>
  );
}