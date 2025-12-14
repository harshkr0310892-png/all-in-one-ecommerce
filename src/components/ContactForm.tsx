import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  className?: string;
}

export const ContactForm = ({ className = "" }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      // Validate Indian phone number (10 digits)
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length !== 10) {
        newErrors.phone = "Please enter a valid 10-digit Indian mobile number";
      }
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkIfBanned = async (email: string, phone: string) => {
    // Normalize phone number to match the format in the database (+91XXXXXXXXXX)
    const phoneDigits = phone.replace(/\D/g, "");
    let normalizedPhone = null;
    
    if (phoneDigits.length === 10) {
      normalizedPhone = `+91${phoneDigits}`;
    } else if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
      normalizedPhone = `+${phoneDigits}`;
    } else if (phoneDigits.length === 13 && phoneDigits.startsWith('91')) {
      normalizedPhone = `+${phoneDigits}`;
    }
    
    // Build the query to check if user is banned
    let query = supabase
      .from("banned_users")
      .select("*")
      .eq("is_active", true)
      .limit(1);
    
    // Add conditions for email and/or phone if they exist
    if (email && normalizedPhone) {
      // Check both email and phone
      query = query.or(`email.eq.${email},phone.eq.${normalizedPhone}`);
    } else if (email) {
      // Check only email
      query = query.eq("email", email);
    } else if (normalizedPhone) {
      // Check only phone
      query = query.eq("phone", normalizedPhone);
    } else {
      // No valid identifiers to check
      return false;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error checking banned status:", error);
      return false;
    }
    
    return data && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if user is banned
      const isBanned = await checkIfBanned(formData.email, formData.phone);
      
      if (isBanned) {
        toast.error("You are not allowed to submit this form");
        setIsSubmitting(false);
        return;
      }
      
      // Normalize phone number for storage
      const phoneDigits = formData.phone.replace(/\D/g, "");
      let normalizedPhone = formData.phone;
      
      if (phoneDigits.length === 10) {
        normalizedPhone = `+91${phoneDigits}`;
      } else if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
        normalizedPhone = `+${phoneDigits}`;
      } else if (phoneDigits.length === 13 && phoneDigits.startsWith('91')) {
        normalizedPhone = `+${phoneDigits}`;
      }
      
      // Submit form data
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: normalizedPhone,
          subject: formData.subject,
          description: formData.description,
          is_banned: isBanned, // This should always be false since we're preventing banned users from submitting
        },
      ]);
      
      if (error) throw error;
      
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-card rounded-xl border border-border/50 p-6 ${className}`}>
      <h3 className="font-display text-xl font-bold mb-6">Contact Support</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g., 9876543210"
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
        
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief subject of your inquiry"
            className={errors.subject ? "border-destructive" : ""}
          />
          {errors.subject && <p className="text-destructive text-sm mt-1">{errors.subject}</p>}
        </div>
        
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please provide detailed information about your inquiry"
            rows={4}
            className={errors.description ? "border-destructive" : ""}
          />
          {errors.description && <p className="text-destructive text-sm mt-1">{errors.description}</p>}
        </div>
        
        <Button 
          type="submit" 
          variant="royal" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
};