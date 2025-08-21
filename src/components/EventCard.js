import React from "react";
import "../Css/EventCard.css";

const EventCard = ({ evento }) => {
  // Formatear fecha
  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("es-AR", opciones);
  };

  // Formatear precio
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);
  };

  const handleComprarEntrada = () => {
    if (!evento.disponible) {
      alert("Lo sentimos, las entradas para este evento están agotadas.");
      return;
    }

    // Aquí iría la lógica de compra
    alert(`Redirigiendo a la compra de entradas para: ${evento.titulo}`);
  };

  return (
    <div className={`event-card ${!evento.disponible ? "sold-out" : ""}`}>
      {/* Imagen del evento */}
      <div className="event-card-image-container">
        <img
          src={evento.imagen}
          alt={evento.titulo}
          className="event-card-image"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
          }}
        />
        {!evento.disponible && (
          <div className="sold-out-overlay">
            <span className="sold-out-text">AGOTADO</span>
          </div>
        )}
        <div className="event-card-category">{evento.categoria}</div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="event-card-content">
        <h3 className="event-card-title">{evento.titulo}</h3>

        <div className="event-card-details">
          <div className="event-card-date">
            📅 {formatearFecha(evento.fecha)} - {evento.hora}
          </div>

          <div className="event-card-date">
            📅Entradas disponibles: <h4 className="event-card-title">{evento.disponible}</h4>
          </div>

          <div className="event-card-location">
            📍 {evento.lugar}, {evento.ciudad}
          </div>
        </div>

        {evento.descripcion && (
          <p className="event-card-description">{evento.descripcion}</p>
        )}

        <div className="event-card-footer">
          <div className="event-card-price">
            {formatearPrecio(evento.precio)}
            <br></br>
            <button
              className={`event-card-btn ${
                !evento.disponible ? "disabled" : ""
              }`}
              onClick={handleComprarEntrada}
              disabled={!evento.disponible}
            >
              {evento.disponible ? "🎫 Comprar Entrada" : "Agotado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
