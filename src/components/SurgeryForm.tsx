
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SurgeryFormProps {
  surgery?: any;
  onSave: (surgery: any) => void;
  onCancel: () => void;
}

const SurgeryForm: React.FC<SurgeryFormProps> = ({
  surgery,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hospital, setHospital] = useState('');
  const [doctor, setDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (surgery) {
      setName(surgery.name || '');
      setDate(surgery.date || '');
      setHospital(surgery.hospital || '');
      setDoctor(surgery.doctor || '');
      setNotes(surgery.notes || '');
    }
  }, [surgery]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Surgery name is required';
    }
    
    if (!date.trim()) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        name,
        date,
        hospital,
        doctor,
        notes
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="surgery-name">Surgery Name</Label>
        <Input
          id="surgery-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Appendectomy, Knee Replacement"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="surgery-date">Date</Label>
        <Input
          id="surgery-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="E.g., May 15, 2018"
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hospital">Hospital (Optional)</Label>
        <Input
          id="hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          placeholder="E.g., Memorial Hospital"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="doctor">Doctor (Optional)</Label>
        <Input
          id="doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          placeholder="E.g., Dr. Smith"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional information about the surgery"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {surgery ? 'Update' : 'Add'} Surgery
        </Button>
      </div>
    </form>
  );
};

export default SurgeryForm;
