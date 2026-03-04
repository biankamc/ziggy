import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Ziggy</h1>
        <p className="text-muted-foreground text-lg max-w-sm">
          A practice app built with Next.js, Tailwind CSS, and shadcn/ui.
        </p>
        <Button>Get Started</Button>
      </main>
    </div>
  );
}
