import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus } from '@phosphor-icons/react';
import { RuleData } from '@/lib/types';
import { generateMockRuleData } from '@/lib/mockRuleData';

interface CMLDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (content: string) => void;
}

export function CMLDialog({ open, onClose, onInsert }: CMLDialogProps) {
  const [rules, setRules] = useKV<RuleData[]>('rule-data', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<string>('all');
  const [selectedRule, setSelectedRule] = useState<RuleData | null>(null);

  useEffect(() => {
    // Load mock data if no rules exist
    if (!Array.isArray(rules) || rules.length === 0) {
      generateMockRuleData().then(mockRules => {
        setRules(mockRules);
      });
    }
  }, [rules, setRules]);

  // Filter rules based on search and filter criteria
  const filteredRules = Array.isArray(rules) ? rules.filter(rule => {
    const matchesSearch = !searchQuery || 
      rule.templateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.ruleId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.businessArea?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
      rule.benefitType?.toLowerCase() === filterBy.toLowerCase() ||
      rule.businessArea?.toLowerCase() === filterBy.toLowerCase();
    
    return matchesSearch && matchesFilter;
  }) : [];

  const handleInsertRule = (rule: RuleData) => {
    // Format the rule content for insertion into the rich text editor
    const formattedContent = `
<div class="rule-insert" data-rule-id="${rule.ruleId}">
  <strong>${rule.templateName || 'Untitled Rule'}</strong>
  <br/>
  <em>Rule ID: ${rule.ruleId}</em>
  <br/>
  ${rule.description || 'No description available'}
  ${rule.content ? `<br/><br/>${rule.content}` : ''}
</div>
    `.trim();
    
    onInsert(formattedContent);
    onClose();
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={20} />
            Content Management Library (CML)
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rules by name, description, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="medicare advantage">Medicare Advantage</SelectItem>
                <SelectItem value="medicare part d">Medicare Part D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <div className="flex-1 overflow-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead>Rule ID</TableHead>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Business Area</TableHead>
                  <TableHead>Benefit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No rules found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRules.map((rule) => (
                    <TableRow 
                      key={rule.id} 
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedRule?.id === rule.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedRule(rule)}
                    >
                      <TableCell className="font-mono text-sm">
                        {rule.ruleId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {rule.templateName || 'Untitled'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {rule.businessArea || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {rule.benefitType || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(rule.status)}`}>
                          {rule.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {rule.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInsertRule(rule);
                          }}
                          className="h-8"
                        >
                          Insert
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Selected Rule Preview */}
          {selectedRule && (
            <div className="border rounded-lg p-4 bg-muted/20 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium text-sm">Preview: {selectedRule.templateName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRule.description || 'No description available'}
                  </p>
                  {selectedRule.content && (
                    <div className="text-xs bg-background p-2 rounded border max-h-20 overflow-auto">
                      {selectedRule.content.substring(0, 200)}
                      {selectedRule.content.length > 200 && '...'}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleInsertRule(selectedRule)}
                  className="flex-shrink-0"
                >
                  <Plus size={16} className="mr-2" />
                  Insert Selected
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-muted-foreground flex-shrink-0">
            <span>
              Showing {filteredRules.length} of {rules.length} rules
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}