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
  const doc = new jsPDF({ format: "a4" });
  let y = 10;

  doc.setFontSize(16);
  doc.text("MODULO D’ISCRIZIONE", 10, y);
  y += 10;
  doc.setFontSize(14);
  doc.text('EVENTO: “SUPERCAR FOR PASSION”', 10, y);
  y += 15;

  doc.setFontSize(12);
  doc.text("DATI ANAGRAFICI DEL GUIDATORE", 10, y);
  y += 10;
  doc.text("Cognome: _______________________ Nome: _______________________", 10, y); y += 8;
  doc.text("Codice Fiscale: ____________________________________________", 10, y); y += 8;
  doc.text("Patente: __________________ Scadenza: ______________________", 10, y); y += 8;
  doc.text("Cellulare: ___________________ Email: _______________________", 10, y); y += 12;

  doc.text("DATI ANAGRAFICI DEL PASSEGGERO", 10, y);
  y += 10;
  doc.text("Cognome: _______________________ Nome: _______________________", 10, y); y += 8;
  doc.text("Codice Fiscale: ____________________________________________", 10, y); y += 8;
  doc.text("Cellulare: ___________________ Email: _______________________", 10, y); y += 12;

  doc.text("DATI AUTOVETTURA", 10, y);
  y += 10;
  doc.text("Modello: __________ Anno: ______ Colore: ______ Targa: ______", 10, y); y += 12;

  doc.text("PACCHETTO/SOLUZIONE:", 10, y);
  y += 8;
  doc.text("□ QUOTA 1   □ QUOTA 2   □ QUOTA 3   □ QUOTA 4   □ QUOTA 5   □ QUOTA 6", 10, y); y += 10;

  doc.text("ESIGENZE ALIMENTARI GUIDATORE: SI □   NO □", 10, y); y += 8;
  doc.text("Se sì, indicare: ___________________________________________", 10, y); y += 10;

  doc.text("ESIGENZE ALIMENTARI PASSEGGERO: SI □   NO □", 10, y); y += 8;
  doc.text("Se sì, indicare: ___________________________________________", 10, y); y += 12;

  doc.text("DICHIARA/DICHIARANO", 10, y); y += 8;
  const dichiarazioni = [
    "1) di aver preso visione della brochure e accettare il programma;",
    "2) di voler partecipare esclusivamente a scopo turistico, non competitivo;",
    "3) di utilizzare un mezzo conforme e in efficienza;",
    "4) che il mezzo è in regola con bollo, revisione e assicurazione;",
    "5) di esonerare gli organizzatori nei limiti di legge da responsabilità civili;",
    "6) di mantenere copertura RCA e assumersi responsabilità verso terzi;",
    "7) di sollevare gli organizzatori da danni e furti non causati da dolo;",
    "8) di trovarsi in perfetta salute fisica e psichica;",
    "9) di accettare che l'iscrizione è valida solo con esonero firmato;",
    "10) di essere consapevole dei rischi dell’abuso di alcol;",
    "11) che gli organizzatori possono escludere partecipanti per motivi gravi;",
    "12) che la quota d’iscrizione non è rimborsabile;",
    "13) che gli organizzatori possono intraprendere azioni legali se necessario;",
    "14) di rispettare sempre il Codice della Strada e norme di sicurezza."
  ];

  for (const line of dichiarazioni) {
    if (y > 270) { doc.addPage(); y = 10; }
    doc.text(line, 10, y);
    y += 6;
  }

  doc.addPage(); y = 10;
  doc.text("Firme e approvazioni", 10, y); y += 8;
  doc.text("GUIDATORE: ____________________________________", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y); y += 10;

  doc.text("Dichiaro di aver preso visione e approvo le clausole 5, 6, 7, 9, 11, 13.", 10, y); y += 8;
  doc.text("Firma: ____________________", 10, y); y += 12;

  doc.text("PASSEGGERO: ____________________________________", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y); y += 10;

  doc.text("Dichiaro di aver preso visione e approvo le clausole 5, 6, 7, 9, 11, 13.", 10, y); y += 8;
  doc.text("Firma: ____________________", 10, y); y += 12;

  doc.addPage(); y = 10;
  doc.setFontSize(11);
  doc.text("LIBERATORIA USO IMMAGINI", 10, y); y += 8;
  doc.text("Autorizzo l’utilizzo di foto/video durante l’evento da parte degli organizzatori", 10, y); y += 6;
  doc.text("per fini promozionali e informativi, senza limiti di tempo o mezzi.", 10, y); y += 10;

  doc.text("GUIDATORE: ____________________  ◯ Acconsento  ◯ Non acconsento", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y); y += 10;

  doc.text("PASSEGGERO: ____________________  ◯ Acconsento  ◯ Non acconsento", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y); y += 12;

  doc.text("INFORMATIVA PRIVACY", 10, y); y += 8;
  doc.setFontSize(10);
  doc.text("Ai sensi del D.Lgs. 196/2003 i dati saranno trattati con correttezza e trasparenza,", 10, y); y += 5;
  doc.text("per finalità statistiche interne e gestione della card. Il titolare è Marlan S.R.L.", 10, y); y += 5;
  doc.text("I dati non saranno diffusi a terzi. È possibile richiedere rettifica o cancellazione.", 10, y); y += 7;

  doc.setFontSize(11);
  doc.text("GUIDATORE: ____________________  ◯ Acconsento  ◯ Non acconsento", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y); y += 10;

  doc.text("PASSEGGERO: ____________________  ◯ Acconsento  ◯ Non acconsento", 10, y); y += 7;
  doc.text("Luogo e data: __________________     Firma: __________________", 10, y);

  doc.save("Modulo_Iscrizione_Compilato.pdf");
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
