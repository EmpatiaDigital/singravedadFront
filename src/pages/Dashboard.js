import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import "../Css/Dashboard.css";

const Dashboard = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    entradasDisponibles: "",
    disponible: true,
  });
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");

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
    entradasDisponibles: 1000,
    disponible: true,
  };

  const resetForm = () => {
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
      entradasDisponibles: "",
      disponible: true,
    });
    setEditando(false);
    setError("");
  };

  const fetchEventos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("https://singravedad-back.vercel.app/api/eventos");
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo cargar los eventos`);
      }
      
      const data = await res.json();

      // Asegurar que cada evento tenga un id válido
      const eventosConId = data.map((ev) => ({
        ...ev,
        id: ev._id || ev.id,
        entradasDisponibles: ev.entradasDisponibles || 0
      }));

      setEventos(eventosConId.length ? eventosConId : [eventoEstandar]);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setError("Error al cargar los eventos");
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
    setError(""); // Limpiar errores al hacer cambios
    
    console.log(`Campo: ${name}, Valor: "${value}", Tipo: ${type}, Longitud: ${value.length}`); // Debug mejorado
    
    // Validación específica para entradasDisponibles
    if (name === 'entradasDisponibles') {
      // Solo permitir números
      const numericValue = value.replace(/[^0-9]/g, '');
      console.log(`Valor filtrado para entradasDisponibles: "${numericValue}"`);
      
      setNuevoEvento((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }
    
    setNuevoEvento((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const required = ['titulo', 'fecha', 'hora', 'lugar', 'ciudad', 'categoria'];
    for (let field of required) {
      if (!nuevoEvento[field] || !nuevoEvento[field].toString().trim()) {
        setError(`El campo ${field} es obligatorio`);
        return false;
      }
    }
    
    if (nuevoEvento.precio && nuevoEvento.precio !== "" && (isNaN(parseFloat(nuevoEvento.precio)) || parseFloat(nuevoEvento.precio) < 0)) {
      setError("El precio debe ser un número válido mayor o igual a 0");
      return false;
    }
    
    if (nuevoEvento.entradasDisponibles && nuevoEvento.entradasDisponibles !== "" && (isNaN(parseInt(nuevoEvento.entradasDisponibles, 10)) || parseInt(nuevoEvento.entradasDisponibles, 10) <= 0)) {
      setError("La cantidad de entradas debe ser un número entero válido mayor a 0");
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      let response;
      let url;
      let method;

      if (editando) {
        url = `https://singravedad-back.vercel.app/api/eventos/${nuevoEvento.id}`;
        method = "PUT";
      } else {
        url = "https://singravedad-back.vercel.app/api/eventos/crear";
        method = "POST";
      }

      // Preparar el payload con conversiones adecuadas
      const entradasFinal = nuevoEvento.entradasDisponibles && nuevoEvento.entradasDisponibles !== "" 
        ? parseInt(nuevoEvento.entradasDisponibles, 10) 
        : 100;
      

      const payload = {
        titulo: nuevoEvento.titulo.trim(),
        fecha: nuevoEvento.fecha,
        hora: nuevoEvento.hora,
        lugar: nuevoEvento.lugar.trim(),
        ciudad: nuevoEvento.ciudad.trim(),
        descripcion: nuevoEvento.descripcion ? nuevoEvento.descripcion.trim() : "",
        categoria: nuevoEvento.categoria.trim(),
        imagen: nuevoEvento.imagen ? nuevoEvento.imagen.trim() : "",
        disponible: nuevoEvento.entradasDisponibles,
        precio: nuevoEvento.precio ? parseFloat(nuevoEvento.precio) : 0,
      };

      response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo guardar el evento`);
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data); // Para debug
      
      // Asegurar que el evento retornado tenga un id válido
      const eventoGuardado = {
        ...data.evento,
        id: data.evento._id || data.evento.id
      };

      if (editando) {
        setEventos((prev) =>
          prev.map((ev) => 
            (ev.id === nuevoEvento.id || ev._id === nuevoEvento.id) 
              ? eventoGuardado 
              : ev
          )
        );
      } else {
        setEventos((prev) => [eventoGuardado, ...prev]);
      }

      resetForm();
      alert(editando ? "Evento actualizado correctamente" : "Evento creado correctamente");
      
    } catch (error) {
      console.error("Error al guardar:", error);
      setError(error.message || "Error al guardar el evento");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (evento) => {
    const eventoId = evento._id || evento.id;
    
    if (!window.confirm(`¿Seguro que querés borrar el evento "${evento.titulo}"?`)) return;

    try {
      setError("");
      const res = await fetch(`https://singravedad-back.vercel.app/api/eventos/${eventoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo eliminar el evento`);
      }

      const data = await res.json();
      console.log(data.mensaje);

      setEventos((prev) => prev.filter((ev) => 
        (ev.id !== eventoId && ev._id !== eventoId)
      ));
      
      alert("Evento eliminado correctamente");
      
    } catch (error) {
      console.error("Error al eliminar:", error);
      setError("Error al eliminar el evento");
    }
  };

  const handleEdit = (evento) => {
    console.log("Editando evento:", evento); // Debug
    
    setNuevoEvento({
      ...evento,
      id: evento._id || evento.id,
      precio: evento.precio ? evento.precio.toString() : "",
      entradasDisponibles: evento.disponible ? evento.disponible.toString() : "50", // Valor por defecto aquí
      descripcion: evento.descripcion || "",
      imagen: evento.imagen || "",
    });
    setEditando(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🎸 Dashboard de Eventos</h1>
        <p>Crear, editar y eliminar recitales</p>
      </header>

      <div className="create-event-form">
        <h2>{editando ? "Editar evento" : "Agregar nuevo evento"}</h2>
        
        {error && (
          <div className="error-message" style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}

        <div className="form-grid">
          <input
            name="titulo"
            placeholder="Título *"
            value={nuevoEvento.titulo}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="fecha"
            type="date"
            value={nuevoEvento.fecha}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="hora"
            type="time"
            value={nuevoEvento.hora}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="lugar"
            placeholder="Lugar *"
            value={nuevoEvento.lugar}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="ciudad"
            placeholder="Ciudad *"
            value={nuevoEvento.ciudad}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="categoria"
            placeholder="Categoría *"
            value={nuevoEvento.categoria}
            onChange={handleChange}
            disabled={saving}
          />
          <input
            name="precio"
            type="number"
            placeholder="Precio (opcional)"
            value={nuevoEvento.precio}
            onChange={handleChange}
            disabled={saving}
            min="0"
            step="0.01"
          />
          <input
            name="entradasDisponibles"
            type="text"
            placeholder="Entradas disponibles (default: 50)"
            value={nuevoEvento.entradasDisponibles}
            onChange={handleChange}
            disabled={saving}
            pattern="[0-9]*"
            inputMode="numeric"
          />
          <input
            name="imagen"
            placeholder="URL Imagen (opcional)"
            value={nuevoEvento.imagen}
            onChange={handleChange}
            disabled={saving}
          />
          <textarea
            name="descripcion"
            placeholder="Descripción (opcional)"
            value={nuevoEvento.descripcion}
            onChange={handleChange}
            disabled={saving}
            style={{ gridColumn: '1 / -1', minHeight: '60px', resize: 'vertical' }}
          />
        </div>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="disponible"
            checked={nuevoEvento.disponible}
            onChange={handleChange}
            disabled={saving}
          />
          Evento disponible para la venta
        </label>

        <div className="form-buttons">
          <button 
            onClick={handleSave} 
            className="save-btn"
            disabled={saving}
          >
            {saving 
              ? (editando ? "Guardando..." : "Creando...") 
              : (editando ? "Guardar cambios" : "Crear Evento")
            }
          </button>
          {editando && (
            <button 
              onClick={resetForm} 
              className="cancel-btn"
              disabled={saving}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      <section className="events-section">
        {loading ? (
          <div className="loading">Cargando eventos...</div>
        ) : eventos.length ? (
          <div className="events-grid">
            {eventos.map((evento, index) => (
              <div className="dashboard-card" key={evento._id || evento.id || index}>
                <div className="event-card-wrapper">
                  <EventCard evento={evento} />
                </div>
                {/* <div className="event-info">
                  <p><strong>Entradas:</strong> {evento.entradasDisponibles || 'No especificado'}</p>
                  <p><strong>Estado:</strong> {evento.disponible ? 'Disponible' : 'No disponible'}</p>
                </div> */}
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(evento)}
                    disabled={saving}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(evento)}
                    disabled={saving}
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

