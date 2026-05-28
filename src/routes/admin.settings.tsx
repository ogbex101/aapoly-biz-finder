import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [site, setSite] = useState({
    name: "CampusBiz",
    tagline: "AAPoly Campus Business Directory",
    contactEmail: "admin@aapoly.edu.ng",
    description:
      "The official directory for student-run and on-campus businesses at Abraham Adesanya Polytechnic.",
  });
  const [flags, setFlags] = useState({
    autoApprove: false,
    allowSignups: true,
    maintenance: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Platform Settings</h2>
        <p className="text-sm text-muted-foreground">
          Global configuration for the CampusBiz platform.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Site information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Site name</Label>
              <Input
                value={site.name}
                onChange={(e) => setSite({ ...site, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact email</Label>
              <Input
                value={site.contactEmail}
                onChange={(e) =>
                  setSite({ ...site, contactEmail: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={site.tagline}
              onChange={(e) => setSite({ ...site, tagline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={site.description}
              onChange={(e) =>
                setSite({ ...site, description: e.target.value })
              }
            />
          </div>
          <Button onClick={() => toast.success("Settings saved (demo)")}>
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              k: "autoApprove",
              label: "Auto-approve listings",
              desc: "Skip manual review for new submissions.",
            },
            {
              k: "allowSignups",
              label: "Allow new signups",
              desc: "Disable to temporarily pause account creation.",
            },
            {
              k: "maintenance",
              label: "Maintenance mode",
              desc: "Show a maintenance banner to all visitors.",
            },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Switch
                checked={flags[row.k as keyof typeof flags]}
                onCheckedChange={(v) => setFlags({ ...flags, [row.k]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}