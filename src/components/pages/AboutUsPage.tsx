import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Card } from "../ui/card";
import { Heart, Shield, Award, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Language, translations } from "../../lib/translations";

interface AboutUsPageProps {
  onNavigate: (page: string) => void;
  language?: Language;
}

export function AboutUsPage({ onNavigate, language = "en" }: AboutUsPageProps) {
  const t = translations[language].about;

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-[#FF6B6B]" />,
      title: t.egyptianHospitality,
      description: t.egyptianHospitalityDesc,
    },
    {
      icon: <Shield className="w-8 h-8 text-[#00BFA6]" />,
      title: t.trustSafety,
      description: t.trustSafetyDesc,
    },
    {
      icon: <Award className="w-8 h-8 text-[#FF6B6B]" />,
      title: t.qualityFirst,
      description: t.qualityFirstDesc,
    },
    {
      icon: <Users className="w-8 h-8 text-[#00BFA6]" />,
      title: t.communityDriven,
      description: t.communityDrivenDesc,
    },
  ];

  const team = [
    { name: "Ahmed Hassan", role: t.founderCeo, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { name: "Fatima Ibrahim", role: t.headOfOperations, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
    { name: "Mohamed Ali", role: t.headOfTechnology, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" },
    { name: "Sarah Ahmed", role: t.customerExperience, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZ3lwdCUyMGNvYXN0fGVufDF8fHx8MTc2MTE2MTM3OXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Egyptian Coast"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00BFA6]/80 to-[#FF6B6B]/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {t.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">{t.ourMission}</h2>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              {t.missionText1}
            </p>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              {t.missionText2}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t.missionText3}
            </p>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwYmVhY2h8ZW58MXx8fHwxNzYxMTYxMzgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Mediterranean beach"
              className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#2B2B2B] text-center mb-12">{t.ourValues}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="font-semibold text-xl text-[#2B2B2B] mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-[#00BFA6] to-[#00A890] rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-5xl font-bold mb-2">1,200+</p>
              <p className="text-lg opacity-90">{t.statsProperties}</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">15,000+</p>
              <p className="text-lg opacity-90">{t.statsGuests}</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">3</p>
              <p className="text-lg opacity-90">{translations[language].properties.allLocations}</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">4.9</p>
              <p className="text-lg opacity-90">{t.statsRating}</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-[#2B2B2B] text-center mb-12">{t.meetOurTeam}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg text-[#2B2B2B] mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#F9F6F1] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-[#2B2B2B] mb-4">{t.joinCommunity}</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            {t.joinDesc}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-[#00BFA6] hover:bg-[#00A890]"
              onClick={() => onNavigate("properties")}
            >
              {t.browseProperties}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate("register?role=owner")}
            >
              {t.becomeHost}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
