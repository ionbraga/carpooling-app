import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';
import { Button } from '../common/Button';
import logo from '../../assets/rideon-logo.png';

const publicLinks = [
  { to: '/', label: 'Acasă' },
  { to: '/rides', label: 'Curse' },
];

const privateLinks = [
  { to: '/rides/create', label: 'Publică o cursă' },
  { to: '/bookings', label: 'Rezervările mele' },
];

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__inner">
          <Link to="/" className="brand">
            <img src={logo} alt="RideON logo" className="brand__logo" />

            <div className="brand__text">
              <strong className="brand__title">RideON</strong>
              <small className="brand__subtitle">
                Curse ocazionale, mai simplu
              </small>
            </div>
          </Link>

          <nav className="nav">
  {publicLinks.map((item) => (
    <NavLink key={item.to} to={item.to} end className="nav__link">
      {item.label}
    </NavLink>
  ))}

  {isAuthenticated &&
    privateLinks.map((item) => (
      <NavLink key={item.to} to={item.to} end className="nav__link">
        {item.label}
      </NavLink>
    ))}
</nav>

          <div className="topbar__actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="user-chip user-chip--link">
                  <span className="user-chip__avatar">
                    {getInitials(user?.name)}
                  </span>

                  <div className="user-chip__info">
                    <strong>{user?.name}</strong>
                    <small>{user?.email}</small>
                  </div>
                </Link>

                <Button variant="ghost" onClick={logout}>
                  Deconectare
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav__link nav__link--button">
                  Autentificare
                </NavLink>

                <Link to="/register" className="btn btn--primary btn--md">
                  Creează cont
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <strong>RideON</strong>
            <p>
              Platformă pentru publicarea curselor, rezervări și evaluări între utilizatori.
            </p>
          </div>
          <p>
            Conectează șoferi și pasageri pentru drumuri mai simple în Republica Moldova.
          </p>
        </div>
      </footer>
    </div>
  );
}