import { Link } from 'react-router-dom';
import { EmptyState } from '../components/common/EmptyState';

export function NotFoundPage() {
  return (
    <div className="stack">
      <EmptyState
        title="Pagina căutată nu există"
        description="Verifică adresa sau revino la pagina principală."
        action={
          <Link className="btn btn--primary btn--md" to="/">
            Înapoi acasă
          </Link>
        }
      />
    </div>
  );
}