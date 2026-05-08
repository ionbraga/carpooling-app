import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { validateRegisterForm } from '../utils/validators';

export function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateRegisterForm(form);
    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      notify('Cont creat cu succes. Te poți autentifica acum.', 'success');
      navigate('/login');
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
          eyebrow="Înregistrare"
          title="Creează un cont nou în RideON"
          description="Înregistrează-te pentru a publica trasee, a rezerva locuri și a lăsa evaluări după călătorii."
        />

        <div className="auth-panel__highlights">
          <div className="auth-highlight">
            <strong>Publică trasee</strong>
            <span>Adaugă ușor o cursă nouă.</span>
          </div>

          <div className="auth-highlight">
            <strong>Rezervă locuri</strong>
            <span>Găsește curse potrivite pentru tine.</span>
          </div>

          <div className="auth-highlight">
            <strong>Lasă feedback</strong>
            <span>Contribuie la o comunitate mai sigură.</span>
          </div>
        </div>
      </div>

      <form className="card auth-card stack" onSubmit={handleSubmit}>
        <InputField
          label="Nume complet"
          placeholder="Ana Popescu"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
        />

        <InputField
          label="Email"
          type="email"
          placeholder="exemplu@email.com"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />

        <InputField
          label="Parolă"
          type="password"
          placeholder="Minimum 8 caractere"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
          helperText="Parola trebuie să conțină literă mare, literă mică și cifră."
        />

        <InputField
          label="Confirmă parola"
          type="password"
          placeholder="Reintrodu parola"
          value={form.confirmPassword}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              confirmPassword: event.target.value,
            }))
          }
        />

        <Button type="submit" fullWidth loading={loading}>
          Creează cont
        </Button>

        <p className="auth-card__footer">
          Ai deja cont? <Link to="/login">Autentifică-te</Link>
        </p>
      </form>
    </div>
  );
}