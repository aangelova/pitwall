import aboutPhoto from "../assets/about.png";

function About() {
  return (
   <section className="about-page">

    <h2 className="about-title">Behind PitWall</h2>

    <div className="about-hero">

      <img
        src={aboutPhoto}
        alt="Creator of PitWall"
        className="about-photo"
      />

      <div className="about-heading">

        <h1>
          Welcome to the mess that's inside a 23-year-old girl's head.
        </h1>

        <p>
          <span className="about-subtitle">
            Hope you enjoy it. :)
          </span>
        </p>

      </div>

    </div>

    <div className="about-content">

      <div className="about-divider" />

      <p>
        This project is basically every random idea I decided was worth building.
      </p>

      <p>
        Some features were planned. Most of them definitely weren't.
      </p>

      <p>
        PitWall became my place to experiment with design, interactive experiences
        and everything that makes Formula 1 a little more fun.
      </p>

    </div>

  </section>
  );
}

export default About;