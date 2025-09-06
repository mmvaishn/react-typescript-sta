import { useEffect, useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { RuleGrid } from '@/components/pages/RuleGrid';
import { ActivityLog } from '@/components/pages/ActivityLog';
import { MedicareEOCMasterList } from '@/components/pages/MedicareEOCMasterList';
import { RuleEditDialog } from '@/components/pages/RuleEditDialog';
import { RuleData } from '@/lib/types';
import { generateMockRuleData } from '@/lib/mockRuleData';

interface DocuGenPageProps {
  onNavigate: (page: string) => void;
  onEditRule?: (rule: RuleData) => void;
  onCreateRule?: () => void;
  onUpdateRule?: (rule: RuleData) => void;
}

export function DocuGenPage({ onNavigate, onEditRule, onCreateRule, onUpdateRule }: DocuGenPageProps) {
  const [rules, setRules] = useKV<RuleData[]>('rule-data', []);
  const [selectedConfig, setSelectedConfig] = useKV<string>('selected-config', 'medicare-anoc');
  const [selectedMedicareType, setSelectedMedicareType] = useKV<string>('selected-medicare-type', 'medicare-anoc');
  const [activityLogCollapsed, setActivityLogCollapsed] = useKV<boolean>('activity-log-collapsed', false);
  
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RuleData | null>(null);

  const handleEditRule = (rule: RuleData) => {
    setEditingRule(rule);
    setEditDialogOpen(true);
  };

  const handleRuleUpdate = (updatedRule: RuleData) => {
    setRules(current => {
      if (!Array.isArray(current)) {
        console.error('Rules state is not an array:', current);
        return [updatedRule];
      }
      return current.map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      );
    });
    
    // Log the rule update activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'edit',
        target: `Rule ${updatedRule.ruleId || 'N/A'}`,
        details: `Updated rule in ${updatedRule.templateName || 'Unknown Template'}`,
        ruleId: updatedRule.ruleId,
      });
    }
  };

  // Export the update function for use by other components
  useEffect(() => {
    (window as any).updateRule = handleRuleUpdate;
    return () => {
      delete (window as any).updateRule;
    };
  }, [handleRuleUpdate]);

  useEffect(() => {
    // Load mock data if no rules exist - ensure rules is an array
    if (!Array.isArray(rules) || rules.length === 0) {
      generateMockRuleData().then(mockRules => {
        setRules(mockRules);
      });
    }
  }, [rules, setRules]);

  const handleRuleCreate = (newRule: RuleData) => {
    setRules(current => {
      if (!Array.isArray(current)) {
        console.error('Rules state is not an array:', current);
        return [newRule];
      }
      return [newRule, ...current];
    });
    
    // Log the rule creation activity
    if ((window as any).addActivityLog) {
      (window as any).addActivityLog({
        user: 'Current User',
        action: 'create',
        target: `Rule ${newRule.ruleId}`,
        details: `Created new rule with auto-generated ID: ${newRule.ruleId}`,
        ruleId: newRule.ruleId,
      });
    }
  };

  const handleRuleDelete = (ruleId: string) => {
    setRules(current => {
      if (!Array.isArray(current)) {
        console.error('Rules state is not an array:', current);
        return [];
      }
      const ruleToDelete = current.find(rule => rule.ruleId === ruleId);
      const filteredRules = current.filter(rule => rule.ruleId !== ruleId);
      
      // Log the rule deletion activity and show toast
      if (ruleToDelete) {
        if ((window as any).addActivityLog) {
          (window as any).addActivityLog({
            user: 'Current User',
            action: 'delete',
            target: `Rule ${ruleId}`,
            details: `Deleted rule: ${ruleToDelete.templateName || 'Unknown Template'}`,
            ruleId: ruleId,
          });
        }
        toast.success(`Successfully deleted Rule ${ruleId}`);
      }
      
      return filteredRules;
    });
  };

  // If Medicare EOC is selected, show the Global Template view
  if (selectedConfig === 'medicare-eoc') {
    return <MedicareEOCMasterList onNavigate={onNavigate} />;
  }

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col relative">
      {/* Compact Header */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicare-anoc">Medicare ANOC</SelectItem>
                  <SelectItem value="medicare-eoc">Medicare EOC</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted Height for Activity Log */}
      <div className={`flex-1 overflow-hidden ${activityLogCollapsed ? '' : 'pb-64'}`}>
        <RuleGrid 
          rules={rules} 
          onRuleUpdate={handleRuleUpdate}
          onRuleCreate={handleRuleCreate}
          onRuleDelete={handleRuleDelete}
          onEditRule={handleEditRule}
          onCreateRule={onCreateRule}
        />
      </div>

      {/* Activity Log at Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 ${activityLogCollapsed ? 'h-auto' : 'h-64'}`}>
        <ActivityLog 
          isCollapsed={activityLogCollapsed}
          onToggle={() => setActivityLogCollapsed(!activityLogCollapsed)}
        />
      </div>

      {/* Edit Rule Dialog */}
      <RuleEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        rule={editingRule}
        onSave={handleRuleUpdate}
      />

      <Toaster />
    </div>
  );
}