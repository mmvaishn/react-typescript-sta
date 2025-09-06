import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Search } from '@phosphor-icons/react';

interface ColumnFilterProps {
  columnKey: string;
  columnTitle: string;
  values: string[];
  selectedValues: string[];
  onFilter: (values: string[]) => void;
  filterType?: 'text' | 'multiselect' | 'boolean';
  textValue?: string;
  onTextFilter?: (value: string) => void;
  booleanValue?: 'all' | 'true' | 'false';
  onBooleanFilter?: (value: 'all' | 'true' | 'false') => void;
}

export function ColumnFilter({ 
  columnKey,
  columnTitle, 
  values, 
  selectedValues, 
  onFilter,
  filterType = 'multiselect',
  textValue = '',
  onTextFilter,
  booleanValue = 'all',
  onBooleanFilter
}: ColumnFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredValues = values.filter(value => 
    value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveFilter = () => {
    switch (filterType) {
      case 'text':
        return textValue !== '';
      case 'boolean':
        return booleanValue !== 'all';
      case 'multiselect':
      default:
        return selectedValues.length > 0;
    }
  };

  const clearFilter = () => {
    switch (filterType) {
      case 'text':
        onTextFilter?.('');
        break;
      case 'boolean':
        onBooleanFilter?.('all');
        break;
      case 'multiselect':
      default:
        onFilter([]);
        break;
    }
    setIsOpen(false);
  };

  const handleValueToggle = (value: string, checked: boolean) => {
    if (checked) {
      onFilter([...selectedValues, value]);
    } else {
      onFilter(selectedValues.filter(v => v !== value));
    }
  };

  const handleSelectAll = () => {
    onFilter(values);
  };

  const handleSelectNone = () => {
    onFilter([]);
  };

  const renderTextFilter = () => (
    <div className="p-3 space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Filter {columnTitle}
        </label>
        <Input
          placeholder={`Enter ${columnTitle.toLowerCase()}...`}
          value={textValue}
          onChange={(e) => onTextFilter?.(e.target.value)}
          className="w-full"
        />
      </div>
      {textValue && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilter}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );

  const renderBooleanFilter = () => (
    <div className="p-3 space-y-3">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {columnTitle}
        </label>
        <div className="space-y-2">
          {['all', 'true', 'false'].map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={booleanValue === option}
                onCheckedChange={() => onBooleanFilter?.(option as 'all' | 'true' | 'false')}
              />
              <span className="text-sm">
                {option === 'all' ? 'All' : option === 'true' ? 'Yes' : 'No'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMultiSelectFilter = () => (
    <div className="w-80">
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm text-gray-900">Filter {columnTitle}</span>
          {hasActiveFilter() && (
            <Button variant="ghost" size="sm" onClick={clearFilter} className="h-6 px-2">
              <X size={12} />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      <div className="p-3 border-b bg-gray-50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectAll}
            className="h-7 text-xs"
          >
            Select All
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSelectNone}
            className="h-7 text-xs"
          >
            Clear All
          </Button>
        </div>
        {selectedValues.length > 0 && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              {selectedValues.length} selected
            </Badge>
          </div>
        )}
      </div>

      <ScrollArea className="max-h-64">
        <div className="p-2">
          {filteredValues.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No values found
            </div>
          ) : (
            <div className="space-y-1">
              {filteredValues.map(value => (
                <div key={value} className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedValues.includes(value)}
                    onCheckedChange={(checked) => handleValueToggle(value, checked as boolean)}
                  />
                  <span className="text-sm flex-1 truncate" title={value}>
                    {value || '(Empty)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 ${hasActiveFilter() ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Filter size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 border border-gray-200 shadow-lg"
        align="start"
        sideOffset={4}
      >
        {filterType === 'text' && renderTextFilter()}
        {filterType === 'boolean' && renderBooleanFilter()}
        {filterType === 'multiselect' && renderMultiSelectFilter()}
      </PopoverContent>
    </Popover>
  );
}