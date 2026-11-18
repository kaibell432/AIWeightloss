export default function SiteFooter() {
  return (
    <footer className="footer border-t border-base-300 bg-base-200 px-4 py-6 text-sm text-base-content/70 sm:footer-horizontal sm:px-6 lg:px-10">
      <p>&copy; {new Date().getFullYear()} Weight Loss App</p>
      <p className="sm:justify-self-end">
        AI-generated guidance is not medical advice. Consult a healthcare professional before major changes.
      </p>
    </footer>
  );
}
