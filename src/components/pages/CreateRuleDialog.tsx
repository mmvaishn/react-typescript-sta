import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ArrowLeft, Microphone } from '@phosphor-icons/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface CreateRuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ruleData: any) => void;
}

export function CreateRuleDialog({ isOpen, onClose, onSave }: CreateRuleDialogProps) {
  const [formData, setFormData] = useState({
    benefitType: 'Out of Pocket Maximum',
    benefitCategory: 'Part D Tier 2',
    businessArea: 'Portals, Materials',
    subBusinessArea: 'MRK: DNSP',
    planYear: '2026',
    contentEffectiveStartDate: '01/01/2026',
    contentEffectiveEndDate: '12/31/2026',
    description: 'Long Bullet w/ amount',
    networkType: 'INN/OON'
  });

  const [aiSuggestionLanguage, setAiSuggestionLanguage] = useState('English (US)');
  const [aiSuggestionText, setAiSuggestionText] = useState('product type is ppo');
  const [generatedKey, setGeneratedKey] = useState('Medicare[PlanProductType]=PPO');
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 0, 1)); // January 1, 2026
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 11, 31)); // December 31, 2026

  const benefitTypes = [
    'Out of Pocket Maximum',
    'Deductible',
    'Copayment',
    'Coinsurance'
  ];

  const benefitCategories = [
    'Part D Tier 1',
    'Part D Tier 2',
    'Part D Tier 3',
    'Part D Tier 4'
  ];

  const businessAreas = [
    'Portals, Materials',
    'Claims Processing',
    'Member Services',
    'Provider Network'
  ];

  const subBusinessAreas = [
    'MRK: DNSP',
    'MRK: HMO',
    'MRK: PPO',
    'MRK: POS'
  ];

  const planYears = [
    '2024',
    '2025',
    '2026',
    '2027'
  ];

  const descriptions = [
    'Long Bullet w/ amount',
    'Short Bullet',
    'Tabular Format',
    'Narrative Format'
  ];

  const networkTypes = [
    'INN/OON',
    'In-Network Only',
    'Out-of-Network Only'
  ];

  const languages = [
    'English (US)',
    'Spanish (US)',
    'French (CA)'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    // AI generation logic would go here
    // For now, just update the generated key based on the suggestion
    if (aiSuggestionText.toLowerCase().includes('ppo')) {
      setGeneratedKey('Medicare[PlanProductType]=PPO');
    } else {
      setGeneratedKey('Medicare[PlanProductType]=' + aiSuggestionText.toUpperCase());
    }
  };

  const handleValidate = () => {
    // Validation logic would go here
    console.log('Validating generated key...');
  };

  const handleKeyToEnglish = () => {
    // Convert key to English logic would go here
    console.log('Converting key to English...');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
  };

  const handleReset = () => {
    setFormData({
      benefitType: 'Out of Pocket Maximum',
      benefitCategory: 'Part D Tier 2',
      businessArea: 'Portals, Materials',
      subBusinessArea: 'MRK: DNSP',
      planYear: '2026',
      contentEffectiveStartDate: '01/01/2026',
      contentEffectiveEndDate: '12/31/2026',
      description: 'Long Bullet w/ amount',
      networkType: 'INN/OON'
    });
    setAiSuggestionText('product type is ppo');
    setGeneratedKey('Medicare[PlanProductType]=PPO');
    setStartDate(new Date(2026, 0, 1));
    setEndDate(new Date(2026, 11, 31));
  };

  const handleApply = () => {
    const ruleData = {
      ...formData,
      contentEffectiveStartDate: startDate ? format(startDate, 'MM/dd/yyyy') : '',
      contentEffectiveEndDate: endDate ? format(endDate, 'MM/dd/yyyy') : '',
      aiSuggestionText,
      generatedKey
    };
    onSave(ruleData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1">
              <ArrowLeft size={16} />
            </Button>
            <DialogTitle>Create Rule</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] space-y-6 p-1">
          {/* Rule Details Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* First Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="benefitType">Benefit Type *</Label>
                  <Select value={formData.benefitType} onValueChange={(value) => handleInputChange('benefitType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {benefitTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="benefitCategory">Benefit Category *</Label>
                  <Select value={formData.benefitCategory} onValueChange={(value) => handleInputChange('benefitCategory', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {benefitCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessArea">Business Area *</Label>
                  <Select value={formData.businessArea} onValueChange={(value) => handleInputChange('businessArea', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {businessAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subBusinessArea">Sub-business Area *</Label>
                  <Select value={formData.subBusinessArea} onValueChange={(value) => handleInputChange('subBusinessArea', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subBusinessAreas.map(area => (
                        <SelectItem key={area} value={area}>{area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planYear">Plan Year *</Label>
                  <Select value={formData.planYear} onValueChange={(value) => handleInputChange('planYear', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {planYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentEffectiveStartDate">Content Effective Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'MM/dd/yyyy') : '01/01/2026'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentEffectiveEndDate">Content Effective End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'MM/dd/yyyy') : '12/31/2026'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Select value={formData.description} onValueChange={(value) => handleInputChange('description', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {descriptions.map(desc => (
                        <SelectItem key={desc} value={desc}>{desc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="networkType">Network Type *</Label>
                  <Select value={formData.networkType} onValueChange={(value) => handleInputChange('networkType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networkTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Key - AI Suggestions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Key - AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ai-suggestions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai-suggestions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={aiSuggestionLanguage} onValueChange={setAiSuggestionLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-end">
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleGenerate}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiSuggestion">Alternate Key (Condition) Natural Language Suggestions</Label>
                    <div className="relative">
                      <Textarea 
                        value={aiSuggestionText}
                        onChange={(e) => setAiSuggestionText(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Enter natural language description..."
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute bottom-2 right-2 p-1"
                        onClick={() => {/* Voice input logic */}}
                      >
                        <Microphone size={16} />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="conditions" className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    Conditions tab content would be implemented here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Generated Key Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-purple-600">Generated Key *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input 
                  value={generatedKey}
                  onChange={(e) => setGeneratedKey(e.target.value)}
                  className="font-mono"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleValidate} className="bg-purple-600 text-white hover:bg-purple-700">
                  Validate
                </Button>
                <Button variant="outline" onClick={handleKeyToEnglish} className="bg-purple-600 text-white hover:bg-purple-700">
                  Key to English
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  📋 Copy
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Affected Individual Plans:</span> <span>0</span>
                </div>
                <div>
                  <span className="font-medium">Affected Group Plans:</span> <span>0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border pt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply} className="bg-purple-600 hover:bg-purple-700 text-white">
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}