import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight, FileText, Check, AlertCircle, CalendarPlus, Pill, User } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import MedicineReminder from '@/components/MedicineReminder';
import { Json } from '@/integrations/supabase/types';

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

interface MedicationRecordDetails {
  medication_id: string;
  medication_name: string;
  dosage: string;
  taken_at: string;
}

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState('');
  const [nextMedicine, setNextMedicine] = useState<any>(null);
  const [recentUpdates, setRecentUpdates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return; // Skip fetching if no user
      
      setIsLoading(true);
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id as string)
          .single();
        
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profileData && profileData.first_name) {
          setFirstName(profileData.first_name);
        }
        
        // Fetch medications sorted by time
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const { data: medicationsData, error: medicationsError } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id as string)
          .order('time', { ascending: true });
        
        if (medicationsError) {
          console.error('Error fetching medications:', medicationsError);
        } else if (medicationsData && medicationsData.length > 0) {
          // Find the next medication to take based on time
          const next = medicationsData.find(med => med.time >= currentTime) || medicationsData[0];
          setNextMedicine(next);
          setMedicines(medicationsData);
        }
        
        // Fetch recent medical records
        const { data: recordsData, error: recordsError } = await supabase
          .from('medical_records')
          .select('*')
          .eq('user_id', user.id as string)
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (recordsError) {
          console.error('Error fetching medical records:', recordsError);
        } else if (recordsData) {
          setRecentUpdates(recordsData);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load your data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // If user is not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // Format the recent updates for display
  const formatRecentUpdates = () => {
    if (!recentUpdates.length) {
      return [
        {
          type: "medication",
          title: "No recent updates",
          time: "N/A",
          icon: <AlertCircle className="text-amber-500" size={16} />
        }
      ];
    }
    
    return recentUpdates.map(update => {
      const details = update.details;
      const createdAt = new Date(update.created_at);
      const formattedTime = createdAt.toLocaleString('en-US', {
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      switch(update.record_type) {
        case 'medication_taken':
          return {
            type: "medication",
            title: `${details.medication_name} taken`,
            time: formattedTime,
            icon: <Check className="text-green-500" size={16} />
          };
        case 'blood_pressure':
          return {
            type: "health",
            title: `Blood pressure: ${details.systolic}/${details.diastolic}`,
            time: formattedTime,
            icon: <AlertCircle className="text-amber-500" size={16} />
          };
        case 'appointment':
          return {
            type: "appointment",
            title: `Doctor appointment ${details.status || 'added'}`,
            time: formattedTime,
            icon: <CalendarPlus className="text-teal-500" size={16} />
          };
        default:
          return {
            type: "other",
            title: update.record_type.replace(/_/g, ' '),
            time: formattedTime,
            icon: <FileText className="text-lavender-500" size={16} />
          };
      }
    });
  };

  const formattedUpdates = formatRecentUpdates();

  const getBackgroundClass = (type: string) => {
    switch(type) {
      case "medication": return "bg-lavender-50";
      case "health": return "bg-peach-50";
      case "appointment": return "bg-teal-50";
      default: return "bg-slate-50";
    }
  };

  const handleMedicineTaken = async (medicine: any) => {
    try {
      // Add a medical record for the taken medicine
      const { error } = await supabase
        .from('medical_records')
        .insert({
          user_id: user.id as string,
          record_type: 'medication_taken',
          details: {
            medication_id: medicine.id,
            medication_name: medicine.name,
            dosage: medicine.dosage,
            taken_at: new Date().toISOString()
          } as Json
        });
        
      if (error) throw error;
      
      toast({
        title: "Medicine taken",
        description: `${medicine.name} has been marked as taken.`,
      });
      
      // Refresh the recent updates
      const { data: recordsData } = await supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id as string)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (recordsData) {
        setRecentUpdates(recordsData);
      }
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {getGreeting()}, <span className="text-teal-500">{firstName || 'User'}</span>
          </h1>
          <p className="text-slate-500 mb-8">Ready to take care of your health today?</p>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="shadow-md border-teal-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium text-slate-800">Next Medicine</h2>
                      <Clock className="text-teal-400" size={20} />
                    </div>
                    
                    {nextMedicine ? (
                      <div className="bg-teal-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-white p-2 rounded-md">
                            <Calendar className="text-teal-500" size={24} />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-800">{nextMedicine.name}</h3>
                            <p className="text-sm text-slate-500">{nextMedicine.description || "No description provided"}</p>
                            <div className="mt-2 flex gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                {nextMedicine.dosage}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lavender-100 text-lavender-800">
                                {nextMedicine.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-teal-50 p-4 rounded-lg mb-4 text-center">
                        <p className="text-slate-600">No medications scheduled yet.</p>
                        <p className="text-sm text-slate-500 mt-1">Add your first medication to see it here.</p>
                      </div>
                    )}
                    
                    <Link to="/medicines">
                      <Button className="w-full gap-2">
                        View Today's Schedule
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-lavender-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-medium text-slate-800">Recent Updates</h2>
                      <FileText className="text-lavender-400" size={20} />
                    </div>
                    
                    <div className="space-y-4">
                      {formattedUpdates.map((update, index) => (
                        <div key={index} className={`flex items-start gap-3 p-3 ${getBackgroundClass(update.type)} rounded-lg`}>
                          <div className="bg-white p-1.5 rounded-md">
                            {update.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{update.title}</p>
                            <p className="text-xs text-slate-500">{update.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="shadow-sm border-teal-100 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-teal-100 p-3 rounded-full mb-4">
                      <Pill className="text-teal-600" size={24} />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Manage Medications</h3>
                    <p className="text-sm text-slate-500 mb-4">Add, edit or remove your medications and schedule.</p>
                    <Link to="/medicines" className="text-teal-500 text-sm font-medium hover:underline">View Medications</Link>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-lavender-100 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-lavender-100 p-3 rounded-full mb-4">
                      <FileText className="text-lavender-600" size={24} />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Medical History</h3>
                    <p className="text-sm text-slate-500 mb-4">View and update your medical history and documents.</p>
                    <Link to="/history" className="text-lavender-500 text-sm font-medium hover:underline">View History</Link>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-peach-100 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-peach-100 p-3 rounded-full mb-4">
                      <User className="text-peach-600" size={24} />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Your Profile</h3>
                    <p className="text-sm text-slate-500 mb-4">Update your personal information and preferences.</p>
                    <Link to="/profile" className="text-peach-500 text-sm font-medium hover:underline">View Profile</Link>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Background component for reminders */}
      <MedicineReminder medicines={medicines} onMedicineTaken={handleMedicineTaken} />
    </div>
  );
};

export default Index;
