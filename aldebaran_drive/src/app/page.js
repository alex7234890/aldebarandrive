import Image from "next/image";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="text-2xl font-bold">LOGO</div>
        <nav className="space-x-6 text-sm">
          <a href="#galleria" className="hover:underline">Galleria</a>
          <a href="#chi-siamo" className="hover:underline">Chi siamo</a>
          <a href="#eventi" className="hover:underline">Eventi</a>
          <a href="#contatti" className="hover:underline">Contatti</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Passione su Due e Quattro Ruote</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Organizziamo raduni ed eventi per gli amanti di auto e moto d'epoca, sportive e custom.
        </p>
      </section>

      {/* Galleria */}
      <section id="galleria" className="py-16 px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">Galleria Espositiva</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Placeholder immagini */}
          <div className="bg-gray-800 h-64 flex items-center justify-center">Spazio immagine</div>
          <div className="bg-gray-800 h-64 flex items-center justify-center">Spazio immagine</div>
          <div className="bg-gray-800 h-64 flex items-center justify-center">Spazio immagine</div>
        </div>
      </section>

      {/* Chi Siamo */}
      <section id="chi-siamo" className="py-16 px-4 bg-gray-900">
        <h2 className="text-3xl font-semibold mb-4 text-center">Chi Siamo</h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-center">
          {/* Testo da inserire */}
          [Inserisci qui la descrizione dell'associazione]
        </p>
      </section>

      {/* Eventi */}
      <section id="eventi" className="py-16 px-4">
        <h2 className="text-3xl font-semibold mb-8 text-center">Prossimi Eventi</h2>
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-lg max-w-sm">
            <img
              src="/path/to/image.jpg"
              alt="Copertina Evento"
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-2xl font-bold text-white">[Nome Evento]</h3>
              <p className="text-gray-400 mt-1">📍 [Data e Luogo Evento]</p>
              <p className="text-gray-300 mt-3 text-sm">[Descrizione breve dell'evento]</p>
              <button
                className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
              >
                Iscriviti
              </button>
            </div>
          </div>
          <div className="border border-gray-700 p-4 rounded-xl">
            <h3 className="text-xl font-semibold">[Nome Evento]</h3>
            <p className="text-gray-400">[Data e Luogo Evento]</p>
            <p className="text-gray-500 mt-2">[Descrizione breve dell'evento]</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-gray-900">
        <h2 className="text-3xl font-semibold mb-4 text-center">Iscriviti alla Newsletter</h2>
        <p className="text-gray-400 text-center mb-6">Rimani aggiornato su eventi e raduni esclusivi.</p>
        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
          <Input type="email" placeholder="La tua email" className="bg-black border border-gray-700 text-white" />
          <Button type="submit" className="bg-white text-black">Iscriviti</Button>
        </form>
      </section>

      {/* Footer */}
      <footer id="contatti" className="bg-black border-t border-gray-800 py-8 px-4 text-sm text-gray-500">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">Contatti</h4>
            <p><PhoneIcon className="inline w-4 h-4 mr-2" /> +39 123 456 7890</p>
            <p><MailIcon className="inline w-4 h-4 mr-2" /> info@tuosito.it</p>
            <p><MapPinIcon className="inline w-4 h-4 mr-2" /> Via Esempio 123, Città</p>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">Navigazione</h4>
            <ul className="space-y-1">
              <li><a href="#galleria" className="hover:underline">Galleria</a></li>
              <li><a href="#chi-siamo" className="hover:underline">Chi siamo</a></li>
              <li><a href="#eventi" className="hover:underline">Eventi</a></li>
              <li><a href="#contatti" className="hover:underline">Contatti</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-lg font-semibold mb-2">Info Legali</h4>
            <p>P.IVA: 12345678901</p>
            <p>&copy; {new Date().getFullYear()} Associazione Auto & Moto. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

import React from "react";
import jsPDF from "jspdf";

export default function TestPdfButton() {
  const generaPDF = () => {
    const doc = new jsPDF();

    // Dati finti predefiniti
    const dati = {
      nome: "Mario Rossi",
      email: "mario.rossi@example.com",
      messaggio: "Questo è un messaggio di prova generato da codice.",
    };

    // Scrittura nel PDF
    doc.setFontSize(16);
    doc.text("Anteprima PDF con dati finti", 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome: ${dati.nome}`, 10, 20);
    doc.text(`Email: ${dati.email}`, 10, 30);
    doc.text(`Messaggio: ${dati.messaggio}`, 10, 40);

    // Salvataggio
    doc.save("test-dati.pdf");
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={generaPDF}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:opacity-80 transition"
      >
        Genera PDF di Test
      </button>
    </div>
  );
}

