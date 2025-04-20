
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  time: string;
}

interface MedicineReminderProps {
  medicines: Medicine[];
  onMedicineTaken?: (medicine: Medicine) => void;
}

const MedicineReminder: React.FC<MedicineReminderProps> = ({ 
  medicines,
  onMedicineTaken
}) => {
  const [checkedMedicines, setCheckedMedicines] = useState<Set<string>>(new Set());
  const [missedMedicines, setMissedMedicines] = useState<Set<string>>(new Set());
  const [takenMedicines, setTakenMedicines] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    // Reset states when medicines prop changes
    setCheckedMedicines(new Set());
    setMissedMedicines(new Set());
    setTakenMedicines(new Set());
  }, [medicines]);
  
  useEffect(() => {
    // Check every 10 minutes for missed medicines
    const interval = setInterval(() => {
      if (!medicines || medicines.length === 0) return;
      
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      medicines.forEach(medicine => {
        // Skip if already taken
        if (takenMedicines.has(medicine.id)) return;
        
        const [medHour, medMin] = medicine.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(medHour, medMin, 0);
        
        // If medicine time has passed and hasn't been taken
        if (medTime < now && !checkedMedicines.has(medicine.id) && !takenMedicines.has(medicine.id)) {
          // Add to missed medicines if not already there
          if (!missedMedicines.has(medicine.id)) {
            setMissedMedicines(prev => {
              const updated = new Set(prev);
              updated.add(medicine.id);
              return updated;
            });
            
            // Show a missed medicine notification
            toast(
              <div className="flex items-center gap-3">
                <Bell className="text-amber-500" />
                <div>
                  <p className="font-medium">Missed Medicine Reminder</p>
                  <p className="text-sm text-muted-foreground">Please take {medicine.name} as soon as possible</p>
                </div>
              </div>,
              {
                duration: 10000,
                action: {
                  label: "Take Now",
                  onClick: () => {
                    if (onMedicineTaken) {
                      onMedicineTaken(medicine);
                      // Mark as taken
                      setTakenMedicines(prev => {
                        const updated = new Set(prev);
                        updated.add(medicine.id);
                        return updated;
                      });
                      // Remove from missed medicines
                      setMissedMedicines(prev => {
                        const updated = new Set(prev);
                        updated.delete(medicine.id);
                        return updated;
                      });
                      // Show confirmation toast
                      toast(
                        <div className="flex items-center gap-3">
                          <Bell className="text-green-500" />
                          <div>
                            <p className="font-medium">Medicine Taken</p>
                            <p className="text-sm text-muted-foreground">You've taken {medicine.name}</p>
                          </div>
                        </div>,
                        { duration: 3000 }
                      );
                    }
                  },
                },
              }
            );
          }
        }
        
        if (medicine.time === currentTime && !takenMedicines.has(medicine.id)) {
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
                    // Mark as taken
                    setTakenMedicines(prev => {
                      const updated = new Set(prev);
                      updated.add(medicine.id);
                      return updated;
                    });
                    // Show confirmation toast
                    toast(
                      <div className="flex items-center gap-3">
                        <Bell className="text-green-500" />
                        <div>
                          <p className="font-medium">Medicine Taken</p>
                          <p className="text-sm text-muted-foreground">You've taken {medicine.name}</p>
                        </div>
                      </div>,
                      { duration: 3000 }
                    );
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
      
      medicines.forEach(medicine => {
        if (takenMedicines.has(medicine.id)) return; // Skip if already taken
        
        const [medHour, medMin] = medicine.time.split(':').map(Number);
        const medTime = new Date();
        medTime.setHours(medHour, medMin, 0);
        
        const diffMs = now.getTime() - medTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        
        // Show notification for medicines that should have been taken in the last 10 minutes
        if (diffMinutes >= 0 && diffMinutes <= 10 && !checkedMedicines.has(medicine.id)) {
          toast(
            <div className="flex items-center gap-3">
              <Bell className="text-amber-500" />
              <div>
                <p className="font-medium">Medicine Due</p>
                <p className="text-sm text-muted-foreground">Please take {medicine.name} now</p>
              </div>
            </div>,
            {
              duration: 10000,
              action: {
                label: "Take Now",
                onClick: () => {
                  if (onMedicineTaken) {
                    onMedicineTaken(medicine);
                    // Mark as taken
                    setTakenMedicines(prev => {
                      const updated = new Set(prev);
                      updated.add(medicine.id);
                      return updated;
                    });
                    // Show confirmation toast
                    toast(
                      <div className="flex items-center gap-3">
                        <Bell className="text-green-500" />
                        <div>
                          <p className="font-medium">Medicine Taken</p>
                          <p className="text-sm text-muted-foreground">You've taken {medicine.name}</p>
                        </div>
                      </div>,
                      { duration: 3000 }
                    );
                  }
                },
              },
            }
          );
        }
      });
    }
    
    return () => clearInterval(interval);
  }, [medicines, checkedMedicines, missedMedicines, takenMedicines, onMedicineTaken]);
  
  return null; // This is a background component with no UI
};

export default MedicineReminder;
