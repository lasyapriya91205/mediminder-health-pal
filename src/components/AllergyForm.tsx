
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AllergyFormProps {
  allergy?: any;
  onSave: (allergy: any) => void;
  onCancel: () => void;
}

const AllergyForm: React.FC<AllergyFormProps> = ({
  allergy,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (allergy) {
      setName(allergy.name || '');
      setSeverity(allergy.severity || '');
      setSymptoms(allergy.symptoms || '');
    }
  }, [allergy]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Allergy name is required';
    }
    
    if (!severity) {
      newErrors.severity = 'Severity is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        severity,
        symptoms
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="allergy-name">Allergy Name</Label>
        <Input
          id="allergy-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Peanuts, Penicillin"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="severity">Severity</Label>
        <Select 
          value={severity} 
          onValueChange={setSeverity}
        >
          <SelectTrigger id="severity">
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.severity && <p className="text-sm text-red-500">{errors.severity}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="symptoms">Symptoms (Optional)</Label>
        <Textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="E.g., Rash, difficulty breathing, swelling"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {allergy ? 'Update' : 'Add'} Allergy
        </Button>
      </div>
    </form>
  );
};

export default AllergyForm;
