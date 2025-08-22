import React, { useState, useEffect } from "react";
import {
  Upload,
  Music,
  Edit2,
  Trash2,
  Save,
  X,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import "../Css/MusicAdmin.css";

const MusicAdmin = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados del formulario
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    duration: "",
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://singravedad-back.vercel.app/api/music");
      if (response.ok) {
        const data = await response.json();
        setSongs(data.canciones || data);
      } else {
        showMessage("error", "Error al cargar las canciones");
      }
    } catch (error) {
      showMessage("error", "Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const resetForm = () => {
    setFormData({ title: "", artist: "", album: "", duration: "" });
    setAudioFile(null);
    setCoverFile(null);
    setEditingSong(null);
    setShowUploadForm(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);

    // Auto-rellenar duración si es posible
    if (file) {
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setFormData((prev) => ({
          ...prev,
          duration: `${minutes}:${seconds.toString().padStart(2, "0")}`,
        }));
      };
    }
  };

  const handleCoverFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.artist) {
      showMessage("error", "Título y artista son obligatorios");
      return;
    }

    if (!editingSong && !audioFile) {
      showMessage("error", "Selecciona un archivo de audio");
      return;
    }

    setIsSubmitting(true);

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("artist", formData.artist);
    uploadData.append("album", formData.album);
    uploadData.append("duration", formData.duration);

    if (audioFile) {
      uploadData.append("audio", audioFile);
    }
    if (coverFile) {
      uploadData.append("cover", coverFile);
    }

    try {
      const url = editingSong
        ? `https://singravedad-back.vercel.app/api/music/${editingSong._id}`
        : "https://singravedad-back.vercel.app/api/music";

      const method = editingSong ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: uploadData,
      });

      if (response.ok) {
        showMessage(
          "success",
          editingSong ? "Canción actualizada" : "Canción subida exitosamente"
        );
        resetForm();
        fetchSongs();
      } else {
        const errorData = await response.json();
        showMessage(
          "error",
          errorData.message || "Error al procesar la canción"
        );
      }
    } catch (error) {
      showMessage("error", "Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      artist: song.artist,
      album: song.album || "",
      duration: song.duration || "",
    });
    setShowUploadForm(true);
  };

  const handleDelete = async (songId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta canción?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `https://singravedad-back.vercel.app/api/music/${songId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        showMessage("success", "Canción eliminada exitosamente");
        fetchSongs();
      } else {
        showMessage("error", "Error al eliminar la canción");
      }
    } catch (error) {
      showMessage("error", "Error de conexión con el servidor");
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (song.album &&
        song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const defaultCover =
    "data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Cg fill='%23ff6b35' transform='translate(150 150)'%3E%3Ccircle r='60' fill='none' stroke='%23ff6b35' stroke-width='2'/%3E%3Cpath d='M-20-20 L20-20 L20,20 L-20,20 Z' fill='%23ff6b35'/%3E%3Ctext y='100' text-anchor='middle' fill='%23666' font-size='14'%3ERock Band%3C/text%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="music-admin">
      <div className="music-admin-container">
        {/* Header */}
        <div className="header-card">
          <div className="header-content">
            <div className="header-info">
              <h1>
                <Music className="header-icon" size={32} />
                Administrador de Música
              </h1>
              <p className="header-subtitle">Gestiona tu biblioteca musical</p>
            </div>

            <button
              onClick={() => setShowUploadForm(true)}
              className="btn-new-song"
            >
              <Plus size={20} className="btn-icon" />
              Nueva Canción
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {message.text && (
          <div
            className={`message ${
              message.type === "success" ? "message-success" : "message-error"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={20} className="message-icon" />
            ) : (
              <AlertCircle size={20} className="message-icon" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Formulario de subida/edición */}
        {showUploadForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingSong ? "Editar Canción" : "Nueva Canción"}
                </h2>
                <button onClick={resetForm} className="btn-close">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  {/* Archivos */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Archivo de Audio {!editingSong && "*"}
                      </label>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAudioFileChange}
                        className="form-file-input"
                        required={!editingSong}
                      />
                      {audioFile && (
                        <p className="file-success">✓ {audioFile.name}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Carátula</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="form-file-input"
                      />
                      {coverFile && (
                        <p className="file-success">✓ {coverFile.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  {/* Información de la canción */}
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Título *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Artista *</label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Álbum</label>
                      <input
                        type="text"
                        name="album"
                        value={formData.album}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Duración (mm:ss)</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="3:45"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="form-buttons">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="spinner" size={20} />
                        {editingSong ? "Actualizando..." : "Subiendo..."}
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingSong ? "Actualizar" : "Subir Canción"}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="search-card">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar canciones por título, artista..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <br></br>
          <Search className="search-icon" size={20} />
        </div>

        {/* Lista de canciones */}
        <div className="songs-card">
          <div className="songs-header">
            <h3 className="songs-title">
              <Music className="songs-title-icon" size={20} />
              Biblioteca Musical ({filteredSongs.length} canciones)
            </h3>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <Loader className="loading-icon spinner" size={48} />
              <span className="loading-text">Cargando canciones...</span>
            </div>
          ) : filteredSongs.length > 0 ? (
            <div className="songs-list">
              {filteredSongs.map((song) => (
                <div key={song._id} className="song-item">
                  <div className="song-content">
                    {/* Carátula */}
                    <div className="song-cover">
                      <img
                        src={song.coverUrl || defaultCover}
                        alt={song.title}
                        onError={(e) => {
                          e.target.src = defaultCover;
                        }}
                      />
                    </div>

                    {/* Información */}
                    <div className="song-info">
                      <h4 className="song-title truncate">{song.title}</h4>
                      <p className="song-artist truncate">{song.artist}</p>
                      {song.album && (
                        <p className="song-album truncate">{song.album}</p>
                      )}
                    </div>

                    {/* Duración */}
                    <div className="song-duration">
                      {song.duration || "0:00"}
                    </div>
                  </div>
                  {/* Acciones */}
                  <div className="song-actions">
                    <button
                      onClick={() => handleEdit(song)}
                      className="btn-action btn-edit"
                      title="Editar"
                    >
                      <Edit2 size={18} className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(song._id)}
                      className="btn-action btn-delete"
                      title="Eliminar"
                    >
                      <Trash2 size={18} className="action-icon" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Music size={64} className="empty-icon" />
              <h3 className="empty-title">No se encontraron canciones</h3>
              <p className="empty-subtitle">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza subiendo tu primera canción"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="btn-first-song"
                >
                  <Plus size={20} className="btn-icon" />
                  Subir Primera Canción
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicAdmin;
