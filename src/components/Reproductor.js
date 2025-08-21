import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, Shuffle, Repeat, Music } from 'lucide-react';
import "../Css/Reproductor.css";

const Reproductor = ({ playlist = [] }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  
  // Función para seleccionar una canción
  const selectTrack = (track, index) => {
    if (!track) return;
    setCurrentTrack({ ...track, index });
    setIsPlaying(true);
  };

  // Función para detener la reproducción y limpiar el track actual
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePlayPause = async () => {
    if (!currentTrack || playlist.length === 0) return;
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn("Error al reproducir el audio:", error);
    }
  };

  // Siguiente canción
  const nextTrack = () => {
    if (!playlist.length) {
      stopPlayback();
      return;
    }
    
    let nextIndex;
    if (isShuffleOn) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentTrack ? (currentTrack.index + 1) % playlist.length : 0;
    }
    
    selectTrack(playlist[nextIndex], nextIndex);
  };

  // Canción anterior
  const prevTrack = () => {
    if (!playlist.length) {
      stopPlayback();
      return;
    }
    
    let prevIndex;
    if (isShuffleOn) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentTrack ? (currentTrack.index - 1 + playlist.length) % playlist.length : 0;
    }
    
    selectTrack(playlist[prevIndex], prevIndex);
  };

  // Control de volumen
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Control de progreso
  const handleProgressClick = (e) => {
    if (audioRef.current && progressBarRef.current && currentTrack) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
    }
  };

  // Formatear tiempo
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Efecto para manejar cuando la playlist cambia
  useEffect(() => {
    if (playlist.length === 0) {
      // Si la playlist se vacía, detener la reproducción
      stopPlayback();
    } else if (currentTrack) {
      // Verificar si la canción actual aún existe en la playlist
      const trackExists = playlist.find(track => 
        track._id === currentTrack._id || track.id === currentTrack.id
      );
      
      if (!trackExists) {
        // Si la canción actual ya no está en la playlist, seleccionar la primera
        selectTrack(playlist[0], 0);
      }
    }
  }, [playlist]);

  // Efectos del reproductor
  useEffect(() => {
    const playTrack = async () => {
      if (audioRef.current && currentTrack && playlist.length > 0) {
        audioRef.current.src = currentTrack.audioUrl;
        audioRef.current.volume = isMuted ? 0 : volume;

        if (isPlaying) {
          try {
            await audioRef.current.play();
          } catch (error) {
            console.warn("Autoplay bloqueado, se requiere interacción del usuario:", error);
          }
        }
      }
    };

    playTrack();
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeatOn && currentTrack) {
        // Repetir la canción actual
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn("Error al repetir la canción:", error);
        });
      } else {
        // Pasar a la siguiente canción automáticamente
        if (playlist.length > 0) {
          nextTrack();
        } else {
          // Si no hay playlist, detener la reproducción
          stopPlayback();
        }
      }
    };

    const handleError = () => {
      console.warn("Error al cargar el audio");
      // Si hay error con la canción actual, pasar a la siguiente
      if (playlist.length > 1) {
        nextTrack();
      } else {
        stopPlayback();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeatOn, currentTrack, playlist]);

  const defaultCover = "data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='300' height='300' fill='%23333'/%3E%3Cg fill='%23ff6b35' transform='translate(150 150)'%3E%3Ccircle r='60' fill='none' stroke='%23ff6b35' stroke-width='2'/%3E%3Cpath d='M-20-20 L20-20 L20,20 L-20,20 Z' fill='%23ff6b35'/%3E%3Ctext y='100' text-anchor='middle' fill='%23666' font-size='14'%3ERock Band%3C/text%3E%3C/g%3E%3C/svg%3E";

  return (
    <div className="reproductor-container">
      <div className={`reproductor ${isMinimized ? 'minimized' : 'maximized'}`}>
        <audio ref={audioRef} />
        
        {/* Header con controles de ventana */}
        <div className="reproductor-header">
            <h4>REPRODUCCION</h4>
          <div className="window-controls">
            <button
              className="minimize-btn"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {!isMinimized ? (
          /* Vista maximizada */
          <div className="reproductor-content">
            <div className="main-content">
              {/* Área de la carátula y información */}
              <div className="track-display">
                <div className="cover-art">
                  <img
                    src={currentTrack?.coverUrl || defaultCover}
                    alt={currentTrack?.title || 'Sin canción'}
                    onError={(e) => { e.target.src = defaultCover; }}
                  />
                </div>
                
                <div className="track-info">
                  <h3 className="track-title">
                    {currentTrack?.title || (playlist.length === 0 ? 'Lista vacía' : 'Selecciona una canción')}
                  </h3>
                  <p className="track-artist">
                    {currentTrack?.artist || (playlist.length === 0 ? 'No hay canciones disponibles' : 'Rock Band')}
                  </p>
                  <p className="track-album">
                    {currentTrack?.album || ''}
                  </p>
                </div>
              </div>

              {/* Controles principales */}
              <div className="main-controls">
                <div className="control-buttons">
                  <button
                    className={`control-btn ${isShuffleOn ? 'active' : ''} ${playlist.length === 0 ? 'disabled' : ''}`}
                    onClick={() => playlist.length > 0 && setIsShuffleOn(!isShuffleOn)}
                    disabled={playlist.length === 0}
                  >
                    <Shuffle size={20} />
                  </button>
                  
                  <button 
                    className={`control-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                    onClick={prevTrack}
                    disabled={playlist.length === 0}
                  >
                    <SkipBack size={24} />
                  </button>
                  
                  <button 
                    className={`play-pause-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                    onClick={togglePlayPause}
                    disabled={playlist.length === 0}
                  >
                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                  </button>
                  
                  <button 
                    className={`control-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                    onClick={nextTrack}
                    disabled={playlist.length === 0}
                  >
                    <SkipForward size={24} />
                  </button>
                  
                  <button
                    className={`control-btn ${isRepeatOn ? 'active' : ''} ${playlist.length === 0 ? 'disabled' : ''}`}
                    onClick={() => playlist.length > 0 && setIsRepeatOn(!isRepeatOn)}
                    disabled={playlist.length === 0}
                  >
                    <Repeat size={20} />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="progress-section">
                  <span className="time-display">{formatTime(currentTime)}</span>
                  <div
                    ref={progressBarRef}
                    className={`progress-bar ${playlist.length === 0 ? 'disabled' : ''}`}
                    onClick={playlist.length > 0 ? handleProgressClick : undefined}
                  >
                    <div
                      className="progress-fill"
                      style={{
                        width: `${duration && currentTrack ? (currentTime / duration) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="time-display">{formatTime(duration)}</span>
                </div>

                {/* Control de volumen */}
                <div className="volume-section">
                  <button className="volume-btn" onClick={toggleMute}>
                    {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMuted ? 0 : volume * 100}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              </div>
            </div>

            {/* Playlist */}
            <div className="playlist-section">
              <h4 className="playlist-title">
                <Music size={16} />
                Lista de Reproducción ({playlist.length})
              </h4>
              <div className="playlist">
                {playlist.length > 0 ? (
                  playlist.map((track, index) => (
                    <div
                      key={track._id || track.id || index}
                      className={`playlist-item ${
                        currentTrack?._id === track._id || currentTrack?.id === track.id 
                          ? 'active' 
                          : ''
                      }`}
                      onClick={() => selectTrack(track, index)}
                    >
                      <div className="playlist-item-cover">
                        <img
                          src={track.coverUrl || defaultCover}
                          alt={track.title}
                          onError={(e) => { e.target.src = defaultCover; }}
                        />
                      </div>
                      <div className="playlist-item-info">
                        <p className="playlist-item-title">{track.title}</p>
                        <p className="playlist-item-artist">{track.artist}</p>
                      </div>
                      <div className="playlist-item-duration">
                        {track.duration || '0:00'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-tracks">
                    <Music size={32} />
                    <p>No hay canciones en la playlist</p>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                      Agrega algunas canciones para comenzar a escuchar música
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Vista minimizada */
          <div className="reproductor-minimized">
            <div className="mini-cover">
              <img
                src={currentTrack?.coverUrl || defaultCover}
                alt={currentTrack?.title || 'Sin canción'}
                onError={(e) => { e.target.src = defaultCover; }}
              />
            </div>
            
            <div className="mini-info">
              <p className="mini-title">
                {currentTrack?.title || (playlist.length === 0 ? 'Lista vacía' : 'Sin canción')}
              </p>
              <p className="mini-artist">
                {currentTrack?.artist || (playlist.length === 0 ? 'No hay canciones' : 'Rock Band')}
              </p>
            </div>
            
            <div className="mini-controls">
              <button 
                className={`mini-control-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                onClick={prevTrack}
                disabled={playlist.length === 0}
              >
                <SkipBack size={16} />
              </button>
              <button 
                className={`mini-play-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                onClick={togglePlayPause}
                disabled={playlist.length === 0}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                className={`mini-control-btn ${playlist.length === 0 ? 'disabled' : ''}`} 
                onClick={nextTrack}
                disabled={playlist.length === 0}
              >
                <SkipForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reproductor;