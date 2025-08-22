import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../Css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false); // 👀

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "El email no es válido";

    if (!password) newErrors.password = "La contraseña es requerida";
    else if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 🔹 Login de prueba local para superadmin
      if (email === "superadmin@local.com" && password === "123456") {
        const usuario = {
          token: "superadmin-token",
          rol: "superadmin",
          email: email,
          nombre: "Super Admin"
        };
        login(usuario);
        setSuccess(true);
        setTimeout(() => navigate("/"), 800);
        return;
      }

      // 🔹 Login normal al backend
      const res = await fetch("https://singravedad-back.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en login");
      }

      const data = await res.json();
      const usuario = {
        token: data.token,
        rol: data.role || "admin",
        email: data.email || email,
        nombre: data.nombre || "Usuario"
      };
      login(usuario);
      setSuccess(true);
      setTimeout(() => navigate("/"), 800);

    } catch (error) {
      console.error("Error en login:", error);
      setErrors({
        general: error.message || "Error al iniciar sesión. Verifica tus credenciales."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-header">
            <span className="login-icon">🎸</span>
            <h2 className="login-title">Iniciar Sesión</h2>
            <p className="login-subtitle">Accede a tu cuenta de Sin Gravedad</p>
          </div>

          {errors.general && <div className="error-message">{errors.general}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group password-wrapper">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type={mostrarPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`form-input ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              disabled={loading}
              autoComplete="current-password"
            />
            <span
              className="eye-icon"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              {mostrarPassword ? "🙈" : "👁️"}
            </span>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''} ${success ? 'login-success' : ''}`}
            disabled={loading}
          >
            {loading ? '' : success ? '¡Éxito!' : 'Entrar'}
          </button>

          <div className="login-divider">
            <span className="login-divider-text">o</span>
          </div>

          <div className="login-footer">
            <p className="login-footer-text">
              ¿No tienes cuenta? <Link to="/register" className="login-link">Regístrate aquí</Link>
            </p>
            <p className="login-footer-text">
              <Link to="/forgot-password" className="login-link">¿Olvidaste tu contraseña?</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

