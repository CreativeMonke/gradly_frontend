import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "@mui/material/styles";

export default function ParticlesBackground() {
  const [initialized, setInitialized] = useState(false);

  const theme = useTheme();

  // Initialize the engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      // If you want to load everything, switch to: await loadAll(engine)
    }).then(() => {
      setInitialized(true);
    });
  }, []);

  // Callback after the particles have loaded
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  // Config object typed as ISourceOptions
  const particlesOptions: ISourceOptions = useMemo(
    () => ({
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          // Must be an object, not a boolean
          resize: {
            enable: true,
            delay: 0,
          },
        },
        modes: {
          push: { quantity: 1 },
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: theme.palette.primary.main },
        links: {
          color: theme.palette.primary.main,
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 2,
        },
        move: {
          direction: MoveDirection.none, // or MoveDirection.top, etc.
          enable: true,
          outModes: {
            default: OutMode.out, // or OutMode.bounce, OutMode.destroy, etc.
          },
          speed: 2,
        },
        number: {
          value: 400,
          density: {
            enable: true,
            area: 1000,
          },
        },
        opacity: { value: 0.5 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 5 } },
      },
      detectRetina: true,
    }),
    [theme]
  );

  // Only render Particles after engine init
  if (!initialized) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={particlesOptions}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // behind other elements
      }}
    />
  );
}
