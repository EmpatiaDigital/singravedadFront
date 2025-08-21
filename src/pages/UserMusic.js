import React, { useState, useEffect } from "react";
import { Plus, Trash2, Music } from "lucide-react";
import "../Css/UserMusic.css";

const UserMusica = ({ onAddTrack, onRemoveTrack, currentPlaylist = [] }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://singravedad-back.vercel.app/api/music");
        if (!response.ok) throw new Error("Error al obtener canciones");
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las canciones");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  // Verifica individualmente si la canción está en la playlist
  const isInPlaylist = (songId) =>
    currentPlaylist.some((track) => track._id === songId);

  // Maneja la acción de agregar canción
  const handleAdd = (song) => {
    setActionLoading((prev) => ({ ...prev, [song._id]: "adding" }));
    try {
      onAddTrack(song); // llama a la función de App.js
    } catch (err) {
      console.error("Error al agregar canción:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [song._id]: false }));
    }
  };

  // Maneja la acción de quitar canción
  const handleRemove = (song) => {
    setActionLoading((prev) => ({ ...prev, [song._id]: "removing" }));
    try {
      onRemoveTrack(song); // llama a la función de App.js
    } catch (err) {
      console.error("Error al quitar canción:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [song._id]: false }));
    }
  };

  if (loading) return <p className="loading">Cargando canciones...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="user-musica-container">
      <h2>
        <Music size={24} /> Catálogo de Canciones
      </h2>

      <div className="playlist-summary">
        <p>Canciones en playlist: {currentPlaylist.length}</p>
      </div>

      <div className="song-list">
        {songs.length === 0 && <p>No hay canciones disponibles</p>}
        {songs.map((song) => {
          const inPlaylist = isInPlaylist(song._id);
          const isActionLoading = actionLoading[song._id];

          return (
            <div
              key={song._id}
              className={`song-item ${inPlaylist ? "in-playlist" : ""}`}
            >
              <div className="song-info">
                 <div className="mini-cover">
              <img
                src={song?.coverUrl || song}
                alt={song?.title || 'Sin canción'}
                onError={(e) => { e.target.src = song; }}
              />
            </div>
                <p className="song-title">{song.title}</p>
                <p className="song-artist">{song.artist}</p>
                {song.duration && (
                  <p className="song-duration">{song.duration}</p>
                )}
              </div>
              <div className="song-actions">
                {!inPlaylist ? (
                  <button
                    onClick={() => handleAdd(song)}
                    className="add-btn"
                    disabled={isActionLoading}
                  >
                    <Plus size={18} />
                    {isActionLoading === "adding" ? "Agregando..." : "Agregar"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRemove(song)}
                    className="remove-btn"
                    disabled={isActionLoading}
                  >
                    <Trash2 size={18} />
                    {isActionLoading === "removing" ? "Quitando..." : "Quitar"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserMusica;
