import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/Register.css";

const ConfirmCode = () => {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // email pasado desde Register

  if (!email) {
    // Si entran directo a esta ruta sin email
    navigate("/register");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("https://singravedad-back.vercel.app/api/auth/confirmar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Cuenta confirmada correctamente!");
        setTimeout(() => navigate("/login"), 1500); // Redirige al login
      } else {
        setMensaje(data.mensaje || "Código incorrecto");
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
        <h2 className="register-title">Confirmar Cuenta</h2>
        <p>Ingresa el código que recibiste en tu correo para activar tu cuenta.</p>

        <input
          type="text"
          placeholder="Código de confirmación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          className="register-input"
        />

        <button type="submit" disabled={cargando} className="register-btn">
          {cargando ? "Verificando..." : "Confirmar"}
        </button>

        {mensaje && <p className="register-message">{mensaje}</p>}
      </form>
    </div>
  );
};

export default ConfirmCode;
