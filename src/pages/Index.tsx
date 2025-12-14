import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryZigzagSection from "@/components/CategoryZigzagSection";
import { Building2, HardHat, ChefHat, HandHelping, Users, Shield, Clock, Star } from "lucide-react";
import heroImage from "@/assets/hero-workforce.jpg";
import heroWorkersTeam from "@/assets/hero-workers-team.jpg";
import categoryWarehouse from "@/assets/category-warehouse.jpg";
import categoryBuilding from "@/assets/category-building.jpg";
import categoryKitchen from "@/assets/category-kitchen.jpg";
import categoryCleaning from "@/assets/category-cleaning-realistic.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    {
      icon: Building2,
      title: t.categories.hotels.title,
      description: t.categories.hotels.description,
      jobCount: 150,
      image: categoryWarehouse,
    },
    {
      icon: HardHat,
      title: t.categories.construction.title,
      description: t.categories.construction.description,
      jobCount: 200,
      image: categoryBuilding,
    },
    {
      icon: ChefHat,
      title: t.categories.plumbing.title,
      description: t.categories.plumbing.description,
      jobCount: 85,
      image: categoryKitchen,
    },
    {
      icon: HandHelping,
      title: t.categories.helper.title,
      description: t.categories.helper.description,
      jobCount: 300,
      image: categoryCleaning,
    },
  ];
  const stats = [{
    value: "10K+",
    label: t.stats.jobsPosted
  }, {
    value: "5K+",
    label: t.stats.candidatesHired
  }, {
    value: "500+",
    label: t.stats.partnerCompanies
  }, {
    value: "98%",
    label: t.stats.satisfactionRate
  }];
  const features = [{
    icon: Users,
    title: t.whyChoose.vettedEmployers.title,
    description: t.whyChoose.vettedEmployers.description
  }, {
    icon: Shield,
    title: t.whyChoose.securePrivate.title,
    description: t.whyChoose.securePrivate.description
  }, {
    icon: Clock,
    title: t.whyChoose.quickMatching.title,
    description: t.whyChoose.quickMatching.description
  }, {
    icon: Star,
    title: t.whyChoose.careerSupport.title,
    description: t.whyChoose.careerSupport.description
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24 overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 transition-transform duration-100"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.85), hsl(var(--primary) / 0.6)), url(${heroWorkersTeam})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.4}px)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in">
                {t.hero.title}{" "}
                <span className="text-accent">{t.hero.titleAccent}</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{
              animationDelay: "100ms"
            }}>
                {t.hero.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{
              animationDelay: "200ms"
            }}>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/find-jobs">{t.hero.findJobs}</Link>
                </Button>
                <Button variant="hero-outline" size="xl" asChild>
                  <Link to="/post-job">{t.hero.postJob}</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in" style={{
            animationDelay: "300ms"
          }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl opacity-100">
                <img alt="Professional workforce in hotels, construction, plumbing, and helper services" className="w-full h-auto object-cover" src="/lovable-uploads/d0328e87-9585-4a15-8e7e-90ed37ace50d.png" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-card rounded-xl p-4 shadow-xl animate-slide-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">5,000+</p>
                    <p className="text-sm text-muted-foreground">{t.stats.candidatesHired}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => <div key={stat.label} className="text-center animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <p className="font-serif text-3xl lg:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.categories.title}
            </h2>
            <p className="text-muted-foreground">
              {t.categories.subtitle}
            </p>
          </div>

          <CategoryZigzagSection categories={categories} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t.whyChoose.title}
            </h2>
            <p className="text-muted-foreground">
              {t.whyChoose.subtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <div key={feature.title} className="p-6 rounded-xl bg-card border border-border text-center animate-fade-in" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="w-14 h-14 mx-auto rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-2xl gradient-hero p-8 lg:p-16 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              {t.cta.title}
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              {t.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/find-jobs">{t.cta.browseJobs}</Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/post-job">{t.cta.hireWorkers}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;