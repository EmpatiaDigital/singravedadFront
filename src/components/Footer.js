import React from "react";
import { Link } from "react-router-dom";
import "../Css/Footer.css";

// Importar imágenes
import instaLogo from "../assets/insta.jpg";
import faceLogo from "../assets/face.jpg";
import youtubeLogo from "../assets/youtube.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">Sin Gravedad</div>
        
        {/* Tagline */}
        <p className="footer-tagline">
          "Donde el rock argentino cobra vida"
        </p>

        {/* Navigation Links */}
        <nav className="footer-links">
          <Link to="/eventos" className="footer-link">Eventos</Link>
          <Link to="/about" className="footer-link">Nosotros</Link>
          <Link to="/contact" className="footer-link">Contacto</Link>
        </nav>

        {/* Social Media */}
        <div className="footer-social">
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-social-link"
            aria-label="Facebook"
          >
            <img src={faceLogo} alt="Facebook" className="footer-icon" />
          </a>
          <a 
            href="https://www.instagram.com/singravedadrock" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-social-link"
            aria-label="Instagram"
          >
            <img src={instaLogo} alt="Instagram" className="footer-icon" />
          </a>
          <a 
            href="https://www.youtube.com/@jochysguitarristarosarino4733" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-social-link"
            aria-label="YouTube"
          >
            <img src={youtubeLogo} alt="YouTube" className="footer-icon" />
          </a>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Copyright */}
        <p className="footer-copyright">
          © <span className="footer-year">{currentYear}</span> Sin Gravedad. 
          Todos los derechos reservados.
        </p>

        {/* Made with love */}
        <div className="footer-made-with">
          Desarrollado por <span className="footer-heart">Gabo Dev</span> 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
