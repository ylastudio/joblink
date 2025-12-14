import { MapPin, Clock, DollarSign, Building, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface JobListingCardProps {
  title: string;
  company: string;
  location: string;
  region?: string;
  type: string;
  salary: string;
  category: string;
  postedAt: string;
  onApply: () => void;
  onViewDetails?: () => void;
  delay?: number;
}

const JobListingCard = ({
  title,
  company,
  location,
  region,
  type,
  salary,
  category,
  postedAt,
  onApply,
  onViewDetails,
  delay = 0,
}: JobListingCardProps) => {
  const { t } = useLanguage();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on the apply button
    if ((e.target as HTMLElement).closest('button')) return;
    onViewDetails?.();
  };

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border shadow-card",
        "hover:shadow-card-hover transition-all duration-300",
        "animate-fade-in",
        onViewDetails && "cursor-pointer hover:border-accent/50"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={handleCardClick}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Job Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
              {category}
            </span>
            <span className="text-xs text-muted-foreground">{postedAt}</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              {company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {location}{region ? `, ${region}` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {type}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              {salary}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <Button variant="accent" onClick={onApply}>
          {t.findJobsPage.applyNow}
        </Button>
      </div>
    </div>
  );
};

export default JobListingCard;
