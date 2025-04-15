
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import MedicineCard from '../components/MedicineCard';
import MedicineForm from '../components/MedicineForm';
import MedicineReminder from '../components/MedicineReminder';
import { Calendar, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface MedicationRecordDetails {
  medication_id: string;
  medication_name: string;
  dosage: string;
  taken_at: string;
}

const MedicinesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [visibleMedicines, setVisibleMedicines] = useState<any[]>([]);
  const [takenMedicines, setTakenMedicines] = useState<Set<string>>(new Set());
  const [activeMedicineId, setActiveMedicineId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)
          .order('time', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        const medicationsWithImages = data.map(med => ({
          ...med,
          imageUrl: "/placeholder.svg"
        }));
        
        setMedicines(medicationsWithImages);
        
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const { data: recordsData, error: recordsError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('user_id', user.id)
          .eq('record_type', 'medication_taken')
          .gte('created_at', todayStr);
          
        if (recordsError) {
          console.error('Error fetching medication records:', recordsError);
        } else if (recordsData) {
          const takenMeds = new Set(
            recordsData
              .filter(record => {
                const recordDate = new Date(record.created_at).toISOString().split('T')[0];
                return recordDate === todayStr;
              })
              .map(record => {
                // Safely cast the details to MedicationRecordDetails
                const details = record.details as unknown as MedicationRecordDetails;
                return details.medication_id;
              })
          );
          
          setTakenMedicines(takenMeds);
        }
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast({
          title: "Error fetching medications",
          description: "Could not load your medications. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchMedications();
    }
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [user, toast]);
  
  useEffect(() => {
    const filteredMedicines = medicines.filter(med => !takenMedicines.has(med.id));
    setVisibleMedicines(filteredMedicines);
  }, [medicines, takenMedicines]);
  
  useEffect(() => {
    const now = currentTime;
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const activeMed = visibleMedicines.find(med => {
      const [hours, minutes] = med.time.split(':').map(Number);
      const medTime = new Date(now);
      medTime.setHours(hours, minutes, 0);
      
      const diffMs = Math.abs(now.getTime() - medTime.getTime());
      const diffMinutes = Math.floor(diffMs / 60000);
      
      return diffMinutes <= 15;
    });
    
    setActiveMedicineId(activeMed?.id || null);
  }, [currentTime, visibleMedicines]);
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const handleAddMedicine = () => {
    setEditingMedicine(null);
    setIsFormOpen(true);
  };
  
  const handleEditMedicine = (medicine: any) => {
    setEditingMedicine(medicine);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMedicine(null);
  };
  
  const handleSaveMedicine = async (medicineData: any) => {
    try {
      if (editingMedicine) {
        const { error } = await supabase
          .from('medications')
          .update({
            name: medicineData.name,
            dosage: medicineData.dosage,
            description: medicineData.description,
            time: medicineData.time,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingMedicine.id);
          
        if (error) throw error;
        
        setMedicines(prevMedicines => 
          prevMedicines.map(med => 
            med.id === editingMedicine.id 
              ? { 
                  ...med, 
                  ...medicineData, 
                  updated_at: new Date().toISOString() 
                } 
              : med
          )
        );
        
        toast({
          title: "Medicine updated",
          description: `${medicineData.name} has been updated successfully.`,
        });
      } else {
        const { data, error } = await supabase
          .from('medications')
          .insert([
            {
              user_id: user.id,
              name: medicineData.name,
              dosage: medicineData.dosage,
              description: medicineData.description,
              time: medicineData.time
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const newMedicine = {
            ...data[0],
            imageUrl: "/placeholder.svg"
          };
          
          setMedicines(prevMedicines => [...prevMedicines, newMedicine]);
          
          toast({
            title: "Medicine added",
            description: `${medicineData.name} has been added to your schedule.`,
          });
        }
      }
      
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving medication:', error);
      toast({
        title: "Error saving medication",
        description: error.message || "Could not save your medication. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteMedicine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setMedicines(prevMedicines => prevMedicines.filter(med => med.id !== id));
      
      toast({
        title: "Medicine deleted",
        description: "The medication has been removed from your schedule.",
      });
    } catch (error: any) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error deleting medication",
        description: error.message || "Could not delete your medication. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleMedicineTaken = async (medicine: any) => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .insert([
          {
            user_id: user.id,
            record_type: 'medication_taken',
            details: {
              medication_id: medicine.id,
              medication_name: medicine.name,
              dosage: medicine.dosage,
              taken_at: new Date().toISOString()
            }
          }
        ]);
        
      if (error) throw error;
      
      setTakenMedicines(prev => {
        const updated = new Set(prev);
        updated.add(medicine.id);
        return updated;
      });
      
      toast({
        title: "Medicine taken",
        description: `${medicine.name} has been marked as taken.`,
      });
    } catch (error: any) {
      console.error('Error recording medication taken:', error);
      toast({
        title: "Error updating records",
        description: error.message || "Could not update your records. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            
            <Button className="gap-2" onClick={handleAddMedicine}>
              <Plus size={16} />
              Add Medicine
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-slate-800">Today's Medications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : visibleMedicines.length > 0 ? (
                <div className="space-y-4">
                  {visibleMedicines.map(medicine => (
                    <MedicineCard 
                      key={medicine.id}
                      medicine={medicine}
                      isActive={medicine.id === activeMedicineId}
                      onEdit={() => handleEditMedicine(medicine)}
                      onDelete={() => handleDeleteMedicine(medicine.id)}
                      onTakeMedicine={() => handleMedicineTaken(medicine)}
                    />
                  ))}
                </div>
              ) : medicines.length > 0 ? (
                <div className="text-center py-8">
                  <p className="text-green-600 font-medium">Great job! All medications for today have been taken.</p>
                  <p className="text-sm text-slate-500 mt-1">Your next medications will appear here tomorrow.</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">No medications scheduled yet.</p>
                  <p className="text-sm text-slate-500 mt-1">Click the "Add Medicine" button to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMedicine ? "Edit Medicine" : "Add New Medicine"}</DialogTitle>
          </DialogHeader>
          <MedicineForm 
            medicine={editingMedicine}
            onSave={handleSaveMedicine}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
      
      <MedicineReminder medicines={visibleMedicines} onMedicineTaken={handleMedicineTaken} />
    </div>
  );
};

export default MedicinesPage;
