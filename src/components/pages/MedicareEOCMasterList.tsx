import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, Search, Pencil, Lock, MoreHorizontal } from '@phosphor-icons/react';

interface MedicareEOCMasterListProps {
  onNavigate: (page: string) => void;
}

export function MedicareEOCMasterList({ onNavigate }: MedicareEOCMasterListProps) {
  const [view, setView] = useKV<string>('medicare-eoc-view', 'Medicare EOC');
  const [instances, setInstances] = useKV<string>('medicare-eoc-instances', 'Medicare EOC');
  const [section, setSection] = useKV<string>('medicare-eoc-section', 'Medicare EOC Cover Page');
  const [activeTab, setActiveTab] = useKV<string>('medicare-eoc-tab', 'Errors');

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
    'Riders & Dental Chart'
  ];

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">Global Template</h1>
          <Button variant="outline" size="sm">
            Get Help?
          </Button>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          Medicare EOC 1/1/2026, Version No. 2026_1.01
        </div>

        {/* Controls Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Pencil size={16} className="text-muted-foreground" />
            <Lock size={16} className="text-muted-foreground" />
            <MoreHorizontal size={16} className="text-muted-foreground" />
          </div>
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">View</span>
            <Select value={view} onValueChange={setView}>
              <SelectTrigger className="w-40">
                <SelectValue />
                <ChevronDown size={16} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medicare EOC">Medicare EOC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Instances</span>
            <Select value={instances} onValueChange={setInstances}>
              <SelectTrigger className="w-40">
                <SelectValue />
                <ChevronDown size={16} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medicare EOC">Medicare EOC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Section</span>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger className="w-64">
                <SelectValue />
                <ChevronDown size={16} />
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
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded text-sm">
              Logo
            </div>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="px-6 py-3 border-b border-border">
        <h2 className="text-lg font-medium text-foreground">{section}</h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex">
        {/* Main Editor Area */}
        <div className="flex-1 bg-white">
          {/* Toolbar */}
          <div className="border-b border-border px-4 py-2 bg-muted/30">
            <div className="flex items-center gap-4 text-sm">
              <span>File</span>
              <span>Edit</span>
              <span>Insert</span>
              <span>View</span>
              <span>Format</span>
              <span>Table</span>
              <span>Tools</span>
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="border-b border-border px-4 py-2 bg-muted/10">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="p-1">
                <span className="text-sm">💬</span>
              </Button>
              <span className="text-sm">AI Rewrite</span>
              
              <div className="mx-2 h-4 w-px bg-border"></div>
              
              <Button variant="ghost" size="sm" className="p-1 font-bold">
                B
              </Button>
              <Button variant="ghost" size="sm" className="p-1 italic">
                I
              </Button>
              <Button variant="ghost" size="sm" className="p-1 underline">
                U
              </Button>
              <Button variant="ghost" size="sm" className="p-1 line-through">
                S
              </Button>

              <div className="mx-2 h-4 w-px bg-border"></div>

              <Select defaultValue="sans-serif">
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans-serif">sans-serif</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="12pt">
                <SelectTrigger className="w-16 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12pt">12pt</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="Paragraph">
                <SelectTrigger className="w-24 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paragraph">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-6 bg-white text-black">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                {'{{ELSE}} {{IF:[GlobalRule[GR157]=true]}}'}
              </div>
              <div className="text-base font-medium">
                Medicare Advantage with prescription drugs
              </div>
              <div className="text-sm text-gray-600">
                {'{{ELSE}}'}
              </div>
              <div className="text-sm text-gray-600">
                {'{{IF:[Medicare[DoesyourPlanofferaPrescrptionPartDbenefit]=YES]}}'}
              </div>
              <div className="text-base font-medium">
                Medicare Advantage plan with prescription drugs
              </div>
              <div className="text-sm text-gray-600">
                {'{{ELSE}} {{IF:[Medicare[PlanType]=Medicare Prescription Drug Plan]}}'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border bg-card">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Page 1</span>
              <ChevronDown size={16} />
            </div>
            
            {/* Chapter Navigation */}
            <div className="space-y-1">
              {sectionOptions.map((option) => (
                <div
                  key={option}
                  className={`px-2 py-1 text-sm rounded cursor-pointer ${
                    option === section 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSection(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="border-t border-border bg-card">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-6">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger value="Errors" className="text-sm">Errors</TabsTrigger>
              <TabsTrigger value="Activity Log" className="text-sm">Activity Log</TabsTrigger>
              <TabsTrigger value="Journal" className="text-sm">Journal</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Section</span>
              <div className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                Medicare EOC Cover Page
              </div>
            </div>
          </div>
          
          <TabsContent value="Errors" className="px-6 py-4">
            <div className="text-sm text-muted-foreground">
              No errors found.
            </div>
          </TabsContent>
          
          <TabsContent value="Activity Log" className="px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Activity log is empty.
            </div>
          </TabsContent>
          
          <TabsContent value="Journal" className="px-6 py-4">
            <div className="text-sm text-muted-foreground">
              No journal entries.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}