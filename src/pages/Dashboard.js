import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../Css/Dashboard.css";

const Dashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevoEvento, setNuevoEvento] = useState({
    id: null,
    titulo: "",
    fecha: "",
    hora: "",
    lugar: "",
    ciudad: "",
    descripcion: "",
    precio: "",
    imagen: "",
    categoria: "",
    disponible: true,
  });
  const [editando, setEditando] = useState(false); // Estado para edición

  const eventoEstandar = {
    id: 0,
    titulo: "Sin gravedad - Evento de prueba",
    fecha: "2025-08-30",
    hora: "20:00",
    lugar: "Estadio Obras Sanitarias",
    ciudad: "Buenos Aires",
    descripcion: "Evento de prueba mientras no hay datos en la base.",
    precio: 20000,
    imagen:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    categoria: "Rock Nacional",
    disponible: true,
  };

const fetchEventos = async () => {
  try {
    setLoading(true);
    const res = await fetch("https://singravedad-back.vercel.app/api/eventos");
    if (!res.ok) throw new Error("No se pudo cargar los eventos");
    const data = await res.json();

    // Normalizar _id a id
    const eventosConId = data.map(ev => ({ ...ev, id: ev._id }));
    setEventos(eventosConId.length ? eventosConId : [eventoEstandar]);
  } catch (error) {
    console.error(error);
    setEventos([eventoEstandar]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEventos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoEvento((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (editando) {
        // Actualizar evento en backend
        const res = await fetch(
          `https://singravedad-back.vercel.app/api/eventos/${nuevoEvento.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoEvento),
          }
        );
        const data = await res.json();
        setEventos((prev) =>
          prev.map((ev) => (ev.id === nuevoEvento.id ? data.evento : ev))
        );
        setEditando(false);
      } else {
        // Crear nuevo evento en backend
        const res = await fetch("https://singravedad-back.vercel.app/api/eventos/crear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoEvento),
        });
        const data = await res.json();
        setEventos((prev) => [data.evento, ...prev]);
      }

      // Limpiar formulario
      setNuevoEvento({
        id: null,
        titulo: "",
        fecha: "",
        hora: "",
        lugar: "",
        ciudad: "",
        descripcion: "",
        precio: "",
        imagen: "",
        categoria: "",
        disponible: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar el evento");
    }
  };

const handleDelete = async (id) => {
  if (!window.confirm("¿Seguro que querés borrar este evento?")) return;

  try {
    const res = await fetch(`https://singravedad-back.vercel.app/api/eventos/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data.mensaje);

    // Actualizar estado local
    setEventos((prev) => prev.filter((evento) => evento.id !== id));
  } catch (error) {
    console.error(error);
    alert("Error al eliminar el evento");
  }
};


  const handleEdit = (evento) => {
    setNuevoEvento(evento); // Cargar datos al formulario
    setEditando(true); // Cambiar estado a edición
    window.scrollTo({ top: 0, behavior: "smooth" }); // Ir al formulario
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎸 Dashboard de Eventos</h1>
        <p>Crear, editar y eliminar recitales</p>
      </header>

      {/* Formulario para crear o editar evento */}
      <div className="create-event-form">
        <h2>{editando ? "Editar evento" : "Agregar nuevo evento"}</h2>
        <input
          name="titulo"
          placeholder="Título"
          value={nuevoEvento.titulo}
          onChange={handleChange}
        />
        <input
          name="fecha"
          type="date"
          value={nuevoEvento.fecha}
          onChange={handleChange}
        />
        <input
          name="hora"
          type="time"
          value={nuevoEvento.hora}
          onChange={handleChange}
        />
        <input
          name="lugar"
          placeholder="Lugar"
          value={nuevoEvento.lugar}
          onChange={handleChange}
        />
        <input
          name="ciudad"
          placeholder="Ciudad"
          value={nuevoEvento.ciudad}
          onChange={handleChange}
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={nuevoEvento.descripcion}
          onChange={handleChange}
        />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={nuevoEvento.precio}
          onChange={handleChange}
        />
        <input
          name="imagen"
          placeholder="URL Imagen"
          value={nuevoEvento.imagen}
          onChange={handleChange}
        />
        <input
          name="categoria"
          placeholder="Categoría"
          value={nuevoEvento.categoria}
          onChange={handleChange}
        />
        <input
          name="disponible"
          type="number"
          placeholder="Entradas disponibles"
          value={nuevoEvento.disponible}
          onChange={handleChange}
        />

        <label>
          Disponible
          <input
            type="checkbox"
            name="disponible"
            checked={nuevoEvento.disponible}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleSave}>
          {editando ? "Guardar cambios" : "Crear Evento"}
        </button>
      </div>

      <section className="events-section">
        {loading ? (
          <div className="loading">Cargando eventos...</div>
        ) : eventos.length ? (
          <div className="events-grid">
            {eventos.map((evento, index) => (
              <div className="dashboard-card" key={evento.id || index}>
                <EventCard evento={evento} />
                <div className="dashboard-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(evento)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(evento.id)}
                  >
                    🗑️ Borrar
                  </button>
                </div>
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

export default Dashboard;
