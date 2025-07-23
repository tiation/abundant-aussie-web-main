import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Bell, 
  Calendar, 
  Clock, 
  Mail, 
  Smartphone, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Settings
} from "lucide-react";

const SetReminders = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("30");

  const existingReminders = [
    {
      id: 1,
      qualification: "First Aid Certificate",
      expiryDate: "2024-08-30",
      reminderDate: "2024-07-30",
      status: "active",
      frequency: "30 days before"
    },
    {
      id: 2,
      qualification: "CPR Certificate", 
      expiryDate: "2024-09-15",
      reminderDate: "2024-08-15",
      status: "active",
      frequency: "30 days before"
    },
    {
      id: 3,
      qualification: "High Risk Work Licence - Rigging",
      expiryDate: "2025-03-15",
      reminderDate: "2025-02-15", 
      status: "scheduled",
      frequency: "30 days before"
    }
  ];

  const [reminders, setReminders] = useState(existingReminders);

  const handleDeleteReminder = (id: number, qualification: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast({
      title: "Reminder Deleted",
      description: `Reminder for ${qualification} has been removed.`,
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  const handleAddCustomReminder = () => {
    toast({
      title: "Custom Reminder",
      description: "Custom reminder feature will allow you to set reminders for any date.",
    });
  };

  const upcomingQualifications = [
    {
      name: "Working at Heights",
      expiryDate: "2025-01-20",
      hasReminder: false
    },
    {
      name: "Rigging Intermediate", 
      expiryDate: "2024-12-10",
      hasReminder: false
    }
  ];

  const handleAddReminder = (qualification: string, expiryDate: string) => {
    const reminderDate = new Date(expiryDate);
    reminderDate.setDate(reminderDate.getDate() - parseInt(reminderFrequency));
    
    const newReminder = {
      id: Date.now(),
      qualification,
      expiryDate,
      reminderDate: reminderDate.toISOString().split('T')[0],
      status: "scheduled",
      frequency: `${reminderFrequency} days before`
    };
    
    setReminders(prev => [...prev, newReminder]);
    toast({
      title: "Reminder Added",
      description: `You'll be notified ${reminderFrequency} days before ${qualification} expires.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Set Qualification Reminders</h1>
          <p className="text-muted-foreground">Never let your certifications expire. Set up automatic reminders to stay on top of renewals.</p>
        </div>

        {/* Notification Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive reminder emails</p>
                    </div>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label className="text-base">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                    </div>
                  </div>
                  <Switch 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="frequency">Default Reminder Timing</Label>
                  <select 
                    id="frequency"
                    value={reminderFrequency}
                    onChange={(e) => setReminderFrequency(e.target.value)}
                    className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                  >
                    <option value="7">7 days before expiry</option>
                    <option value="14">14 days before expiry</option>
                    <option value="30">30 days before expiry</option>
                    <option value="60">60 days before expiry</option>
                    <option value="90">90 days before expiry</option>
                  </select>
                </div>
                
                <Button onClick={handleSaveSettings} className="w-full">
                  Save Preferences
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Reminders */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Active Reminders ({reminders.length})
              </CardTitle>
              <Button variant="outline" onClick={handleAddCustomReminder}>
                <Plus className="w-4 h-4 mr-2" />
                Add Custom
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      reminder.status === 'active' ? 'bg-warning/10' : 'bg-accent'
                    }`}>
                      {reminder.status === 'active' ? (
                        <AlertTriangle className="w-5 h-5 text-warning" />
                      ) : (
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{reminder.qualification}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Expires: {reminder.expiryDate}</span>
                        <span>•</span>
                        <span>Reminder: {reminder.frequency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={reminder.status === 'active' ? 'destructive' : 'secondary'}>
                      {reminder.status === 'active' ? 'Due Soon' : 'Scheduled'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteReminder(reminder.id, reminder.qualification)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Reminders for Existing Qualifications */}
        <Card>
          <CardHeader>
            <CardTitle>Add Reminders for Your Qualifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingQualifications.map((qual, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{qual.name}</h4>
                      <p className="text-sm text-muted-foreground">Expires: {qual.expiryDate}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleAddReminder(qual.name, qual.expiryDate)}
                    disabled={qual.hasReminder}
                  >
                    {qual.hasReminder ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Reminder
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default SetReminders;