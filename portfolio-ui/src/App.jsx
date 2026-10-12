import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SplashCursor from './components/SplashCursor';
import { useEffect, useState } from "react";
import IntroReel from "./components/IntroReel";

function App() {
  // The site (and its heavy effects) only mounts once the intro ends,
  // so the video gets the whole CPU/GPU and plays smoothly.
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("portfolio_visit_sent");

    if (!hasVisited) {
      fetch("/api/visit", {
        method: "POST",
      })
        .then(() => {
          sessionStorage.setItem("portfolio_visit_sent", "true");
        })
        .catch((error) => {
          console.error("Visit notification failed:", error);
        });
    }
  }, []);


  return (
    <>
      <IntroReel
        src="/Intro_nawyes.mp4"
        poster="/nawres.png"
        onFinish={() => setIntroDone(true)}
      />

      {introDone && (
        <>
          <SplashCursor
            DENSITY_DISSIPATION={3.5}
            VELOCITY_DISSIPATION={2}
            PRESSURE={0.1}
            CURL={3}
            SPLAT_RADIUS={0.2}
            SPLAT_FORCE={6000}
            COLOR_UPDATE_SPEED={10}
            SHADING
            RAINBOW_MODE={false}
            COLOR="#f7b8b7"
          />
          <Navbar />
          <main>
            <Hero />
            <Projects />
            <About />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;