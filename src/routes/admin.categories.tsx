import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockCategories, type Category } from "@/lib/mockData";

export const Route = createFileRoute("/admin/categories")({
  component: ManageCategories,
});

function ManageCategories() {
  const [cats, setCats] = useState<Category[]>(mockCategories);
  const [name, setName] = useState("");

  function add() {
    if (!name.trim()) return;
    setCats((p) => [...p, { id: crypto.randomUUID(), name, icon: "Tag" }]);
    setName("");
    toast.success("Category added");
  }

  function remove(id: string) {
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
            <Button onClick={add}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cats.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span className="font-medium">{c.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => remove(c.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}