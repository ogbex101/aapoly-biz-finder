/** Type definitions. All data now comes from Supabase — these are shared across routes. */

export type Listing = {
  id: string;
  business_name: string;
  category: string;
  description: string;
  owner_id: string;
  owner_name?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  image_url?: string;
  contact?: string;
  location?: string;
};

export type AppUser = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "user";
  is_verified: boolean;
};

export type Category = { id: string; name: string; icon: string };

export type FavoriteItem = {
  id: string;
  listing_id: string;
  user_id: string;
  saved_at: string;
  listing?: Listing;
};

export type Message = {
  id: string;
  from_id: string;
  to_id: string;
  listing_id: string;
  from_name: string;
  business_name: string;
  body: string;
  created_at: string;
  read: boolean;
};

/** Default categories used as fallback in forms if the DB has none yet. */
export const defaultCategories: Category[] = [
  { id: "c1", name: "Food & Drinks", icon: "UtensilsCrossed" },
  { id: "c2", name: "Fashion", icon: "Shirt" },
  { id: "c3", name: "Tech & Gadgets", icon: "Laptop" },
  { id: "c4", name: "Salon & Beauty", icon: "Scissors" },
  { id: "c5", name: "Printing", icon: "Printer" },
  { id: "c6", name: "Books & Stationery", icon: "BookOpen" },
];
