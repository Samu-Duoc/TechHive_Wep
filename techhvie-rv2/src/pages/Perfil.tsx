// src/pages/Perfil.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Usuario } from "../context/AuthContext";
import MenuPerfil from "./MenuPerfil";
import "../styles/MenuPerfil.css";

const API = "http://localhost:8081";

const Perfil: React.FC = () => {
  const { usuario, setUsuario, logout, token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Usuario>(() => usuario ?? {});
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (!usuario?.id) return;

    const fetchUser = async () => {
      setLoading(true);
      setMsg("");
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const resp = await fetch(`${API}/usuarios/${usuario.id}`, { headers } as RequestInit);

        if (resp.ok) {
          const data: Usuario = await resp.json();
          setForm(data);
          setUsuario(data);
        } else {
          // fallback: lo que ya tienes en contexto/localStorage
          setForm(usuario);
        }
      } catch {
        setForm(usuario);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id]);

  if (!usuario) {
    return (
      <div className="container mt-4">
        <p>Debes iniciar sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="perfil-layout">
        <MenuPerfil role={usuario.rol ?? null} />

        <div className="perfil-card">
          <h3>Perfil de usuario</h3>

          {msg && <p className="alert alert-info">{msg}</p>}
          {loading && <p>Cargando...</p>}

          <div className="perfil-field">
            <label>Nombre</label>
            <div className="value">{form.nombre ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Apellido</label>
            <div className="value">{form.apellido ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Email</label>
            <div className="value">{form.email ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>RUT</label>
            <div className="value">{form.rut ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Teléfono</label>
            <div className="value">{form.telefono ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Dirección</label>
            <div className="value">{form.direccion ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Rol</label>
            <div className="value">{form.rol ?? "—"}</div>
          </div>

          <div className="perfil-field">
            <label>Acciones</label>
            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-warning" onClick={() => window.location.href = "/cuenta/editar"}>
                Editar perfil
              </button>
              <button className="btn btn-primary" onClick={() => window.location.href = "/cuenta/cambiar-password"}>
                Cambiar contraseña
              </button>
              <button className="btn btn-outline-dark" onClick={() => { logout(); window.location.href = "/"; }}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
