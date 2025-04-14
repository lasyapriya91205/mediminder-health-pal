import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ArrowRight, FileText, Check, AlertCircle, CalendarPlus, Pill, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample data for next medicine
const nextMedicine = {
  name: "Vitamin D",
  time: "08:00",
  dosage: "1000 IU",
  description: "Supports bone health and immune function"
};

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Index = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }
          
          if (data && data.first_name) {
            setFirstName(data.first_name);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {getGreeting()}, <span className="text-teal-500">{firstName || 'User'}</span>
          </h1>
          <p className="text-slate-500 mb-8">Ready to take care of your health today?</p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-md border-teal-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-slate-800">Next Medicine</h2>
                  <Clock className="text-teal-400" size={20} />
                </div>
                
                <div className="bg-teal-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-md">
                      <Calendar className="text-teal-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800">{nextMedicine.name}</h3>
                      <p className="text-sm text-slate-500">{nextMedicine.description}</p>
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
                  <div className="flex items-start gap-3 p-3 bg-lavender-50 rounded-lg">
                    <div className="bg-white p-1.5 rounded-md">
                      <Check className="text-green-500" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Aspirin taken</p>
                      <p className="text-xs text-slate-500">Today, 07:15 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-peach-50 rounded-lg">
                    <div className="bg-white p-1.5 rounded-md">
                      <AlertCircle className="text-amber-500" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Blood pressure recorded</p>
                      <p className="text-xs text-slate-500">Today, 06:30 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg">
                    <div className="bg-white p-1.5 rounded-md">
                      <CalendarPlus className="text-teal-500" size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Doctor appointment added</p>
                      <p className="text-xs text-slate-500">Yesterday, 02:45 PM</p>
                    </div>
                  </div>
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
        </div>
      </main>
    </div>
  );
};

export default Index;
