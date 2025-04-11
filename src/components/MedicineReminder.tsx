
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

interface MedicineReminderProps {
  medicines: any[];
}

const MedicineReminder: React.FC<MedicineReminderProps> = ({ medicines }) => {
  const [activeMedicine, setActiveMedicine] = useState<string | null>(null);
  
  useEffect(() => {
    // Check every minute for medicines that need to be taken
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(medicine => {
        if (medicine.time === currentTime) {
          setActiveMedicine(medicine.id);
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
                  // Logic to mark as taken could be added here
                  console.log("Taking medicine:", medicine.name);
                },
              },
            }
          );
        }
      });
    }, 60000); // Check every minute
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [medicines]);
  
  return null; // This is a background component with no UI
};

export default MedicineReminder;
