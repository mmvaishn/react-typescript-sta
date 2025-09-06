import { useState, useEffect } from 'react';
import { RuleData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, MagicWand, CheckCircle, Clock, User, Calendar, Save, X } from '@phosphor-icons/react';
import { format, parse, isValid } from 'date-fns';
import { toast } from 'sonner';

interface RuleEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: RuleData | null;
  onSave: (updatedRule: RuleData) => void;
}

export function RuleEditDialog({ open, onOpenChange, rule, onSave }: RuleEditDialogProps) {
  const [formData, setFormData] = useState<RuleData | null>(null);
  
  // Initialize form data when rule changes
  useEffect(() => {
    if (rule) {
      setFormData({ ...rule });
    }
  }, [rule]);
  
  // Parse the effective date more robustly
  const parseEffectiveDate = (dateString: string): Date => {
    if (!dateString) return new Date('2025-01-01');
    
    try {
      // Try to parse as MM/dd/yyyy first
      let date = parse(dateString, 'MM/dd/yyyy', new Date());
      if (isValid(date)) return date;
      
      // Try as regular Date constructor
      date = new Date(dateString);
      if (isValid(date)) return date;
      
      // Default fallback
      return new Date('2025-01-01');
    } catch {
      return new Date('2025-01-01');
    }
  };
  
  const [contentEffectiveStartDate, setContentEffectiveStartDate] = useState<Date | undefined>(
    rule ? parseEffectiveDate(rule.effectiveDate || '') : new Date('2025-01-01')
  );
  const [contentEffectiveEndDate, setContentEffectiveEndDate] = useState<Date | undefined>(
    new Date('2025-12-31')
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');

  // Update dates when rule changes
  useEffect(() => {
    if (rule) {
      setContentEffectiveStartDate(parseEffectiveDate(rule.effectiveDate || ''));
      setContentEffectiveEndDate(new Date('2025-12-31'));
    }
  }, [rule]);

  const handleInputChange = (field: keyof RuleData, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null);
  };

  const handleSave = () => {
    if (!formData) return;
    
    const updatedRule = {
      ...formData,
      effectiveDate: contentEffectiveStartDate ? format(contentEffectiveStartDate, 'MM/dd/yyyy') : formData.effectiveDate,
      lastModified: new Date(),
      lastModifiedBy: 'Current User'
    };
    
    onSave(updatedRule);
    toast.success('Rule updated successfully');
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleValidate = () => {
    toast.info('Rule validation completed');
  };

  const handleViewPlanEligibility = () => {
    toast.info('Plan eligibility view opened');
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground tracking-tight">
                Edit Rule
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="text-xs">
                  ID: {formData.ruleId || 'AUTO-GEN'}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User size={12} />
                  <span>Last modified by {formData.lastModifiedBy || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  <span>{format(formData.lastModified || new Date(), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleValidate}>
                <CheckCircle size={16} className="mr-2" />
                Validate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-primary to-primary/90">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-6">
            <Tabs defaultValue="basic-info" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-muted/50">
                <TabsTrigger value="basic-info" className="text-sm">Basic Info</TabsTrigger>
                <TabsTrigger value="content" className="text-sm">Content</TabsTrigger>
                <TabsTrigger value="preview" className="text-sm">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic-info" className="space-y-6">
                {/* Rule Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    Rule Information
                  </h3>
                  
                  {/* First Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="benefit-category" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Benefit Category <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.templateName || ''} onValueChange={(value) => handleInputChange('templateName', value)}>
                        <SelectTrigger id="benefit-category" className="h-9">
                          <SelectValue placeholder="Select benefit category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fitness Rider">Fitness Rider</SelectItem>
                          <SelectItem value="Dental">Dental</SelectItem>
                          <SelectItem value="Vision">Vision</SelectItem>
                          <SelectItem value="Prescription Drugs">Prescription Drugs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="benefit-type" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Benefit Type <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.benefitType || ''} onValueChange={(value) => handleInputChange('benefitType', value)}>
                        <SelectTrigger id="benefit-type" className="h-9">
                          <SelectValue placeholder="Select benefit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Out of Pocket Maximum">Out of Pocket Maximum</SelectItem>
                          <SelectItem value="Copayment">Copayment</SelectItem>
                          <SelectItem value="Coinsurance">Coinsurance</SelectItem>
                          <SelectItem value="Deductible">Deductible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business-area" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Business Area <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.businessArea || ''} onValueChange={(value) => handleInputChange('businessArea', value)}>
                        <SelectTrigger id="business-area" className="h-9">
                          <SelectValue placeholder="Select business area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Customer Service">Customer Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sub-business-area" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Sub-business Area <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.subBusinessArea || ''} onValueChange={(value) => handleInputChange('subBusinessArea', value)}>
                        <SelectTrigger id="sub-business-area" className="h-9">
                          <SelectValue placeholder="Select sub-business area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MRK: DNSP">MRK: DNSP</SelectItem>
                          <SelectItem value="MRK: ANOC">MRK: ANOC</SelectItem>
                          <SelectItem value="MRK: EOC">MRK: EOC</SelectItem>
                          <SelectItem value="MRK: SB">MRK: SB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Second Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan-year" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Plan Year <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.version || ''} onValueChange={(value) => handleInputChange('version', value)}>
                        <SelectTrigger id="plan-year" className="h-9">
                          <SelectValue placeholder="Select plan year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                          <SelectItem value="2027">2027</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start-date" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Content Effective Start Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        date={contentEffectiveStartDate}
                        onDateChange={setContentEffectiveStartDate}
                        placeholder="01-01-2025"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end-date" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Content Effective End Date <span className="text-destructive">*</span>
                      </Label>
                      <DatePicker
                        date={contentEffectiveEndDate}
                        onDateChange={setContentEffectiveEndDate}
                        placeholder="31-12-2025"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Description <span className="text-destructive">*</span>
                      </Label>
                      <Select value={formData.description || ''} onValueChange={(value) => handleInputChange('description', value)}>
                        <SelectTrigger id="description" className="h-9">
                          <SelectValue placeholder="Select description" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Headline">Headline</SelectItem>
                          <SelectItem value="Body Text">Body Text</SelectItem>
                          <SelectItem value="Footer">Footer</SelectItem>
                          <SelectItem value="Disclaimer">Disclaimer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-border/30" />

                  {/* Third Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="network-type" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Network Type <span className="text-destructive">*</span>
                      </Label>
                      <Select defaultValue="INN">
                        <SelectTrigger id="network-type" className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INN">INN</SelectItem>
                          <SelectItem value="OON">OON</SelectItem>
                          <SelectItem value="Both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Status</Label>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant={formData.status === 'Active' ? 'default' : 'secondary'} className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle size={12} className="mr-1" />
                          {formData.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Rule Key Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    Rule Key Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rule-key" className="text-sm font-medium text-foreground flex items-center gap-1">
                        Rule Key <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="rule-key"
                          value={formData.key || ''}
                          onChange={(e) => handleInputChange('key', e.target.value)}
                          placeholder="MedicareAcupuncturePackage="
                          className="flex-1 h-9"
                        />
                        <Button variant="outline" size="sm" onClick={handleValidate} className="h-9">
                          <CheckCircle size={16} className="mr-2" />
                          Validate
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary h-9">
                          <MagicWand size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-900">Affected Individual Plans: 5</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Affected Group Plans: 0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                {/* Language and Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Template */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Content Template
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">Language Options</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge 
                            variant={selectedLanguage === 'english' ? 'default' : 'secondary'} 
                            className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                            onClick={() => setSelectedLanguage('english')}
                          >
                            English
                          </Badge>
                          <Badge 
                            variant={selectedLanguage === 'spanish' ? 'default' : 'secondary'} 
                            className="cursor-pointer px-3 py-1 transition-all hover:scale-105"
                            onClick={() => setSelectedLanguage('spanish')}
                          >
                            Español
                          </Badge>
                          <Badge variant="outline" className="cursor-pointer px-3 py-1 transition-all hover:scale-105">
                            中文
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-foreground mb-3 block">Formatting Tools</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                            H
                          </Button>
                          <Button variant="outline" size="sm" disabled className="h-8 w-8 p-0">
                            Hi
                          </Button>
                          <Button variant="outline" size="sm" disabled className="h-8 px-2">
                            fo()
                          </Button>
                          <Button variant="outline" size="sm" disabled className="h-8 px-2">
                            ()
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content-text" className="text-sm font-medium text-foreground">
                          Content Text
                        </Label>
                        <Textarea
                          id="content-text"
                          placeholder="Enter your content text here..."
                          className="min-h-32 resize-none"
                          value={formData.content || ''}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Content Preview
                      </h3>
                      <Button variant="ghost" size="sm" onClick={handleViewPlanEligibility} className="text-primary hover:bg-primary/10">
                        <Eye size={16} className="mr-2" />
                        View Plan Eligibility
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Select Plan for Preview</Label>
                        <Select defaultValue="">
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="plan1">Plan A - Individual</SelectItem>
                            <SelectItem value="plan2">Plan B - Family</SelectItem>
                            <SelectItem value="plan3">Plan C - Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 rounded-lg border border-border/30 min-h-32">
                        <p className="text-sm text-muted-foreground italic">
                          Select a plan and click Apply to preview content with actual data values.
                        </p>
                        {formData.content && (
                          <div className="mt-3 p-2 bg-card rounded border text-sm">
                            {formData.content}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Clear
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Rule Preview
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Rule Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Benefit Category:</span>
                            <span className="font-medium">{formData.templateName || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Benefit Type:</span>
                            <span className="font-medium">{formData.benefitType || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Business Area:</span>
                            <span className="font-medium">{formData.businessArea || 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Effective Date:</span>
                            <span className="font-medium">
                              {contentEffectiveStartDate ? format(contentEffectiveStartDate, 'MMM dd, yyyy') : 'Not set'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-foreground">Validation Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Required fields completed</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>Rule key format valid</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock size={16} className="text-yellow-500" />
                            <span>Content validation pending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3">Generated Output Preview</h4>
                      <div className="p-4 bg-gradient-to-br from-card to-muted/20 rounded-lg border min-h-24">
                        <p className="text-sm text-muted-foreground">
                          Rule output will appear here once all required fields are completed and validated.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}