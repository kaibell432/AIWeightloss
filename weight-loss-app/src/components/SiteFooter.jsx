export default function SiteFooter() {
  return (
    <footer className="page mt-24 flex flex-col gap-2 border-t border-rule py-8 text-sm text-muted sm:flex-row sm:justify-between">
      <p>&copy; {new Date().getFullYear()} Weight Loss App</p>
      <p className="max-w-xl sm:text-right">
        AI-generated guidance is not medical advice. Check with a healthcare professional before making big changes.
      </p>
    </footer>
  );
}
