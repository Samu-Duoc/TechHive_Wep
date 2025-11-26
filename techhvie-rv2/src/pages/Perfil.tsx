import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import MenuPerfil from './MenuPerfil';
import '../styles/MenuPerfil.css';

interface ProfileData {
  id?: number;
  nombre?: string;
  email?: string;
  rol?: string;
}

const Perfil: React.FC = () => {
  const { usuario, setUsuario } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(usuario ?? null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Intentar sincronizar con endpoint de auth si existe
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const resp = await fetch('http://localhost:8081/auth/me');
        if (resp.ok) {
          const data = await resp.json();
          setProfile(data);
          // mantener también en el contexto
          setUsuario && setUsuario(data);
        } else {
          // fallback: usar usuario del contexto/localStorage
          setProfile(usuario ?? null);
        }
      } catch (e) {
        setProfile(usuario ?? null);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <div className="perfil-layout">
        <MenuPerfil role={profile?.rol ?? usuario?.rol ?? null} />

        <div className="perfil-card">
          <h3>Perfil de usuario</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div>
              <div className="perfil-field">
                <label>Nombre</label>
                <div className="value">{profile?.nombre ?? '—'}</div>
              </div>

              <div className="perfil-field">
                <label>Email</label>
                <div className="value">{profile?.email ?? '—'}</div>
              </div>

              <div className="perfil-field">
                <label>Rol</label>
                <div className="value">{profile?.rol ?? '—'}</div>
              </div>

              <div className="perfil-field">
                <label>Acciones</label>
                <div>
                  <button className="btn btn-warning me-2" onClick={() => { alert('Editar perfil (pendiente)'); }}>Editar</button>
                  <button className="btn btn-secondary" onClick={() => { localStorage.removeItem('usuario'); localStorage.removeItem('isLoggedIn'); window.location.reload(); }}>Cerrar sesión</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
