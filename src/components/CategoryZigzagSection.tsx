import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryItem {
  icon: LucideIcon;
  title: string;
  description: string;
  jobCount: number;
  image: string;
}

interface CategoryZigzagSectionProps {
  categories: CategoryItem[];
}

const CategoryZigzagSection = ({ categories }: CategoryZigzagSectionProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 lg:space-y-24">
      {categories.map((category, index) => {
        const isEven = index % 2 === 0;
        const Icon = category.icon;

        return (
          <div
            key={category.title}
            className={cn(
              "grid lg:grid-cols-2 gap-8 lg:gap-16 items-center animate-fade-in"
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Image */}
            <div
              className={cn(
                "relative rounded-2xl overflow-hidden shadow-xl group",
                !isEven && "lg:order-2"
              )}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-64 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              
              {/* Floating job count badge */}
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <span className="text-lg font-bold text-accent">{category.jobCount}+</span>
                <span className="text-sm text-muted-foreground ml-1">{t.categories.openPositions}</span>
              </div>
            </div>

            {/* Content */}
            <div
              className={cn(
                "space-y-6",
                !isEven && "lg:order-1"
              )}
            >
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-lg">
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>

              <h3 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
                {category.title}
              </h3>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {category.description}
              </p>

              <Link
                to="/find-jobs"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all duration-300 group"
              >
                {t.categories.viewJobs}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryZigzagSection;
