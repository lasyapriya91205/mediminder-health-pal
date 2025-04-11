
import React from 'react';
import Navigation from '../components/Navigation';
import { Settings, Bell, Sun, Volume2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Settings</h1>
              <p className="text-slate-500">Customize your experience</p>
            </div>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-teal-500" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="medicine-reminders" className="text-base">Medicine Reminders</Label>
                      <p className="text-sm text-slate-500">Receive alerts when it's time to take your medicine</p>
                    </div>
                    <Switch id="medicine-reminders" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="missed-dose" className="text-base">Missed Dose Alerts</Label>
                      <p className="text-sm text-slate-500">Get notified if you miss taking a medicine</p>
                    </div>
                    <Switch id="missed-dose" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="refill-reminders" className="text-base">Refill Reminders</Label>
                      <p className="text-sm text-slate-500">Alerts when medications need to be refilled</p>
                    </div>
                    <Switch id="refill-reminders" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="reminder-interval" className="text-base mb-2 block">Reminder Intervals</Label>
                    <p className="text-sm text-slate-500 mb-4">How often to remind you about missed medications</p>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Every 5 minutes</SelectItem>
                        <SelectItem value="10">Every 10 minutes</SelectItem>
                        <SelectItem value="15">Every 15 minutes</SelectItem>
                        <SelectItem value="30">Every 30 minutes</SelectItem>
                        <SelectItem value="60">Every hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-teal-500" />
                  Sound Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notification-sound" className="text-base">Notification Sound</Label>
                      <p className="text-sm text-slate-500">Play sound with notifications</p>
                    </div>
                    <Switch id="notification-sound" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="sound-type" className="text-base mb-2 block">Alert Tone</Label>
                    <p className="text-sm text-slate-500 mb-4">Choose the sound for medicine reminders</p>
                    <Select defaultValue="gentle">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gentle">Gentle Chime</SelectItem>
                        <SelectItem value="bell">Bell</SelectItem>
                        <SelectItem value="digital">Digital Beep</SelectItem>
                        <SelectItem value="calm">Calm Melody</SelectItem>
                        <SelectItem value="urgent">Urgent Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="volume" className="text-base mb-2 block">Volume</Label>
                    <p className="text-sm text-slate-500 mb-4">Adjust notification volume</p>
                    <div className="w-full md:w-[300px]">
                      <Slider defaultValue={[75]} max={100} step={1} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sun className="h-5 w-5 text-teal-500" />
                  Display Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                      <p className="text-sm text-slate-500">Switch between light and dark theme</p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="large-text" className="text-base">Large Text</Label>
                      <p className="text-sm text-slate-500">Increase text size for better readability</p>
                    </div>
                    <Switch id="large-text" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-500" />
                  Time Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="time-format" className="text-base mb-2 block">Time Format</Label>
                    <p className="text-sm text-slate-500 mb-4">Choose 12-hour or 24-hour format</p>
                    <Select defaultValue="12">
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="timezone" className="text-base mb-2 block">Time Zone</Label>
                    <p className="text-sm text-slate-500 mb-4">Set your current time zone</p>
                    <Select defaultValue="utc-5">
                      <SelectTrigger className="w-full md:w-[300px]">
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="utc-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
