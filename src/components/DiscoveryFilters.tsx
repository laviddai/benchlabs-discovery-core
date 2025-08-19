import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, X, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { UserPreferencesModal } from '@/components/UserPreferencesModal';

interface FilterState {
  searchQuery: string;
  selectedDiscipline: string;
  selectedField: string;
  selectedTickerSymbol: string;
  selectedJournal: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface DiscoveryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

interface UserPreferences {
  include_keywords: string[];
  exclude_keywords: string[];
  preferred_disciplines: string[];
  preferred_fields: string[];
  followed_ticker_symbols: string[];
  followed_journals: string[];
  excluded_journals: string[];
  keyword_logic: 'OR' | 'AND';
}

interface DiscoveryFiltersPropsWithPrefs extends DiscoveryFiltersProps {
  onPreferencesChange?: (preferences: UserPreferences | null) => void;
  currentPreferences?: UserPreferences | null;
  user?: any;
}

interface Category {
  level_1_discipline: string;
  level_2_field: string;
}

export const DiscoveryFilters = ({ 
  filters, 
  onFiltersChange, 
  onPreferencesChange, 
  currentPreferences, 
  user 
}: DiscoveryFiltersPropsWithPrefs) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tickerSymbols, setTickerSymbols] = useState<string[]>([]);
  const [journalsForTicker, setJournalsForTicker] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchTickerSymbols();
  }, []);

  useEffect(() => {
    if (filters.selectedTickerSymbol) {
      fetchJournalsForTicker(filters.selectedTickerSymbol);
    } else {
      setJournalsForTicker([]);
    }
  }, [filters.selectedTickerSymbol]);

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

  const fetchTickerSymbols = async () => {
    try {
      const { data, error } = await supabase
        .from('articles_with_metadata')
        .select('ticker_symbol')
        .not('ticker_symbol', 'is', null)
        .order('ticker_symbol');

      if (error) {
        console.error('Error fetching ticker symbols:', error);
        return;
      }

      // Get all unique ticker symbols (should be exactly 15)
      const uniqueSymbols = [...new Set(data?.map(d => d.ticker_symbol).filter(Boolean))] as string[];
      console.log('Found ticker symbols:', uniqueSymbols.length, uniqueSymbols);
      setTickerSymbols(uniqueSymbols.sort());
    } catch (error) {
      console.error('Error fetching ticker symbols:', error);
    }
  };

  const fetchJournalsForTicker = async (tickerSymbol: string) => {
    try {
      const { data, error } = await supabase
        .from('articles_with_metadata')
        .select('journal_name')
        .eq('ticker_symbol', tickerSymbol)
        .not('journal_name', 'is', null);

      if (error) {
        console.error('Error fetching journals for ticker:', error);
        return;
      }

      const uniqueJournals = [...new Set(data?.map(d => d.journal_name).filter(Boolean))] as string[];
      setJournalsForTicker(uniqueJournals.sort());
    } catch (error) {
      console.error('Error fetching journals for ticker:', error);
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

  const handleTickerSymbolChange = (tickerSymbol: string) => {
    onFiltersChange({
      selectedTickerSymbol: tickerSymbol,
      selectedJournal: '' // Reset journal when ticker changes
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      selectedDiscipline: '',
      selectedField: '',
      selectedTickerSymbol: '',
      selectedJournal: '',
      dateFrom: undefined,
      dateTo: undefined
    });
  };

  const hasActiveFilters = filters.selectedDiscipline || filters.selectedField || 
    filters.selectedTickerSymbol || filters.selectedJournal || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <div className="flex items-center space-x-2">
          {user && onPreferencesChange && (
            <UserPreferencesModal 
              onPreferencesChange={onPreferencesChange}
              currentPreferences={currentPreferences}
              triggerButtonText="Customize feed"
              triggerButtonIcon={<Settings className="h-4 w-4" />}
            />
          )}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
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

      {/* Ticker Symbol Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Ticker Symbol</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.selectedTickerSymbol}
            onValueChange={handleTickerSymbolChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ticker symbol" />
            </SelectTrigger>
            <SelectContent>
              {tickerSymbols.map((symbol) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Associated Journal Filter */}
      {filters.selectedTickerSymbol && journalsForTicker.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Associated Journal</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={filters.selectedJournal}
              onValueChange={(journal) => onFiltersChange({ selectedJournal: journal })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select journal" />
              </SelectTrigger>
              <SelectContent>
                {journalsForTicker.map((journal) => (
                  <SelectItem key={journal} value={journal}>
                    {journal}
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
              {filters.selectedTickerSymbol && (
                <div className="flex items-center justify-between">
                  <span>Ticker:</span>
                  <span className="font-medium">{filters.selectedTickerSymbol}</span>
                </div>
              )}
              {filters.selectedJournal && (
                <div className="flex items-center justify-between">
                  <span>Journal:</span>
                  <span className="font-medium">{filters.selectedJournal}</span>
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