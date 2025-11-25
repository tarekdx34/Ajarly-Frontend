import { ImageWithFallback } from "../../figma/ImageWithFallback";
import { Language } from "../../../lib/translations";

interface CategoriesProps {
  language: Language;
  onNavigate: (page: string) => void;
}

const CATEGORIES = [
  {
    title: "Beachfront",
    image:
      "https://images.unsplash.com/photo-1678788762802-0c6c6cdd89fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwcHJvcGVydHl8ZW58MXx8fHwxNzYxMTYxMzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Family Homes",
    image:
      "https://images.unsplash.com/photo-1629359080404-2dafcfd9f159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGhvbWV8ZW58MXx8fHwxNzYxMTYxMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "Chalets",
    image:
      "https://images.unsplash.com/photo-1638310081327-5b4b5da6d155?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGNoYWxldCUyMHBvb2x8ZW58MXx8fHwxNzYxMTYxMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    title: "City Apartments",
    image:
      "https://images.unsplash.com/photo-1700126689261-1f5bdfe5adcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBjaXR5fGVufDF8fHx8MTc2MTEwNjkyM3ww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function Categories({ language, onNavigate }: CategoriesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {CATEGORIES.map((category) => (
        <button
          key={category.title}
          onClick={() => onNavigate("properties")}
          className="group text-left"
        >
          <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
            <ImageWithFallback
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <h3 className="font-semibold text-[#2B2B2B]">{category.title}</h3>
        </button>
      ))}
    </div>
  );
}
