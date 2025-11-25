import { Shield, Users, Clock } from "lucide-react";

interface WhyAjarlyProps {
  t: any;
}

export function WhyAjarly({ t }: WhyAjarlyProps) {
  const features = [
    {
      icon: Shield,
      title: t?.trustedPlatform || "Trusted Platform",
      description: t?.trustedDesc || "Verified properties and secure bookings",
    },
    {
      icon: Users,
      title: t?.localExpertise || "Local Expertise",
      description:
        t?.localExpertiseDesc || "Deep knowledge of Egyptian properties",
    },
    {
      icon: Clock,
      title: t?.support247 || "24/7 Support",
      description: t?.supportDesc || "Always here to help you",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.title} className="text-center">
          <div className="w-16 h-16 bg-[#00BFA6] rounded-full flex items-center justify-center mx-auto mb-4">
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
