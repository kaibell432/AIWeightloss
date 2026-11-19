export default function PageHeader({ title, description, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 pt-10 sm:pt-14">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-lg text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
