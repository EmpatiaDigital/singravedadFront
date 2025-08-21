import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Reproductor from "./components/Reproductor";
import MusicAdmin from "./pages/MusicAdmin";
import UserMusica from "./pages/UserMusic";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Eventos from "./pages/Eventos";
import About from "./pages/About";
import Register from "./pages/Register";
import Confirma from "./pages/ConfirmCode";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [playlist, setPlaylist] = useState([]);

  // Función para agregar canción a la playlist
  const handleAddTrack = (song) => {
    setPlaylist(prev => {
      // Evitar duplicados - usar _id en lugar de id
      if (prev.some(track => track._id === song._id)) {
        console.log("La canción ya está en la playlist");
        return prev;
      }
      
      // Transformar la canción al formato que espera el reproductor
      const trackForPlayer = {
        id: song._id, // mantener también id para compatibilidad
        _id: song._id, // id original de MongoDB
        title: song.title,
        artist: song.artist,
        album: song.album || '',
        audioUrl: song.audioUrl,
        coverUrl: song.coverUrl,
        duration: song.duration || '0:00'
      };
      
      console.log("Agregando canción a playlist:", trackForPlayer);
      return [...prev, trackForPlayer];
    });
  };

  // Función para quitar canción de la playlist
  const handleRemoveTrack = (song) => {
    setPlaylist(prev => {
      const filtered = prev.filter(track => track._id !== song._id);
      console.log("Quitando canción de playlist:", song.title);
      return filtered;
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />

          {/* Reproductor recibe toda la playlist y la función para eliminar */}
          <Reproductor playlist={playlist} onRemoveTrack={handleRemoveTrack} />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/register" element={<Register />} />
              <Route path="/confirmar-codigo" element={<Confirma />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/reproductor" element={<MusicAdmin />} />

              {/* UserMusica recibe la playlist y las funciones para agregar/quitar */}
              <Route
                path="/music"
                element={
                  <UserMusica
                    currentPlaylist={playlist}
                    onAddTrack={handleAddTrack}
                    onRemoveTrack={handleRemoveTrack}
                  />
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["admin", "superadmin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;