import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  Gift,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  job: {
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
  } | null;
}

const JobDetailsModal = ({ isOpen, onClose, onApply, job }: JobDetailsModalProps) => {
  const { t } = useLanguage();

  if (!job) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseListItems = (text: string | null) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge variant="secondary" className="mb-2">
                {job.category}
              </Badge>
              <DialogTitle className="text-2xl font-bold">
                {job.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{job.location}, {job.region}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{job.job_type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>{job.salary || "Competitive"}</span>
            </div>
          </div>

          {job.application_deadline && (
            <div className="flex items-center gap-2 text-sm bg-accent/10 text-accent px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Application Deadline: {formatDate(job.application_deadline)}</span>
            </div>
          )}

          <Separator />

          {/* Description */}
          {job.description && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Job Description</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Requirements</h3>
              </div>
              <ul className="space-y-2">
                {parseListItems(job.requirements).map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Benefits</h3>
              </div>
              <ul className="space-y-2">
                {parseListItems(job.benefits).map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Posted Date */}
          <p className="text-sm text-muted-foreground">
            Posted on {formatDate(job.created_at)}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="accent" onClick={onApply} className="flex-1">
              {t.findJobsPage.applyNow}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
