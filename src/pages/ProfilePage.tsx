
import React from 'react';
import Navigation from '../components/Navigation';
import { User, Mail, Phone, Cake, Map, Edit2, Building, Plus, Download, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
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
                  <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                  <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">SJ</AvatarFallback>
                </Avatar>
                
                <h2 className="text-xl font-medium text-slate-800 mb-1">Sarah Johnson</h2>
                <p className="text-sm text-slate-500 mb-4">Patient ID: #38291</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 hover:bg-teal-100">
                    Female
                  </Badge>
                  <Badge variant="outline" className="bg-lavender-50 text-lavender-700 hover:bg-lavender-100">
                    42 years
                  </Badge>
                </div>
                
                <Button variant="outline" className="w-full gap-2">
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
                      <p className="text-slate-800">sarah.johnson@example.com</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Phone Number</h3>
                      <p className="text-slate-800">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Cake className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Date of Birth</h3>
                      <p className="text-slate-800">May 12, 1981</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <Map className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-slate-500">Address</h3>
                      <p className="text-slate-800">123 Main Street, Apt 4B<br/>Boston, MA 02115</p>
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
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800">John Johnson</h3>
                      <p className="text-sm text-slate-500">Relationship: Spouse</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Edit</Button>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">(555) 987-6543</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">john.johnson@example.com</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full gap-2">
                  <Plus size={16} />
                  Add Emergency Contact
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
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800">Dr. Michael Chen</h3>
                      <p className="text-sm text-slate-500">Primary Care Physician</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Edit</Button>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">Boston Medical Center</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">(555) 111-2222</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-slate-800">Dr. Sarah Wilson</h3>
                      <p className="text-sm text-slate-500">Cardiologist</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8">Edit</Button>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">Heart & Vascular Institute</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700">(555) 333-4444</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full gap-2">
                  <Plus size={16} />
                  Add Healthcare Provider
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
