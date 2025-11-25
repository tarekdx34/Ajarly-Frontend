import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertCircle, CheckCircle2, MessageSquare, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Badge } from "../ui/badge";

interface SupportPageProps {
  onNavigate: (page: string) => void;
}

export function SupportPage({ onNavigate }: SupportPageProps) {
  const [issueType, setIssueType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bookingCode: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support ticket created! Our team will contact you within 24 hours.");
    setFormData({ name: "", email: "", bookingCode: "", description: "" });
    setIssueType("");
  };

  const issueTypes = [
    { value: "booking", label: "Booking Issue" },
    { value: "payment", label: "Payment Problem" },
    { value: "property", label: "Property Issue" },
    { value: "account", label: "Account Problem" },
    { value: "cancellation", label: "Cancellation Request" },
    { value: "fraud", label: "Report Fraud/Scam" },
    { value: "technical", label: "Technical Problem" },
    { value: "other", label: "Other" },
  ];

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6 text-[#00BFA6]" />,
      title: "Emergency Hotline",
      content: "+20 123 456 7890",
      subContent: "Available 24/7 for urgent issues",
      available: true,
    },
    {
      icon: <Mail className="w-6 h-6 text-[#00BFA6]" />,
      title: "Email Support",
      content: "support@ajarly.com",
      subContent: "Response within 24 hours",
      available: true,
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[#00BFA6]" />,
      title: "Live Chat",
      content: "Chat with our team",
      subContent: "Mon-Fri, 9AM-6PM (EET)",
      available: false,
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00BFA6]" />,
      title: "Support Hours",
      content: "24/7 Emergency Support",
      subContent: "Business hours: 9AM-6PM",
      available: true,
    },
  ];

  const commonIssues = [
    {
      title: "Can't access my booking",
      solution: "Check your email for the confirmation. If you still can't find it, submit a support ticket with your booking details.",
    },
    {
      title: "Payment failed but money was deducted",
      solution: "This is usually a temporary hold that will be released in 3-5 business days. If not, contact your bank and submit a support ticket.",
    },
    {
      title: "Need to change booking dates",
      solution: "Contact your host through your dashboard to request date changes. The host must approve any modifications.",
    },
    {
      title: "Property doesn't match listing",
      solution: "Document the issues with photos and report immediately through your dashboard. We'll investigate and help resolve the situation.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-xl opacity-90">
            Report issues and get help from our support team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Support Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">Report an Issue</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="issueType">Issue Type *</Label>
                  <Select value={issueType} onValueChange={setIssueType} required>
                    <SelectTrigger id="issueType" className="mt-1">
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ahmed Hassan"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bookingCode">Booking/Property Code (if applicable)</Label>
                  <Input
                    id="bookingCode"
                    value={formData.bookingCode}
                    onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                    placeholder="e.g., AJR-2025-8472"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Describe the Issue *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please provide as much detail as possible, including dates, property name, and what went wrong..."
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">For urgent issues during your stay:</p>
                      <p>Contact your host directly first, then call our 24/7 emergency hotline if needed.</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-[#FF6B6B] hover:bg-[#FF5252]">
                  Submit Support Ticket
                </Button>
              </form>
            </Card>

            {/* Common Issues */}
            <Card className="p-8 mt-8">
              <h3 className="text-2xl font-bold text-[#2B2B2B] mb-6">Common Issues & Quick Solutions</h3>
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#00BFA6] flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-[#2B2B2B] mb-2">{issue.title}</h4>
                        <p className="text-gray-700 text-sm">{issue.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Contact Methods */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-xl text-[#2B2B2B] mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 bg-[#F9F6F1] rounded-lg flex-shrink-0">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[#2B2B2B]">{method.title}</h4>
                          {method.available && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Available</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-800">{method.content}</p>
                        <p className="text-xs text-gray-600 mt-1">{method.subContent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emergency Notice */}
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Emergency?</h4>
                  <p className="text-sm text-red-800 mb-3">
                    If you're in immediate danger or facing a life-threatening situation, call local emergency services first.
                  </p>
                  <p className="text-sm font-medium text-red-900">
                    Egypt Emergency: 122 (Police)<br />
                    Ambulance: 123
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ Link */}
            <Card className="p-6 bg-gradient-to-br from-[#00BFA6] to-[#00A890] text-white">
              <h4 className="font-semibold text-lg mb-2">Quick Answers</h4>
              <p className="text-sm opacity-90 mb-4">
                Many questions can be answered instantly in our FAQ section.
              </p>
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => onNavigate("faq")}
              >
                Visit FAQ
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
