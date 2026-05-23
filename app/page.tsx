"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Star = {
  id: number;
  name: string;
  message: string;
  anonymous: boolean;
  x: number;
  y: number;
};

export default function Home() {
  const [exploring, setExploring] = useState(false);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const [stars, setStars] = useState<Star[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function loadStars() {
    const { data, error } = await supabase
      .from("messages")
      .select("*");

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

    setLoading(true);
    setError(null);
    setSuccess(false);

    const x = Math.floor(Math.random() * window.innerWidth);
    const y = Math.floor(Math.random() * window.innerHeight);

    const { error } = await supabase.from("messages").insert({
      name: anonymous ? "Anónimo" : name || "Anónimo",
      message,
      anonymous,
      x,
      y,
    });

    setLoading(false);

    if (error) {
      setError(`Error al enviar: ${error.message}`);
      console.error("Error en createMessage:", error);
    } else {
      setMessage("");
      setName("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      loadStars();
    }
  }

  if (exploring) {
    return (
      <main className="w-screen h-screen bg-black relative overflow-hidden">
        {stars.map((star) => (
          <button
            key={star.id}
            className="absolute w-2 h-2 bg-white rounded-full hover:scale-150 transition"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
            }}
            onClick={() => {
              alert(
                `${star.name}\n\n${star.message}`
              );
            }}
          />
        ))}

        <button
          onClick={() => setExploring(false)}
          className="absolute top-5 left-5 text-white border border-white/20 px-4 py-2 rounded-xl"
        >
          Volver
        </button>
      </main>
    );
  }

  return (
    <main className="w-screen h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <h1 className="text-white text-3xl mb-6 text-center font-light">
          Night Sky
        </h1>

        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 text-white outline-none"
        />

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

        <label className="flex items-center gap-2 text-white mb-6">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Anónimo
        </label>

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