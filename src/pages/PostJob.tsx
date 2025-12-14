import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import { CheckCircle, Briefcase, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroManagerImage from "@/assets/hero-manager-smiling.jpg";
import { z } from "zod";
import { COUNTRIES } from "@/constants/countries";

// Validation schema for job inquiry form
const jobInquirySchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(200, "Company name must be less than 200 characters"),
  contactPerson: z.string().min(1, "Contact person is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().min(1, "Phone number is required").max(30, "Phone must be less than 30 characters"),
  industry: z.string().min(1, "Please select an industry"),
  positions: z.string().regex(/^\d+$/, "Invalid position count"),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  country: z.string().min(1, "Country is required").max(100, "Country must be less than 100 characters"),
  jobDetails: z.string().max(2000, "Job details must be less than 2000 characters").optional(),
});

const PostJob = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    industry: "",
    positions: "1",
    location: "",
    country: "",
    jobDetails: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate form data
    const validationResult = jobInquirySchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    const validatedData = validationResult.data;

    try {
      const { error } = await supabase.from("job_inquiries").insert({
        company_name: validatedData.companyName,
        contact_person: validatedData.contactPerson,
        email: validatedData.email,
        phone: validatedData.phone,
        industry: validatedData.industry,
        positions: parseInt(validatedData.positions) || 1,
        location: validatedData.location,
        country: validatedData.country,
        job_details: validatedData.jobDetails || null,
      });

      if (error) throw error;

      // Send email notification (non-blocking)
      supabase.functions.invoke('notify-job-inquiry', {
        body: {
          companyName: validatedData.companyName,
          contactPerson: validatedData.contactPerson,
          email: validatedData.email,
          phone: validatedData.phone,
          country: validatedData.country,
          location: validatedData.location,
          industry: validatedData.industry,
          positions: parseInt(validatedData.positions) || 1,
          jobDetails: validatedData.jobDetails || "",
        },
      }).then(({ error: emailError }) => {
        if (emailError) {
          console.error("Email notification failed:", emailError);
        }
      });

      setIsSubmitted(true);
      toast({
        title: t.postJobPage.success.title,
        description: t.postJobPage.success.message,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Users,
      title: t.postJobPage.benefits.vettedTalent.title,
      description: t.postJobPage.benefits.vettedTalent.description,
    },
    {
      icon: Clock,
      title: t.postJobPage.benefits.quickTurnaround.title,
      description: t.postJobPage.benefits.quickTurnaround.description,
    },
    {
      icon: Briefcase,
      title: t.postJobPage.benefits.industryExpertise.title,
      description: t.postJobPage.benefits.industryExpertise.description,
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-lg mx-auto text-center animate-scale-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
                {t.postJobPage.success.title}
              </h1>
              <p className="text-muted-foreground mb-8">
                {t.postJobPage.success.message}
              </p>
              <Button
                variant="accent"
                size="lg"
                onClick={() => setIsSubmitted(false)}
              >
                {t.postJobPage.success.submitAnother}
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="pt-24 lg:pt-28 pb-12 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.75), hsl(var(--primary) / 0.5)), url(${heroManagerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
              {t.postJobPage.title}
            </h1>
            <p
              className="text-primary-foreground/80 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              {t.postJobPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 p-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {t.postJobPage.form.title}
              </h2>
              <p className="text-muted-foreground">
                {t.postJobPage.form.subtitle}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-card p-6 lg:p-10 rounded-2xl border border-border shadow-card animate-fade-in"
            >
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t.postJobPage.form.companyName} *</Label>
                    <Input
                      id="companyName"
                      placeholder="Your Company Name"
                      required
                      maxLength={200}
                      className={`h-12 ${errors.companyName ? "border-destructive" : ""}`}
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                    {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">{t.postJobPage.form.contactPerson} *</Label>
                    <Input
                      id="contactName"
                      placeholder="Your Full Name"
                      required
                      maxLength={100}
                      className={`h-12 ${errors.contactPerson ? "border-destructive" : ""}`}
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    />
                    {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t.postJobPage.form.email} *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      required
                      maxLength={255}
                      className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t.postJobPage.form.phone} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      required
                      maxLength={30}
                      className={`h-12 ${errors.phone ? "border-destructive" : ""}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">{t.postJobPage.form.location} *</Label>
                    <Input
                      id="location"
                      placeholder="City or Region"
                      required
                      maxLength={100}
                      className={`h-12 ${errors.location ? "border-destructive" : ""}`}
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                    {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t.postJobPage.form.country} *</Label>
                    <Select 
                      required 
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger className={`h-12 ${errors.country ? "border-destructive" : ""}`}>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry">{t.postJobPage.form.industry} *</Label>
                    <Select required onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotels">{t.categories.hotels.title}</SelectItem>
                        <SelectItem value="construction">{t.categories.construction.title}</SelectItem>
                        <SelectItem value="plumbing">{t.categories.plumbing.title}</SelectItem>
                        <SelectItem value="helper">{t.categories.helper.title}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="positions">{t.postJobPage.form.positions}</Label>
                    <Select onValueChange={(value) => handleInputChange("positions", value)}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="3">2-5</SelectItem>
                        <SelectItem value="7">5-10</SelectItem>
                        <SelectItem value="10">10+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDetails">{t.postJobPage.form.jobDetails}</Label>
                  <Textarea
                    id="jobDetails"
                    placeholder="Please describe the position(s) you're looking to fill..."
                    rows={5}
                    className="resize-none"
                    value={formData.jobDetails}
                    onChange={(e) => handleInputChange("jobDetails", e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="accent"
                    size="xl"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : t.postJobPage.form.submit}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    {t.postJobPage.form.responseTime}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PostJob;
