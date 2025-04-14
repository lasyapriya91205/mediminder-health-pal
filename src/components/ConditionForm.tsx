
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConditionFormProps {
  condition?: any;
  onSave: (condition: any) => void;
  onCancel: () => void;
}

const ConditionForm: React.FC<ConditionFormProps> = ({
  condition,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (condition) {
      setName(condition.name || '');
      setDiagnosisDate(condition.diagnosis_date || '');
      setDescription(condition.description || '');
    }
  }, [condition]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Condition name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        diagnosis_date: diagnosisDate,
        description
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="condition-name">Condition Name</Label>
        <Input
          id="condition-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Hypertension, Diabetes"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="diagnosis-date">Diagnosis Date (Optional)</Label>
        <Input
          id="diagnosis-date"
          type="text" 
          value={diagnosisDate}
          onChange={(e) => setDiagnosisDate(e.target.value)}
          placeholder="E.g., January 2020"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="condition-description">Description (Optional)</Label>
        <Textarea
          id="condition-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional information about the condition"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {condition ? 'Update' : 'Add'} Condition
        </Button>
      </div>
    </form>
  );
};

export default ConditionForm;
