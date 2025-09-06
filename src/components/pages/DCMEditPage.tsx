import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Gear, FileText, Globe, Check, X } from '@phosphor-icons/react';
import { format, parse, isValid } from 'date-fns';
import { RuleData } from '@/lib/types';
import { toast } from 'sonner';

interface DCMEditPageProps {
  rule: RuleData | null;
  onNavigate: (page: string) => void;
  onSave?: (rule: RuleData) => void;
  mode: 'edit' | 'create';
}

export function DCMEditPage({ rule, onNavigate, onSave, mode }: DCMEditPageProps) {
  const [formData, setFormData] = useState<RuleData>({
    id: '',
    ruleId: '',
    effectiveDate: '01/01/2026',
    version: '2026',
    benefitType: 'Out of Pocket Maximum',
    businessArea: 'Marketing',
    subBusinessArea: 'MRK: DNSP',
    description: 'Headline',
    templateName: 'Fitness Rider',
    serviceId: '',
    cmsRegulated: false,
    chapterName: '',
    sectionName: '',
    subsectionName: '',
    serviceGroup: 'INN',
    sourceMapping: '',
    tiers: '',
    key: 'Medicare|Acupuncture|Package|=',
    rule: '',
    isTabular: false,
    english: '',
    englishStatus: 'Draft',
    spanish: '',
    spanishStatus: 'Draft',
    published: false,
    createdAt: new Date(),
    lastModified: new Date()
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (rule && mode === 'edit') {
      setFormData(rule);
    }
  }, [rule, mode]);

  const formatDateForDisplay = (dateString: string): Date | undefined => {
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
      
      // Try to parse as MM-dd-yyyy format
      date = parse(dateString, 'MM-dd-yyyy', new Date());
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

  const handleInputChange = (field: keyof RuleData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      lastModified: new Date()
    }));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      handleInputChange('effectiveDate', formatDateForStorage(newDate));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validation
      if (!formData.templateName || !formData.templateName.trim()) {
        toast.error('Benefit Category is required');
        return;
      }
      if (!formData.benefitType || !formData.benefitType.trim()) {
        toast.error('Benefit Type is required');
        return;
      }
      if (!formData.businessArea || !formData.businessArea.trim()) {
        toast.error('Business Area is required');
        return;
      }
      if (!formData.subBusinessArea || !formData.subBusinessArea.trim()) {
        toast.error('Sub-Business Area is required');
        return;
      }

      // Generate rule ID if creating new
      if (mode === 'create') {
        const newRuleId = `R${String(Date.now()).slice(-4)}`;
        formData.ruleId = newRuleId;
        formData.id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        formData.createdAt = new Date();
      }

      if (onSave) {
        onSave(formData);
      }

      // Log the activity
      if ((window as any).addActivityLog) {
        (window as any).addActivityLog({
          user: 'Current User',
          action: mode === 'create' ? 'create' : 'edit',
          target: `Rule ${formData.ruleId}`,
          details: `${mode === 'create' ? 'Created' : 'Updated'} rule details`,
          ruleId: formData.ruleId,
        });
      }

      toast.success(`Rule ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      onNavigate('digital-content-manager');
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Failed to save rule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = () => {
    // Mock validation - in real app this would validate business rules
    toast.success('Rule validation passed successfully');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all changes?')) {
      if (mode === 'edit' && rule) {
        setFormData(rule);
      } else {
        setFormData({
          id: '',
          ruleId: '',
          effectiveDate: '01/01/2026',
          version: '2026',
          benefitType: 'Out of Pocket Maximum',
          businessArea: 'Marketing',
          subBusinessArea: 'MRK: DNSP',
          description: 'Headline',
          templateName: 'Fitness Rider',
          serviceId: '',
          cmsRegulated: false,
          chapterName: '',
          sectionName: '',
          subsectionName: '',
          serviceGroup: 'INN',
          sourceMapping: '',
          tiers: '',
          key: 'Medicare|Acupuncture|Package|=',
          rule: '',
          isTabular: false,
          english: '',
          englishStatus: 'Draft',
          spanish: '',
          spanishStatus: 'Draft',
          published: false,
          createdAt: new Date(),
          lastModified: new Date()
        });
      }
      toast.info('Form cleared');
    }
  };

  return (
    <div className="h-full bg-background overflow-auto">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('digital-content-manager')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Digital Content Manager
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {mode === 'edit' ? 'Edit Rule Details' : 'Create New Rule'}
              </h1>
              {mode === 'edit' && (
                <p className="text-sm text-muted-foreground">
                  Rule ID: <span className="font-mono font-medium">{formData.ruleId}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={handleValidate}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Check size={16} />
              Validate
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 bg-purple-600 text-white hover:bg-purple-700"
            >
              <Check size={16} />
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-6xl mx-auto">
        {/* Rule Information Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Rule Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="benefitCategory" className="text-sm font-medium">
                  Benefit Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.templateName || 'Fitness Rider'} onValueChange={(value) => handleInputChange('templateName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fitness Rider">Fitness Rider</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Dental">Dental</SelectItem>
                    <SelectItem value="Vision">Vision</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefitType" className="text-sm font-medium">
                  Benefit Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.benefitType || 'Out of Pocket Maximum'} onValueChange={(value) => handleInputChange('benefitType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Out of Pocket Maximum">Out of Pocket Maximum</SelectItem>
                    <SelectItem value="Copayment">Copayment</SelectItem>
                    <SelectItem value="Coinsurance">Coinsurance</SelectItem>
                    <SelectItem value="Deductible">Deductible</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessArea" className="text-sm font-medium">
                  Business Area <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.businessArea || 'Marketing'} onValueChange={(value) => handleInputChange('businessArea', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Medical Management">Medical Management</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subBusinessArea" className="text-sm font-medium">
                  Sub-business Area <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.subBusinessArea || 'MRK: DNSP'} onValueChange={(value) => handleInputChange('subBusinessArea', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MRK: DNSP">MRK: DNSP</SelectItem>
                    <SelectItem value="OPS: Claims">OPS: Claims</SelectItem>
                    <SelectItem value="COMP: Regulatory">COMP: Regulatory</SelectItem>
                    <SelectItem value="MED: Utilization">MED: Utilization</SelectItem>
                    <SelectItem value="FIN: Actuarial">FIN: Actuarial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="planYear" className="text-sm font-medium">
                  Plan Year <span className="text-red-500">*</span>
                </Label>
                <Select value="2026" onValueChange={(value) => handleInputChange('version', value)}>
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
                <Label htmlFor="effectiveStartDate" className="text-sm font-medium">
                  Content Effective Start Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={formatDateForDisplay(formData.effectiveDate)}
                  onDateChange={handleDateChange}
                  placeholder="01-01-2026"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectiveEndDate" className="text-sm font-medium">
                  Content Effective End Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={new Date(2026, 11, 31)} // December 31, 2026
                  onDateChange={() => {}} // Read-only for now
                  placeholder="31-12-2026"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Select value="Headline" onValueChange={(value) => handleInputChange('description', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headline">Headline</SelectItem>
                    <SelectItem value="Body Text">Body Text</SelectItem>
                    <SelectItem value="Footnote">Footnote</SelectItem>
                    <SelectItem value="Disclaimer">Disclaimer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="networkType" className="text-sm font-medium">
                  Network Type <span className="text-red-500">*</span>
                </Label>
                <Select value="INN" onValueChange={(value) => handleInputChange('serviceGroup', value)}>
                  <SelectTrigger>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Rule Key <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={formData.key || 'Medicare|Acupuncture|Package|='}
                onChange={(e) => handleInputChange('key', e.target.value)}
                placeholder="Enter rule key"
                className="min-h-[60px] font-mono text-sm"
              />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    Affected Individual Plans: 5
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Affected Group Plans: 0
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="default" size="sm" className="bg-blue-600 text-white">
                English
              </Button>
              <Button variant="outline" size="sm">
                Español
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Globe size={16} />
                繁
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Content Template */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Content Template</Label>
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    ()
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    III
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Ⅱ()
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    ()
                  </Button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Content Preview</Label>
                  <Button variant="link" size="sm" className="text-blue-600 text-xs">
                    View Plan Eligibility
                  </Button>
                </div>
                <Select value="" onValueChange={() => {}}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan1">Plan 1</SelectItem>
                    <SelectItem value="plan2">Plan 2</SelectItem>
                  </SelectContent>
                </Select>
                <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
                  Select a plan and click Apply to preview content.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}