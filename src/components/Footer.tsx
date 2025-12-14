import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import joblinkLogo from "@/assets/joblink-logo.jpeg";
const Footer = () => {
  const {
    t
  } = useLanguage();
  return <footer className="gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img alt="JobLink" className="h-10 w-auto" src="/lovable-uploads/da2fb042-a78f-46d4-a4e5-ac9062fe0be6.png" />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {[{
              name: t.nav.findJobs,
              path: "/find-jobs"
            }, {
              name: t.nav.postJob,
              path: "/post-job"
            }, {
              name: t.nav.contact,
              path: "/contact"
            }].map(link => <li key={link.path}>
                  <Link to={link.path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.industries}</h4>
            <ul className="space-y-2">
              {[t.categories.hotels.title, t.categories.construction.title, t.categories.plumbing.title, t.categories.helper.title].map(industry => <li key={industry}>
                  <span className="text-sm text-primary-foreground/70">
                    {industry}
                  </span>
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.contactUs}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-accent" />
                info@joblink.com
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-accent" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                123 Business Avenue, Suite 100
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            {t.footer.copyright}
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-primary-foreground/50 hover:text-primary-foreground/70 cursor-pointer transition-colors">
              {t.footer.privacyPolicy}
            </span>
            <span className="text-sm text-primary-foreground/50 hover:text-primary-foreground/70 cursor-pointer transition-colors">
              {t.footer.termsOfService}
            </span>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;