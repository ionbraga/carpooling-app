import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { userService } from '../api/userService';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { InputField } from '../components/common/InputField';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { SectionCard } from '../components/common/SectionCard';
import { StatCard } from '../components/common/StatCard';
import { ReviewList } from '../components/reviews/ReviewList';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { formatDateTime, getInitials } from '../utils/formatters';
import {
  validateChangePasswordForm,
  validateProfileForm,
} from '../utils/validators';

export function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const { notify } = useNotification();

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const response = await userService.getMe();

      setProfile(response.data);
      setProfileForm({
        name: response.data.user.name,
      });

      updateUser(response.data.user);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [notify, updateUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateProfileForm(profileForm);

    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setProfileLoading(true);

      const response = await userService.updateMe({
        name: profileForm.name.trim(),
      });

      updateUser(response.data.user);

      setProfile((current) => ({
        ...current,
        user: response.data.user,
      }));

      notify('Profilul a fost actualizat cu succes.', 'success');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateChangePasswordForm(passwordForm);

    if (validationError) {
      notify(validationError, 'error');
      return;
    }

    try {
      setPasswordLoading(true);

      await userService.changePassword(passwordForm);

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });

      notify('Parola a fost schimbată cu succes.', 'success');
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return <Loader label="Se încarcă profilul..." />;
  }

  const profileUser = profile?.user || user;
  const statistics = profile?.statistics || {};
  const receivedReviews = profile?.received_reviews || [];

  return (
    <div className="profile-page stack stack--lg">
      <PageHeader
        eyebrow="Cont personal"
        title="Contul meu"
        description="Gestionează datele contului, urmărește activitatea ta și schimbă parola atunci când este necesar."
      />

      <section className="card profile-overview">
        <div className="profile-overview__identity">
          <span className="profile-overview__avatar">
            {getInitials(profileUser?.name)}
          </span>

          <div>
            <h2>{profileUser?.name}</h2>
            <p>{profileUser?.email}</p>
            <small>Cont creat: {formatDateTime(profileUser?.created_at)}</small>
          </div>
        </div>

        <div className="profile-overview__actions">
          <Link className="btn btn--ghost btn--md" to="/rides/my">
            Cursele mele
          </Link>

          <Link className="btn btn--ghost btn--md" to="/bookings">
            Rezervările mele
          </Link>

          <Button variant="secondary" onClick={logout}>
            Deconectare
          </Button>
        </div>
      </section>

      <div className="stats-grid stats-grid--compact">
        <StatCard
          label="Curse publicate"
          value={statistics.published_rides_count || 0}
        />

        <StatCard
          label="Curse active"
          value={statistics.active_rides_count || 0}
          accent="teal"
        />

        <StatCard
          label="Rezervări totale"
          value={statistics.bookings_count || 0}
          accent="purple"
        />

        <StatCard
          label="Rezervări active"
          value={statistics.active_bookings_count || 0}
        />

        <StatCard
          label="Recenzii primite"
          value={statistics.reviews_received_count || 0}
          accent="teal"
        />

        <StatCard
          label="Rating mediu"
          value={
            Number(statistics.average_rating || 0) > 0
              ? `${Number(statistics.average_rating).toFixed(1)} / 5`
              : '—'
          }
          accent="purple"
        />
      </div>

      <SectionCard
  title="Review-uri primite"
  description="Aici sunt afișate cele mai recente evaluări primite de la pasageri după curse finalizate."
>
  {receivedReviews.length === 0 ? (
    <EmptyState
      title="Nu ai primit încă review-uri"
      description="Review-urile vor apărea aici după ce pasagerii vor evalua cursele finalizate."
    />
  ) : (
    <ReviewList reviews={receivedReviews} />
  )}
</SectionCard>

      <div className="grid grid--2 profile-forms-grid">
        <SectionCard
          title="Date personale"
          description="Poți modifica numele afișat în aplicație. Emailul rămâne neschimbat pentru siguranța contului."
        >
          <form className="stack" onSubmit={handleProfileSubmit}>
            <InputField
              label="Nume complet"
              placeholder="Ex. Ion Popescu"
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              helperText="Numele va fi afișat la curse, rezervări și recenzii."
            />

            <InputField
              label="Email"
              type="email"
              value={profileUser?.email || ''}
              disabled
              helperText="Emailul nu poate fi modificat în această versiune."
            />

            <div className="form-actions">
              <Button type="submit" loading={profileLoading}>
                Salvează modificările
              </Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard
          title="Schimbare parolă"
          description="Alege o parolă nouă, diferită de cea actuală, pentru a păstra contul protejat."
        >
          <form className="stack" onSubmit={handlePasswordSubmit}>
            <InputField
              label="Parola actuală"
              type="password"
              placeholder="Introdu parola actuală"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  currentPassword: event.target.value,
                }))
              }
            />

            <InputField
              label="Parola nouă"
              type="password"
              placeholder="Minimum 8 caractere"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  newPassword: event.target.value,
                }))
              }
              helperText="Trebuie să conțină literă mare, literă mică și cifră."
            />

            <InputField
              label="Confirmă parola nouă"
              type="password"
              placeholder="Reintrodu parola nouă"
              value={passwordForm.confirmNewPassword}
              onChange={(event) =>
                setPasswordForm((current) => ({
                  ...current,
                  confirmNewPassword: event.target.value,
                }))
              }
            />

            <div className="form-actions">
              <Button type="submit" loading={passwordLoading}>
                Schimbă parola
              </Button>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}