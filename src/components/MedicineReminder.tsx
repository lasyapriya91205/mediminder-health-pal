
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

interface MedicineReminderProps {
  medicines: any[];
  onMedicineTaken?: (medicine: any) => void;
}

const MedicineReminder: React.FC<MedicineReminderProps> = ({ 
  medicines,
  onMedicineTaken
}) => {
  const [checkedMedicines, setCheckedMedicines] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Reset checked medicines when the medicines prop changes
    setCheckedMedicines(new Set());
  }, [medicines]);
  
  useEffect(() => {
    // Check every minute for medicines that need to be taken
    const interval = setInterval(() => {
      if (!medicines || medicines.length === 0) return;
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(medicine => {
        // Skip if already checked
        if (checkedMedicines.has(medicine.id)) return;
        
        if (medicine.time === currentTime) {
          // Add to checked medicines
          setCheckedMedicines(prev => {
            const updated = new Set(prev);
            updated.add(medicine.id);
            return updated;
          });
          
          // Show a toast notification
          toast(
            <div className="flex items-center gap-3">
              <Bell className="text-teal-500" />
              <div>
                <p className="font-medium">Medicine Reminder</p>
                <p className="text-sm text-muted-foreground">Time to take {medicine.name}</p>
              </div>
            </div>,
            {
              duration: 10000,
              action: {
                label: "Take Now",
                onClick: () => {
                  if (onMedicineTaken) {
                    onMedicineTaken(medicine);
                  }
                },
              },
            }
          );
        }
      });
    }, 60000); // Check every minute
    
    // Also check immediately on mount or when medicines change
    if (medicines && medicines.length > 0) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(medicine => {
        // Only trigger for medicines due in the last 5 minutes
        const [medHour, medMin] = medicine.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(medHour, medMin, 0);
        
        const diffMs = now.getTime() - medTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        
        if (diffMinutes >= 0 && diffMinutes <= 5 && !checkedMedicines.has(medicine.id)) {
          // Add to checked medicines
          setCheckedMedicines(prev => {
            const updated = new Set(prev);
            updated.add(medicine.id);
            return updated;
          });
          
          // Show a toast notification
          toast(
            <div className="flex items-center gap-3">
              <Bell className="text-teal-500" />
              <div>
                <p className="font-medium">Medicine Reminder</p>
                <p className="text-sm text-muted-foreground">Time to take {medicine.name}</p>
              </div>
            </div>,
            {
              duration: 10000,
              action: {
                label: "Take Now",
                onClick: () => {
                  if (onMedicineTaken) {
                    onMedicineTaken(medicine);
                  }
                },
              },
            }
          );
        }
      });
    }
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [medicines, checkedMedicines, onMedicineTaken]);
  
  return null; // This is a background component with no UI
};

export default MedicineReminder;
