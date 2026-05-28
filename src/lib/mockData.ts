/** Mock seed data used until Supabase keys are wired up. */
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

export const mockCategories: Category[] = [
  { id: "c1", name: "Food & Drinks", icon: "UtensilsCrossed" },
  { id: "c2", name: "Fashion", icon: "Shirt" },
  { id: "c3", name: "Tech & Gadgets", icon: "Laptop" },
  { id: "c4", name: "Salon & Beauty", icon: "Scissors" },
  { id: "c5", name: "Printing", icon: "Printer" },
  { id: "c6", name: "Books & Stationery", icon: "BookOpen" },
];

export const mockListings: Listing[] = [
  {
    id: "1",
    business_name: "Mama Tee's Kitchen",
    category: "Food & Drinks",
    description:
      "Affordable home-style Nigerian meals served fresh near the main gate. Jollof, amala, fried rice, and student combo plates.",
    owner_id: "u2",
    owner_name: "Tolu Ade",
    status: "approved",
    created_at: "2025-04-12T09:00:00Z",
    image_url:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    contact: "+234 803 000 1111",
    location: "Opposite Main Gate, AAPoly",
  },
  {
    id: "2",
    business_name: "CampusPrint Hub",
    category: "Printing",
    description:
      "Project binding, lecture-note printing, color copies, and ID lamination. Open till 9pm.",
    owner_id: "u3",
    owner_name: "Femi O.",
    status: "approved",
    created_at: "2025-04-22T10:30:00Z",
    image_url:
      "https://images.unsplash.com/photo-1612831455540-26303a574200?w=800",
    contact: "+234 805 222 3344",
    location: "Block C, Student Center",
  },
  {
    id: "3",
    business_name: "Glow Beauty Lounge",
    category: "Salon & Beauty",
    description:
      "Braiding, pedicure, manicure, lash extensions. Student discounts every Wednesday.",
    owner_id: "u4",
    owner_name: "Adaeze K.",
    status: "pending",
    created_at: "2025-05-01T12:00:00Z",
    image_url:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
    contact: "+234 810 555 7777",
    location: "Hostel B Walkway",
  },
  {
    id: "4",
    business_name: "TechFix Repairs",
    category: "Tech & Gadgets",
    description:
      "Laptop & phone repairs, screen replacement, software installs. Fast turnaround.",
    owner_id: "u5",
    owner_name: "Daniel I.",
    status: "pending",
    created_at: "2025-05-05T08:15:00Z",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    contact: "+234 802 888 9999",
    location: "Behind ICT Building",
  },
  {
    id: "5",
    business_name: "Trendy Threads",
    category: "Fashion",
    description:
      "Affordable ready-to-wear for students. Custom tailoring on request.",
    owner_id: "u6",
    owner_name: "Bisi M.",
    status: "approved",
    created_at: "2025-04-18T14:45:00Z",
    image_url:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    contact: "+234 807 121 3434",
    location: "Market Square, AAPoly",
  },
  {
    id: "6",
    business_name: "PageOne Bookstore",
    category: "Books & Stationery",
    description:
      "Textbooks, past questions, exam pads, and full stationery range.",
    owner_id: "u7",
    owner_name: "Mr. Ola",
    status: "approved",
    created_at: "2025-03-30T07:00:00Z",
    image_url:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800",
    contact: "+234 809 234 5678",
    location: "Library Annex",
  },
];

export const mockUsers: AppUser[] = [
  {
    id: "u1",
    email: "ogbeifundaniel0@gmail.com",
    full_name: "Daniel Ogbeifun",
    role: "admin",
    is_verified: true,
  },
  {
    id: "u2",
    email: "tolu@student.aapoly.edu",
    full_name: "Tolu Ade",
    role: "user",
    is_verified: true,
  },
  {
    id: "u3",
    email: "femi@student.aapoly.edu",
    full_name: "Femi O.",
    role: "user",
    is_verified: true,
  },
  {
    id: "u4",
    email: "ada@student.aapoly.edu",
    full_name: "Adaeze K.",
    role: "user",
    is_verified: false,
  },
  {
    id: "u5",
    email: "daniel.i@student.aapoly.edu",
    full_name: "Daniel I.",
    role: "user",
    is_verified: true,
  },
];

export type FavoriteItem = { listing_id: string; saved_at: string };
export const mockFavorites: FavoriteItem[] = [
  { listing_id: "1", saved_at: "2025-05-10T10:00:00Z" },
  { listing_id: "5", saved_at: "2025-05-12T14:30:00Z" },
  { listing_id: "6", saved_at: "2025-05-15T09:15:00Z" },
];

export type Message = {
  id: string;
  from_name: string;
  business_name: string;
  preview: string;
  created_at: string;
  unread: boolean;
};
export const mockMessages: Message[] = [
  {
    id: "m1",
    from_name: "Chinedu A.",
    business_name: "Mama Tee's Kitchen",
    preview: "Hi, do you deliver to Hostel B around 2pm?",
    created_at: "2025-05-26T12:14:00Z",
    unread: true,
  },
  {
    id: "m2",
    from_name: "Aisha B.",
    business_name: "CampusPrint Hub",
    preview: "Can you bind 3 project copies before Friday?",
    created_at: "2025-05-25T17:02:00Z",
    unread: true,
  },
  {
    id: "m3",
    from_name: "Sodiq O.",
    business_name: "TechFix Repairs",
    preview: "Thanks! My laptop is working perfectly now.",
    created_at: "2025-05-22T08:40:00Z",
    unread: false,
  },
];