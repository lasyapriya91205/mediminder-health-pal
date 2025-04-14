import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { User, Mail, Phone, Cake, Map, Edit2, Building, Plus, Download, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    avatar_url: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    healthcare_provider_name: '',
    healthcare_provider_phone: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, emergency_contact_name, emergency_contact_phone, healthcare_provider_name, healthcare_provider_phone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setProfileData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            avatar_url: data.avatar_url || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
            healthcare_provider_name: data.healthcare_provider_name || '',
            healthcare_provider_phone: data.healthcare_provider_phone || ''
          });
        }
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleEditProfile = () => {
    navigate('/create-profile');
  };

  const fullName = `${profileData.first_name} ${profileData.last_name}`.trim();
  const initials = fullName
    ? `${profileData.first_name?.[0] || ''}${profileData.last_name?.[0] || ''}`.toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Your Profile</h1>
              <p className="text-slate-500">Manage your personal information</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1">
              <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profileData.avatar_url} alt="Profile" />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">{initials}</AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-medium text-slate-800 mb-1">{fullName || 'User'}</h2>
                <p className="text-sm text-slate-500 mb-4">Patient ID: #{user?.id.substring(0, 5) || '00000'}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                    Patient
                  </Badge>
                </div>
                
                <Button variant="outline" className="w-full gap-2" onClick={handleEditProfile}>
                  <Edit2 size={16} />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Email Address</h3>
                      <p className="text-slate-800">{user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <User className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">First Name</h3>
                      <p className="text-slate-800">{profileData.first_name || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <User className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Last Name</h3>
                      <p className="text-slate-800">{profileData.last_name || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.emergency_contact_name ? (
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800">{profileData.emergency_contact_name}</h3>
                        <p className="text-sm text-slate-500">Emergency Contact</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8" onClick={handleEditProfile}>Edit</Button>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{profileData.emergency_contact_phone || 'No phone provided'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">No emergency contacts added yet.</p>
                )}
                
                <Button variant="outline" className="w-full gap-2" onClick={handleEditProfile}>
                  <Plus size={16} />
                  {profileData.emergency_contact_name ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Healthcare Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.healthcare_provider_name ? (
                  <div className="p-4 bg-white rounded-lg border border-slate-200">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-slate-800">{profileData.healthcare_provider_name}</h3>
                        <p className="text-sm text-slate-500">Primary Care Physician</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-8" onClick={handleEditProfile}>Edit</Button>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{profileData.healthcare_provider_phone || 'No phone provided'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-600">No healthcare providers added yet.</p>
                )}
                
                <Button variant="outline" className="w-full gap-2" onClick={handleEditProfile}>
                  <Plus size={16} />
                  {profileData.healthcare_provider_name ? 'Edit Healthcare Provider' : 'Add Healthcare Provider'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
