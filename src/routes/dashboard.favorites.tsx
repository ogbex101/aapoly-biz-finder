import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import type { Listing } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/favorites")({
  component: Favorites,
});

type FavoriteRow = { id: string; listing_id: string; listing: Listing };

function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("id, listing_id, listing:listings(*)")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load favorites: " + error.message);
        else setFavorites((data ?? []) as unknown as FavoriteRow[]);
        setLoading(false);
      });
  }, [user]);

  async function remove(favoriteId: string) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId)
      .eq("user_id", user!.id);

    if (error) {
      toast.error("Failed to remove: " + error.message);
      return;
    }
    setFavorites((p) => p.filter((f) => f.id !== favoriteId));
    toast.success("Removed from saved");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Saved Businesses</h2>
        <p className="text-sm text-muted-foreground">
          Quick access to businesses you've bookmarked.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : favorites.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No saved businesses yet. Tap the heart icon on a listing to save it.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => {
            const l = fav.listing;
            return (
              <Card key={fav.id} className="overflow-hidden p-0">
                {l.image_url && (
                  <img
                    src={l.image_url}
                    alt={l.business_name}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{l.business_name}</h3>
                    <Badge variant="outline">{l.category}</Badge>
                  </div>
                  {l.location && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {l.location}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/listing/$id" params={{ id: l.id }}>
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => remove(fav.id)}
                    >
                      <Heart className="mr-1 h-3.5 w-3.5 fill-current text-rose-500" />
                      Saved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
