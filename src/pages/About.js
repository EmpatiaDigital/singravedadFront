import React from "react";
import "../Css/About.css";

const About = () => {
  return (
    <div
      className="about-page"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#e0e0e0",
      }}
    >
      <div className="about-overlay">
        <header className="about-header">
          <h1>🎸 Sobre Sin Gravedad</h1>
          <p>
            Sin Gravedad es una banda argentina que nació en los años 90 con la misión
            de fusionar el rock clásico con la energía de los shows en vivo. Desde sus
            primeros conciertos en clubes locales hasta grandes escenarios, la banda ha
            dejado huella con su estilo único y letras que conectan con generaciones.
          </p>
        </header>

        <section className="about-content">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              Fundada por un grupo de amigos apasionados por la música, Sin Gravedad se destacó
              rápidamente en la escena underground. La banda ha lanzado varios discos,
              recorriendo el país con recitales inolvidables y construyendo una comunidad
              de fans leales que siguen la energía del rock argentino.
            </p>
            <p>
              Nuestra misión es mantener viva la esencia del rock, ofrecer shows memorables,
              y transmitir emociones a través de cada acorde y cada letra. ¡Bienvenidos a
              la experiencia Sin Gravedad!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
