import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { FileText, Upload, Plus, Check, X, FileUp, Trash, Download, Building, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { supabase, createBucketIfNotExists } from '@/integrations/supabase/client';
import ConditionForm from '../components/ConditionForm';
import AllergyForm from '../components/AllergyForm';
import SurgeryForm from '../components/SurgeryForm';
import { Progress } from "@/components/ui/progress";

const MedicalHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conditions, setConditions] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [surgeries, setSurgeries] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'condition' | 'allergy' | 'surgery' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  useEffect(() => {
    const fetchMedicalData = async () => {
      setIsLoading(true);
      try {
        await createBucketIfNotExists();
        
        const { data: conditionsData, error: conditionsError } = await supabase
          .from('medical_conditions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (conditionsError) throw conditionsError;
        setConditions(conditionsData || []);
        
        const { data: allergiesData, error: allergiesError } = await supabase
          .from('allergies')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (allergiesError) throw allergiesError;
        setAllergies(allergiesData || []);
        
        const { data: surgeriesData, error: surgeriesError } = await supabase
          .from('surgeries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (surgeriesError) throw surgeriesError;
        setSurgeries(surgeriesData || []);
        
        try {
          const { data: documentsData, error: documentsError } = await supabase
            .storage
            .from('medical_documents')
            .list(`${user.id}`);
            
          if (documentsError) {
            if (!documentsError.message.includes('The resource was not found')) {
              throw documentsError;
            }
          }
          
          setDocuments(documentsData || []);
        } catch (docError) {
          console.error('Error fetching documents:', docError);
        }
        
      } catch (error: any) {
        console.error('Error fetching medical data:', error);
        toast({
          title: "Error loading medical data",
          description: error.message || "Could not load your medical data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchMedicalData();
    }
  }, [user, toast]);
  
  const openAddForm = (type: 'condition' | 'allergy' | 'surgery') => {
    setFormType(type);
    setEditingItem(null);
    setIsFormOpen(true);
  };
  
  const openEditForm = (type: 'condition' | 'allergy' | 'surgery', item: any) => {
    setFormType(type);
    setEditingItem(item);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setFormType(null);
    setEditingItem(null);
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (!selectedFile || !user) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      await createBucketIfNotExists();
      
      const filePath = `${user.id}/${selectedFile.name}`;
      
      const xhr = new XMLHttpRequest();
      let uploadPromise: Promise<void>;
      
      uploadPromise = new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentage = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percentage));
          }
        });
        
        xhr.addEventListener('load', () => resolve());
        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));
      });
      
      const fileBuffer = await selectedFile.arrayBuffer();
      
      const { data, error } = await supabase.storage
        .from('medical_documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      setUploadProgress(100);
      
      const { data: documentsData, error: documentsError } = await supabase
        .storage
        .from('medical_documents')
        .list(`${user.id}`);
        
      if (documentsError) throw documentsError;
      
      setDocuments(documentsData || []);
      
      toast({
        title: "File uploaded successfully",
        description: `${selectedFile.name} has been uploaded to your medical records.`
      });
      
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error uploading file",
        description: error.message || "Could not upload your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleDownloadFile = async (fileName: string) => {
    try {
      if (!user) return;
      
      const filePath = `${user.id}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('medical_documents')
        .download(filePath);
        
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error downloading file",
        description: error.message || "Could not download your file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteFile = async (fileName: string) => {
    try {
      if (!user) return;
      
      const filePath = `${user.id}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('medical_documents')
        .remove([filePath]);
        
      if (error) throw error;
      
      setDocuments(docs => docs.filter(doc => doc.name !== fileName));
      
      toast({
        title: "File deleted",
        description: `${fileName} has been removed from your medical records.`
      });
      
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error deleting file",
        description: error.message || "Could not delete your file. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSaveCondition = async (conditionData: any) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('medical_conditions')
          .update({
            name: conditionData.name,
            diagnosis_date: conditionData.diagnosis_date,
            description: conditionData.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
          
        if (error) throw error;
        
        setConditions(prevConditions => 
          prevConditions.map(cond => 
            cond.id === editingItem.id 
              ? { 
                  ...cond, 
                  ...conditionData, 
                  updated_at: new Date().toISOString() 
                } 
              : cond
          )
        );
        
        toast({
          title: "Condition updated",
          description: `${conditionData.name} has been updated successfully.`,
        });
      } else {
        const { data, error } = await supabase
          .from('medical_conditions')
          .insert([
            {
              user_id: user.id,
              name: conditionData.name,
              diagnosis_date: conditionData.diagnosis_date,
              description: conditionData.description
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setConditions(prevConditions => [data[0], ...prevConditions]);
          
          toast({
            title: "Condition added",
            description: `${conditionData.name} has been added to your medical records.`,
          });
        }
      }
      
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving medical condition:', error);
      toast({
        title: "Error saving condition",
        description: error.message || "Could not save your medical condition. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCondition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medical_conditions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setConditions(prevConditions => prevConditions.filter(cond => cond.id !== id));
      
      toast({
        title: "Condition deleted",
        description: "The medical condition has been removed from your records.",
      });
    } catch (error: any) {
      console.error('Error deleting condition:', error);
      toast({
        title: "Error deleting condition",
        description: error.message || "Could not delete your medical condition. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveAllergy = async (allergyData: any) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('allergies')
          .update({
            name: allergyData.name,
            severity: allergyData.severity,
            symptoms: allergyData.symptoms,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
          
        if (error) throw error;
        
        setAllergies(prevAllergies => 
          prevAllergies.map(allergy => 
            allergy.id === editingItem.id 
              ? { 
                  ...allergy, 
                  ...allergyData, 
                  updated_at: new Date().toISOString() 
                } 
              : allergy
          )
        );
        
        toast({
          title: "Allergy updated",
          description: `${allergyData.name} has been updated successfully.`,
        });
      } else {
        const { data, error } = await supabase
          .from('allergies')
          .insert([
            {
              user_id: user.id,
              name: allergyData.name,
              severity: allergyData.severity,
              symptoms: allergyData.symptoms
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAllergies(prevAllergies => [data[0], ...prevAllergies]);
          
          toast({
            title: "Allergy added",
            description: `${allergyData.name} has been added to your medical records.`,
          });
        }
      }
      
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving allergy:', error);
      toast({
        title: "Error saving allergy",
        description: error.message || "Could not save your allergy. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAllergy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('allergies')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setAllergies(prevAllergies => prevAllergies.filter(allergy => allergy.id !== id));
      
      toast({
        title: "Allergy deleted",
        description: "The allergy has been removed from your records.",
      });
    } catch (error: any) {
      console.error('Error deleting allergy:', error);
      toast({
        title: "Error deleting allergy",
        description: error.message || "Could not delete your allergy. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveSurgery = async (surgeryData: any) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('surgeries')
          .update({
            name: surgeryData.name,
            date: surgeryData.date,
            hospital: surgeryData.hospital,
            doctor: surgeryData.doctor,
            notes: surgeryData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingItem.id);
          
        if (error) throw error;
        
        setSurgeries(prevSurgeries => 
          prevSurgeries.map(surgery => 
            surgery.id === editingItem.id 
              ? { 
                  ...surgery, 
                  ...surgeryData, 
                  updated_at: new Date().toISOString() 
                } 
              : surgery
          )
        );
        
        toast({
          title: "Surgery updated",
          description: `${surgeryData.name} has been updated successfully.`,
        });
      } else {
        const { data, error } = await supabase
          .from('surgeries')
          .insert([
            {
              user_id: user.id,
              name: surgeryData.name,
              date: surgeryData.date,
              hospital: surgeryData.hospital,
              doctor: surgeryData.doctor,
              notes: surgeryData.notes
            }
          ])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setSurgeries(prevSurgeries => [data[0], ...prevSurgeries]);
          
          toast({
            title: "Surgery added",
            description: `${surgeryData.name} has been added to your medical records.`,
          });
        }
      }
      
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving surgery:', error);
      toast({
        title: "Error saving surgery",
        description: error.message || "Could not save your surgery. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSurgery = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surgeries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSurgeries(prevSurgeries => prevSurgeries.filter(surgery => surgery.id !== id));
      
      toast({
        title: "Surgery deleted",
        description: "The surgery has been removed from your records.",
      });
    } catch (error: any) {
      console.error('Error deleting surgery:', error);
      toast({
        title: "Error deleting surgery",
        description: error.message || "Could not delete your surgery. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderFormContent = () => {
    switch (formType) {
      case 'condition':
        return (
          <ConditionForm 
            condition={editingItem}
            onSave={handleSaveCondition}
            onCancel={handleFormClose}
          />
        );
      case 'allergy':
        return (
          <AllergyForm 
            allergy={editingItem}
            onSave={handleSaveAllergy}
            onCancel={handleFormClose}
          />
        );
      case 'surgery':
        return (
          <SurgeryForm 
            surgery={editingItem}
            onSave={handleSaveSurgery}
            onCancel={handleFormClose}
          />
        );
      default:
        return null;
    }
  };

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
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-800">Medical Conditions</CardTitle>
                  <Button size="sm" onClick={() => openAddForm('condition')}>
                    <Plus size={16} className="mr-1" />
                    Add Condition
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : conditions.length > 0 ? (
                    <div className="space-y-4">
                      {conditions.map(condition => (
                        <div key={condition.id} className="p-4 bg-white rounded-lg border border-slate-200">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-slate-800">{condition.name}</h3>
                              <p className="text-sm text-slate-500">
                                {condition.diagnosis_date 
                                  ? `Diagnosed: ${condition.diagnosis_date}`
                                  : "Diagnosis date not specified"}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => openEditForm('condition', condition)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteCondition(condition.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="text-sm text-slate-600">
                            {condition.description ? (
                              <p>{condition.description}</p>
                            ) : (
                              <p className="text-slate-400 italic">No description provided</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600">You have no medical conditions recorded.</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Click the "Add Condition" button to record one.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="allergies">
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-800">Allergies</CardTitle>
                  <Button size="sm" onClick={() => openAddForm('allergy')}>
                    <Plus size={16} className="mr-1" />
                    Add Allergy
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : allergies.length > 0 ? (
                    <div className="space-y-4">
                      {allergies.map(allergy => (
                        <div key={allergy.id} className="p-4 bg-white rounded-lg border border-slate-200">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-slate-800">{allergy.name}</h3>
                              <p className="text-sm text-slate-500">
                                Severity: {allergy.severity}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => openEditForm('allergy', allergy)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteAllergy(allergy.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="text-sm text-slate-600">
                            {allergy.symptoms ? (
                              <p>Symptoms: {allergy.symptoms}</p>
                            ) : (
                              <p className="text-slate-400 italic">No symptoms specified</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600">You have no allergies recorded.</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Click the "Add Allergy" button to record one.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="surgeries">
              <Card>
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-800">Surgical History</CardTitle>
                  <Button size="sm" onClick={() => openAddForm('surgery')}>
                    <Plus size={16} className="mr-1" />
                    Add Surgery
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : surgeries.length > 0 ? (
                    <div className="space-y-4">
                      {surgeries.map(surgery => (
                        <div key={surgery.id} className="p-4 bg-white rounded-lg border border-slate-200">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-slate-800">{surgery.name}</h3>
                              <p className="text-sm text-slate-500">
                                Date: {surgery.date}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8"
                                onClick={() => openEditForm('surgery', surgery)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm"
                                className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteSurgery(surgery.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="text-sm text-slate-600">
                            {surgery.hospital && <p>Hospital: {surgery.hospital}</p>}
                            {surgery.doctor && <p>Doctor: {surgery.doctor}</p>}
                            {surgery.notes ? (
                              <p className="mt-2">{surgery.notes}</p>
                            ) : (
                              <p className="text-slate-400 italic mt-2">No additional notes</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600">You have no surgeries recorded.</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Click the "Add Surgery" button to record one.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-slate-800">Medical Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-slate-200 rounded-lg p-8 mb-4 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={handleClickUpload}
                  >
                    <div className="mx-auto flex flex-col items-center">
                      <FileUp className="h-10 w-10 text-slate-400 mb-2" />
                      <h3 className="font-medium text-slate-800 mb-1">Upload Medical Documents</h3>
                      <p className="text-sm text-slate-500 mb-4">Drag and drop files or click to browse</p>
                      <Button variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        handleClickUpload();
                      }}>
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  
                  {isUploading && (
                    <div className="my-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Uploading...</p>
                        <p className="text-sm text-slate-500">{uploadProgress}%</p>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    </div>
                  ) : documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((document, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="bg-lavender-50 p-2 rounded mr-3">
                              <FileText className="h-5 w-5 text-lavender-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-slate-800">{document.name}</h4>
                              <p className="text-xs text-slate-500">
                                {new Date(document.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDownloadFile(document.name)}
                            >
                              <span className="sr-only">Download</span>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500"
                              onClick={() => handleDeleteFile(document.name)}
                            >
                              <span className="sr-only">Delete</span>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-600">You have no documents uploaded.</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Click the upload area to add medical documents.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formType === 'condition' && `${editingItem ? 'Edit' : 'Add'} Medical Condition`}
              {formType === 'allergy' && `${editingItem ? 'Edit' : 'Add'} Allergy`}
              {formType === 'surgery' && `${editingItem ? 'Edit' : 'Add'} Surgery`}
            </DialogTitle>
          </DialogHeader>
          {renderFormContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalHistoryPage;
