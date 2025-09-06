import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CalendarBlank, X, Check } from '@phosphor-icons/react';
import { RuleData } from '@/lib/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface RuleDetailsPageProps {
  onNavigate: (page: string) => void;
  rule?: RuleData | null;
  mode?: 'create' | 'edit';
}

export function RuleDetailsPage({ onNavigate, rule, mode = 'create' }: RuleDetailsPageProps) {
  const [rules, setRules] = useKV<RuleData[]>('rule-data', []);
  
  // Form state - using existing RuleData fields
  const [formData, setFormData] = useState({
    benefitCategory: '', // Will map to a custom field or templateName
    benefitType: '',
    businessArea: '',
    subBusinessArea: '',
    version: '2026', // Plan Year maps to version
    effectiveDate: new Date(2025, 0, 1), // January 1, 2025
    endDate: new Date(2026, 11, 31), // December 31, 2026
    networkType: 'INN', // Custom field for this form
    description: 'Headline',
    rule: '',
    affectedIndividualPlans: 5, // Custom field for this form
    affectedGroupPlans: 0, // Custom field for this form
    language: 'English' // Custom field for this form
  });

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English']);
  const [activeTab, setActiveTab] = useState<'template' | 'preview'>('template');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Initialize form data if editing
  useEffect(() => {
    if (mode === 'edit' && rule) {
      setFormData({
        benefitCategory: rule.templateName || '',
        benefitType: rule.benefitType || '',
        businessArea: rule.businessArea || '',
        subBusinessArea: rule.subBusinessArea || '',
        version: rule.version || '2026',
        effectiveDate: rule.effectiveDate ? new Date(rule.effectiveDate) : new Date(2025, 0, 1),
        endDate: new Date(2026, 11, 31),
        networkType: 'INN',
        description: rule.description || 'Headline',
        rule: rule.rule || '',
        affectedIndividualPlans: 5,
        affectedGroupPlans: 0,
        language: 'English'
      });
    }
  }, [mode, rule]);

  // Generate unique Rule ID
  const generateUniqueRuleId = (): string => {
    const safeRules = Array.isArray(rules) ? rules : [];
    const existingRuleIds = new Set(safeRules.map(rule => rule.ruleId).filter(Boolean));
    let counter = 1;
    
    // Find the highest existing rule number
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
    
    let ruleId: string;
    do {
      ruleId = `R${String(counter).padStart(4, '0')}`;
      counter++;
    } while (existingRuleIds.has(ruleId));
    
    return ruleId;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(lang => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const handleSave = () => {
    if (mode === 'create') {
      const newRuleId = generateUniqueRuleId();
      const newRule: RuleData = {
        id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ruleId: newRuleId,
        effectiveDate: formData.effectiveDate ? format(formData.effectiveDate, 'MM/dd/yyyy') : '01/01/2025',
        version: formData.version || '2026',
        benefitType: formData.benefitType || '',
        businessArea: formData.businessArea || '',
        subBusinessArea: formData.subBusinessArea || '',
        description: formData.description || '',
        templateName: formData.benefitCategory || '',
        serviceId: '',
        cmsRegulated: false,
        chapterName: '',
        sectionName: '',
        subsectionName: '',
        serviceGroup: '',
        sourceMapping: '',
        tiers: '',
        key: '',
        rule: formData.rule || '',
        isTabular: false,
        english: formData.rule || '',
        englishStatus: 'Draft',
        spanish: '',
        spanishStatus: 'Draft',
        published: false,
        createdAt: new Date(),
        lastModified: new Date()
      };

      setRules(current => {
        const safeRules = Array.isArray(current) ? current : [];
        return [newRule, ...safeRules];
      });

      // Log the rule creation activity
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: 'create',
          target: `Rule ${newRuleId}`,
          details: `Created new rule with auto-generated ID: ${newRuleId}`,
          ruleId: newRuleId,
        });
      }

      toast.success(`New rule created with ID: ${newRuleId}`);
    } else if (mode === 'edit' && rule) {
      // Handle rule update
      const updatedRule: RuleData = {
        ...rule,
        effectiveDate: formData.effectiveDate ? format(formData.effectiveDate, 'MM/dd/yyyy') : rule.effectiveDate,
        version: formData.version || rule.version,
        benefitType: formData.benefitType || rule.benefitType,
        businessArea: formData.businessArea || rule.businessArea,
        subBusinessArea: formData.subBusinessArea || rule.subBusinessArea,
        description: formData.description || rule.description,
        templateName: formData.benefitCategory || rule.templateName,
        rule: formData.rule || rule.rule || '',
        english: formData.rule || rule.english || '',
        lastModified: new Date()
      };

      setRules(current => {
        const safeRules = Array.isArray(current) ? current : [];
        return safeRules.map(r => r.id === rule.id ? updatedRule : r);
      });

      toast.success('Rule updated successfully');
    }

    // Navigate back to the main page
    onNavigate('manage');
  };

  const handleClear = () => {
    setFormData({
      benefitCategory: '',
      benefitType: '',
      businessArea: '',
      subBusinessArea: '',
      version: '2026',
      effectiveDate: new Date(2025, 0, 1),
      endDate: new Date(2026, 11, 31),
      networkType: 'INN',
      description: 'Headline',
      rule: '',
      affectedIndividualPlans: 5,
      affectedGroupPlans: 0,
      language: 'English'
    });
    setSelectedLanguages(['English']);
    setSelectedPlan('');
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b border-border flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('manage')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Rule Details</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClear} className="flex items-center gap-2">
                <X size={16} />
                Clear
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Check size={16} />
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Rule Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="benefitCategory" className="text-sm font-medium">
                    Benefit Category *
                  </Label>
                  <Select value={formData.benefitCategory || ''} onValueChange={(value) => handleInputChange('benefitCategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fitness Rider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness-rider">Fitness Rider</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="dental">Dental</SelectItem>
                      <SelectItem value="vision">Vision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefitType" className="text-sm font-medium">
                    Benefit Type *
                  </Label>
                  <Select value={formData.benefitType || ''} onValueChange={(value) => handleInputChange('benefitType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Out of Pocket Maximum" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="out-of-pocket-maximum">Out of Pocket Maximum</SelectItem>
                      <SelectItem value="deductible">Deductible</SelectItem>
                      <SelectItem value="copayment">Copayment</SelectItem>
                      <SelectItem value="coinsurance">Coinsurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessArea" className="text-sm font-medium">
                    Business Area *
                  </Label>
                  <Select value={formData.businessArea || ''} onValueChange={(value) => handleInputChange('businessArea', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Marketing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subBusinessArea" className="text-sm font-medium">
                    Sub-business Area *
                  </Label>
                  <Select value={formData.subBusinessArea || ''} onValueChange={(value) => handleInputChange('subBusinessArea', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="MRK: DNSP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mrk-dnsp">MRK: DNSP</SelectItem>
                      <SelectItem value="mrk-anoc">MRK: ANOC</SelectItem>
                      <SelectItem value="mrk-eoc">MRK: EOC</SelectItem>
                      <SelectItem value="ops-claims">OPS: Claims</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planYear" className="text-sm font-medium">
                    Plan Year *
                  </Label>
                  <Select value={formData.version || '2026'} onValueChange={(value) => handleInputChange('version', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Contract Effective Start Date *
                  </Label>
                  <DatePicker
                    date={formData.effectiveDate}
                    onDateChange={(date) => handleInputChange('effectiveDate', date)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Contract Effective End Date *
                  </Label>
                  <DatePicker
                    date={formData.endDate}
                    onDateChange={(date) => handleInputChange('endDate', date)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description *
                  </Label>
                  <Select value={formData.description || ''} onValueChange={(value) => handleInputChange('description', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Headline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headline">Headline</SelectItem>
                      <SelectItem value="detail">Detail</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="networkType" className="text-sm font-medium">
                    Network Type *
                  </Label>
                  <Select value={formData.networkType || 'INN'} onValueChange={(value) => handleInputChange('networkType', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INN">INN</SelectItem>
                      <SelectItem value="OON">OON</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Key Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Key *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={formData.rule || ''}
                  onChange={(e) => handleInputChange('rule', e.target.value)}
                  placeholder="Medicare|AcupuncturePackage|="
                  className="min-h-[100px] font-mono text-sm"
                />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Affected Individual Plans: {formData.affectedIndividualPlans || 5}</span>
                  <span>Affected Group Plans: {formData.affectedGroupPlans || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Selection */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                {['English', 'Español'].map((language) => (
                  <Badge
                    key={language}
                    variant={selectedLanguages.includes(language) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-1 ${
                      selectedLanguages.includes(language) 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                    }`}
                    onClick={() => handleLanguageToggle(language)}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Template and Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Button
                  variant={activeTab === 'template' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('template')}
                  className={activeTab === 'template' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Content Template
                </Button>
                <Button
                  variant={activeTab === 'preview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('preview')}
                  className={activeTab === 'preview' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  Content Preview
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {activeTab === 'template' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {['()', 'H', 'H+', '()'].map((item, index) => (
                      <Button key={index} variant="outline" size="sm" className="h-8">
                        {item}
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Content template will appear here..."
                    className="min-h-[200px]"
                    readOnly
                  />
                </div>
              )}
              {activeTab === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Content Preview</h3>
                    <Button variant="link" size="sm" className="text-purple-600">
                      View Plan Eligibility
                    </Button>
                  </div>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plan1">Plan 1</SelectItem>
                      <SelectItem value="plan2">Plan 2</SelectItem>
                      <SelectItem value="plan3">Plan 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-[200px] border border-border rounded-md p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      Select a plan and click Apply to preview content.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}