'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";
import React from "react";
import jsPDF from "jspdf";

const eventi = [
  {
    titolo: "Evento A",
    tipo: "AUTO",
    data: "01 Gennaio 2024",
    luogo: "Luogo A",
    posti: 30,
    descrizione: "Descrizione evento A.",
  },
  {
    titolo: "Evento B",
    tipo: "MOTO",
    data: "10 Febbraio 2024",
    luogo: "Luogo B",
    posti: 45,
    descrizione: "Descrizione evento B.",
  },
  {
    titolo: "Evento C",
    tipo: "AUTO",
    data: "15 Marzo 2024",
    luogo: "Luogo C",
    posti: 60,
    descrizione: "Descrizione evento C.",
  },
];

export default function Home() {
  const generaPDF = () => {
    const doc = new jsPDF();

    const dati = {
      nome: "Mario Rossi",
      email: "mario.rossi@example.com",
      messaggio: "Questo è un messaggio di prova generato da codice.",
    };

    doc.setFontSize(16);
    doc.text("Anteprima PDF con dati finti", 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome: ${dati.nome}`, 10, 20);
    doc.text(`Email: ${dati.email}`, 10, 30);
    doc.text(`Messaggio: ${dati.messaggio}`, 10, 40);

    doc.save("test-dati.pdf");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-black text-white p-2 rounded">🚗</span> MotorEvents Pro
        </div>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#chi-siamo">Chi Siamo</a>
          <a href="#prossimi-eventi">Prossimi Eventi</a>
          <a href="#galleria-eventi">Galleria Eventi</a>
          <a href="#galleria-foto">Galleria Foto</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center px-4 py-20 bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Vivi la Passione</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Raduni esclusivi per auto e moto d'epoca. Unisciti alla nostra community di appassionati.
        </p>
        <Button className="bg-black text-white hover:bg-gray-800">
          Scopri i Prossimi Eventi
        </Button>
      </section>

      {/* PROSSIMI EVENTI */}
      <section id="prossimi-eventi" className="px-6 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2">Prossimi Eventi</h2>
        <p className="text-center text-gray-600 mb-12">
          Scopri i nostri eventi esclusivi e iscriviti per vivere esperienze indimenticabili
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {eventi.map((evento, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border rounded-xl shadow-sm hover:shadow-lg transition p-6 flex flex-col"
            >
              <div className="text-xs font-semibold bg-black text-white px-2 py-1 rounded-full w-fit mb-3">
                {evento.tipo}
              </div>
              <h3 className="text-xl font-bold mb-2">{evento.titolo}</h3>
              <p className="text-sm text-gray-600 mb-4">{evento.descrizione}</p>
              <div className="flex flex-col gap-2 text-sm text-gray-700 mb-4">
                <p className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-4 h-4" /> {evento.data}
                </p>
                <p className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" /> {evento.luogo}
                </p>
                <p className="flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" /> {evento.posti} posti disponibili
                </p>
              </div>
              <Button className="mt-auto bg-black text-white hover:bg-gray-800">
                Iscriviti Ora
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERIA GENERALE */}
      <section id="galleria-foto" className="px-6 py-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6">Galleria Generale</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-200">
              <Image
                src="/img.jpg"
                alt={`Foto Generale ${i + 1}`}
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </section>

      {/* GALLERIA EVENTI PASSATI */}
      <section id="galleria-eventi" className="px-6 py-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">Galleria Eventi Passati</h2>
        <div className="space-y-16">
          {eventi.map((evento, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-4">{evento.titolo}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="aspect-square overflow-hidden rounded-xl bg-gray-200"
                  >
                    <Image
                      src="/img.jpg"
                      alt={`Evento ${idx + 1} - Foto ${j + 1}`}
                      width={600}
                      height={600}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PDF BUTTON */}
      <div className="p-6 text-center">
        <button
          onClick={generaPDF}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:opacity-80 transition"
        >
          Genera PDF di Test
        </button>
      </div>
    </main>
  );
}
