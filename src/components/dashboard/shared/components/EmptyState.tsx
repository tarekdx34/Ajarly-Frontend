import { LucideIcon } from "lucide-react";
import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-[#2B2B2B] mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className="bg-[#00BFA6] hover:bg-[#00A890]"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}