import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Upload, CheckCircle, Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { COUNTRIES } from "@/constants/countries";
import PhoneInput, { validatePhoneNumber, formatPhoneDisplay } from "@/components/PhoneInput";

interface CVApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle?: string;
}

const INDUSTRIES = [
  "Agriculture",
  "Automotive",
  "Construction",
  "Education",
  "Energy & Utilities",
  "Finance & Banking",
  "Food & Beverage",
  "Healthcare",
  "Hospitality & Tourism",
  "Information Technology",
  "Logistics & Transportation",
  "Manufacturing",
  "Mining",
  "Oil & Gas",
  "Real Estate",
  "Retail",
  "Security Services",
  "Telecommunications",
  "Warehouse & Distribution",
  "Other",
];

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().min(1, "Phone is required").refine(validatePhoneNumber, "Please enter a valid phone number"),
  phoneCountryCode: z.string().min(1, "Please select a country code"),
  nationality: z.string().min(1, "Nationality is required"),
  currentLocation: z.string().min(1, "Current location is required").max(100),
  experienceYears: z.number().min(0, "Experience must be 0 or more").max(50, "Invalid experience years"),
  skills: z.string().min(1, "Please enter at least one skill").max(500),
  preferredIndustries: z.array(z.string()).min(1, "Select at least one industry"),
  preferredCountries: z.array(z.string()).min(1, "Select at least one country"),
  coverLetter: z.string().max(2000).optional(),
});

const CVApplicationModal = ({
  isOpen,
  onClose,
  jobTitle,
}: CVApplicationModalProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phoneCountryCode: "US",
    nationality: "",
    currentLocation: "",
    experienceYears: 0,
    skills: "",
    preferredIndustries: [] as string[],
    preferredCountries: [] as string[],
    coverLetter: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type (only PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      
      if (!allowedTypes.includes(selectedFile.type) && !allowedExtensions.includes(fileExtension)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setFileName(selectedFile.name);
      setFile(selectedFile);
      if (errors.cv) {
        setErrors((prev) => ({ ...prev, cv: "" }));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      phoneCountryCode: "US",
      nationality: "",
      currentLocation: "",
      experienceYears: 0,
      skills: "",
      preferredIndustries: [],
      preferredCountries: [],
      coverLetter: "",
    });
    setFileName("");
    setFile(null);
    setErrors({});
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNumberChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const toggleArrayItem = (field: "preferredIndustries" | "preferredCountries", item: string) => {
    setFormData((prev) => {
      const currentArray = prev[field];
      const newArray = currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = applicationSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    // Validate file
    if (!file) {
      setErrors((prev) => ({ ...prev, cv: "Please upload your CV" }));
      return;
    }

    setIsSubmitting(true);

    try {
      let cvUrl: string | null = null;

      // Upload CV file
      const fileExt = file.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("candidate-cvs")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Failed to upload CV: ${uploadError.message}`);
      }

      cvUrl = filePath;

      const fullPhoneNumber = formatPhoneDisplay(formData.phoneCountryCode, formData.phone);

      // Insert candidate record
      const skillsArray = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);
      
      const { error: insertError } = await supabase.from("candidates").insert({
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: fullPhoneNumber,
        cv_url: cvUrl,
        notes: formData.coverLetter
          ? `Applied for: ${jobTitle || "General Application"}\n\nCover Letter:\n${formData.coverLetter}`
          : `Applied for: ${jobTitle || "General Application"}`,
        nationality: formData.nationality,
        current_location: formData.currentLocation,
        experience_years: formData.experienceYears,
        skills: skillsArray,
        preferred_industries: formData.preferredIndustries,
        preferred_countries: formData.preferredCountries,
        status: "pending",
      });

      if (insertError) {
        throw new Error(`Failed to submit application: ${insertError.message}`);
      }

      setIsSubmitted(true);
      toast({
        title: t.applicationModal.success.title,
        description: t.applicationModal.success.message,
      });

      setTimeout(() => {
        setIsSubmitted(false);
        resetForm();
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Application submission error:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      setIsSubmitted(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-12 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
              {t.applicationModal.success.title}
            </h3>
            <p className="text-muted-foreground">
              {t.applicationModal.success.message}
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {t.applicationModal.title}
              </DialogTitle>
              <DialogDescription>
                {jobTitle
                  ? `${t.applicationModal.subtitle}: ${jobTitle}`
                  : t.applicationModal.subtitle}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {t.applicationModal.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`h-11 ${errors.firstName ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.applicationModal.lastName}</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`h-11 ${errors.lastName ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t.applicationModal.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.email ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t.applicationModal.phone}</Label>
                <PhoneInput
                  value={formData.phone}
                  onChange={(value) => handleSelectChange("phone", value)}
                  countryCode={formData.phoneCountryCode}
                  onCountryCodeChange={(code) => handleSelectChange("phoneCountryCode", code)}
                  error={!!errors.phone || !!errors.phoneCountryCode}
                  placeholder="Phone number"
                  required
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => handleSelectChange("nationality", value)}
                  >
                    <SelectTrigger className={`h-11 ${errors.nationality ? "border-destructive" : ""}`}>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.nationality && (
                    <p className="text-sm text-destructive">{errors.nationality}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location *</Label>
                  <Input
                    id="currentLocation"
                    placeholder="City, Country"
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    className={`h-11 ${errors.currentLocation ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.currentLocation && (
                    <p className="text-sm text-destructive">{errors.currentLocation}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience *</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  max="50"
                  placeholder="0"
                  value={formData.experienceYears}
                  onChange={(e) => handleNumberChange("experienceYears", e.target.value)}
                  className={`h-11 ${errors.experienceYears ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.experienceYears && (
                  <p className="text-sm text-destructive">{errors.experienceYears}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills * (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="e.g., Welding, Driving, Plumbing"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className={`h-11 ${errors.skills ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.skills && (
                  <p className="text-sm text-destructive">{errors.skills}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Industries * (select multiple)</Label>
                <div className={`grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-[150px] overflow-y-auto ${errors.preferredIndustries ? "border-destructive" : "border-input"}`}>
                  {INDUSTRIES.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={`industry-${industry}`}
                        checked={formData.preferredIndustries.includes(industry)}
                        onCheckedChange={() => toggleArrayItem("preferredIndustries", industry)}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`industry-${industry}`}
                        className="text-sm cursor-pointer"
                      >
                        {industry}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.preferredIndustries.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.preferredIndustries.map((ind) => (
                      <span key={ind} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent-foreground text-xs rounded-full">
                        {ind}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => toggleArrayItem("preferredIndustries", ind)}
                        />
                      </span>
                    ))}
                  </div>
                )}
                {errors.preferredIndustries && (
                  <p className="text-sm text-destructive">{errors.preferredIndustries}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Countries * (select multiple)</Label>
                <div className={`grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-[150px] overflow-y-auto ${errors.preferredCountries ? "border-destructive" : "border-input"}`}>
                  {COUNTRIES.map((country) => (
                    <div key={country} className="flex items-center space-x-2">
                      <Checkbox
                        id={`country-${country}`}
                        checked={formData.preferredCountries.includes(country)}
                        onCheckedChange={() => toggleArrayItem("preferredCountries", country)}
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`country-${country}`}
                        className="text-sm cursor-pointer"
                      >
                        {country}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.preferredCountries.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.preferredCountries.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/20 text-accent-foreground text-xs rounded-full">
                        {c}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => toggleArrayItem("preferredCountries", c)}
                        />
                      </span>
                    ))}
                  </div>
                )}
                {errors.preferredCountries && (
                  <p className="text-sm text-destructive">{errors.preferredCountries}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cv">{t.applicationModal.uploadCV}</Label>
                <div className="relative">
                  <Input
                    id="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="cv"
                    className={`flex items-center justify-center gap-2 h-24 rounded-lg border-2 border-dashed hover:border-accent cursor-pointer transition-colors bg-muted/50 ${
                      errors.cv ? "border-destructive" : "border-border"
                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {fileName || t.applicationModal.uploadPlaceholder}
                    </span>
                  </label>
                </div>
                {errors.cv && (
                  <p className="text-sm text-destructive">{errors.cv}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverLetter">
                  {t.applicationModal.coverLetter}
                </Label>
                <Textarea
                  id="coverLetter"
                  placeholder={t.applicationModal.coverLetterPlaceholder}
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {t.applicationModal.cancel}
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    t.applicationModal.submit
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CVApplicationModal;
