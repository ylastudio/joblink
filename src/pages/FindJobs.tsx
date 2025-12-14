import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobListingCard from "@/components/JobListingCard";
import CVApplicationModal from "@/components/CVApplicationModal";
import JobDetailsModal from "@/components/JobDetailsModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Globe, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroWorkerImage from "@/assets/hero-worker-smiling.jpg";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  region: string;
  category: string;
  job_type: string;
  salary: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  application_deadline: string | null;
  created_at: string;
}

const FindJobs = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ["Warehousing", "Construction", "Kitchen", "Cleaning"];
  const regions = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria",
    "Cambodia", "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia",
    "Finland", "France",
    "Georgia", "Germany", "Ghana", "Greece", "Guatemala",
    "Honduras", "Hong Kong", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
    "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg",
    "Macedonia", "Malaysia", "Malta", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Myanmar",
    "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "North Korea", "Norway",
    "Oman",
    "Pakistan", "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia",
    "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan",
    "UAE", "Uganda", "UK", "Ukraine", "Uruguay", "USA", "Uzbekistan",
    "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse salary string to get numeric value for filtering
  const parseSalaryValue = (salary: string | null): number => {
    if (!salary) return 0;
    const numbers = salary.match(/[\d,]+/g);
    if (!numbers || numbers.length === 0) return 0;
    return parseInt(numbers[0].replace(/,/g, ''));
  };

  const matchesSalaryRange = (salary: string | null, range: string): boolean => {
    if (range === "all") return true;
    const salaryValue = parseSalaryValue(salary);
    switch (range) {
      case "0-1000": return salaryValue >= 0 && salaryValue < 1000;
      case "1000-2000": return salaryValue >= 1000 && salaryValue < 2000;
      case "2000-3000": return salaryValue >= 2000 && salaryValue < 3000;
      case "3000-5000": return salaryValue >= 3000 && salaryValue < 5000;
      case "5000+": return salaryValue >= 5000;
      default: return true;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      job.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesRegion =
      selectedRegion === "all" ||
      job.region.toLowerCase() === selectedRegion.toLowerCase();
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const handleApply = (jobTitle: string) => {
    setSelectedJobTitle(jobTitle);
    setIsModalOpen(true);
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleApplyFromDetails = () => {
    if (selectedJob) {
      setSelectedJobTitle(selectedJob.title);
      setIsDetailsModalOpen(false);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="pt-24 lg:pt-28 pb-12 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.75), hsl(var(--primary) / 0.5)), url(${heroWorkerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
              {t.findJobsPage.title}
            </h1>
            <p
              className="text-primary-foreground/80 mb-8 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              {t.findJobsPage.subtitle}
            </p>

            {/* Search Bar */}
            <div
              className="flex flex-col gap-3 p-4 bg-card rounded-xl shadow-xl animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder={t.findJobsPage.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-0 bg-muted/50"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-44 h-12 border-0 bg-muted/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder={t.findJobsPage.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.findJobsPage.allCategories}</SelectItem>
                    <SelectItem value="hotels">Hotels</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="helper">Helper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full sm:w-44 h-12 border-0 bg-muted/50">
                    <Globe className="w-4 h-4 mr-2" />
                    <SelectValue placeholder={t.findJobsPage.allRegions} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.findJobsPage.allRegions}</SelectItem>
                    {regions.map((reg) => (
                      <SelectItem key={reg} value={reg.toLowerCase()}>{reg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="accent" size="lg" className="h-12 px-8 sm:ml-auto">
                  {t.findJobsPage.search}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              {t.findJobsPage.showing}{" "}
              <span className="font-semibold text-foreground">
                {filteredJobs.length}
              </span>{" "}
              {t.findJobsPage.jobs}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <JobListingCard
                  key={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  region={job.region}
                  category={job.category}
                  type={job.job_type}
                  salary={job.salary || "Competitive"}
                  postedAt={getTimeAgo(job.created_at)}
                  onApply={() => handleApply(job.title)}
                  onViewDetails={() => handleViewDetails(job)}
                  delay={index * 50}
                />
              ))}
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {t.findJobsPage.noJobs}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedRegion("all");
                }}
              >
                {t.findJobsPage.clearFilters}
              </Button>
            </div>
          )}
        </div>
      </section>

      <CVApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJobTitle}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onApply={handleApplyFromDetails}
        job={selectedJob}
      />

      <Footer />
    </div>
  );
};

export default FindJobs;
