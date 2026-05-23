"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ColorPicker } from "@/app/components/ColorPicker";
import { CountrySelect } from "@/app/components/CountrySelect";
import { type Country } from "@/lib/countries";
import { SpaceBackground } from "@/app/components/SpaceBackground";
import { StarMessageModal } from "@/app/components/StarMessageModal";
import { hexToRgb, starGlow } from "@/lib/color";
import { supabase } from "@/lib/supabase";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

type Star = {
  id: number;
  name: string;
  message: string;
  anonymous: boolean;
  x: number;
  y: number;
  color?: string;
  country_code?: string | null;
  country_name?: string | null;
};

type ExploreStar = Star & {
  worldX: number;
  worldY: number;
};

const NEAR_RADIUS = 52;
const FAR_RADIUS = 240;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function getStarFloatOffset(id: number, time: number) {
  const driftX = 2 + seededRandom(id) * 4;
  const driftY = 2 + seededRandom(id + 2) * 4;
  const speedX = 0.25 + seededRandom(id + 4) * 0.35;
  const speedY = 0.2 + seededRandom(id + 5) * 0.4;
  const phaseX = seededRandom(id + 6) * Math.PI * 2;
  const phaseY = seededRandom(id + 7) * Math.PI * 2;

  return {
    x: Math.sin(time * speedX + phaseX) * driftX,
    y: Math.cos(time * speedY + phaseY) * driftY,
  };
}

function useFloatTime(active: boolean) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      setTime((now - start) / 1000);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  return time;
}

function buildExploreStarsLayout(
  stars: Star[],
  focusId: number,
  shuffle = false
): ExploreStar[] {
  const focus = stars.find((star) => star.id === focusId);
  if (!focus) return [];

  const others = stars
    .filter((star) => star.id !== focusId)
    .sort(
      (a, b) =>
        Math.abs(a.id - focusId) - Math.abs(b.id - focusId) || a.id - b.id
    );

  const layout: ExploreStar[] = [{ ...focus, worldX: 0, worldY: 0 }];
  const count = others.length;

  others.forEach((star, index) => {
    const proximity = count <= 1 ? 0 : index / (count - 1);
    const radius = NEAR_RADIUS + proximity * (FAR_RADIUS - NEAR_RADIUS);
    const angle = shuffle
      ? Math.random() * Math.PI * 2
      : seededRandom(star.id) * Math.PI * 2;

    layout.push({
      ...star,
      worldX: Math.cos(angle) * radius,
      worldY: Math.sin(angle) * radius,
    });
  });

  return layout;
}

export default function Home() {
  const zoomRef = useRef<ReactZoomPanPinchRef | null>(null);
  const cameraBase = useRef({ x: 0, y: 0 });
  const [cameraParallax, setCameraParallax] = useState({
    x: 0,
    y: 0,
    scale: 1,
  });
  const [exploring, setExploring] = useState(false);
  const [lastCreatedStarId, setLastCreatedStarId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [colorHex, setColorHex] = useState("#fde047");
  const [country, setCountry] = useState<Country | null>(null);

  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [exploreStars, setExploreStars] = useState<ExploreStar[]>([]);
  const [selectedStar, setSelectedStar] = useState<ExploreStar | null>(null);

  async function loadStars() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("id", { ascending: true });

    if (!error && data) {
      setStars(data);
    }
  }

  useEffect(() => {
    loadStars();
  }, []);

  async function createMessage() {
    if (!message.trim()) {
      setError("Por favor escribe un pensamiento");
      return;
    }

    if (!country) {
      setError("Selecciona tu país de la lista");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        name: anonymous ? "Anónimo" : name || "Anónimo",
        message,
        anonymous,
        x: 0,
        y: 0,
        color: hexToRgb(colorHex),
        country_code: country.code,
        country_name: country.name,
      })
      .select("*")
      .single();

    setLoading(false);

    if (error) {
      setError(`Error al enviar: ${error.message}`);
      console.error("Error en createMessage:", error);
    } else {
      setLastCreatedStarId(data.id);
      setMessage("");
      setName("");
      setCountry(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadStars();
    }
  }

  const focusStarId = useMemo(() => {
    if (lastCreatedStarId) return lastCreatedStarId;
    return stars.length ? stars[stars.length - 1].id : null;
  }, [lastCreatedStarId, stars]);

  useEffect(() => {
    if (!exploring || !focusStarId) return;

    setExploreStars(buildExploreStarsLayout(stars, focusStarId));
  }, [exploring, stars, focusStarId]);

  useEffect(() => {
    if (!exploring || !zoomRef.current) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    zoomRef.current.setTransform(centerX, centerY, 1, 200);
    cameraBase.current = { x: centerX, y: centerY };
    setCameraParallax({ x: 0, y: 0, scale: 1 });
  }, [exploring, exploreStars]);

  const handleCameraTransform = useCallback((ref: ReactZoomPanPinchRef) => {
    const { positionX, positionY, scale } = ref.state;
    setCameraParallax({
      x: positionX - cameraBase.current.x,
      y: positionY - cameraBase.current.y,
      scale,
    });
  }, []);

  const floatTime = useFloatTime(exploring);

  if (exploring) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <SpaceBackground parallax={cameraParallax} />
        <TransformWrapper
          ref={zoomRef}
          minScale={0.35}
          maxScale={4}
          limitToBounds={false}
          centerOnInit={false}
          wheel={{ step: 0.03 }}
          pinch={{ step: 2 }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
          onTransform={handleCameraTransform}
          wrapperClass="!w-screen !h-screen !bg-transparent"
          wrapperStyle={{ background: "transparent" }}
        >
          <TransformComponent
            wrapperClass="!w-screen !h-screen !bg-transparent"
            contentClass="!w-0 !h-0 !bg-transparent"
          >
            <div className="relative">
              {exploreStars.map((star) => {
                const starColor = star.color || "rgb(255, 255, 255)";
                const isFocus = star.id === focusStarId;
                const offset = getStarFloatOffset(star.id, floatTime);

                return (
                <button
                  key={star.id}
                  type="button"
                  className="absolute p-0 border-0 bg-transparent cursor-pointer group"
                  style={{
                    left: `${star.worldX}px`,
                    top: `${star.worldY}px`,
                  }}
                  onClick={() => setSelectedStar(star)}
                >
                  <span
                    className="block will-change-transform"
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px)`,
                    }}
                  >
                    <span
                      className={`block rounded-full transition-transform duration-300 group-hover:scale-150 ${
                        isFocus ? "w-3 h-3" : "w-2 h-2"
                      }`}
                      style={{
                        backgroundColor: starColor,
                        boxShadow: starGlow(starColor),
                      }}
                    />
                  </span>
                </button>
              );
              })}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {selectedStar && (
          <StarMessageModal
            name={selectedStar.name}
            message={selectedStar.message}
            countryCode={selectedStar.country_code}
            countryName={selectedStar.country_name}
            color={selectedStar.color}
            onClose={() => setSelectedStar(null)}
          />
        )}

        <div className="absolute top-5 left-5 z-10 flex gap-2">
          <button
            onClick={() => {
              setSelectedStar(null);
              setExploring(false);
            }}
            className="text-white border border-white/20 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm"
          >
            Volver
          </button>
          <button
            onClick={() => {
              if (!focusStarId) return;
              setExploreStars(buildExploreStarsLayout(stars, focusStarId, true));
            }}
            className="text-white border border-white/20 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm"
          >
            Reordenar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden flex items-center justify-center px-4">
      <SpaceBackground />
      <div className="relative z-10 w-full max-w-md bg-black/30 border border-white/15 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
        <h1 className="text-white text-3xl mb-6 text-center font-light">
          No se como llamarlo lol...
        </h1>

        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white outline-none"
        />

        <CountrySelect value={country} onChange={setCountry} />

        <textarea
          placeholder="Escribe un pensamiento..."
          maxLength={200}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-32 mb-2 px-4 py-3 rounded-xl bg-white/10 text-white outline-none resize-none"
        />

        <p className="text-white/50 text-sm mb-4">
          {message.length} / 200
        </p>

        <label className="flex items-center gap-2 text-white mb-4">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Anónimo
        </label>

        <ColorPicker hex={colorHex} onChange={setColorHex} />

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 rounded-xl text-sm">
            ¡Pensamiento enviado! ✨
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={createMessage}
            disabled={loading}
            className="flex-1 bg-white text-black py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>

          <button
            onClick={() => setExploring(true)}
            disabled={loading}
            className="flex-1 border border-white/20 text-white py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Explorar
          </button>
        </div>
      </div>
    </main>
  );
}