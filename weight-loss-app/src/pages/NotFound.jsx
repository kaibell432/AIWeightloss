import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page py-24 text-center">
      <p className="font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-base-content/70">That page doesn't exist or has moved.</p>
      <Link to="/" className="btn btn-primary mt-6">
        Go home
      </Link>
    </div>
  );
}
