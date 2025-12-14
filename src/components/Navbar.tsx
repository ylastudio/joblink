import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSelector from "@/components/LanguageSelector";
import joblinkLogo from "@/assets/joblink-logo.jpeg";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {
    t
  } = useLanguage();
  const {
    user,
    isAdmin
  } = useAuth();
  const navLinks = [{
    name: t.nav.home,
    path: "/"
  }, {
    name: t.nav.findJobs,
    path: "/find-jobs"
  }, {
    name: t.nav.postJob,
    path: "/post-job"
  }, {
    name: t.nav.contact,
    path: "/contact"
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img alt="JobLink" className="h-10 lg:h-12 w-auto group-hover:scale-105 transition-transform" src="/lovable-uploads/e78b468d-82b0-49e2-89db-75362a35902a.png" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => <Link key={link.path} to={link.path} className={cn("text-sm font-medium transition-colors relative py-2", isActive(link.path) ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                {link.name}
                {isActive(link.path) && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />}
              </Link>)}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSelector />
            {user ? <Button variant="accent" size="sm" asChild>
                <Link to="/admin">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Link>
              </Button> : <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/find-jobs">{t.nav.findWork}</Link>
                </Button>
                <Button variant="accent" size="sm" asChild>
                  <Link to="/post-job">{t.nav.hireTalent}</Link>
                </Button>
              </>}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <button className="p-2 text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="lg:hidden bg-card border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map(link => <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className={cn("py-3 px-4 rounded-lg text-sm font-medium transition-colors", isActive(link.path) ? "bg-accent/10 text-primary" : "text-muted-foreground hover:bg-muted")}>
                {link.name}
              </Link>)}
            <div className="flex gap-2 mt-4">
              {user ? <Button variant="accent" size="sm" className="flex-1" asChild>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                    <Shield className="w-4 h-4 mr-1" />
                    Admin Dashboard
                  </Link>
                </Button> : <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to="/find-jobs" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.findWork}
                    </Link>
                  </Button>
                  <Button variant="accent" size="sm" className="flex-1" asChild>
                    <Link to="/post-job" onClick={() => setIsMenuOpen(false)}>
                      {t.nav.hireTalent}
                    </Link>
                  </Button>
                </>}
            </div>
          </div>
        </div>}
    </nav>;
};
export default Navbar;