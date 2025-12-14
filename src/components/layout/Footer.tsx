import { Link } from "react-router-dom";
import { Crown, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold gradient-gold-text">
                Royal Store
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your premier destination for quality products and exceptional service.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:gradient-gold hover:text-primary-foreground transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:gradient-gold hover:text-primary-foreground transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:gradient-gold hover:text-primary-foreground transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Shop Collection
              </Link>
              <Link to="/cart" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                View Cart
              </Link>
              <Link to="/track-order" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Track Your Order
              </Link>
              <Link to="/contact-us" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                FAQs
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">support@royalstore.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-muted-foreground text-sm">+91 9876543210</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-muted-foreground text-sm">123 Commerce Street, Mumbai, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Access */}
          <div className="flex flex-col gap-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Administration</h4>
            <div className="flex flex-col gap-2">
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Royal Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};