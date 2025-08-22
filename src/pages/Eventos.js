import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../Css/Dashboard.css";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para traer eventos desde backend
  const fetchEventos = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://singravedad-back.vercel.app/api/eventos");
      if (!res.ok) throw new Error("No se pudo cargar los eventos");
      const data = await res.json();
      setEventos(data);
    } catch (error) {
      console.error(error);
      setEventos([]); // Si falla, lista vacía
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Función para borrar evento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que querés borrar este evento?")) return;

    try {
      const res = await fetch(`https://singravedad-back.vercel.app/api/eventos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo borrar el evento");
      setEventos((prev) => prev.filter((evento) => evento.id !== id));
    } catch (error) {
      console.error(error);
      alert("Error al borrar el evento");
    }
  };

  // Función para editar evento (puede abrir un modal o redirigir a otro form)
  const handleEdit = (evento) => {
    alert(`Aquí podrías abrir un formulario para editar: ${evento.titulo}`);
    // Ej: navigate(`/admin/edit/${evento.id}`)
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎸 Dashboard de Eventos</h1>
        <p>Visualizá, editá y eliminá tus recitales</p>
      </header>

      <section className="events-section">
        {loading ? (
          <div className="loading">Cargando eventos...</div>
        ) : eventos.length ? (
          <div className="events-grid">
            {eventos.map((evento, index) => (
              <div className="dashboard-card" key={evento.id || index}>
                <EventCard evento={evento} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">No hay eventos disponibles</div>
        )}
      </section>
    </div>
  );
};

export default Eventos;
