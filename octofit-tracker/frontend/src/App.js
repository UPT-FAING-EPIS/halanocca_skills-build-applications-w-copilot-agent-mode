import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function navClassName({ isActive }) {
  return `nav-link ${isActive ? 'active' : ''}`;
}

function App() {
  return (
    <div className="app-shell py-4 py-md-5">
      <div className="container app-container">
        <header className="card border-0 shadow-sm mb-4 app-header-card">
          <div className="card-body p-4">
            <p className="text-uppercase small fw-semibold text-primary mb-2">OctoFit Tracker</p>
            <h1 className="h2 mb-3">Fitness Dashboard</h1>
            <p className="text-secondary mb-4">
              Explore users, teams, activities, leaderboard standings and workouts with a
              consistent Bootstrap experience.
            </p>
            <nav className="nav nav-pills flex-wrap gap-2 app-nav" aria-label="Main navigation">
              <NavLink className={navClassName} to="/users">
                Users
              </NavLink>
              <NavLink className={navClassName} to="/activities">
                Activities
              </NavLink>
              <NavLink className={navClassName} to="/teams">
                Teams
              </NavLink>
              <NavLink className={navClassName} to="/leaderboard">
                Leaderboard
              </NavLink>
              <NavLink className={navClassName} to="/workouts">
                Workouts
              </NavLink>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<Users />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/workouts" element={<Workouts />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;