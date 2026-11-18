export default function PageHeader({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && <p className="mt-1 text-base-content/70">{description}</p>}
    </div>
  );
}
