import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Filter, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  level_1_discipline: string;
  level_2_field: string;
  level_3_specialization?: string;
  level_4_subspecialization?: string;
  description?: string;
}

interface CategoryFilterData {
  discipline: string;
  fields: string[];
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  categoryData?: CategoryFilterData[];
}

export const CategoryFilter = ({ 
  selectedCategories, 
  onCategoryChange, 
  categoryData 
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDisciplines, setExpandedDisciplines] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Use provided categoryData if available, otherwise fetch from database
    if (categoryData) {
      setLoading(false);
    } else {
      fetchCategories();
    }
  }, [categoryData]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('level_1_discipline', { ascending: true });

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

  // Use provided categoryData or generate from database categories
  const groupedCategories = categoryData 
    ? categoryData.reduce((acc, item) => {
        acc[item.discipline] = item.fields.reduce((fieldAcc, field) => {
          fieldAcc[field] = [];
          return fieldAcc;
        }, {} as Record<string, Category[]>);
        return acc;
      }, {} as Record<string, Record<string, Category[]>>)
    : categories.reduce((acc, category) => {
        const discipline = category.level_1_discipline;
        const field = category.level_2_field;
        
        if (!acc[discipline]) {
          acc[discipline] = {};
        }
        if (!acc[discipline][field]) {
          acc[discipline][field] = [];
        }
        acc[discipline][field].push(category);
        
        return acc;
      }, {} as Record<string, Record<string, Category[]>>);

  const toggleDiscipline = (discipline: string) => {
    const newExpanded = new Set(expandedDisciplines);
    if (newExpanded.has(discipline)) {
      newExpanded.delete(discipline);
    } else {
      newExpanded.add(discipline);
    }
    setExpandedDisciplines(newExpanded);
  };

  const toggleField = (field: string) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(field)) {
      newExpanded.delete(field);
    } else {
      newExpanded.add(field);
    }
    setExpandedFields(newExpanded);
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    if (checked) {
      onCategoryChange([...selectedCategories, categoryId]);
    } else {
      onCategoryChange(selectedCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
        
        {/* Journal Filter Placeholder */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Journal
          </label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select journals..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="cell">Cell</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker Placeholder */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Filter by Publication Date
          </label>
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Select date range
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Categories</h4>
        
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-8 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Object.entries(groupedCategories).map(([discipline, fields]) => (
              <div key={discipline} className="space-y-1">
                <button
                  onClick={() => toggleDiscipline(discipline)}
                  className="flex items-center space-x-2 w-full text-left py-1 px-2 hover:bg-muted rounded"
                >
                  {expandedDisciplines.has(discipline) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium text-sm">{discipline}</span>
                </button>
                
                {expandedDisciplines.has(discipline) && (
                  <div className="ml-4 space-y-1">
                    {Object.entries(fields).map(([field, categories]) => (
                      <div key={field} className="space-y-1">
                        <button
                          onClick={() => toggleField(field)}
                          className="flex items-center space-x-2 w-full text-left py-1 px-2 hover:bg-muted/50 rounded"
                        >
                          {expandedFields.has(field) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          <span className="text-sm text-muted-foreground">{field}</span>
                        </button>
                        
                        {expandedFields.has(field) && categories.length > 0 && (
                          <div className="ml-4 space-y-2">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={category.id}
                                  checked={selectedCategories.includes(category.id)}
                                  onCheckedChange={(checked) => 
                                    handleCategoryToggle(category.id, checked as boolean)
                                  }
                                />
                                <label
                                  htmlFor={category.id}
                                  className="text-xs cursor-pointer flex-1"
                                  title={category.description}
                                >
                                  {category.level_3_specialization}
                                  {category.level_4_subspecialization && 
                                    ` - ${category.level_4_subspecialization}`
                                  }
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};