import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/Register.css";

const Register = () => {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const navigate = useNavigate(); // para redirigir

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("https://singravedad-back.vercel.app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMensaje(data.mensaje || "Error inesperado");

      if (res.ok) {
        setForm({ nombre: "", email: "", password: "" });
        // Redirigir a la pantalla de confirmación, pasando el email
        navigate("/confirmar-codigo", { state: { email: form.email } });
      }
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Registro</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="register-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="register-input"
        />

        <div className="password-wrapper">
          <input
            type={mostrarPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="register-input"
          />
          <span
            className="eye-icon"
            onClick={() => setMostrarPassword(!mostrarPassword)}
          >
            {mostrarPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" disabled={cargando} className="register-btn">
          {cargando ? "Registrando..." : "Registrarse"}
        </button>

        {mensaje && <p className="register-message">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Register;
