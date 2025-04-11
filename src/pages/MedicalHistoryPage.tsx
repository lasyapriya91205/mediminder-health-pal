
import React from 'react';
import Navigation from '../components/Navigation';
import { FileText, Upload, Plus, Check, X, FileUp, Trash, Download, Building } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const MedicalHistoryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Medical History</h1>
              <p className="text-slate-500">Track and manage your medical information</p>
            </div>
            
            <Button className="gap-2">
              <Plus size={16} />
              Add Record
            </Button>
          </div>
          
          <Tabs defaultValue="conditions" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="surgeries">Surgeries</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="conditions">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-800">Medical Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Hypertension</h3>
                          <p className="text-sm text-slate-500">Diagnosed: January 2020</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Edit</Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-slate-600">
                        <p>Blood pressure consistently above 140/90 mmHg. Managed with medication and lifestyle changes.</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Type 2 Diabetes</h3>
                          <p className="text-sm text-slate-500">Diagnosed: March 2019</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Edit</Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-slate-600">
                        <p>Managed with Metformin, diet control, and regular exercise. Last HbA1c: 6.5%</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Plus size={16} />
                      Add Condition
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="allergies">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-800">Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Penicillin</h3>
                          <p className="text-sm text-slate-500">Severity: High</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Edit</Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-slate-600">
                        <p>Symptoms: Rash, difficulty breathing. Requires immediate medical attention if exposed.</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Peanuts</h3>
                          <p className="text-sm text-slate-500">Severity: Moderate</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Edit</Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-slate-600">
                        <p>Symptoms: Hives, swelling. Carry antihistamines at all times.</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Plus size={16} />
                      Add Allergy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="surgeries">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-800">Surgical History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-slate-800">Appendectomy</h3>
                          <p className="text-sm text-slate-500">Date: May 15, 2018</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Edit</Button>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-slate-600">
                        <p>Performed at Memorial Hospital by Dr. Smith. Laparoscopic procedure with no complications.</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full gap-2">
                      <Plus size={16} />
                      Add Surgery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-800">Medical Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 mb-4 text-center">
                    <div className="mx-auto flex flex-col items-center">
                      <FileUp className="h-10 w-10 text-slate-400 mb-2" />
                      <h3 className="font-medium text-slate-800 mb-1">Upload Medical Documents</h3>
                      <p className="text-sm text-slate-500 mb-4">Drag and drop files or click to browse</p>
                      <Button variant="outline">Browse Files</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-lavender-50 p-2 rounded mr-3">
                          <FileText className="h-5 w-5 text-lavender-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-slate-800">Blood Test Results.pdf</h4>
                          <p className="text-xs text-slate-500">Uploaded: April 10, 2023</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                          <span className="sr-only">Delete</span>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-teal-50 p-2 rounded mr-3">
                          <FileText className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-slate-800">EKG Report.pdf</h4>
                          <p className="text-xs text-slate-500">Uploaded: January 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Download</span>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500">
                          <span className="sr-only">Delete</span>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MedicalHistoryPage;
