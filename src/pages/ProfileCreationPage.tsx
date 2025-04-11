
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Phone, UserCog } from 'lucide-react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  avatarUrl: z.string().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(6, "Valid phone number is required"),
  healthcareProviderName: z.string().min(1, "Healthcare provider name is required"),
  healthcareProviderPhone: z.string().min(6, "Valid phone number is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileCreationPage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileCreated, setProfileCreated] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatarUrl: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      healthcareProviderName: "",
      healthcareProviderPhone: "",
    }
  });

  useEffect(() => {
    // Redirect to home if user is not authenticated
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if the user has already created a profile
    const checkProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, emergency_contact_name, emergency_contact_phone, healthcare_provider_name, healthcare_provider_phone, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking profile:', error);
          return;
        }

        // If the user has already filled in their profile (has first name or last name), redirect to home
        if (data && (data.first_name || data.last_name) && 
            data.emergency_contact_name && data.healthcare_provider_name) {
          setProfileCreated(true);
          navigate('/');
        }
        
        // Pre-fill form with existing data if available
        if (data) {
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            avatarUrl: data.avatar_url || "",
            emergencyContactName: data.emergency_contact_name || "",
            emergencyContactPhone: data.emergency_contact_phone || "",
            healthcareProviderName: data.healthcare_provider_name || "",
            healthcareProviderPhone: data.healthcare_provider_phone || "",
          });
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };

    checkProfile();
  }, [user, navigate, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          avatar_url: values.avatarUrl,
          emergency_contact_name: values.emergencyContactName,
          emergency_contact_phone: values.emergencyContactPhone,
          healthcare_provider_name: values.healthcareProviderName,
          healthcare_provider_phone: values.healthcareProviderPhone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile created",
        description: "Your profile has been set up successfully!",
      });
      
      // Redirect to homepage after profile creation
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error creating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide some information about yourself to complete your account setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-center mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={form.watch("avatarUrl")} alt="Profile picture" />
                  <AvatarFallback className="bg-teal-100 text-teal-800">
                    <User size={36} />
                  </AvatarFallback>
                </Avatar>
              </div>

              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/your-photo.jpg"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-800">
                  <Phone size={18} className="text-teal-500" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555-123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2 text-slate-800">
                  <UserCog size={18} className="text-teal-500" />
                  Healthcare Provider
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="healthcareProviderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="healthcareProviderPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 555-987-6543" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Complete Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            This information helps us personalize your experience
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileCreationPage;
