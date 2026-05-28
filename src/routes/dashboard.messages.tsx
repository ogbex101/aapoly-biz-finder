import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockMessages } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard/messages")({
  component: Messages,
});

function Messages() {
  const [active, setActive] = useState(mockMessages[0]?.id);
  const [text, setText] = useState("");
  const current = mockMessages.find((m) => m.id === active);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Chat with students interested in your listings.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <Card className="p-0">
          <CardContent className="p-0">
            <ul className="divide-y">
              {mockMessages.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => setActive(m.id)}
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
                        {m.unread && <Badge className="h-5 px-1.5">New</Badge>}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.business_name}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {m.preview}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
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
                    {current.preview}
                  </div>
                  <div className="ml-auto max-w-[75%] rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                    Hi {current.from_name.split(" ")[0]}, thanks for reaching out!
                  </div>
                </div>
                <form
                  className="flex gap-2 border-t p-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setText("");
                  }}
                >
                  <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your reply…"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
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
    </div>
  );
}