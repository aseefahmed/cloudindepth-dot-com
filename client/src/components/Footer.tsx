import { Button } from "@/components/ui/button";

interface FooterProps {
  scrollToSection?: (sectionId: string) => void;
}

export default function Footer({ scrollToSection }: FooterProps) {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-yellow-500">
              Cloud in Depth
            </h3>
            <p className="text-background/80 mb-4">
              Master AWS, Azure, DevOps and cutting edge technologies with industry expert Aseef
              Ahmed. Transform your career with comprehensive, hands-on
              training.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/aseefahmed"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-background transition-colors"
                data-testid="link-linkedin"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a
                href="https://youtube.com/@cloudindepth"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-background transition-colors"
                data-testid="link-youtube"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a>
              <a
                href="https://www.facebook.com/cloudacademy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/80 hover:text-background transition-colors"
                data-testid="link-github"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection?.("curriculum")}
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="footer-curriculum"
                >
                  Curriculum
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection?.("benefits")}
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="footer-benefits"
                >
                  Benefits
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection?.("pricing")}
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="footer-pricing"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a
                  href="https://skillsprofile.skillbuilder.aws/user/aseefahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button
                    className="text-background/80 hover:text-background transition-colors"
                    data-testid="verify-creds"
                  >
                    Verify Credentials
                  </button>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>aseefahmed@gmail.com</span>
              </div>
              <div className="flex items-center">
                <i className="fab fa-linkedin mr-3"></i>
                <span>linkedin.com/in/aseefahmed</span>
              </div>
              <div className="flex items-center">
                <i className="fab fa-whatsapp mr-3"></i>
                <span>+64 22 194 5611</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe mr-3"></i>
                <span>Available for Global Training</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
