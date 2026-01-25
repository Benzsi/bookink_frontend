import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UsersService } from '../services/api';
import type { User } from '../services/api';

interface AdminProps {
  user: User | null;
}

export function AdminUsers({ user }: AdminProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'USER' | 'ADMIN'>('USER');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<'USER' | 'ADMIN'>('USER');

  const usersService = new UsersService();

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Felhasználók lekérése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Biztosan törlöd ezt a felhasználót?')) return;

    try {
      await usersService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      setSuccess('Felhasználó sikeresen törölve!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Felhasználó törlése sikertelen');
    }
  };

  const handleUpdateUser = async (id: number) => {
    if (!newUsername.trim()) {
      setError('A felhasználónév nem lehet üres');
      return;
    }

    try {
      const updated = await usersService.updateUser(id, {
        username: newUsername,
        role: newRole,
      });
      
      setUsers(users.map(u => u.id === id ? updated : u));
      setEditingId(null);
      setNewUsername('');
      setSuccess('Felhasználó sikeresen frissítve!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Felhasználó frissítése sikertelen');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!createUsername.trim() || !createPassword.trim()) {
      setError('Kérlek töltsd ki az összes mezőt');
      return;
    }

    if (createUsername.length < 3 || createUsername.length > 32) {
      setError('A felhasználónév 3-32 karakter közötti kell legyen');
      return;
    }

    if (createPassword.length < 4 || createPassword.length > 64) {
      setError('A jelszó 4-64 karakter közötti kell legyen');
      return;
    }

    try {
      const newUser = await usersService.createUser({
        username: createUsername,
        password: createPassword,
        role: createRole,
      });

      setUsers([...users, newUser]);
      setCreateUsername('');
      setCreatePassword('');
      setCreateRole('USER');
      setShowCreateForm(false);
      setSuccess('Felhasználó sikeresen létrehozva!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Felhasználó létrehozása sikertelen');
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="auth-container">
        <h2>Hozzáférés megtagadva</h2>
        <p>Ez az oldal csak adminisztrátorok számára elérhető.</p>
        <Link to="/" className="btn-primary">
          Vissza a főoldalra
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Link to="/" className="back-btn">
        ← Vissza a főoldalra
      </Link>

      <div className="admin-section">
        <h1>👥 Felhasználók kezelése</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="admin-controls">
          <button
            className="btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? '✕ Mégsem' : '+ Új felhasználó'}
          </button>
          <button className="btn-primary" onClick={fetchUsers} disabled={loading}>
            {loading ? '⟳ Frissítés...' : '⟳ Frissítés'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-user-form">
            <h2>Új felhasználó létrehozása</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="createUsername">Felhasználónév</label>
                <input
                  id="createUsername"
                  type="text"
                  value={createUsername}
                  onChange={(e) => setCreateUsername(e.target.value)}
                  placeholder="Felhasználónév"
                />
              </div>
              <div className="form-group">
                <label htmlFor="createPassword">Jelszó</label>
                <input
                  id="createPassword"
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Jelszó"
                />
              </div>
              <div className="form-group">
                <label htmlFor="createRole">Szerepkör</label>
                <select
                  id="createRole"
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as 'USER' | 'ADMIN')}
                >
                  <option value="USER">Felhasználó</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              <button type="submit" className="form-submit">
                Létrehozás
              </button>
            </form>
          </div>
        )}

        {loading && !showCreateForm ? (
          <div className="loading">Felhasználók betöltése...</div>
        ) : (
          <div className="users-table">
            <div className="table-header">
              <div className="col-id">ID</div>
              <div className="col-username">Felhasználónév</div>
              <div className="col-role">Szerepkör</div>
              <div className="col-created">Létrehozva</div>
              <div className="col-actions">Műveletek</div>
            </div>

            {users.map((u) => (
              <div key={u.id} className="table-row">
                {editingId === u.id ? (
                  <>
                    <div className="col-id">{u.id}</div>
                    <div className="col-username">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Felhasználónév"
                      />
                    </div>
                    <div className="col-role">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as 'USER' | 'ADMIN')}
                      >
                        <option value="USER">Felhasználó</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </div>
                    <div className="col-created">
                      {new Date(u.createdAt).toLocaleDateString('hu-HU')}
                    </div>
                    <div className="col-actions">
                      <button
                        className="btn-small btn-save"
                        onClick={() => handleUpdateUser(u.id)}
                      >
                        ✓ Mentés
                      </button>
                      <button
                        className="btn-small btn-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        ✕ Mégsem
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-id">{u.id}</div>
                    <div className="col-username">{u.username}</div>
                    <div className="col-role">
                      {u.role === 'ADMIN' ? '👨‍💼 Admin' : '👤 User'}
                    </div>
                    <div className="col-created">
                      {new Date(u.createdAt).toLocaleDateString('hu-HU')}
                    </div>
                    <div className="col-actions">
                      <button
                        className="btn-small btn-edit"
                        onClick={() => {
                          setEditingId(u.id);
                          setNewUsername(u.username);
                          setNewRole(u.role);
                        }}
                      >
                        ✎ Szerkesztés
                      </button>
                      <button
                        className="btn-small btn-delete"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        🗑 Törlés
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
