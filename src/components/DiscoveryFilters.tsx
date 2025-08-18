import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface FilterState {
  searchQuery: string;
  selectedDiscipline: string;
  selectedField: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface DiscoveryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

interface Category {
  level_1_discipline: string;
  level_2_field: string;
}

export const DiscoveryFilters = ({ filters, onFiltersChange }: DiscoveryFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('level_1_discipline, level_2_field')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique disciplines
  const disciplines = Array.from(new Set(categories.map(c => c.level_1_discipline))).sort();
  
  // Get fields for selected discipline
  const fieldsForDiscipline = categories
    .filter(c => c.level_1_discipline === filters.selectedDiscipline)
    .map(c => c.level_2_field);
  const uniqueFields = Array.from(new Set(fieldsForDiscipline)).sort();

  const handleDisciplineChange = (discipline: string) => {
    onFiltersChange({ 
      selectedDiscipline: discipline,
      selectedField: '' // Reset field when discipline changes
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      selectedDiscipline: '',
      selectedField: '',
      dateFrom: undefined,
      dateTo: undefined
    });
  };

  const hasActiveFilters = filters.selectedDiscipline || filters.selectedField || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Main Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Research Discipline</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.selectedDiscipline}
            onValueChange={handleDisciplineChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select discipline" />
            </SelectTrigger>
            <SelectContent>
              {disciplines.map((discipline) => (
                <SelectItem key={discipline} value={discipline}>
                  {discipline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Secondary Category Filter */}
      {filters.selectedDiscipline && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Research Field</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={filters.selectedField}
              onValueChange={(field) => onFiltersChange({ selectedField: field })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {uniqueFields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Publication Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? format(filters.dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateFrom}
                  onSelect={(date) => onFiltersChange({ dateFrom: date })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">To Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateTo ? format(filters.dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.dateTo}
                  onSelect={(date) => onFiltersChange({ dateTo: date })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              {filters.selectedDiscipline && (
                <div className="flex items-center justify-between">
                  <span>Discipline:</span>
                  <span className="font-medium">{filters.selectedDiscipline}</span>
                </div>
              )}
              {filters.selectedField && (
                <div className="flex items-center justify-between">
                  <span>Field:</span>
                  <span className="font-medium">{filters.selectedField}</span>
                </div>
              )}
              {filters.dateFrom && (
                <div className="flex items-center justify-between">
                  <span>From:</span>
                  <span className="font-medium">{format(filters.dateFrom, "MMM dd, yyyy")}</span>
                </div>
              )}
              {filters.dateTo && (
                <div className="flex items-center justify-between">
                  <span>To:</span>
                  <span className="font-medium">{format(filters.dateTo, "MMM dd, yyyy")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};