import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { SectionCard } from '../components/common/SectionCard';
import { StatCard } from '../components/common/StatCard';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="stack stack--xl">
      <section className="hero card hero-card">
        <div className="hero-card__content">
          <span className="page-header__eyebrow">RideON · Curse ocazionale în Moldova</span>
          <h1>Găsește rapid o cursă sau publică propriul drum.</h1>
          <p>
            RideON te ajută să conectezi șoferi și pasageri într-o interfață clară,
            rapidă și ușor de folosit. Cauți o cursă, rezervi un loc și vezi
            feedback real de la alți utilizatori.
          </p>

          <div className="hero-card__actions">
            <Link className="btn btn--primary btn--lg" to="/rides">
              Vezi cursele
            </Link>
            {isAuthenticated ? (
              <Link className="btn btn--secondary btn--lg" to="/rides/create">
                Publică o cursă
              </Link>
            ) : (
              <Link className="btn btn--secondary btn--lg" to="/register">
                Creează cont
              </Link>
            )}
          </div>
        </div>

        <div className="hero-card__panel">
          <div className="floating-card">
            <span>Rută populară</span>
            <strong>Chișinău → Bălți</strong>
            <small>Vezi curse active și rezervă direct din platformă.</small>
          </div>

          <div className="floating-card floating-card--accent">
            <span>Experiență completă</span>
            <strong>Curse · Rezervări · Evaluări</strong>
            <small>Totul într-un flux simplu și ușor de urmărit.</small>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Rezervare rapidă" value="1 flux" accent="purple" />
        <StatCard label="Căutare clară" value="Filtre utile" accent="teal" />
        <StatCard label="Plată estimată" value="Preț / loc" accent="amber" />
        <StatCard label="Încredere" value="Review-uri" accent="default" />
      </section>

      <PageHeader
        eyebrow={isAuthenticated ? `Bine ai revenit, ${user?.name}` : 'De ce RideON'}
        title={
          isAuthenticated
            ? 'Totul este pregătit pentru următoarea ta cursă.'
            : 'O aplicație simplă, clară și utilă pentru curse ocazionale.'
        }
        description="Interfața este gândită pentru viteză, claritate și încredere: publicare rapidă, rezervare ușoară și evaluări între utilizatori."
      />

      <div className="grid grid--3 feature-grid">
        <SectionCard
          title="Publicare rapidă"
          description="Șoferii pot adăuga curse noi cu traseu, oră, locuri disponibile și preț per loc."
        >
          <p>Formularul este simplu și ușor de completat, fără pași inutili.</p>
        </SectionCard>

        <SectionCard
          title="Rezervări sigure"
          description="Pasagerii pot rezerva doar dacă există locuri disponibile și dacă sunt autentificați."
        >
          <p>Utilizatorul primește feedback clar în fiecare pas al procesului.</p>
        </SectionCard>

        <SectionCard
          title="Evaluări transparente"
          description="După o experiență reală, utilizatorii pot lăsa review-uri și rating."
        >
          <p>Asta ajută la creșterea încrederii între șoferi și pasageri.</p>
        </SectionCard>
      </div>

      {!isAuthenticated && (
        <section className="cta-band card">
          <div>
            <h2>Începe acum cu RideON</h2>
            <p>Creează un cont pentru a publica curse, a rezerva locuri și a evalua alți utilizatori.</p>
          </div>
          <Link to="/register">
            <Button size="lg">Înregistrare</Button>
          </Link>
        </section>
      )}
    </div>
  );
}