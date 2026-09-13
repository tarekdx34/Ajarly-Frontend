import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: "page" | "banner";
  offline?: boolean;
  className?: string;
}

// Reusable "something went wrong" UI so every page shows a friendly,
// non-technical message with a retry action instead of a raw error string.
export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = "Try again",
  variant = "banner",
  offline = false,
  className = "",
}: ErrorStateProps) {
  const Icon = offline ? WifiOff : AlertCircle;

  if (variant === "page") {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Icon className="w-7 h-7 text-red-500" />
          </div>
          {title && (
            <h3 className="text-lg font-semibold text-[#2B2B2B] mb-2">
              {title}
            </h3>
          )}
          <p className="text-gray-600 mb-4">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {retryLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}
    >
      <Icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-medium text-red-800 mb-0.5">{title}</p>
        )}
        <p className="text-sm text-red-700">{message}</p>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="gap-1.5 flex-shrink-0 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

interface OfflineDataBannerProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

// Subtle notice used above listings that are showing sample/demo data
// because the backend couldn't be reached — deliberately calmer than
// ErrorState since nothing is actually broken from the visitor's view.
export function OfflineDataBanner({
  message,
  onRetry,
  retryLabel = "Try again",
  className = "",
}: OfflineDataBannerProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 mb-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 ${className}`}
    >
      <WifiOff className="w-4 h-4 flex-shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium underline hover:no-underline flex-shrink-0"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
