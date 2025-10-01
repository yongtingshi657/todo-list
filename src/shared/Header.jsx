import { NavLink } from 'react-router';
import styles from './Header.module.css';

export default function Header({ title, logo }) {
  return (
    <header className={styles.header}>
      <div className={styles.LogoTitle}>
        {logo && <img className={styles.logo} src={logo}/>}
        <h1>{title}</h1>
      </div>
      <nav className={styles.navBar}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.active}` : `${styles.inactive}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? `${styles.active}` : `${styles.inactive}`
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
}
