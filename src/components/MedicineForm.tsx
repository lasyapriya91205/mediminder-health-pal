
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MedicineFormProps {
  medicine?: any;
  onSave: (medicine: any) => void;
  onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({
  medicine,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (medicine) {
      setName(medicine.name || '');
      setDescription(medicine.description || '');
      setDosage(medicine.dosage || '');
      setTime(medicine.time || '');
    }
  }, [medicine]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Medicine name is required';
    }
    
    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }
    
    if (!time.trim()) {
      newErrors.time = 'Time is required';
    } else {
      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        newErrors.time = 'Time must be in 24-hour format (HH:MM)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        description,
        dosage,
        time
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Medicine Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Aspirin, Vitamin D"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., For pain relief, Blood pressure medication"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dosage">Dosage</Label>
        <Input
          id="dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="E.g., 500mg, 2 tablets, 1 tsp"
        />
        {errors.dosage && <p className="text-sm text-red-500">{errors.dosage}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Time (24-hour format)</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {medicine ? 'Update' : 'Add'} Medicine
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;
