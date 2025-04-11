
import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import MedicineCard from '../components/MedicineCard';
import MedicineReminder from '../components/MedicineReminder';
import { Calendar, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Sample medicine data
const medicinesData = [
  {
    id: "med1",
    name: "Vitamin D",
    description: "Supports bone health and immune function",
    dosage: "1000 IU",
    time: "08:00",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "med2",
    name: "Aspirin",
    description: "Pain reliever and blood thinner",
    dosage: "81 mg",
    time: "09:30",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "med3",
    name: "Metformin",
    description: "Helps control blood sugar levels",
    dosage: "500 mg",
    time: "12:00",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "med4",
    name: "Lisinopril",
    description: "Blood pressure medication",
    dosage: "10 mg",
    time: "18:00",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "med5",
    name: "Melatonin",
    description: "Promotes sleep",
    dosage: "3 mg",
    time: "21:30",
    imageUrl: "/placeholder.svg"
  }
];

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState(medicinesData);
  const [activeMedicineId, setActiveMedicineId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check which medicine is active based on time
  useEffect(() => {
    const now = currentTime;
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const activeMed = medicines.find(med => {
      const [hours, minutes] = med.time.split(':').map(Number);
      const medTime = new Date(now);
      medTime.setHours(hours, minutes, 0);
      
      // Consider a medicine active if it's within 15 minutes of its scheduled time
      const diffMs = Math.abs(now.getTime() - medTime.getTime());
      const diffMinutes = Math.floor(diffMs / 60000);
      
      return diffMinutes <= 15;
    });
    
    setActiveMedicineId(activeMed?.id || null);
  }, [currentTime, medicines]);
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Medicine Schedule</h1>
              <p className="text-slate-500 flex items-center gap-1">
                <Calendar size={16} className="text-teal-500" />
                {formattedDate}
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus size={16} />
              Add Medicine
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-slate-800">Today's Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicines.map(medicine => (
                  <MedicineCard 
                    key={medicine.id}
                    medicine={medicine}
                    isActive={medicine.id === activeMedicineId}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Background component for reminders */}
      <MedicineReminder medicines={medicines} />
    </div>
  );
};

export default MedicinesPage;
