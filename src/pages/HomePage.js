import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import singra2 from "../assets/sin gra2.jpg";
import "../index.css"; // Asegúrate de que el path sea correcto

const HomePage = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de prueba para mostrar mientras no hay backend
  const eventosDePrueba = [
    {
      id: 1,
      titulo: "Sin gravedad - Tocando junto a J.A.F",
      fecha: "2025-09-15",
      hora: "21:00",
      lugar: "Estadio River Plate",
      ciudad: "Buenos Aires",
      descripcion: "El regreso más esperado del rock nacional. Vuelve a los escenarios Sin Gravedad después de un año sabatico, haciendo soporte a un grande de la música J.A.F.",
      precio: 25000,
      imagen: singra2,
      categoria: "Rock Nacional",
      disponible: true
    },
    {
      id: 2,
      titulo: "Sin Gravedad",
      fecha: "2025-10-22",
      hora: "20:30",
      lugar: "Luna Park",
      ciudad: "CABA",
      descripcion: "La Aplanadora del Rock vuelve con todos sus clásicos y nuevos temas que prometen hacer vibrar a toda la audiencia.",
      precio: 18000,
      imagen: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      categoria: "Rock Nacional",
      disponible: true
    },
    {
      id: 3,
      titulo: "Sin Gravedad - Acústico Especial",
      fecha: "2025-11-08",
      hora: "21:30",
      lugar: "Teatro Colón",
      ciudad: "Buenos Aires",
      descripcion: "Una noche única en formato acústico, interpretando sus grandes éxitos de una manera intimista.",
      precio: 22000,
      imagen: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      categoria: "Acústico",
      disponible: true
    },
    {
      id: 4,
      titulo: "Sin Gravedad - Gira Despedida",
      fecha: "2025-12-31",
      hora: "22:00",
      lugar: "Estadio Único de La Plata",
      ciudad: "La Plata",
      descripcion: "La despedida de año más rockera junto a Sin Gravedad. Una celebración épica para recibir el 2026 como corresponde.",
      precio: 30000,
      imagen: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      categoria: "Festival",
      disponible: true
    },
    {
      id: 5,
      titulo: "Sin Gravedad - 10 Años de Rock",
      fecha: "2025-08-30",
      hora: "20:00",
      lugar: "Estadio Obras Sanitarias",
      ciudad: "Buenos Aires",
      descripcion: "Celebrando una década de rock puro. Sin Gravedad presenta su show más especial con invitados sorpresa.",
      precio: 20000,
      imagen: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      categoria: "Rock Nacional",
      disponible: true
    },
    {
      id: 6,
      titulo: "J.A.F Eterno - Tributo",
      fecha: "2025-07-17",
      hora: "21:00",
      lugar: "Niceto Club",
      ciudad: "Buenos Aires",
      descripcion: "Un homenaje al legado eterno de Juan Antonio Ferreyra, con las mejores bandas tributo del rock.",
      precio: 8000,
      imagen: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      categoria: "Tributo",
      disponible: false
    }
  ];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        
        // Intenta fetch del backend
        const res = await fetch("https://singravedad-back.vercel.app/api/eventos");
        
        if (res.ok) {
          const data = await res.json();
          setEventos(data);
        } else {
          // Si el backend no responde, usa datos de prueba
          console.log("Backend no disponible, usando datos de prueba");
          setTimeout(() => {
            setEventos(eventosDePrueba);
          }, 1000); // Simula tiempo de carga
        }
      } catch (error) {
        console.log("Error conectando al backend, usando datos de prueba:", error);
        // Simula tiempo de carga y usa datos de prueba
        setTimeout(() => {
          setEventos(eventosDePrueba);
        }, 1000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    
    fetchEventos();
  }, []);

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>🎸 Próximos Recitales</h1>
        <p>Descubrí shows, comprá entradas y viví la experiencia rock argentina</p>
      </header>

      <section className="events-section">
        {loading ? (
          <div className="loading">Cargando eventos...</div>
        ) : eventos.length ? (
          <div className="events-grid">
            {eventos.map((evento, index) => (
              <EventCard key={evento.id || index} evento={evento} />
            ))}
          </div>
        ) : (
          <div className="no-events">
            No hay eventos disponibles en este momento
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
