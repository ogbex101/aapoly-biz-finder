import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { supabase } from "@/lib/supabaseClient";
import { defaultCategories, type Category, type Listing } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/listings")({
  component: MyListings,
});

function MyListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch this user's listings
    supabase
      .from("listings")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load listings: " + error.message);
        else setListings((data ?? []) as Listing[]);
        setLoading(false);
      });

    // Fetch categories
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setCategories(data as Category[]);
      });
  }, [user]);

  async function addListing(
    form: Omit<Listing, "id" | "created_at" | "status" | "owner_id" | "owner_name">,
  ) {
    if (!user) return;
    const { data, error } = await supabase
      .from("listings")
      .insert({
        ...form,
        owner_id: user.id,
        owner_name: user.full_name,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add listing: " + error.message);
      return;
    }
    setListings((prev) => [data as Listing, ...prev]);
    toast.success("Listing submitted for approval");
  }

  async function deleteListing(id: string) {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id)
      .eq("owner_id", user!.id);

    if (error) {
      toast.error("Failed to delete listing: " + error.message);
      return;
    }
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
        <AddListingDialog categories={categories} onAdd={addListing} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : listings.length === 0 ? (
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
  categories,
  onAdd,
}: {
  categories: Category[];
  onAdd: (l: Omit<Listing, "id" | "created_at" | "status" | "owner_id" | "owner_name">) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    category: categories[0]?.name ?? "",
    description: "",
    contact: "",
    location: "",
    image_url: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onAdd(form);
    setSaving(false);
    setOpen(false);
    setForm({
      business_name: "",
      category: categories[0]?.name ?? "",
      description: "",
      contact: "",
      location: "",
      image_url: "",
    });
  }

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
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Business name</Label>
            <Input
              required
              value={form.business_name}
              onChange={(e) => setForm({ ...form, business_name: e.target.value })}
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
                {categories.map((c) => (
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</>
            ) : (
              "Submit for approval"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
