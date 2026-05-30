import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/lib/mockData";

export const Route = createFileRoute("/admin/categories")({
  component: ManageCategories,
});

function ManageCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load categories: " + error.message);
        else setCats((data ?? []) as Category[]);
        setLoading(false);
      });
  }, []);

  async function add() {
    if (!name.trim()) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), icon: "Tag" })
      .select()
      .single();

    setAdding(false);
    if (error) { toast.error("Failed to add: " + error.message); return; }
    setCats((p) => [...p, data as Category].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    toast.success("Category added");
  }

  async function remove(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { toast.error("Failed to remove: " + error.message); return; }
    setCats((p) => p.filter((c) => c.id !== id));
    toast.success("Category removed");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Categories</h2>
        <p className="text-sm text-muted-foreground">
          Organize businesses into searchable categories.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New category name"
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
            <Button onClick={add} disabled={adding}>
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <><Plus className="mr-1 h-4 w-4" /> Add</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between p-4">
                <span className="font-medium">{c.name}</span>
                <Button size="sm" variant="ghost" onClick={() => remove(c.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
