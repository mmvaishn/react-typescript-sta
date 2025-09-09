import { useState, useMemo, useEffect } from 'react';
import { RuleData, EditingRule } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ColumnFilter } from '@/components/pages/ColumnFilter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HtmlRichTextEditor } from '@/components/pages/HtmlRichTextEditor';
import { DatePicker } from '@/components/ui/date-picker';
import { format, parse, isValid } from 'date-fns';
import { 
  ChevronDown, 
  Edit, 
  Save, 
  X, 
  Plus,
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
  PencilSimple,
  Eye,
  Trash
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface RuleGridProps {
  rules: RuleData[];
  onRuleUpdate: (updatedRule: RuleData) => void;
  onRuleCreate: (newRule: RuleData) => void;
  onRuleDelete: (ruleId: string) => void;
  onEditRule: (rule: RuleData) => void;
  onCreateRule?: () => void;
  onNavigate?: (page: string) => void;
}

export function RuleGrid({ rules, onRuleUpdate, onRuleCreate, onRuleDelete, onEditRule, onCreateRule, onNavigate }: RuleGridProps) {
  // Ensure rules is always an array to prevent .map errors
  const safeRules = Array.isArray(rules) ? rules : [];
  
  const [editingRule, setEditingRule] = useState<EditingRule | null>(null);
  const [editValue, setEditValue] = useState('');
  const [previewRule, setPreviewRule] = useState<RuleData | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [richTextEditorOpen, setRichTextEditorOpen] = useState(false);
  const [currentEditingRule, setCurrentEditingRule] = useState<RuleData | null>(null);
  
  // Pagination state - default to 50 for better performance with large datasets
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  
  // Column-specific filters state
  const [columnFilters, setColumnFilters] = useState({
    ruleId: '',
    effectiveDate: '',
    version: [] as string[],
    benefitType: [] as string[],
    businessArea: [] as string[],
    subBusinessArea: [] as string[],
    description: '',
    templateName: [] as string[],
    serviceId: [] as string[],
    cmsRegulated: 'all' as 'all' | 'true' | 'false',
    chapterName: [] as string[],
    sectionName: [] as string[],
    subsectionName: [] as string[],
    serviceGroup: [] as string[],
    sourceMapping: [] as string[],
    tiers: [] as string[],
    key: [] as string[],

    isTabular: 'all' as 'all' | 'true' | 'false',
    english: '',
    englishStatus: [] as string[],
    spanish: '',
    spanishStatus: [] as string[],
    published: 'all' as 'all' | 'true' | 'false'
  });

  // Get unique values for each column
  const uniqueValues = useMemo(() => ({
    ruleId: [...new Set(safeRules.map(r => r.ruleId).filter(Boolean))],
    effectiveDate: [...new Set(safeRules.map(r => r.effectiveDate).filter(Boolean))],
    version: [...new Set(safeRules.map(r => r.version).filter(Boolean))],
    benefitType: [...new Set(safeRules.map(r => r.benefitType).filter(Boolean))],
    businessArea: [...new Set(safeRules.map(r => r.businessArea).filter(Boolean))],
    subBusinessArea: [...new Set(safeRules.map(r => r.subBusinessArea).filter(Boolean))],
    templateName: [...new Set(safeRules.map(r => r.templateName).filter(Boolean))],
    serviceId: [...new Set(safeRules.map(r => r.serviceId).filter(Boolean))],
    chapterName: [...new Set(safeRules.map(r => r.chapterName).filter(Boolean))],
    sectionName: [...new Set(safeRules.map(r => r.sectionName).filter(Boolean))],
    subsectionName: [...new Set(safeRules.map(r => r.subsectionName).filter(Boolean))],
    serviceGroup: [...new Set(safeRules.map(r => r.serviceGroup).filter(Boolean))],
    sourceMapping: [...new Set(safeRules.map(r => r.sourceMapping).filter(Boolean))],
    tiers: [...new Set(safeRules.map(r => r.tiers).filter(Boolean))],
    key: [...new Set(safeRules.map(r => r.key).filter(Boolean))],
    englishStatus: [...new Set(safeRules.map(r => r.englishStatus).filter(Boolean))],
    spanishStatus: [...new Set(safeRules.map(r => r.spanishStatus).filter(Boolean))]
  }), [safeRules]);

  // Apply column filters directly to rules
  const columnFilteredRules = useMemo(() => {
    return safeRules.filter(rule => {
      // Text filters
      if (columnFilters.ruleId && !rule.ruleId?.toLowerCase().includes(columnFilters.ruleId.toLowerCase())) return false;
      if (columnFilters.effectiveDate && !rule.effectiveDate?.toLowerCase().includes(columnFilters.effectiveDate.toLowerCase())) return false;
      if (columnFilters.description && !rule.description?.toLowerCase().includes(columnFilters.description.toLowerCase())) return false;

      if (columnFilters.english && !rule.english?.toLowerCase().includes(columnFilters.english.toLowerCase())) return false;
      if (columnFilters.spanish && !rule.spanish?.toLowerCase().includes(columnFilters.spanish.toLowerCase())) return false;

      // Multi-select filters
      if (columnFilters.version.length > 0 && !columnFilters.version.includes(rule.version || '')) return false;
      if (columnFilters.benefitType.length > 0 && !columnFilters.benefitType.includes(rule.benefitType || '')) return false;
      if (columnFilters.businessArea.length > 0 && !columnFilters.businessArea.includes(rule.businessArea || '')) return false;
      if (columnFilters.subBusinessArea.length > 0 && !columnFilters.subBusinessArea.includes(rule.subBusinessArea || '')) return false;
      if (columnFilters.templateName.length > 0 && !columnFilters.templateName.includes(rule.templateName || '')) return false;
      if (columnFilters.serviceId.length > 0 && !columnFilters.serviceId.includes(rule.serviceId || '')) return false;
      if (columnFilters.chapterName.length > 0 && !columnFilters.chapterName.includes(rule.chapterName || '')) return false;
      if (columnFilters.sectionName.length > 0 && !columnFilters.sectionName.includes(rule.sectionName || '')) return false;
      if (columnFilters.subsectionName.length > 0 && !columnFilters.subsectionName.includes(rule.subsectionName || '')) return false;
      if (columnFilters.serviceGroup.length > 0 && !columnFilters.serviceGroup.includes(rule.serviceGroup || '')) return false;
      if (columnFilters.sourceMapping.length > 0 && !columnFilters.sourceMapping.includes(rule.sourceMapping || '')) return false;
      if (columnFilters.tiers.length > 0 && !columnFilters.tiers.includes(rule.tiers || '')) return false;
      if (columnFilters.key.length > 0 && !columnFilters.key.includes(rule.key || '')) return false;
      if (columnFilters.englishStatus.length > 0 && !columnFilters.englishStatus.includes(rule.englishStatus || '')) return false;
      if (columnFilters.spanishStatus.length > 0 && !columnFilters.spanishStatus.includes(rule.spanishStatus || '')) return false;

      // Boolean filters
      if (columnFilters.cmsRegulated !== 'all') {
        const expectedValue = columnFilters.cmsRegulated === 'true';
        if (rule.cmsRegulated !== expectedValue) return false;
      }
      
      if (columnFilters.isTabular !== 'all') {
        const expectedValue = columnFilters.isTabular === 'true';
        if (rule.isTabular !== expectedValue) return false;
      }

      if (columnFilters.published !== 'all') {
        const expectedValue = columnFilters.published === 'true';
        if (rule.published !== expectedValue) return false;
      }

      return true;
    });
  }, [safeRules, columnFilters]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(columnFilteredRules.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, columnFilteredRules.length);
  const paginatedRules = columnFilteredRules.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [columnFilters]);

  // Keyboard navigation for pagination
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle pagination keys when not editing and no input is focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.contentEditable === 'true'
      );
      
      if (isInputFocused || editingRule) return;

      switch (event.key) {
        case 'ArrowLeft':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handlePreviousPage();
          }
          break;
        case 'ArrowRight':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleNextPage();
          }
          break;
        case 'Home':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleFirstPage();
          }
          break;
        case 'End':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            handleLastPage();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, editingRule]);

  // Helper functions for date handling
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    try {
      // Try to parse as ISO date first
      let date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MM/dd/yyyy');
      }
      
      // Try to parse as MM/dd/yyyy format
      date = parse(dateString, 'MM/dd/yyyy', new Date());
      if (isValid(date)) {
        return format(date, 'MM/dd/yyyy');
      }
      
      // Return original string if parsing fails
      return dateString;
    } catch {
      return dateString;
    }
  };

  const parseDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      // Try to parse as ISO date first
      let date = new Date(dateString);
      if (isValid(date)) {
        return date;
      }
      
      // Try to parse as MM/dd/yyyy format
      date = parse(dateString, 'MM/dd/yyyy', new Date());
      if (isValid(date)) {
        return date;
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  };

  const formatDateForStorage = (date: Date): string => {
    return format(date, 'MM/dd/yyyy');
  };

  // Generate unique Rule ID
  const generateUniqueRuleId = (): string => {
    const existingRuleIds = new Set(safeRules.map(rule => rule.ruleId).filter(Boolean));
    let counter = 1;
    let ruleId: string;
    
    // Find the highest existing rule number to start from
    const existingNumbers = safeRules
      .map(rule => rule.ruleId)
      .filter(Boolean)
      .map(id => {
        const match = id.match(/^R(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);
    
    if (existingNumbers.length > 0) {
      counter = Math.max(...existingNumbers) + 1;
    }
    
    do {
      ruleId = `R${String(counter).padStart(4, '0')}`;
      counter++;
    } while (existingRuleIds.has(ruleId));
    
    return ruleId;
  };

  // Handle new rule creation
  const handleCreateNewRule = () => {
    if (onCreateRule) {
      // Use the provided onCreateRule callback (for backwards compatibility)
      onCreateRule();
    } else if (onNavigate) {
      // Navigate to the create rule page
      onNavigate('create-rule');
    } else {
      // Show error since no navigation method is available
      toast.error('Unable to create new rule - navigation not configured');
    }
  };

  // Pagination handlers
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1);
    
    // Log pagination activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'view',
        target: `Page Size`,
        details: `Changed page size to ${newPageSize} rows per page`,
      });
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'view',
        target: `Pagination`,
        details: `Navigated to first page`,
      });
    }
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages);
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'view',
        target: `Pagination`,
        details: `Navigated to last page (${totalPages})`,
      });
    }
  };
  
  const handlePreviousPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
  };
  
  const handleNextPage = () => {
    const newPage = Math.min(totalPages, currentPage + 1);
    setCurrentPage(newPage);
  };

  const handlePageJump = (pageNumber: string) => {
    const page = parseInt(pageNumber);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: 'view',
          target: `Pagination`,
          details: `Jumped to page ${page}`,
        });
      }
    }
  };


  // Column filter handlers
  const handleColumnFilter = (column: string, value: any) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    
    // Log filter activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'filter',
        target: `Column: ${column}`,
        details: `Applied filter to ${column} column`,
      });
    }
  };

  const handleRowSelect = (ruleId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(ruleId);
    } else {
      newSelected.delete(ruleId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Only select rules on the current page
      setSelectedRows(new Set(paginatedRules.map(r => r.id)));
      
      // Log the selection activity
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: 'view',
          target: `Rule Selection`,
          details: `Selected all ${paginatedRules.length} rules on current page`,
        });
      }
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleCellClick = (rule: RuleData, field: keyof RuleData) => {
    if (['createdAt', 'lastModified', 'id', 'ruleId'].includes(field)) return;
    
    // Log cell click activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'view',
        target: `Rule ${rule.ruleId || 'N/A'} - ${field}`,
        details: `Clicked to edit ${field} field`,
        ruleId: rule.ruleId,
      });
    }
    
    // Open TinyMCE editor for English and Spanish content
    if (field === 'english' || field === 'spanish') {
      setCurrentEditingRule(rule);
      setRichTextEditorOpen(true);
      return;
    }
    
    // Handle effective date field with date picker (no inline editing)
    if (field === 'effectiveDate') {
      return; // Date picker will handle this through its own interface
    }
    
    const fieldValue = rule[field] as string || '';
    setEditingRule({ id: rule.id, field, value: fieldValue });
    setEditValue(fieldValue);
  };

  const handleDateChange = (rule: RuleData, newDate: Date | undefined) => {
    if (!newDate) return;
    
    const oldValue = rule.effectiveDate || '';
    const newValue = formatDateForStorage(newDate);
    
    const updatedRule = {
      ...rule,
      effectiveDate: newValue,
      lastModified: new Date()
    };

    onRuleUpdate(updatedRule);
    
    // Log the date change activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'edit',
        target: `Rule ${rule.ruleId || 'N/A'} - Effective Date`,
        details: `Updated effective date`,
        ruleId: rule.ruleId,
        oldValue: oldValue,
        newValue: newValue,
      });
    }
    
    toast.success('Effective date updated successfully');
  };

  const handleSaveEdit = () => {
    if (!editingRule) return;

    const ruleToUpdate = safeRules.find(r => r.id === editingRule.id);
    if (!ruleToUpdate) return;

    const oldValue = ruleToUpdate[editingRule.field] as string || '';
    const updatedRule = {
      ...ruleToUpdate,
      [editingRule.field]: editValue,
      lastModified: new Date()
    };

    onRuleUpdate(updatedRule);
    
    // Log the edit activity with before/after values
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'edit',
        target: `Rule ${ruleToUpdate.ruleId || 'N/A'} - ${editingRule.field}`,
        details: `Updated ${editingRule.field} field`,
        ruleId: ruleToUpdate.ruleId,
        oldValue: oldValue,
        newValue: editValue,
      });
    }
    
    setEditingRule(null);
    setEditValue('');
    toast.success('Rule updated successfully');
  };

  const handleRichTextSave = async (englishContent: string, spanishContent: string) => {
    if (!currentEditingRule) return;

    const oldEnglish = currentEditingRule.english || '';
    const oldSpanish = currentEditingRule.spanish || '';
    
    const updatedRule = {
      ...currentEditingRule,
      english: englishContent,
      spanish: spanishContent,
      lastModified: new Date()
    };

    onRuleUpdate(updatedRule);
    
    // Log the rich text edit activity
    if ((window as any).addActivityLog) {
      const changes = [];
      if (oldEnglish !== englishContent) changes.push('English content');
      if (oldSpanish !== spanishContent) changes.push('Spanish content');
      
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'edit',
        target: `Rule ${currentEditingRule.ruleId || 'N/A'} - Rich Text`,
        details: `Updated ${changes.join(' and ')} using rich text editor`,
        ruleId: currentEditingRule.ruleId,
        oldValue: changes.length > 1 ? `EN: ${oldEnglish.substring(0, 50)}... | ES: ${oldSpanish.substring(0, 50)}...` : (oldEnglish !== englishContent ? oldEnglish : oldSpanish),
        newValue: changes.length > 1 ? `EN: ${englishContent.substring(0, 50)}... | ES: ${spanishContent.substring(0, 50)}...` : (oldEnglish !== englishContent ? englishContent : spanishContent),
      });
    }
    
    setRichTextEditorOpen(false);
    setCurrentEditingRule(null);
    
    // Return a promise to work with async save handler
    return Promise.resolve();
  };

  const handleCancelEdit = () => {
    setEditingRule(null);
    setEditValue('');
  };

  // Handle bulk edit action
  const handleBulkEdit = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select at least one row to edit');
      return;
    }
    
    if (selectedRows.size > 1) {
      toast.error('Please select only one row to edit');
      return;
    }
    
    const selectedRuleId = Array.from(selectedRows)[0];
    const selectedRule = safeRules.find(rule => rule.id === selectedRuleId);
    
    if (selectedRule && typeof onEditRule === 'function') {
      // Navigate to the edit page instead of opening the rich text editor
      onEditRule(selectedRule);
      
      // Log the edit action activity
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: 'edit',
          target: `Rule ${selectedRule.ruleId || 'N/A'}`,
          details: `Started editing rule via Edit button`,
          ruleId: selectedRule.ruleId,
        });
      }
    } else if (!onEditRule) {
      console.error('onEditRule function is not provided');
      toast.error('Edit function is not available');
    }
  };

  // Handle bulk preview action
  const handleBulkPreview = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select at least one row to preview');
      return;
    }
    
    if (selectedRows.size > 1) {
      toast.error('Please select only one row to preview');
      return;
    }
    
    const selectedRuleId = Array.from(selectedRows)[0];
    const selectedRule = safeRules.find(rule => rule.id === selectedRuleId);
    
    if (selectedRule) {
      setPreviewRule(selectedRule);
      
      // Log the preview action activity
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: 'view',
          target: `Rule ${selectedRule.ruleId || 'N/A'}`,
          details: `Opened rule preview via Preview button`,
          ruleId: selectedRule.ruleId,
        });
      }
    }
  };

  // Handle bulk delete action for unpublished rules only
  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      toast.error('Please select at least one row to delete');
      return;
    }
    
    const selectedRules = safeRules.filter(rule => selectedRows.has(rule.id));
    const publishedRules = selectedRules.filter(rule => rule.published);
    
    if (publishedRules.length > 0) {
      toast.error('Cannot delete published rules. Only unpublished rules can be deleted.');
      return;
    }
    
    // Confirm deletion
    const ruleNames = selectedRules.map(rule => rule.ruleId || 'N/A').join(', ');
    const confirmMessage = selectedRules.length === 1 
      ? `Are you sure you want to delete Rule ${ruleNames}?`
      : `Are you sure you want to delete ${selectedRules.length} rules (${ruleNames})?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    // Delete the rules
    selectedRules.forEach(rule => {
      if (rule.ruleId) {
        onRuleDelete(rule.ruleId);
      }
    });
    
    // Clear selection
    setSelectedRows(new Set());
    
    toast.success(`Successfully deleted ${selectedRules.length} rule${selectedRules.length > 1 ? 's' : ''}`);
  };

  // Helper function to strip HTML tags for display in grid
  const stripHtmlTags = (html: string): string => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const renderCell = (rule: RuleData, field: keyof RuleData, content: string, className: string = '') => {
    const isEditing = editingRule?.id === rule.id && editingRule?.field === field;
    const isEditable = !['createdAt', 'lastModified', 'id', 'ruleId', 'cmsRegulated', 'isTabular', 'published'].includes(field);
    const isRichTextField = field === 'english' || field === 'spanish';
    const isDateField = field === 'effectiveDate';
    
    // Special handling for effective date field
    if (isDateField) {
      const currentDate = parseDateFromString(rule.effectiveDate);
      return (
        <div className={`px-2 py-1 border-r border-gray-200 ${className} bg-white`}>
          <DatePicker
            date={currentDate}
            onDateChange={(newDate) => handleDateChange(rule, newDate)}
            placeholder="Select date"
            className="h-7 text-sm w-full border-gray-300 hover:bg-blue-50 justify-start min-w-0"
          />
        </div>
      );
    }
    
    if (isEditing) {
      return (
        <div className={`px-3 py-1 border-r border-gray-200 flex items-center gap-2 ${className}`}>
          {field === 'english' || field === 'spanish' ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[28px] text-sm resize-none border-blue-300 focus:border-blue-500 flex-1"
              autoFocus
            />
          ) : (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm h-7 border-blue-300 focus:border-blue-500 flex-1"
              autoFocus
            />
          )}
          <div className="flex gap-1 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={handleSaveEdit} className="h-6 w-6 p-0 border-green-300 hover:bg-green-50">
              <Save size={10} className="text-green-600" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-6 w-6 p-0 border-gray-300 hover:bg-gray-50">
              <X size={10} className="text-gray-500" />
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`px-3 py-2 text-sm border-r border-gray-200 last:border-r-0 ${className} ${
          isEditable && !isDateField ? 'hover:bg-blue-50 cursor-pointer group' : 'bg-gray-50 cursor-not-allowed'
        } ${selectedRows.has(rule.id) ? 'bg-blue-50' : ''} ${
          field === 'ruleId' ? 'font-mono font-semibold text-purple-700' : ''
        }`}
        onClick={() => isEditable && !isDateField && handleCellClick(rule, field)}
        title={field === 'ruleId' ? 'Rule ID (Auto-generated, non-editable)' : undefined}
      >
        <div className="flex items-center justify-between">
          <span className="truncate flex-1 text-gray-900">
            {isRichTextField && content ? (
              <div className="max-w-[200px]">
                {stripHtmlTags(content).substring(0, 100) + (stripHtmlTags(content).length > 100 ? '...' : '')}
              </div>
            ) : isDateField ? (
              formatDateForDisplay(content)
            ) : (
              content
            )}
          </span>
          {isEditable && !isDateField && (
            <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 flex-shrink-0">
              {isRichTextField ? (
                <PencilSimple size={12} className="text-blue-500" title="Edit with rich text editor" />
              ) : (
                <Edit size={12} className="text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    if (!status) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Unknown</Badge>;
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
    <div className="w-full h-screen flex flex-col overflow-hidden">
      {/* Compact Header Section */}
      <div className="bg-white border border-gray-200 flex-shrink-0">
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-base font-semibold text-gray-900">Digital Content Manager - ANOC-EOC</h2>
              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                {columnFilteredRules.length > 0 ? (
                  <>
                    Showing {startIndex + 1}-{endIndex} of {columnFilteredRules.length.toLocaleString()} rules
                    {columnFilteredRules.length !== safeRules.length && (
                      <span className="text-gray-400"> (filtered from {safeRules.length.toLocaleString()} total)</span>
                    )}
                    {selectedRows.size > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">• {selectedRows.size} selected</span>
                    )}
                  </>
                ) : (
                  'No rules found'
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={handleBulkEdit}
                disabled={selectedRows.size !== 1}
              >
                <Edit size={14} />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2 border-gray-600 text-gray-600 hover:bg-gray-50"
                onClick={handleBulkPreview}
                disabled={selectedRows.size !== 1}
              >
                <Eye size={14} />
                Preview
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="flex items-center gap-2 border-red-600 text-red-600 hover:bg-red-50"
                onClick={handleBulkDelete}
                disabled={selectedRows.size === 0}
              >
                <Trash size={14} />
                Delete
              </Button>
              <Button 
                size="sm" 
                className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleCreateNewRule}
              >
                <Plus size={14} />
                New Rule
              </Button>
            </div>
          </div>
        </div>


      </div>

        {/* Full Height Table Section with Maximum Scrolling Area */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[4350px] h-full">
            {/* Table Header */}
            <div className="flex bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 sticky top-0 z-10">
              <div className="w-12 px-3 py-2 border-r border-gray-200">
                <Checkbox 
                  checked={paginatedRules.length > 0 && selectedRows.size === paginatedRules.length}
                  onCheckedChange={handleSelectAll}
                  title={`Select all ${paginatedRules.length} rules on current page`}
                />
              </div>
              <div className="w-24 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Rule ID</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="ruleId"
                  columnTitle="Rule ID"
                  values={uniqueValues.ruleId}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="text"
                  textValue={columnFilters.ruleId}
                  onTextFilter={(value) => handleColumnFilter('ruleId', value)}
                />
              </div>
              <div className="w-40 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Effective Date</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="effectiveDate"
                  columnTitle="Effective Date"
                  values={uniqueValues.effectiveDate}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="text"
                  textValue={columnFilters.effectiveDate}
                  onTextFilter={(value) => handleColumnFilter('effectiveDate', value)}
                />
              </div>
              <div className="w-24 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Version</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="version"
                  columnTitle="Version"
                  values={uniqueValues.version}
                  selectedValues={columnFilters.version}
                  onFilter={(values) => handleColumnFilter('version', values)}
                />
              </div>
              <div className="w-40 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Benefit Type</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="benefitType"
                  columnTitle="Benefit Type"
                  values={uniqueValues.benefitType}
                  selectedValues={columnFilters.benefitType}
                  onFilter={(values) => handleColumnFilter('benefitType', values)}
                />
              </div>
              <div className="w-40 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Business Area</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="businessArea"
                  columnTitle="Business Area"
                  values={uniqueValues.businessArea}
                  selectedValues={columnFilters.businessArea}
                  onFilter={(values) => handleColumnFilter('businessArea', values)}
                />
              </div>
              <div className="w-48 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Sub-Business Area</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="subBusinessArea"
                  columnTitle="Sub-Business Area"
                  values={uniqueValues.subBusinessArea}
                  selectedValues={columnFilters.subBusinessArea}
                  onFilter={(values) => handleColumnFilter('subBusinessArea', values)}
                />
              </div>
              <div className="w-64 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Description</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="description"
                  columnTitle="Description"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="text"
                  textValue={columnFilters.description}
                  onTextFilter={(value) => handleColumnFilter('description', value)}
                />
              </div>
              <div className="w-48 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Template Name</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="templateName"
                  columnTitle="Template Name"
                  values={uniqueValues.templateName}
                  selectedValues={columnFilters.templateName}
                  onFilter={(values) => handleColumnFilter('templateName', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Service ID</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="serviceId"
                  columnTitle="Service ID"
                  values={uniqueValues.serviceId}
                  selectedValues={columnFilters.serviceId}
                  onFilter={(values) => handleColumnFilter('serviceId', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>CMS Regulated</span>
                </div>
                <ColumnFilter
                  columnKey="cmsRegulated"
                  columnTitle="CMS Regulated"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="boolean"
                  booleanValue={columnFilters.cmsRegulated}
                  onBooleanFilter={(value) => handleColumnFilter('cmsRegulated', value)}
                />
              </div>
              <div className="w-48 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Chapter Name</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="chapterName"
                  columnTitle="Chapter Name"
                  values={uniqueValues.chapterName}
                  selectedValues={columnFilters.chapterName}
                  onFilter={(values) => handleColumnFilter('chapterName', values)}
                />
              </div>
              <div className="w-48 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Section Name</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="sectionName"
                  columnTitle="Section Name"
                  values={uniqueValues.sectionName}
                  selectedValues={columnFilters.sectionName}
                  onFilter={(values) => handleColumnFilter('sectionName', values)}
                />
              </div>
              <div className="w-48 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Subsection Name</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="subsectionName"
                  columnTitle="Subsection Name"
                  values={uniqueValues.subsectionName}
                  selectedValues={columnFilters.subsectionName}
                  onFilter={(values) => handleColumnFilter('subsectionName', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Service Group</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="serviceGroup"
                  columnTitle="Service Group"
                  values={uniqueValues.serviceGroup}
                  selectedValues={columnFilters.serviceGroup}
                  onFilter={(values) => handleColumnFilter('serviceGroup', values)}
                />
              </div>
              <div className="w-40 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Source Mapping</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="sourceMapping"
                  columnTitle="Source Mapping"
                  values={uniqueValues.sourceMapping}
                  selectedValues={columnFilters.sourceMapping}
                  onFilter={(values) => handleColumnFilter('sourceMapping', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Tiers</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="tiers"
                  columnTitle="Tiers"
                  values={uniqueValues.tiers}
                  selectedValues={columnFilters.tiers}
                  onFilter={(values) => handleColumnFilter('tiers', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Key</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="key"
                  columnTitle="Key"
                  values={uniqueValues.key}
                  selectedValues={columnFilters.key}
                  onFilter={(values) => handleColumnFilter('key', values)}
                />
              </div>

              <div className="w-28 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Is Tabular</span>
                </div>
                <ColumnFilter
                  columnKey="isTabular"
                  columnTitle="Is Tabular"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="boolean"
                  booleanValue={columnFilters.isTabular}
                  onBooleanFilter={(value) => handleColumnFilter('isTabular', value)}
                />
              </div>
              <div className="w-64 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>English</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="english"
                  columnTitle="English"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="text"
                  textValue={columnFilters.english}
                  onTextFilter={(value) => handleColumnFilter('english', value)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="englishStatus"
                  columnTitle="English Status"
                  values={uniqueValues.englishStatus}
                  selectedValues={columnFilters.englishStatus}
                  onFilter={(values) => handleColumnFilter('englishStatus', values)}
                />
              </div>
              <div className="w-64 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Spanish</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="spanish"
                  columnTitle="Spanish"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="text"
                  textValue={columnFilters.spanish}
                  onTextFilter={(value) => handleColumnFilter('spanish', value)}
                />
              </div>
              <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Status</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
                <ColumnFilter
                  columnKey="spanishStatus"
                  columnTitle="Spanish Status"
                  values={uniqueValues.spanishStatus}
                  selectedValues={columnFilters.spanishStatus}
                  onFilter={(values) => handleColumnFilter('spanishStatus', values)}
                />
              </div>
              <div className="w-32 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>Published</span>
                </div>
                <ColumnFilter
                  columnKey="published"
                  columnTitle="Published"
                  values={[]}
                  selectedValues={[]}
                  onFilter={() => {}}
                  filterType="boolean"
                  booleanValue={columnFilters.published}
                  onBooleanFilter={(value) => handleColumnFilter('published', value)}
                />
              </div>
            </div>

            {/* Table Body - Compact rows */}
            <div className="bg-white">
              {paginatedRules.length > 0 ? (
                paginatedRules.map((rule, index) => (
                <div 
                  key={rule.id} 
                  className={`flex border-b border-gray-100 hover:bg-gray-50 ${
                    selectedRows.has(rule.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="w-12 px-3 py-2 border-r border-gray-200 flex items-center">
                    <Checkbox 
                      checked={selectedRows.has(rule.id)}
                      onCheckedChange={(checked) => handleRowSelect(rule.id, checked as boolean)}
                    />
                  </div>
                  
                  {renderCell(rule, 'ruleId', rule.ruleId || 'N/A', 'w-24 font-medium')}
                  {renderCell(rule, 'effectiveDate', rule.effectiveDate || 'N/A', 'w-40')}
                  {renderCell(rule, 'version', rule.version || 'N/A', 'w-24')}
                  {renderCell(rule, 'benefitType', rule.benefitType || 'N/A', 'w-40')}
                  {renderCell(rule, 'businessArea', rule.businessArea || 'N/A', 'w-40')}
                  {renderCell(rule, 'subBusinessArea', rule.subBusinessArea || 'N/A', 'w-48')}
                  {renderCell(rule, 'description', rule.description || 'N/A', 'w-64')}
                  {renderCell(rule, 'templateName', rule.templateName || 'N/A', 'w-48 font-medium')}
                  {renderCell(rule, 'serviceId', rule.serviceId || 'N/A', 'w-32')}
                  
                  <div className="w-32 px-3 py-2 border-r border-gray-200 flex items-center justify-center">
                    <Checkbox 
                      checked={rule.cmsRegulated || false}
                      onCheckedChange={(checked) => {
                        const updatedRule = {
                          ...rule,
                          cmsRegulated: checked as boolean,
                          lastModified: new Date()
                        };
                        onRuleUpdate(updatedRule);
                        
                        // Log the checkbox change activity
                        if ((window as any).addActivityLog) {
                          (window as any).addActivityLog({
                            user: 'Current User',
                            action: 'edit',
                            target: `Rule ${rule.ruleId || 'N/A'} - CMS Regulated`,
                            details: `${checked ? 'Enabled' : 'Disabled'} CMS regulation`,
                            ruleId: rule.ruleId,
                            oldValue: rule.cmsRegulated ? 'Yes' : 'No',
                            newValue: checked ? 'Yes' : 'No',
                          });
                        }
                      }}
                    />
                  </div>
                  
                  {renderCell(rule, 'chapterName', rule.chapterName || 'N/A', 'w-48')}
                  {renderCell(rule, 'sectionName', rule.sectionName || 'N/A', 'w-48')}
                  {renderCell(rule, 'subsectionName', rule.subsectionName || 'N/A', 'w-48')}
                  {renderCell(rule, 'serviceGroup', rule.serviceGroup || 'N/A', 'w-32')}
                  {renderCell(rule, 'sourceMapping', rule.sourceMapping || 'N/A', 'w-40')}
                  {renderCell(rule, 'tiers', rule.tiers || 'N/A', 'w-32')}
                  {renderCell(rule, 'key', rule.key || 'N/A', 'w-32')}

                  
                  <div className="w-28 px-3 py-2 border-r border-gray-200 flex items-center justify-center">
                    <Checkbox 
                      checked={rule.isTabular || false}
                      onCheckedChange={(checked) => {
                        const updatedRule = {
                          ...rule,
                          isTabular: checked as boolean,
                          lastModified: new Date()
                        };
                        onRuleUpdate(updatedRule);
                        
                        // Log the checkbox change activity
                        if ((window as any).addActivityLog) {
                          (window as any).addActivityLog({
                            user: 'Current User',
                            action: 'edit',
                            target: `Rule ${rule.ruleId || 'N/A'} - Is Tabular`,
                            details: `${checked ? 'Enabled' : 'Disabled'} tabular format`,
                            ruleId: rule.ruleId,
                            oldValue: rule.isTabular ? 'Yes' : 'No',
                            newValue: checked ? 'Yes' : 'No',
                          });
                        }
                      }}
                    />
                  </div>
                  
                  {renderCell(rule, 'english', rule.english || 'N/A', 'w-64')}
                  
                  <div className="w-32 px-3 py-2 border-r border-gray-200">
                    {getStatusBadge(rule.englishStatus)}
                  </div>
                  
                  {renderCell(rule, 'spanish', rule.spanish || 'N/A', 'w-64')}
                  
                  <div className="w-32 px-3 py-2 border-r border-gray-200">
                    {getStatusBadge(rule.spanishStatus)}
                  </div>
                  
                  <div className="w-32 px-3 py-2 flex items-center justify-center">
                    <Checkbox 
                      checked={rule.published || false}
                      onCheckedChange={(checked) => {
                        const updatedRule = {
                          ...rule,
                          published: checked as boolean,
                          lastModified: new Date()
                        };
                        onRuleUpdate(updatedRule);
                        
                        // Log the checkbox change activity
                        if ((window as any).addActivityLog) {
                          (window as any).addActivityLog({
                            user: 'Current User',
                            action: 'edit',
                            target: `Rule ${rule.ruleId || 'N/A'} - Published`,
                            details: `${checked ? 'Published' : 'Unpublished'} rule`,
                            ruleId: rule.ruleId,
                            oldValue: rule.published ? 'Yes' : 'No',
                            newValue: checked ? 'Yes' : 'No',
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <div className="text-center">
                    <p className="text-sm">No rules found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Pagination Controls */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20 h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              {columnFilteredRules.length > 0 ? (
                `${startIndex + 1}-${endIndex} of ${columnFilteredRules.length.toLocaleString()} rules`
              ) : (
                'No rules to display'
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirstPage}
              disabled={currentPage === 1 || columnFilteredRules.length === 0}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              title="First page (Ctrl+Home)"
            >
              <CaretDoubleLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || columnFilteredRules.length === 0}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              title="Previous page (Ctrl+←)"
            >
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || columnFilteredRules.length === 0}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              title="Next page (Ctrl+→)"
                value={currentPage}
                onChange={(e) => handlePageJump(e.target.value)}
                className="w-16 h-8 text-sm text-center border-gray-300"
                disabled={columnFilteredRules.length === 0}
              />
              <span className="text-sm text-gray-700">of {totalPages}</span>
            </div>
              disabled={currentPage === totalPages || columnFilteredRules.length === 0}
            <Button
              title="Last page (Ctrl+End)"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || columnFilteredRules.length === 0}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              title="Next page (Ctrl+→)"
            >
              <CaretRight size={14} />
              {columnFilteredRules.length !== safeRules.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLastPage}
              disabled={currentPage === totalPages || columnFilteredRules.length === 0}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
              title="Last page (Ctrl+End)"
            >
              <CaretDoubleRight size={14} />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {columnFilteredRules.length !== safeRules.length && (
                `Filtered from ${safeRules.length.toLocaleString()} total`
              )}
            </span>
          </div>
        </div>

      {/* TinyMCE Editor Dialog */}
      {currentEditingRule && (
        <HtmlRichTextEditor
          isOpen={richTextEditorOpen}
          onClose={() => {
            setRichTextEditorOpen(false);
            setCurrentEditingRule(null);
          }}
          englishContent={currentEditingRule.english || ''}
          spanishContent={currentEditingRule.spanish || ''}
          onSave={handleRichTextSave}
          title={`Rule ${currentEditingRule.ruleId || 'N/A'} - ${currentEditingRule.templateName || 'Unknown Template'}`}
          englishStatus={currentEditingRule.englishStatus}
          spanishStatus={currentEditingRule.spanishStatus}
        />
      )}

      {/* Preview Dialog */}
      {previewRule && (
        <Dialog open={!!previewRule} onOpenChange={() => setPreviewRule(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Rule Details - {previewRule.ruleId || 'N/A'}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Template</label>
                    <p className="text-sm">{previewRule.templateName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Version</label>
                    <p className="text-sm">{previewRule.version || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Benefit Type</label>
                    <p className="text-sm">{previewRule.benefitType || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Business Area</label>
                    <p className="text-sm">{previewRule.businessArea || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Sub-Business Area</label>
                    <p className="text-sm">{previewRule.subBusinessArea || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Service ID</label>
                    <p className="text-sm">{previewRule.serviceId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Service Group</label>
                    <p className="text-sm">{previewRule.serviceGroup || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Source Mapping</label>
                    <p className="text-sm">{previewRule.sourceMapping || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Tiers</label>
                    <p className="text-sm">{previewRule.tiers || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Key</label>
                    <p className="text-sm">{previewRule.key || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">CMS Regulated</label>
                    <p className="text-sm">{previewRule.cmsRegulated ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Published</label>
                    <p className="text-sm">{previewRule.published ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Chapter</label>
                    <p className="text-sm">{previewRule.chapterName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Section</label>
                    <p className="text-sm">{previewRule.sectionName || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-500">Description</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{previewRule.description || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-500">Rule Text</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{previewRule.rule || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-500">English</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{previewRule.english || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {previewRule.englishStatus || 'Unknown'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-500">Spanish</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{previewRule.spanish || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {previewRule.spanishStatus || 'Unknown'}</p>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}