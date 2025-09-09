import { useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { RuleGrid } from '@/components/pages/RuleGrid';
import { ActivityLog } from '@/components/pages/ActivityLog';
import { RuleData } from '@/lib/types';
import { generateMockRuleData } from '@/lib/mockRuleData';
import { toast } from 'sonner';

interface DigitalContentManagerProps {
  onNavigate: (page: string) => void;
  onEditRule?: (rule: RuleData) => void;
}

export function DigitalContentManager({ onNavigate, onEditRule }: DigitalContentManagerProps) {
  const [rules, setRules] = useKV<RuleData[]>('rule-data', []);
  const [selectedConfig, setSelectedConfig] = useKV<string>('selected-dcm-config', 'digital-content-manager-anoc-eoc');
  const [activityLogCollapsed, setActivityLogCollapsed] = useKV<boolean>('dcm-activity-log-collapsed', false);
  const [langRepeaterDataLoaded, setLangRepeaterDataLoaded] = useKV<boolean>('lang-repeater-data-loaded', false);

  useEffect(() => {
    // Load mock data if no rules exist - ensure rules is an array
    if (!Array.isArray(rules) || rules.length === 0) {
      generateMockRuleData().then(mockRules => {
        setRules(mockRules);
      });
    }
  }, [rules, setRules]);

  // Auto-load Language Repeater 2 data when Digital Content Manager is loaded
  useEffect(() => {
    if (!langRepeaterDataLoaded && Array.isArray(rules)) {
      loadLanguageRepeaterData();
    }
  }, [langRepeaterDataLoaded, rules]);

  // Mock data extraction from Language Repeater 2 - simulates PDF parsing
  const extractLanguageRepeaterData = async (): Promise<Array<{
    title: string;
    benefitType: string;
    businessArea: string;
    subBusinessArea: string;
    description: string;
  }>> => {
    // Simulate PDF processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock extracted data that would come from Language Repeater 2 PDF
    return [
      {
        title: "Medicare Annual Notice of Change",
        benefitType: "Medical",
        businessArea: "Medicare Advantage",
        subBusinessArea: "Plan Changes",
        description: "Annual notification of plan benefit changes for Medicare Advantage members"
      },
      {
        title: "Evidence of Coverage Document",
        benefitType: "Medical",
        businessArea: "Medicare Advantage", 
        subBusinessArea: "Coverage Details",
        description: "Comprehensive coverage details and benefit explanations"
      },
      {
        title: "Prescription Drug Coverage Notice",
        benefitType: "Pharmacy",
        businessArea: "Medicare Part D",
        subBusinessArea: "Drug Coverage",
        description: "Information about prescription drug coverage changes and benefits"
      },
      {
        title: "Provider Network Updates",
        benefitType: "Medical",
        businessArea: "Network Management",
        subBusinessArea: "Provider Changes",
        description: "Updates to healthcare provider network and access information"
      },
      {
        title: "Formulary Changes Notice",
        benefitType: "Pharmacy",
        businessArea: "Medicare Part D",
        subBusinessArea: "Formulary Updates",
        description: "Changes to covered medications and formulary updates"
      }
    ];
  };

  const loadLanguageRepeaterData = async () => {
    try {
      // Extract data from Language Repeater 2 PDF
      const extractedData = await extractLanguageRepeaterData();
      
      let matched = 0;
      let created = 0;
      let updated = 0;
      const processedTitles: string[] = [];

      // Process each extracted item
      for (const item of extractedData) {
        const existingRule = rules.find(rule => 
          rule.templateName?.toLowerCase().includes(item.title.toLowerCase()) ||
          item.title.toLowerCase().includes(rule.templateName?.toLowerCase() || '')
        );

        if (existingRule) {
          // Update existing rule with new data
          const updatedRule: RuleData = {
            ...existingRule,
            benefitType: item.benefitType,
            businessArea: item.businessArea,
            subBusinessArea: item.subBusinessArea,
            description: item.description,
            lastModified: new Date().toISOString(),
            lastModifiedBy: 'Language Repeater 2 Auto-Load'
          };

          setRules(current => 
            current.map(rule => 
              rule.id === existingRule.id ? updatedRule : rule
            )
          );

          matched++;
          updated++;
          processedTitles.push(item.title);

          // Log the update activity
          if ((window as any).addActivityLog) {
            (window as any).addActivityLog({
              user: 'System',
              action: 'upload',
              target: `Rule ${existingRule.ruleId}`,
              details: `Updated from Language Repeater 2: ${item.title}`,
              ruleId: existingRule.ruleId,
            });
          }
        } else {
          // Create new rule for unmatched titles
          const newRuleId = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newRule: RuleData = {
            id: newRuleId,
            ruleId: newRuleId,
            templateName: item.title,
            benefitType: item.benefitType,
            businessArea: item.businessArea,
            subBusinessArea: item.subBusinessArea,
            description: item.description,
            version: "1.0",
            effectiveDate: "2025-01-01",
            lastModified: new Date().toISOString(),
            lastModifiedBy: 'Language Repeater 2 Auto-Load',
            status: 'Draft',
            category: 'Medicare',
            language: "English",
            repeaterType: "ANOC-EOC",
            published: false
          };

          setRules(current => [newRule, ...current]);
          created++;
          processedTitles.push(item.title);

          // Log the creation activity
          if ((window as any).addActivityLog) {
            (window as any).addActivityLog({
              user: 'System',
              action: 'create',
              target: `Rule ${newRule.ruleId}`,
              details: `Created from Language Repeater 2: ${item.title}`,
              ruleId: newRule.ruleId,
            });
          }
        }
      }

      setLangRepeaterDataLoaded(true);

      // Show summary toast
      toast.success(
        `Language Repeater 2 data loaded successfully! ${matched} titles matched, ${updated} updated, ${created} created.`,
        {
          description: `Processed titles: ${processedTitles.join(', ')}`,
          duration: 5000,
        }
      );

    } catch (error) {
      console.error('Error loading Language Repeater 2 data:', error);
      toast.error('Failed to load Language Repeater 2 data');
    }
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

  return (
    <div className="h-full bg-background overflow-hidden flex flex-col relative">
      {/* Compact Header */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">Digital Content Manager</h1>
              <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select configuration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital-content-manager-anoc-eoc">Digital Content Manager - ANOC-EOC</SelectItem>
                  <SelectItem value="digital-content-manager-general">Digital Content Manager - General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Height Container for Grid */}
      <div className="flex-1 overflow-hidden">
        <RuleGrid 
          rules={rules} 
          onRuleUpdate={handleRuleUpdate}
          onRuleCreate={handleRuleCreate}
          onRuleDelete={handleRuleDelete}
          onEditRule={onEditRule || (() => {})}
          onNavigate={onNavigate}
        />
      </div>

      {/* Activity Log at Bottom */}
      <div className={`${activityLogCollapsed ? 'h-12' : 'h-64'} border-t border-border flex-shrink-0`}>
        <ActivityLog 
          isCollapsed={activityLogCollapsed}
          onToggle={() => setActivityLogCollapsed(!activityLogCollapsed)}
        />
      </div>

      <Toaster />
    </div>
  );
}