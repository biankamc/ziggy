import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Ziggy</h1>
        <p className="text-muted-foreground text-lg max-w-sm">
          A practice app built with Next.js, Tailwind CSS, and shadcn/ui.
        </p>
        <form className="flex flex-col gap-4 w-full max-w-sm text-left">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Your name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </main>
    </div>
  );
}
