import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  level_1_discipline: string;
  level_2_field: string;
  level_3_specialization: string | null;
  level_4_subspecialization: string | null;
  description: string;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export const CategoryFilter = ({ selectedCategories, onCategoryChange }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedDisciplines, setExpandedDisciplines] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('level_1_discipline', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data || []);
  };

  const groupedCategories = categories.reduce((acc, category) => {
    const { level_1_discipline, level_2_field } = category;
    
    if (!acc[level_1_discipline]) {
      acc[level_1_discipline] = {};
    }
    
    if (!acc[level_1_discipline][level_2_field]) {
      acc[level_1_discipline][level_2_field] = [];
    }
    
    acc[level_1_discipline][level_2_field].push(category);
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
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filter by Category</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-96 overflow-y-auto">
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
                      
                      {expandedFields.has(field) && (
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
      </CardContent>
    </Card>
  );
};