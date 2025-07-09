'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";

const eventi = [
  {
    titolo: "Raduno Vintage Cars",
    tipo: "AUTO",
    data: "15 Marzo 2024",
    luogo: "Piazza del Popolo, Roma",
    posti: 50,
    descrizione:
      "Un evento dedicato alle auto d'epoca con esposizione e sfilata nel centro storico di Roma.",
  },
  {
    titolo: "Moto Raduno Primavera",
    tipo: "MOTO",
    data: "22 Marzo 2024",
    luogo: "Lago di Garda",
    posti: 80,
    descrizione:
      "Tour motociclistico panoramico di circa 150km tra le colline e i paesaggi del Garda.",
  },
  {
    titolo: "Classic Car Show",
    tipo: "AUTO",
    data: "5 Aprile 2024",
    luogo: "Autodromo di Monza",
    posti: 100,
    descrizione:
      "Esposizione e dimostrazioni su pista di auto classiche e sportive storiche.",
  },
];

export default function Home() {
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
    </main>
  );
}
