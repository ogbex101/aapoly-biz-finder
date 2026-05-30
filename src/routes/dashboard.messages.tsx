import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/auth";
import type { Message } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/messages")({
  component: Messages,
});

function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("messages")
      .select("*")
      .or(`to_id.eq.${user.id},from_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load messages: " + error.message);
        else {
          const msgs = (data ?? []) as Message[];
          setMessages(msgs);
          if (msgs.length > 0) setActive(msgs[0].id);
        }
        setLoading(false);
      });
  }, [user]);

  async function markRead(id: string) {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    setMessages((p) => p.map((m) => m.id === id ? { ...m, read: true } : m));
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !current || !user) return;
    setSending(true);

    const recipient = current.from_id === user.id ? current.to_id : current.from_id;
    const { error } = await supabase.from("messages").insert({
      from_id: user.id,
      to_id: recipient,
      listing_id: current.listing_id,
      from_name: user.full_name,
      business_name: current.business_name,
      body: text.trim(),
      read: false,
    });

    setSending(false);
    if (error) {
      toast.error("Failed to send: " + error.message);
    } else {
      setText("");
      toast.success("Message sent");
    }
  }

  const current = messages.find((m) => m.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Chat with students interested in your listings.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Card className="p-0">
            <CardContent className="p-0">
              {messages.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                <ul className="divide-y">
                  {messages.map((m) => (
                    <li key={m.id}>
                      <button
                        onClick={() => {
                          setActive(m.id);
                          if (!m.read) markRead(m.id);
                        }}
                        className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50 ${active === m.id ? "bg-muted/50" : ""}`}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {m.from_name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="truncate text-sm font-medium">
                              {m.from_name}
                            </p>
                            {!m.read && <Badge className="h-5 px-1.5">New</Badge>}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {m.business_name}
                          </p>
                          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                            {m.body}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="flex min-h-[420px] flex-col">
            <CardContent className="flex flex-1 flex-col p-0">
              {current ? (
                <>
                  <div className="border-b p-4">
                    <p className="font-semibold">{current.from_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Re: {current.business_name}
                    </p>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    <div className="max-w-[75%] rounded-lg bg-muted p-3 text-sm">
                      {current.body}
                    </div>
                  </div>
                  <form className="flex gap-2 border-t p-3" onSubmit={send}>
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your reply…"
                    />
                    <Button type="submit" size="icon" disabled={sending}>
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="grid flex-1 place-items-center text-sm text-muted-foreground">
                  Select a conversation
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
