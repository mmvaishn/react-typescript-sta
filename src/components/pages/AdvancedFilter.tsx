import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Filter, 
  X, 
  Search, 
  Calendar as CalendarIcon,
  ChevronDown,
  RotateCcw
} from '@phosphor-icons/react';
import { RuleData } from '@/lib/types';

export interface FilterState {
  search: string;
  ruleId: string;
  effectiveDate: {
    from?: Date;
    to?: Date;
  };
  version: string[];
  templateName: string[];
  serviceId: string[];
  cmsRegulated: 'all' | 'true' | 'false';
  chapterName: string[];
  sectionName: string[];
  subsectionName: string[];
  serviceGroup: string[];
  sourceMapping: string[];
  tiers: string[];
  key: string[];
  rule: string;
  isTabular: 'all' | 'true' | 'false';
  english: string;
  englishStatus: string[];
  spanish: string;
  spanishStatus: string[];
}

const defaultFilters: FilterState = {
  search: '',
  ruleId: '',
  effectiveDate: {},
  version: [],
  templateName: [],
  serviceId: [],
  cmsRegulated: 'all',
  chapterName: [],
  sectionName: [],
  subsectionName: [],
  serviceGroup: [],
  sourceMapping: [],
  tiers: [],
  key: [],
  rule: '',
  isTabular: 'all',
  english: '',
  englishStatus: [],
  spanish: '',
  spanishStatus: []
};

interface AdvancedFilterProps {
  rules: RuleData[];
  onFiltersChange: (filteredRules: RuleData[]) => void;
}

export function AdvancedFilter({ rules, onFiltersChange }: AdvancedFilterProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique values for multi-select filters
  const uniqueValues = useMemo(() => {
    return {
      version: [...new Set(rules.map(r => r.version).filter(v => v && v.trim() !== ''))],
      templateName: [...new Set(rules.map(r => r.templateName).filter(v => v && v.trim() !== ''))],
      serviceId: [...new Set(rules.map(r => r.serviceId).filter(v => v && v.trim() !== ''))],
      chapterName: [...new Set(rules.map(r => r.chapterName).filter(v => v && v.trim() !== ''))],
      sectionName: [...new Set(rules.map(r => r.sectionName).filter(v => v && v.trim() !== ''))],
      subsectionName: [...new Set(rules.map(r => r.subsectionName).filter(v => v && v.trim() !== ''))],
      serviceGroup: [...new Set(rules.map(r => r.serviceGroup).filter(v => v && v.trim() !== ''))],
      sourceMapping: [...new Set(rules.map(r => r.sourceMapping).filter(v => v && v.trim() !== ''))],
      tiers: [...new Set(rules.map(r => r.tiers).filter(v => v && v.trim() !== ''))],
      key: [...new Set(rules.map(r => r.key).filter(v => v && v.trim() !== ''))],
      englishStatus: [...new Set(rules.map(r => r.englishStatus).filter(v => v && v.trim() !== ''))],
      spanishStatus: [...new Set(rules.map(r => r.spanishStatus).filter(v => v && v.trim() !== ''))]
    };
  }, [rules]);

  // Apply filters to rules
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      // Search filter (applies to multiple text fields)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          rule.ruleId, rule.templateName, rule.chapterName, 
          rule.sectionName, rule.subsectionName, rule.rule, 
          rule.english, rule.spanish
        ];
        if (!searchableFields.some(field => 
          field?.toLowerCase().includes(searchTerm)
        )) {
          return false;
        }
      }

      // Rule ID filter
      if (filters.ruleId && !rule.ruleId?.toLowerCase().includes(filters.ruleId.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (filters.effectiveDate.from || filters.effectiveDate.to) {
        if (!rule.effectiveDate) return false;
        
        let ruleDate: Date;
        try {
          ruleDate = new Date(rule.effectiveDate);
          // Check if date is valid
          if (isNaN(ruleDate.getTime())) return false;
        } catch {
          return false;
        }
        
        if (filters.effectiveDate.from && ruleDate < filters.effectiveDate.from) {
          return false;
        }
        if (filters.effectiveDate.to && ruleDate > filters.effectiveDate.to) {
          return false;
        }
      }

      // Multi-select filters
      if (filters.version.length > 0 && !filters.version.includes(rule.version || '')) return false;
      if (filters.templateName.length > 0 && !filters.templateName.includes(rule.templateName || '')) return false;
      if (filters.serviceId.length > 0 && !filters.serviceId.includes(rule.serviceId || '')) return false;
      if (filters.chapterName.length > 0 && !filters.chapterName.includes(rule.chapterName || '')) return false;
      if (filters.sectionName.length > 0 && !filters.sectionName.includes(rule.sectionName || '')) return false;
      if (filters.subsectionName.length > 0 && !filters.subsectionName.includes(rule.subsectionName || '')) return false;
      if (filters.serviceGroup.length > 0 && !filters.serviceGroup.includes(rule.serviceGroup || '')) return false;
      if (filters.sourceMapping.length > 0 && !filters.sourceMapping.includes(rule.sourceMapping || '')) return false;
      if (filters.tiers.length > 0 && !filters.tiers.includes(rule.tiers || '')) return false;
      if (filters.key.length > 0 && !filters.key.includes(rule.key || '')) return false;
      if (filters.englishStatus.length > 0 && !filters.englishStatus.includes(rule.englishStatus || '')) return false;
      if (filters.spanishStatus.length > 0 && !filters.spanishStatus.includes(rule.spanishStatus || '')) return false;

      // Boolean filters
      if (filters.cmsRegulated !== 'all') {
        const expectedValue = filters.cmsRegulated === 'true';
        if (rule.cmsRegulated !== expectedValue) return false;
      }
      
      if (filters.isTabular !== 'all') {
        const expectedValue = filters.isTabular === 'true';
        if (rule.isTabular !== expectedValue) return false;
      }

      // Text content filters
      if (filters.rule && !rule.rule?.toLowerCase().includes(filters.rule.toLowerCase())) {
        return false;
      }
      if (filters.english && !rule.english?.toLowerCase().includes(filters.english.toLowerCase())) {
        return false;
      }
      if (filters.spanish && !rule.spanish?.toLowerCase().includes(filters.spanish.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [rules, filters]);

  // Update filtered rules when filters change
  const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  }, [filters]);

  // Apply filters to parent component
  const applyFilters = useCallback(() => {
    onFiltersChange(filteredRules);
  }, [filteredRules, onFiltersChange]);

  // Apply filters whenever filteredRules changes
  useMemo(() => {
    onFiltersChange(filteredRules);
  }, [filteredRules, onFiltersChange]);

  const clearAllFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'effectiveDate') {
        return (value as any).from || (value as any).to;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        return value !== '' && value !== 'all';
      }
      return false;
    });
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'effectiveDate') {
        if ((value as any).from || (value as any).to) count++;
      } else if (Array.isArray(value)) {
        if (value.length > 0) count++;
      } else if (typeof value === 'string') {
        if (value !== '' && value !== 'all') count++;
      }
    });
    return count;
  }, [filters]);

  const MultiSelectFilter = ({ 
    values, 
    selectedValues, 
    onChange, 
    placeholder 
  }: {
    values: string[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedValues.length > 0 ? (
            <span className="truncate">
              {selectedValues.length === 1 ? selectedValues[0] : `${selectedValues.length} selected`}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="p-3 border-b">
          <div className="flex justify-between items-center">
            <span className="font-medium">Select {placeholder}</span>
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([])}
                className="h-6 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        <ScrollArea className="max-h-48">
          <div className="p-2">
            {values.map(value => (
              <div key={value} className="flex items-center space-x-2 py-1">
                <Checkbox
                  checked={selectedValues.includes(value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, value]);
                    } else {
                      onChange(selectedValues.filter(v => v !== value));
                    }
                  }}
                />
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );

  return (
    <Card className="w-full border-gray-200">
      <CardHeader className="pb-3 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-900">
              <Filter size={16} />
              Advanced Filters
            </CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredRules.length} of {rules.length} rules
            </span>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
              >
                <RotateCcw size={12} />
                Clear All
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 border-gray-300 hover:bg-gray-50"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
              <ChevronDown size={12} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Always visible: Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search across all fields..."
                value={filters.search}
                onChange={(e) => handleFiltersChange({ search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Input
              placeholder="Filter Rule ID"
              value={filters.ruleId}
              onChange={(e) => handleFiltersChange({ ruleId: e.target.value })}
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <Separator />
            
            {/* Date and Boolean Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Effective Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon size={14} className="mr-2" />
                      {filters.effectiveDate.from ? (
                        filters.effectiveDate.to ? (
                          `${filters.effectiveDate.from.toLocaleDateString()} - ${filters.effectiveDate.to.toLocaleDateString()}`
                        ) : (
                          `From ${filters.effectiveDate.from.toLocaleDateString()}`
                        )
                      ) : (
                        'Select date range'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3">
                      <Calendar
                        mode="range"
                        selected={{
                          from: filters.effectiveDate.from,
                          to: filters.effectiveDate.to
                        }}
                        onSelect={(range) => {
                          if (range) {
                            handleFiltersChange({
                              effectiveDate: {
                                from: range.from,
                                to: range.to
                              }
                            });
                          }
                        }}
                        numberOfMonths={2}
                      />
                      {(filters.effectiveDate.from || filters.effectiveDate.to) && (
                        <div className="flex justify-end pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFiltersChange({ effectiveDate: {} })}
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">CMS Regulated</label>
                <Select
                  value={filters.cmsRegulated}
                  onValueChange={(value) => handleFiltersChange({ cmsRegulated: value as 'all' | 'true' | 'false' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Is Tabular</label>
                <Select
                  value={filters.isTabular}
                  onValueChange={(value) => handleFiltersChange({ isTabular: value as 'all' | 'true' | 'false' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Multi-select Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Version</label>
                <MultiSelectFilter
                  values={uniqueValues.version}
                  selectedValues={filters.version}
                  onChange={(values) => handleFiltersChange({ version: values })}
                  placeholder="Version"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Template Name</label>
                <MultiSelectFilter
                  values={uniqueValues.templateName}
                  selectedValues={filters.templateName}
                  onChange={(values) => handleFiltersChange({ templateName: values })}
                  placeholder="Template"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service ID</label>
                <MultiSelectFilter
                  values={uniqueValues.serviceId}
                  selectedValues={filters.serviceId}
                  onChange={(values) => handleFiltersChange({ serviceId: values })}
                  placeholder="Service ID"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Chapter Name</label>
                <MultiSelectFilter
                  values={uniqueValues.chapterName}
                  selectedValues={filters.chapterName}
                  onChange={(values) => handleFiltersChange({ chapterName: values })}
                  placeholder="Chapter"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Section Name</label>
                <MultiSelectFilter
                  values={uniqueValues.sectionName}
                  selectedValues={filters.sectionName}
                  onChange={(values) => handleFiltersChange({ sectionName: values })}
                  placeholder="Section"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subsection Name</label>
                <MultiSelectFilter
                  values={uniqueValues.subsectionName}
                  selectedValues={filters.subsectionName}
                  onChange={(values) => handleFiltersChange({ subsectionName: values })}
                  placeholder="Subsection"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Service Group</label>
                <MultiSelectFilter
                  values={uniqueValues.serviceGroup}
                  selectedValues={filters.serviceGroup}
                  onChange={(values) => handleFiltersChange({ serviceGroup: values })}
                  placeholder="Service Group"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Source Mapping</label>
                <MultiSelectFilter
                  values={uniqueValues.sourceMapping}
                  selectedValues={filters.sourceMapping}
                  onChange={(values) => handleFiltersChange({ sourceMapping: values })}
                  placeholder="Source Mapping"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tiers</label>
                <MultiSelectFilter
                  values={uniqueValues.tiers}
                  selectedValues={filters.tiers}
                  onChange={(values) => handleFiltersChange({ tiers: values })}
                  placeholder="Tiers"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Key</label>
                <MultiSelectFilter
                  values={uniqueValues.key}
                  selectedValues={filters.key}
                  onChange={(values) => handleFiltersChange({ key: values })}
                  placeholder="Key"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">English Status</label>
                <MultiSelectFilter
                  values={uniqueValues.englishStatus}
                  selectedValues={filters.englishStatus}
                  onChange={(values) => handleFiltersChange({ englishStatus: values })}
                  placeholder="English Status"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Spanish Status</label>
                <MultiSelectFilter
                  values={uniqueValues.spanishStatus}
                  selectedValues={filters.spanishStatus}
                  onChange={(values) => handleFiltersChange({ spanishStatus: values })}
                  placeholder="Spanish Status"
                />
              </div>
            </div>

            <Separator />

            {/* Text Content Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Rule Content</label>
                <Input
                  placeholder="Filter rule text..."
                  value={filters.rule}
                  onChange={(e) => handleFiltersChange({ rule: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">English Content</label>
                <Input
                  placeholder="Filter English text..."
                  value={filters.english}
                  onChange={(e) => handleFiltersChange({ english: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Spanish Content</label>
                <Input
                  placeholder="Filter Spanish text..."
                  value={filters.spanish}
                  onChange={(e) => handleFiltersChange({ spanish: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}