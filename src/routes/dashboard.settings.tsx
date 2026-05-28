import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/dashboard/settings")({
  component: Settings,
});

function Settings() {
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    smsNotifs: false,
    publicProfile: true,
    marketing: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage notifications, privacy and account security.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { k: "emailNotifs", label: "Email notifications", desc: "Order alerts, messages and approvals." },
            { k: "smsNotifs", label: "SMS notifications", desc: "Critical alerts only via text message." },
            { k: "marketing", label: "Marketing updates", desc: "Tips, features and CampusBiz news." },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Switch
                checked={prefs[row.k as keyof typeof prefs]}
                onCheckedChange={(v) =>
                  setPrefs({ ...prefs, [row.k]: v })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Public profile</p>
              <p className="text-xs text-muted-foreground">
                Show your profile next to your listings.
              </p>
            </div>
            <Switch
              checked={prefs.publicProfile}
              onCheckedChange={(v) => setPrefs({ ...prefs, publicProfile: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>New password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button onClick={() => toast.success("Password updated (demo)")}>
            Update password
          </Button>
          <Separator />
          <Button variant="destructive" onClick={() => toast.error("Account deletion is disabled in demo")}>
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}