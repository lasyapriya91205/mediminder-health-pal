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
  const [missedMedicines, setMissedMedicines] = useState<Set<string>>(new Set());
  const [missedMedicineNotificationTimes, setMissedMedicineNotificationTimes] = useState<Map<string, number>>(new Map());
  
  useEffect(() => {
    // Reset checked medicines when the medicines prop changes
    setCheckedMedicines(new Set());
    setMissedMedicines(new Set());
    setMissedMedicineNotificationTimes(new Map());
  }, [medicines]);
  
  useEffect(() => {
    // Check every 10 minutes for missed medicines
    const interval = setInterval(() => {
      if (!medicines || medicines.length === 0) return;
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(medicine => {
        // Skip if already checked
        if (checkedMedicines.has(medicine.id)) return;
        
        const [medHour, medMin] = medicine.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(medHour, medMin, 0);
        
        // If medicine time has passed and hasn't been taken
        if (medTime < now && !checkedMedicines.has(medicine.id)) {
          // Add to missed medicines if not already there
          if (!missedMedicines.has(medicine.id)) {
            setMissedMedicines(prev => {
              const updated = new Set(prev);
              updated.add(medicine.id);
              return updated;
            });
          }
          
          // Check if it's time to show another notification (every 10 minutes)
          const lastNotificationTime = missedMedicineNotificationTimes.get(medicine.id) || 0;
          const timeSinceLastNotification = now.getTime() - lastNotificationTime;
          
          if (timeSinceLastNotification >= 600000) { // 10 minutes in milliseconds
            // Update last notification time
            setMissedMedicineNotificationTimes(prev => {
              const updated = new Map(prev);
              updated.set(medicine.id, now.getTime());
              return updated;
            });
            
            // Show a toast notification
            toast(
              <div className="flex items-center gap-3">
                <Bell className="text-amber-500" />
                <div>
                  <p className="font-medium">Missed Medicine Reminder</p>
                  <p className="text-sm text-muted-foreground">Please take {medicine.name} as soon as possible</p>
                </div>
              </div>,
              {
                duration: 3000, // Notification slides away after 3 seconds
                action: {
                  label: "Take Now",
                  onClick: () => {
                    if (onMedicineTaken) {
                      onMedicineTaken(medicine);
                      // Remove from missed medicines when taken
                      setMissedMedicines(prev => {
                        const updated = new Set(prev);
                        updated.delete(medicine.id);
                        return updated;
                      });
                      // Clear the notification time
                      setMissedMedicineNotificationTimes(prev => {
                        const updated = new Map(prev);
                        updated.delete(medicine.id);
                        return updated;
                      });
                    }
                  },
                },
              }
            );
          }
        }
        
        if (medicine.time === currentTime) {
          // Add to checked medicines
          setCheckedMedicines(prev => {
            const updated = new Set(prev);
            updated.add(medicine.id);
            return updated;
          });
          
          // Show initial reminder toast
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
    }, 600000); // Check every 10 minutes
    
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
  }, [medicines, checkedMedicines, missedMedicines, onMedicineTaken]);
  
  return null; // This is a background component with no UI
};

export default MedicineReminder;
