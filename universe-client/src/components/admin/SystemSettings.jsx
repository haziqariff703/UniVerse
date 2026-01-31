import React, { useState } from "react";
import {
  Settings,
  Shield,
  Mail,
  Globe,
  Save,
  AlertTriangle,
  Clock,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const SystemSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [settings, setSettings] = useState({
    university_name: "Universe University",
    contact_email: "support@universe.edu.my",
    registration_buffer: "24",
    max_tickets_per_user: "4",
    maintenance_message:
      "We are currently updating our systems. Please check back later.",
  });

  const handleSave = () => {
    alert("Settings saved locally! (Backend implementation pending)");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-starlight to-starlight/60">
            System Settings
          </h1>
          <p className="text-starlight/40 text-sm">
            Control global application behavior and university branding.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold transition-all shadow-lg hover:shadow-violet-500/20"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Global Toggles */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 shadow-lg shadow-rose-500/5">
            <h2 className="text-lg font-bold text-starlight mb-4 flex items-center gap-2">
              <Shield size={18} className="text-rose-400" />
              Critical Controls
            </h2>

            <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <div className="space-y-0.5">
                <Label className="text-starlight text-sm font-bold">
                  Maintenance Mode
                </Label>
                <p className="text-starlight/40 text-xs">
                  Students cannot browse or register when active.
                </p>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-rose-500" : "bg-white/10"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenanceMode ? "translate-x-6" : ""}`}
                />
              </button>
            </div>

            {maintenanceMode && (
              <div className="mt-4 space-y-2 animate-in slide-in-from-top-2">
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenance_message}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenance_message: e.target.value,
                    })
                  }
                  className="bg-black/20 border-white/10 min-h-[100px]"
                />
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg">
            <h2 className="text-lg font-bold text-starlight mb-4 flex items-center gap-2">
              <Info size={18} className="text-blue-400" />
              Platform Limits
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock size={14} className="text-starlight/40" />
                  Reg. Buffer (Hours)
                </Label>
                <Input
                  type="number"
                  value={settings.registration_buffer}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      registration_buffer: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10"
                />
                <p className="text-[10px] text-starlight/30">
                  Close registration X hours before event starts.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Shield size={14} className="text-starlight/40" />
                  Max Tickets/User
                </Label>
                <Input
                  type="number"
                  value={settings.max_tickets_per_user}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      max_tickets_per_user: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Branding & Contact */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-lg">
            <h2 className="text-lg font-bold text-starlight mb-6 flex items-center gap-2">
              <Globe size={18} className="text-violet-400" />
              University Branding
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>University Name</Label>
                <Input
                  value={settings.university_name}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      university_name: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Support Email Address</Label>
                <Input
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-starlight uppercase tracking-wider opacity-60">
                SEO & Identity
              </h3>
              <div className="space-y-2">
                <Label>Platform Tagline</Label>
                <Input
                  placeholder="The Ultimate Student Event Portal"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Platform Meta Description</Label>
                <Textarea
                  placeholder="UniVerse is a comprehensive event management system for university students..."
                  className="bg-white/5 border-white/10 h-24"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-violet-500/5 border border-violet-500/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 text-violet-400">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-violet-300 font-bold mb-1">
                Backup Recommendation
              </h4>
              <p className="text-starlight/40 text-sm leading-relaxed">
                Before activating Maintenance Mode or changing global rules,
                ensure there are no ongoing high-traffic ticket sales to prevent
                disruptive student experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

