import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { validateLoginForm } from '../utils/validators';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/rides';

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateLoginForm(form);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setLoading(true);
      await login(form);
      notify('Autentificare reușită.', 'success');
      navigate(from, { replace: true });
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__intro auth-panel card">
        <PageHeader
          eyebrow="Autentificare"
          title="Intră în contul tău RideON"
          description="Accesează cursele disponibile, rezervările tale și istoricul de evaluări."
        />

        <div className="auth-panel__highlights">
          <div className="auth-highlight">
            <strong>Vezi curse active</strong>
            <span>Găsește rapid traseul potrivit.</span>
          </div>
          <div className="auth-highlight">
            <strong>Rezervă locuri</strong>
            <span>Totul într-un flux simplu și clar.</span>
          </div>
          <div className="auth-highlight">
            <strong>Gestionează contul</strong>
            <span>Urmărește rezervările și review-urile.</span>
          </div>
        </div>
      </div>

      <form className="card auth-card stack" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          type="email"
          placeholder="exemplu@email.com"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
        />

        <InputField
          label="Parolă"
          type="password"
          placeholder="Introdu parola"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
        />

        <Button type="submit" fullWidth loading={loading}>
          Autentificare
        </Button>

        <p className="auth-card__footer">
          Nu ai cont? <Link to="/register">Creează unul nou</Link>
        </p>
      </form>
    </div>
  );
}