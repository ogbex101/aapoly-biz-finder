import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { mockCategories, mockListings, type Listing } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/listings")({
  component: MyListings,
});

function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>(() =>
    mockListings.filter((l) => l.owner_id === user?.id).length > 0
      ? mockListings.filter((l) => l.owner_id === user?.id)
      : mockListings.slice(0, 3),
  );

  function addListing(
    l: Omit<Listing, "id" | "created_at" | "status" | "owner_id">,
  ) {
    setListings((prev) => [
      {
        ...l,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        status: "pending",
        owner_id: user?.id ?? "me",
      },
      ...prev,
    ]);
    toast.success("Listing submitted for approval");
  }

  function deleteListing(id: string) {
    setListings((p) => p.filter((l) => l.id !== id));
    toast.success("Listing removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">My Listings</h2>
          <p className="text-sm text-muted-foreground">
            Manage the businesses you've published to the directory.
          </p>
        </div>
        <AddListingDialog onAdd={addListing} />
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            You haven't created any listings yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((l) => (
            <Card key={l.id} className="overflow-hidden p-0">
              {l.image_url && (
                <img
                  src={l.image_url}
                  alt={l.business_name}
                  className="aspect-video w-full object-cover"
                />
              )}
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{l.business_name}</h3>
                    <p className="text-xs text-muted-foreground">{l.category}</p>
                  </div>
                  <Badge
                    variant={
                      l.status === "approved"
                        ? "default"
                        : l.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {l.status}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {l.description}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteListing(l.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AddListingDialog({
  onAdd,
}: {
  onAdd: (l: Omit<Listing, "id" | "created_at" | "status" | "owner_id">) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    category: mockCategories[0].name,
    description: "",
    contact: "",
    location: "",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Add Listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New business listing</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd(form);
            setOpen(false);
            setForm({
              business_name: "",
              category: mockCategories[0].name,
              description: "",
              contact: "",
              location: "",
            });
          }}
        >
          <div className="space-y-2">
            <Label>Business name</Label>
            <Input
              required
              value={form.business_name}
              onChange={(e) =>
                setForm({ ...form, business_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockCategories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Submit for approval
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}