import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // íconos hamburguesa y cerrar
import "../Css/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Sin Gravedad
        </Link>

        {/* Botón hamburguesa (solo móvil) */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menú principal */}
        <ul className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/about" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Nosotros
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/music" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Escuchanos
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/eventos" className="navbar-link" onClick={() => setMenuOpen(false)}>
              Eventos
            </Link>
          </li>

          {(user?.rol === "user" || user?.rol === "superadmin") && (
            <>
              <li className="navbar-item">
                <Link to="/dashboard" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/reproductor" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Reproductor
                </Link>
              </li>
            </>
          )}

          {!user ? (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          ) : (
            <li className="navbar-item">
              <button onClick={logout} className="navbar-logout-btn">
                Salir
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;


