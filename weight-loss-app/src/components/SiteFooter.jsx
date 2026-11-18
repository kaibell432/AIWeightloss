export default function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Weight Loss App</p>
        <p>AI-generated guidance is not medical advice. Consult a healthcare professional before major changes.</p>
      </div>
    </footer>
  );
}
