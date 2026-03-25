import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus } from "lucide-react";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: "Account created!", description: "You can now log in." });
      navigate("/admin/login");
    } catch (err: any) {
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-card p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <UserPlus className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-heading font-bold gold-text">Create Admin Account</h1>
          <p className="text-sm text-muted-foreground mt-1">One-time setup</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-border" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="bg-secondary/50 border-border" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
