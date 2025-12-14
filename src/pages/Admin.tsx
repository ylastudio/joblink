import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Plus, Pencil, Trash2, LogOut, Loader2, Briefcase, Mail, Eye, Users, Search, X, FileText } from "lucide-react";

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
  is_active: boolean;
  created_at: string;
}

interface JobInquiry {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  country: string;
  location: string;
  industry: string;
  positions: number;
  job_details: string | null;
  created_at: string;
}

interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nationality: string;
  current_location: string | null;
  date_of_birth: string | null;
  skills: string[] | null;
  experience_years: number;
  preferred_industries: string[] | null;
  preferred_countries: string[] | null;
  cv_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const emptyJob = {
  title: "",
  company: "",
  location: "",
  region: "",
  category: "",
  job_type: "Full-time",
  salary: "",
  description: "",
  requirements: "",
  benefits: "",
  application_deadline: "",
  is_active: true,
};

const Admin = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inquiries, setInquiries] = useState<JobInquiry[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInquiriesLoading, setIsInquiriesLoading] = useState(true);
  const [isCandidatesLoading, setIsCandidatesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);
  const [isCandidateDialogOpen, setIsCandidateDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<JobInquiry | null>(null);
  const [viewingCandidate, setViewingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState(emptyJob);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("jobs");

  // Search and filter states
  const [jobSearch, setJobSearch] = useState("");
  const [jobCategoryFilter, setJobCategoryFilter] = useState("all");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryIndustryFilter, setInquiryIndustryFilter] = useState("all");

  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateStatusFilter, setCandidateStatusFilter] = useState("all");
  const [candidateNationalityFilter, setCandidateNationalityFilter] = useState("all");

  const navigate = useNavigate();
  const { toast } = useToast();

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
  const jobTypes = ["Full-time", "Part-time", "Contract"];
  const candidateStatuses = ["pending", "approved", "interview", "rejected"];
  const industries = ["hotels", "construction", "plumbing", "helper", "Manufacturing", "Cleaning", "Warehouse", "Kitchen"];

  // Get unique nationalities from candidates
  const uniqueNationalities = [...new Set(candidates.map(c => c.nationality))].sort();

  // Filtered data
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = jobSearch === "" || 
      job.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      job.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesCategory = jobCategoryFilter === "all" || job.category === jobCategoryFilter;
    const matchesStatus = jobStatusFilter === "all" || 
      (jobStatusFilter === "active" ? job.is_active : !job.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquirySearch === "" ||
      inquiry.company_name.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inquiry.contact_person.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(inquirySearch.toLowerCase());
    const matchesIndustry = inquiryIndustryFilter === "all" || inquiry.industry === inquiryIndustryFilter;
    return matchesSearch && matchesIndustry;
  });

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidateSearch === "" ||
      candidate.full_name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      candidate.email.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      (candidate.skills && candidate.skills.some(s => s.toLowerCase().includes(candidateSearch.toLowerCase())));
    const matchesStatus = candidateStatusFilter === "all" || candidate.status === candidateStatusFilter;
    const matchesNationality = candidateNationalityFilter === "all" || candidate.nationality === candidateNationalityFilter;
    return matchesSearch && matchesStatus && matchesNationality;
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchJobs();
      fetchInquiries();
      fetchCandidates();
    }
  }, [user, isAdmin]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInquiries = async () => {
    setIsInquiriesLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast({
        title: "Error",
        description: "Failed to load job inquiries",
        variant: "destructive",
      });
    } finally {
      setIsInquiriesLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setIsCandidatesLoading(true);
    try {
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates",
        variant: "destructive",
      });
    } finally {
      setIsCandidatesLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const jobData = {
        ...formData,
        application_deadline: formData.application_deadline || null,
        created_by: user?.id,
      };

      if (editingJob) {
        const { error } = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", editingJob.id);

        if (error) throw error;
        toast({ title: "Success", description: "Job updated successfully" });
      } else {
        const { error } = await supabase.from("jobs").insert(jobData);

        if (error) throw error;
        toast({ title: "Success", description: "Job created successfully" });
      }

      setIsDialogOpen(false);
      setEditingJob(null);
      setFormData(emptyJob);
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      region: job.region,
      category: job.category,
      job_type: job.job_type,
      salary: job.salary || "",
      description: job.description || "",
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      application_deadline: job.application_deadline || "",
      is_active: job.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Job deleted successfully" });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const { error } = await supabase.from("job_inquiries").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Inquiry deleted successfully" });
      fetchInquiries();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to delete inquiry",
        variant: "destructive",
      });
    }
  };

  const handleViewInquiry = (inquiry: JobInquiry) => {
    setViewingInquiry(inquiry);
    setIsInquiryDialogOpen(true);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setViewingCandidate(candidate);
    setIsCandidateDialogOpen(true);
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    try {
      const { error } = await supabase.from("candidates").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Candidate deleted successfully" });
      fetchCandidates();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCandidateStatus = async (candidateId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("candidates")
        .update({ status: newStatus })
        .eq("id", candidateId);

      if (error) throw error;
      
      // Update local state
      setCandidates(prev => prev.map(c => 
        c.id === candidateId ? { ...c, status: newStatus } : c
      ));
      if (viewingCandidate?.id === candidateId) {
        setViewingCandidate(prev => prev ? { ...prev, status: newStatus } : null);
      }
      
      toast({ title: "Success", description: "Status updated successfully" });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'interview':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin && user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-8">
              You don't have admin privileges. Contact an administrator to request access.
            </p>
            <Button variant="accent" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 lg:pt-28 pb-8 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-primary-foreground">
                Admin Dashboard
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Manage job listings and inquiries
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="hero-outline" size="lg" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Inquiries ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="candidates" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Candidates ({candidates.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    className="pl-10"
                  />
                  {jobSearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setJobSearch("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Select value={jobCategoryFilter} onValueChange={setJobCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={jobStatusFilter} onValueChange={setJobStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) {
                    setEditingJob(null);
                    setFormData(emptyJob);
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button variant="accent" size="lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingJob ? "Edit Job" : "Create New Job"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title *</Label>
                          <Input
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="e.g. Warehouse Manager"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company *</Label>
                          <Input
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            placeholder="Company name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Location *</Label>
                          <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="City"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Region *</Label>
                          <Select
                            value={formData.region}
                            onValueChange={(value) => handleInputChange("region", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                              {regions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Job Type *</Label>
                          <Select
                            value={formData.job_type}
                            onValueChange={(value) => handleInputChange("job_type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Salary</Label>
                          <Input
                            value={formData.salary}
                            onChange={(e) => handleInputChange("salary", e.target.value)}
                            placeholder="e.g. $40K - $50K"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Application Deadline</Label>
                          <Input
                            type="date"
                            value={formData.application_deadline}
                            onChange={(e) => handleInputChange("application_deadline", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Job description..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Requirements</Label>
                        <Textarea
                          value={formData.requirements}
                          onChange={(e) => handleInputChange("requirements", e.target.value)}
                          placeholder="Job requirements..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Benefits</Label>
                        <Textarea
                          value={formData.benefits}
                          onChange={(e) => handleInputChange("benefits", e.target.value)}
                          placeholder="Job benefits..."
                          rows={3}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_active"
                          checked={formData.is_active}
                          onChange={(e) => handleInputChange("is_active", e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="is_active">Active (visible to job seekers)</Label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="accent"
                          className="flex-1"
                          disabled={isSaving}
                        >
                          {isSaving ? "Saving..." : editingJob ? "Update Job" : "Create Job"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg mb-4">
                    {jobs.length === 0 ? "No jobs created yet." : "No jobs match your filters."}
                  </p>
                  {jobs.length === 0 && (
                    <Button variant="accent" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Job
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="hidden md:table-cell">Location</TableHead>
                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          <TableCell className="font-medium">{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {job.location}, {job.region}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{job.category}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                job.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {job.is_active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(job)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(job.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="inquiries">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inquiries..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    className="pl-10"
                  />
                  {inquirySearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setInquirySearch("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Select value={inquiryIndustryFilter} onValueChange={setInquiryIndustryFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isInquiriesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : filteredInquiries.length === 0 ? (
                <div className="text-center py-16">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {inquiries.length === 0 ? "No job inquiries received yet." : "No inquiries match your filters."}
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Industry</TableHead>
                        <TableHead className="hidden sm:table-cell">Positions</TableHead>
                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="font-medium">{inquiry.company_name}</TableCell>
                          <TableCell>{inquiry.contact_person}</TableCell>
                          <TableCell className="hidden md:table-cell">{inquiry.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{inquiry.industry}</TableCell>
                          <TableCell className="hidden sm:table-cell">{inquiry.positions}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {formatDate(inquiry.created_at)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewInquiry(inquiry)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteInquiry(inquiry.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Inquiry Detail Dialog */}
              <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Job Inquiry Details</DialogTitle>
                  </DialogHeader>
                  {viewingInquiry && (
                    <div className="space-y-6 mt-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Company Name</Label>
                          <p className="font-medium">{viewingInquiry.company_name}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Contact Person</Label>
                          <p className="font-medium">{viewingInquiry.contact_person}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Email</Label>
                          <p className="font-medium">
                            <a href={`mailto:${viewingInquiry.email}`} className="text-accent hover:underline">
                              {viewingInquiry.email}
                            </a>
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Phone</Label>
                          <p className="font-medium">{viewingInquiry.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Country</Label>
                          <p className="font-medium">{viewingInquiry.country}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Location</Label>
                          <p className="font-medium">{viewingInquiry.location}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Industry</Label>
                          <p className="font-medium">{viewingInquiry.industry}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Positions Needed</Label>
                          <p className="font-medium">{viewingInquiry.positions}</p>
                        </div>
                      </div>

                      {viewingInquiry.job_details && (
                        <div>
                          <Label className="text-muted-foreground text-sm">Job Details</Label>
                          <p className="font-medium whitespace-pre-wrap">{viewingInquiry.job_details}</p>
                        </div>
                      )}

                      <div>
                        <Label className="text-muted-foreground text-sm">Submitted On</Label>
                        <p className="font-medium">{formatDate(viewingInquiry.created_at)}</p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsInquiryDialogOpen(false)}
                          className="flex-1"
                        >
                          Close
                        </Button>
                        <Button
                          variant="accent"
                          className="flex-1"
                          asChild
                        >
                          <a href={`mailto:${viewingInquiry.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Reply via Email
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="candidates">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search candidates..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="pl-10"
                  />
                  {candidateSearch && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setCandidateSearch("")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Select value={candidateStatusFilter} onValueChange={setCandidateStatusFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {candidateStatuses.map((status) => (
                      <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={candidateNationalityFilter} onValueChange={setCandidateNationalityFilter}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nationalities</SelectItem>
                    {uniqueNationalities.map((nat) => (
                      <SelectItem key={nat} value={nat}>{nat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isCandidatesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {candidates.length === 0 ? "No candidates registered yet." : "No candidates match your filters."}
                  </p>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="hidden lg:table-cell">Nationality</TableHead>
                        <TableHead className="hidden sm:table-cell">Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.full_name}</TableCell>
                          <TableCell className="hidden md:table-cell">{candidate.email}</TableCell>
                          <TableCell className="hidden lg:table-cell">{candidate.nationality}</TableCell>
                          <TableCell className="hidden sm:table-cell">{candidate.experience_years} yrs</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadgeClass(candidate.status)}`}>
                              {candidate.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewCandidate(candidate)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCandidate(candidate.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Candidate Detail Dialog */}
              <Dialog open={isCandidateDialogOpen} onOpenChange={setIsCandidateDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Candidate Details</DialogTitle>
                  </DialogHeader>
                  {viewingCandidate && (
                    <div className="space-y-6 mt-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold">{viewingCandidate.full_name}</h3>
                        <Select
                          value={viewingCandidate.status}
                          onValueChange={(value) => handleUpdateCandidateStatus(viewingCandidate.id, value)}
                        >
                          <SelectTrigger className={`w-32 ${getStatusBadgeClass(viewingCandidate.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {candidateStatuses.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Email</Label>
                          <p className="font-medium">
                            <a href={`mailto:${viewingCandidate.email}`} className="text-accent hover:underline">
                              {viewingCandidate.email}
                            </a>
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Phone</Label>
                          <p className="font-medium">{viewingCandidate.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Nationality</Label>
                          <p className="font-medium">{viewingCandidate.nationality}</p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Current Location</Label>
                          <p className="font-medium">{viewingCandidate.current_location || "Not provided"}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground text-sm">Date of Birth</Label>
                          <p className="font-medium">
                            {viewingCandidate.date_of_birth 
                              ? formatDate(viewingCandidate.date_of_birth) 
                              : "Not provided"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-sm">Experience</Label>
                          <p className="font-medium">{viewingCandidate.experience_years} years</p>
                        </div>
                      </div>

                      {viewingCandidate.skills && viewingCandidate.skills.length > 0 && (
                        <div>
                          <Label className="text-muted-foreground text-sm">Skills</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {viewingCandidate.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-accent/10 text-accent text-sm rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {viewingCandidate.preferred_industries && viewingCandidate.preferred_industries.length > 0 && (
                        <div>
                          <Label className="text-muted-foreground text-sm">Preferred Industries</Label>
                          <p className="font-medium">{viewingCandidate.preferred_industries.join(", ")}</p>
                        </div>
                      )}

                      {viewingCandidate.preferred_countries && viewingCandidate.preferred_countries.length > 0 && (
                        <div>
                          <Label className="text-muted-foreground text-sm">Preferred Countries</Label>
                          <p className="font-medium">{viewingCandidate.preferred_countries.join(", ")}</p>
                        </div>
                      )}

                      {viewingCandidate.notes && (
                        <div>
                          <Label className="text-muted-foreground text-sm">Notes</Label>
                          <p className="font-medium whitespace-pre-wrap">{viewingCandidate.notes}</p>
                        </div>
                      )}

                      <div>
                        <Label className="text-muted-foreground text-sm">Registered On</Label>
                        <p className="font-medium">{formatDate(viewingCandidate.created_at)}</p>
                      </div>

                      {viewingCandidate.cv_url && (
                        <div>
                          <Label className="text-muted-foreground text-sm">CV / Resume</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-1"
                            onClick={async () => {
                              const { data } = await supabase.storage
                                .from("candidate-cvs")
                                .createSignedUrl(viewingCandidate.cv_url!, 60);
                              if (data?.signedUrl) {
                                window.open(data.signedUrl, "_blank");
                              }
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Download CV
                          </Button>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsCandidateDialogOpen(false)}
                          className="flex-1"
                        >
                          Close
                        </Button>
                        <Button
                          variant="accent"
                          className="flex-1"
                          asChild
                        >
                          <a href={`mailto:${viewingCandidate.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Candidate
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
