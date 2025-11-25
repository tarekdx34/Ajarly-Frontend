import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Language, translations } from "../../lib/translations";

interface ContactPageProps {
  onNavigate: (page: string) => void;
  language?: Language;
}

export function ContactPage({ onNavigate, language = "en" }: ContactPageProps) {
  const t = translations[language].contact;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.messageSent);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-[#00BFA6]" />,
      title: t.emailUs,
      content: "support@ajarly.com",
      subContent: t.emailDesc,
    },
    {
      icon: <Phone className="w-6 h-6 text-[#00BFA6]" />,
      title: t.callUs,
      content: "+20 123 456 7890",
      subContent: t.callDesc,
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#00BFA6]" />,
      title: t.visitUs,
      content: "123 Corniche Road, Alexandria",
      subContent: t.visitDesc,
    },
    {
      icon: <Clock className="w-6 h-6 text-[#00BFA6]" />,
      title: t.businessHours,
      content: t.businessHoursMain,
      subContent: t.businessHoursDesc,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-3xl font-bold text-[#2B2B2B] mb-6">{t.sendMessage}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">{t.fullName} *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t.namePlaceholder}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t.emailAddress} *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t.emailPlaceholder}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">{t.subject} *</Label>
                  <Input
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={t.subjectPlaceholder}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">{t.message} *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.messagePlaceholder}
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-[#00BFA6] hover:bg-[#00A890]">
                  <Send className="w-4 h-4 mr-2" />
                  {t.sendButton}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#F9F6F1] rounded-lg">{info.icon}</div>
                  <div>
                    <h3 className="font-semibold text-[#2B2B2B] mb-1">{info.title}</h3>
                    <p className="text-gray-700 mb-1">{info.content}</p>
                    <p className="text-sm text-gray-500">{info.subContent}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <Card className="overflow-hidden">
          <div className="aspect-[21/9] bg-gray-200 relative">
            {/* Embedded Google Maps Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00BFA6]/20 to-[#FF6B6B]/20">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-[#00BFA6] mx-auto mb-4" />
                <p className="text-lg font-semibold text-[#2B2B2B]">123 Corniche Road, Alexandria, Egypt</p>
                <p className="text-gray-600 mt-2">Interactive map would be embedded here</p>
              </div>
            </div>
            {/* In a real app, you would embed an actual Google Maps iframe here:
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            />
            */}
          </div>
        </Card>

        {/* FAQ Quick Links */}
        <div className="mt-16 text-center bg-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">{t.quickAnswers}</h2>
          <p className="text-gray-700 mb-8">{t.quickAnswersDesc}</p>
          <Button variant="outline" size="lg" onClick={() => onNavigate("faq")}>
            {t.visitFaq}
          </Button>
        </div>
      </div>
    </div>
  );
}