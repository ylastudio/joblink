import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface JobCategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  jobCount: number;
  delay?: number;
}

const JobCategoryCard = ({
  icon: Icon,
  title,
  description,
  jobCount,
  delay = 0,
}: JobCategoryCardProps) => {
  const { t } = useLanguage();

  return (
    <Link
      to="/find-jobs"
      className={cn(
        "group block p-6 lg:p-8 rounded-2xl bg-card gradient-card border border-border",
        "shadow-card hover:shadow-card-hover transition-all duration-300",
        "hover:-translate-y-1 animate-fade-in"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
        <Icon className="w-7 h-7 text-primary-foreground" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-accent">
          {jobCount}+ {t.categories.openPositions}
        </span>
        <span className="text-sm text-primary group-hover:translate-x-1 transition-transform">
          {t.categories.viewJobs} →
        </span>
      </div>
    </Link>
  );
};

export default JobCategoryCard;
