import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import heroCustomerServiceImage from "@/assets/hero-customer-service.jpg";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    toast({
      title: t.contactPage.success.title,
      description: t.contactPage.success.message,
    });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t.contactPage.info.email.title,
      value: "info@workbridge.com",
      description: t.contactPage.info.email.description,
    },
    {
      icon: Phone,
      title: t.contactPage.info.phone.title,
      value: "+1 (555) 123-4567",
      description: t.contactPage.info.phone.description,
    },
    {
      icon: MapPin,
      title: t.contactPage.info.visit.title,
      value: "123 Business Avenue",
      description: t.contactPage.info.visit.description,
    },
    {
      icon: Clock,
      title: t.contactPage.info.hours.title,
      value: t.contactPage.info.hours.value,
      description: t.contactPage.info.hours.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section 
        className="pt-24 lg:pt-28 pb-12 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.75), hsl(var(--primary) / 0.5)), url(${heroCustomerServiceImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-3xl lg:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
              {t.contactPage.title}
            </h1>
            <p
              className="text-primary-foreground/80 animate-fade-in"
              style={{ animationDelay: "100ms" }}
            >
              {t.contactPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={item.title}
                className="p-6 rounded-xl bg-background border border-border text-center animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 mx-auto rounded-lg gradient-hero flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-accent font-medium mb-1">{item.value}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="animate-fade-in">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {t.contactPage.form.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.contactPage.form.subtitle}
              </p>

              {isSubmitted ? (
                <div className="bg-card p-10 rounded-2xl border border-border text-center animate-scale-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {t.contactPage.success.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {t.contactPage.success.message}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-card p-6 lg:p-8 rounded-2xl border border-border shadow-card"
                >
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t.contactPage.form.name} *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.contactPage.form.email} *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.contactPage.form.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t.contactPage.form.subject} *</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contactPage.form.message} *</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        rows={5}
                        required
                        className="resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t.contactPage.form.send}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Map / Location Info */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3">
                {t.contactPage.location.title}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.contactPage.location.subtitle}
              </p>

              <div className="bg-muted rounded-2xl overflow-hidden h-[300px] lg:h-[400px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto rounded-full gradient-hero flex items-center justify-center mb-4">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    WorkBridge Headquarters
                  </h3>
                  <p className="text-muted-foreground mb-1">
                    123 Business Avenue, Suite 100
                  </p>
                  <p className="text-muted-foreground">New York, NY 10001</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-card rounded-xl border border-border">
                <h4 className="font-semibold text-foreground mb-3">
                  {t.contactPage.location.quickContact}
                </h4>
                <div className="space-y-3">
                  <a
                    href="mailto:info@workbridge.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    info@workbridge.com
                  </a>
                  <a
                    href="tel:+15551234567"
                    className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
