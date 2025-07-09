
'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, MapPinIcon, UsersIcon, PlusIcon, XIcon, UploadIcon } from "lucide-react";
import React from "react";
import jsPDF from "jspdf";
import { useState } from 'react';
import { supabase } from "@/lib/supabaseClient"; // Importa il client di supabase

const eventi = [
  {
    id: 1,
    titolo: "Evento A",
    tipo: "AUTO",
    data: "01 Gennaio 2024",
    luogo: "Luogo A",
    posti: 30,
    descrizione: "Descrizione evento A.",
  },
  {
    id: 2,
    titolo: "Evento B",
    tipo: "MOTO",
    data: "10 Febbraio 2024",
    luogo: "Luogo B",
    posti: 45,
    descrizione: "Descrizione evento B.",
  },
  {
    id: 3,
    titolo: "Evento C",
    tipo: "AUTO",
    data: "15 Marzo 2024",
    luogo: "Luogo C",
    posti: 60,
    descrizione: "Descrizione evento C.",
  },
];

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [passeggeri, setPasseggeri] = useState([]);
  
  const [formData, setFormData] = useState({
    // Dati guidatore
    guidatoreCognome: '',
    guidatoreNome: '',
    guidatoreCodiceFiscale: '',
    guidatorePatente: '',
    guidatoreScadenzaPatente: '',
    guidatoreCellulare: '',
    guidatoreEmail: '',
    guidatoreDocumento: null,
    
    // Dati auto
    autoModello: '',
    autoAnno: '',
    autoColore: '',
    autoTarga: '',
    
    // Pacchetto
    quotaSelezionata: 'QUOTA 1',
    
    // Esigenze alimentari
    guidatoreEsigenzeAlimentari: false,
    guidatoreIntolleranze: '',
    
    // Autorizzazioni
    guidatoreAutorizzaFoto: true,
    guidatoreAutorizzaTrattamento: true,
    
    // Luogo e data
    luogo: '',
    data: new Date().toLocaleDateString('it-IT')
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e, person, index = null) => {
    const file = e.target.files[0];
    if (index !== null) {
      // Passeggero
      const newPasseggeri = [...passeggeri];
      newPasseggeri[index] = {
        ...newPasseggeri[index],
        documento: file
      };
      setPasseggeri(newPasseggeri);
    } else {
      // Guidatore
      setFormData(prev => ({
        ...prev,
        [`${person}Documento`]: file
      }));
    }
  };

  const aggiungiPasseggero = () => {
    setPasseggeri(prev => [...prev, {
      cognome: '',
      nome: '',
      codiceFiscale: '',
      cellulare: '',
      email: '',
      documento: null,
      esigenzeAlimentari: false,
      intolleranze: '',
      autorizzaFoto: true,
      autorizzaTrattamento: true
    }]);
  };

  const rimuoviPasseggero = (index) => {
    setPasseggeri(prev => prev.filter((_, i) => i !== index));
  };

  const handlePasseggeroChange = (index, field, value) => {
    const newPasseggeri = [...passeggeri];
    newPasseggeri[index] = {
      ...newPasseggeri[index],
      [field]: value
    };
    setPasseggeri(newPasseggeri);
  };

  const handleIscriviti = (evento) => {
    setSelectedEvent(evento);
    setShowForm(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Impostazioni generali
    doc.setFont('helvetica');
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const lineHeight = 6;
    
    // Funzione per aggiungere testo centrato
    const addCenteredText = (text, fontSize = 12, isBold = false) => {
      if (isBold) doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(text);
      doc.text(text, (pageWidth - textWidth) / 2, yPos);
      if (isBold) doc.setFont('helvetica', 'normal');
      yPos += lineHeight + 2;
    };
    
    // Funzione per aggiungere una linea
    const addLine = (text, value = '', fontSize = 10) => {
      doc.setFontSize(fontSize);
      if (value) {
        doc.text(text, margin, yPos);
        doc.text(value, margin + doc.getTextWidth(text) + 5, yPos);
      } else {
        doc.text(text, margin, yPos);
      }
      yPos += lineHeight;
    };
    
    // Funzione per aggiungere checkbox
    const addCheckbox = (text, isChecked = false) => {
      doc.setFontSize(10);
      doc.rect(margin, yPos - 3, 3, 3);
      if (isChecked) {
        doc.text('X', margin + 0.5, yPos - 0.5);
      }
      doc.text(text, margin + 6, yPos);
      yPos += lineHeight;
    };
    
    // Funzione per nuova pagina se necessario
    const checkNewPage = () => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    };
    
    // HEADER
    addCenteredText('MODULO D\'ISCRIZIONE', 14, true);
    addCenteredText(`EVENTO: "${selectedEvent?.titolo || 'SUPERCAR FOR PASSION'}"`, 12, true);
    yPos += 10;
    
    // DATI GUIDATORE
    addLine('DATI ANAGRAFICI DEL GUIDATORE', '', 12);
    yPos += 5;
    addLine(`Cognome: ${formData.guidatoreCognome}`, '', 10);
    addLine(`Nome: ${formData.guidatoreNome}`, '', 10);
    addLine(`Codice Fiscale: ${formData.guidatoreCodiceFiscale}`, '', 10);
    addLine(`Patente di guida n. ${formData.guidatorePatente}`, '', 10);
    addLine(`Scadenza: ${formData.guidatoreScadenzaPatente}`, '', 10);
    addLine(`Cellulare: ${formData.guidatoreCellulare}`, '', 10);
    addLine(`e-mail: ${formData.guidatoreEmail}`, '', 10);
    if (formData.guidatoreDocumento) {
      addLine(`Documento allegato: ${formData.guidatoreDocumento.name}`, '', 10);
    }
    yPos += 10;
    
    // DATI PASSEGGERI
    passeggeri.forEach((passeggero, index) => {
      addLine(`DATI ANAGRAFICI DEL PASSEGGERO ${index + 1}`, '', 12);
      yPos += 5;
      addLine(`Cognome: ${passeggero.cognome}`, '', 10);
      addLine(`Nome: ${passeggero.nome}`, '', 10);
      addLine(`Codice Fiscale: ${passeggero.codiceFiscale}`, '', 10);
      addLine(`Cellulare: ${passeggero.cellulare}`, '', 10);
      addLine(`e-mail: ${passeggero.email}`, '', 10);
      if (passeggero.documento) {
        addLine(`Documento allegato: ${passeggero.documento.name}`, '', 10);
      }
      yPos += 10;
    });
    
    // DATI AUTO
    addLine('DATI AUTOVETTURA UTILIZZATA PER L\'EVENTO', '', 12);
    yPos += 5;
    addLine(`Modello: ${formData.autoModello}`, '', 10);
    addLine(`Anno immatricolazione: ${formData.autoAnno}`, '', 10);
    addLine(`Colore: ${formData.autoColore}`, '', 10);
    addLine(`Targa: ${formData.autoTarga}`, '', 10);
    yPos += 10;
    
    // RICHIESTA PARTECIPAZIONE
    addLine('CHIEDE/CHIEDONO', '', 12);
    yPos += 5;
    doc.setFontSize(10);
    const richiesta = 'di poter partecipare all\'evento in epigrafe a proprio rischio e pericolo, senza esclusiva, con l\'autovettura sopra identificata, coperta da assicurazione RCA in corso di validità.';
    const splitRichiesta = doc.splitTextToSize(richiesta, pageWidth - 2 * margin);
    doc.text(splitRichiesta, margin, yPos);
    yPos += splitRichiesta.length * lineHeight + 10;
    
    // PACCHETTO
    addLine('PACCHETTO/SOLUZIONE DI PARTECIPAZIONE', '', 12);
    yPos += 5;
    const quote = ['QUOTA 1', 'QUOTA 2', 'QUOTA 3', 'QUOTA 4', 'QUOTA 5', 'QUOTA 6'];
    quote.forEach(quota => {
      addCheckbox(quota, formData.quotaSelezionata === quota);
    });
    yPos += 10;
    
    // ESIGENZE ALIMENTARI
    addLine('ESIGENZE ALIMENTARI GUIDATORE:', '', 10);
    addCheckbox('SI', formData.guidatoreEsigenzeAlimentari);
    addCheckbox('NO', !formData.guidatoreEsigenzeAlimentari);
    if (formData.guidatoreEsigenzeAlimentari) {
      addLine(`Intolleranze/Allergie: ${formData.guidatoreIntolleranze}`, '', 10);
    }
    yPos += 5;
    
    // Esigenze alimentari passeggeri
    passeggeri.forEach((passeggero, index) => {
      addLine(`ESIGENZE ALIMENTARI PASSEGGERO ${index + 1}:`, '', 10);
      addCheckbox('SI', passeggero.esigenzeAlimentari);
      addCheckbox('NO', !passeggero.esigenzeAlimentari);
      if (passeggero.esigenzeAlimentari) {
        addLine(`Intolleranze/Allergie: ${passeggero.intolleranze}`, '', 10);
      }
      yPos += 5;
    });
    
    checkNewPage();
    
    // DICHIARAZIONI (resto del codice PDF...)
    const dichiarazioni = [
      "1) d'aver preso visione della brochure relativa all'evento e di accettarne incondizionatamente il programma e le finalità;",
      "2) di voler partecipare esclusivamente a scopo turistico, senza alcun fine di gara o competizione;",
      "3) di utilizzare un mezzo di proprietà del quale si conferma piena efficienza;",
      "4) che il suddetto mezzo è in regola con pagamento bollo, RC Auto, revisione;",
      "5) di ESONERARE gli organizzatori da ogni responsabilità civile nei limiti di legge;"
    ];
    
    addLine('DICHIARA/DICHIARANO', '', 12);
    yPos += 5;
    
    doc.setFontSize(9);
    dichiarazioni.forEach(dichiarazione => {
      checkNewPage();
      const splitText = doc.splitTextToSize(dichiarazione, pageWidth - 2 * margin);
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * lineHeight + 3;
    });
    
    // Salva il PDF
    doc.save(`iscrizione_${selectedEvent?.titolo || 'evento'}_${formData.guidatoreNome}_${formData.guidatoreCognome}.pdf`);
    
    // Chiudi il form dopo la generazione
    setShowForm(false);
    setSelectedEvent(null);
    // Reset form
    setFormData({
      guidatoreCognome: '', guidatoreNome: '', guidatoreCodiceFiscale: '', guidatorePatente: '',
      guidatoreScadenzaPatente: '', guidatoreCellulare: '', guidatoreEmail: '', guidatoreDocumento: null,
      autoModello: '', autoAnno: '', autoColore: '', autoTarga: '', quotaSelezionata: 'QUOTA 1',
      guidatoreEsigenzeAlimentari: false, guidatoreIntolleranze: '', guidatoreAutorizzaFoto: true,
      guidatoreAutorizzaTrattamento: true, luogo: '', data: new Date().toLocaleDateString('it-IT')
    });
    setPasseggeri([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-black">
      {/* HEADER MIGLIORATO */}
      <header className="bg-white shadow-lg border-b-2 border-black">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src="/logo.png"
                  alt="MotorEvents Pro Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-black">MotorEvents Pro</h1>
                <p className="text-gray-600 text-sm md:text-base">Passione su quattro ruote</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-8 text-lg font-medium">
              <a href="#chi-siamo" className="text-black hover:text-gray-700 transition-colors relative group">
                Chi Siamo
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#prossimi-eventi" className="text-black hover:text-gray-700 transition-colors relative group">
                Prossimi Eventi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#galleria-eventi" className="text-black hover:text-gray-700 transition-colors relative group">
                Galleria Eventi
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#galleria-foto" className="text-black hover:text-gray-700 transition-colors relative group">
                Galleria Foto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </nav>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-full h-0.5 bg-black mb-1"></span>
                <span className="w-full h-0.5 bg-black mb-1"></span>
                <span className="w-full h-0.5 bg-black"></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-4 py-20 bg-gradient-to-b from-black to-gray-900 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Vivi la Passione</h1>
        <p className="text-gray-300 max-w-3xl mx-auto mb-8 text-lg md:text-xl">
          Raduni esclusivi per auto e moto d'epoca. Unisciti alla nostra community di appassionati e scopri eventi unici in tutta Italia.
        </p>
        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold relative group overflow-hidden">
          <span className="relative z-10">Scopri i Prossimi Eventi</span>
          <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
        </Button>
      </section>

      {/* PROSSIMI EVENTI */}
      <section id="prossimi-eventi" className="px-6 py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">Prossimi Eventi</h2>
          <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Scopri i nostri eventi esclusivi e iscriviti per vivere esperienze indimenticabili
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {eventi.map((evento) => (
              <div
                key={evento.id}
                className="bg-gray-50 border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col hover:border-black"
              >
                <div className="text-xs font-bold bg-black text-white px-3 py-1 rounded-full w-fit mb-4">
                  {evento.tipo}
                </div>
                <h3 className="text-xl font-bold mb-3 text-black">{evento.titolo}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{evento.descrizione}</p>
                <div className="flex flex-col gap-3 text-sm text-gray-700 mb-6">
                  <p className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-4 h-4 text-black" /> {evento.data}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-black" /> {evento.luogo}
                  </p>
                  <p className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-black" /> {evento.posti} posti disponibili
                  </p>
                </div>
                <Button 
                  onClick={() => handleIscriviti(evento)}
                  className="mt-auto bg-black text-white hover:bg-gray-800 py-3 font-semibold relative group overflow-hidden"
                >
                  <span className="relative z-10">Iscriviti Ora</span>
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHI SIAMO */}
      <section id="chi-siamo" className="px-6 py-20 bg-black text-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Chi Siamo</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">La Nostra Passione</h3>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                MotorEvents Pro nasce dalla passione per le auto e moto d'epoca. Organizziamo eventi esclusivi 
                per appassionati che vogliono condividere la loro passione per i motori in un ambiente sicuro e divertente.
              </p>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                I nostri eventi sono pensati per creare momenti indimenticabili, dove la bellezza delle macchine 
                si unisce alla scoperta di territori unici e alla condivisione di esperienze autentiche.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src="/img.jpg"
                    alt={`Chi Siamo ${i + 1}`}
                    width={300}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GALLERIA GENERALE */}
      <section id="galleria-foto" className="px-6 py-20 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Galleria Generale</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-200 hover:scale-105 transition-transform duration-300">
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
        </div>
      </section>

      {/* GALLERIA EVENTI PASSATI */}
      <section id="galleria-eventi" className="px-6 py-20 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">Galleria Eventi Passati</h2>
          <div className="space-y-16">
            {eventi.map((evento, idx) => (
              <div key={idx}>
                <h3 className="text-2xl font-semibold mb-6 text-black">{evento.titolo}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="aspect-square overflow-hidden rounded-xl bg-gray-200 hover:scale-105 transition-transform duration-300"
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
        </div>
      </section>

      {/* MODAL FORM ISCRIZIONE */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">
                Iscrizione - {selectedEvent?.titolo}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-black"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <form className="space-y-8">
                {/* DATI GUIDATORE */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Dati Guidatore</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="guidatoreCognome"
                      placeholder="Cognome *"
                      value={formData.guidatoreCognome}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="guidatoreNome"
                      placeholder="Nome *"
                      value={formData.guidatoreNome}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="guidatoreCodiceFiscale"
                      placeholder="Codice Fiscale *"
                      value={formData.guidatoreCodiceFiscale}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="guidatorePatente"
                      placeholder="Numero Patente *"
                      value={formData.guidatorePatente}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="date"
                      name="guidatoreScadenzaPatente"
                      value={formData.guidatoreScadenzaPatente}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="guidatoreCellulare"
                      placeholder="Cellulare *"
                      value={formData.guidatoreCellulare}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="email"
                      name="guidatoreEmail"
                      placeholder="Email *"
                      value={formData.guidatoreEmail}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none md:col-span-2"
                      required
                    />
                  </div>
                  
                  {/* Upload documento guidatore */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Documento di Identità Guidatore *
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, 'guidatore')}
                        className="hidden"
                        id="guidatore-doc"
                      />
                      <label
                        htmlFor="guidatore-doc"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                      >
                        <UploadIcon className="w-4 h-4" />
                        <span>{formData.guidatoreDocumento ? formData.guidatoreDocumento.name : 'Carica Documento'}</span>
                      </label>
                      {formData.guidatoreDocumento && (
                        <span className="text-sm text-gray-600">{formData.guidatoreDocumento.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* DATI PASSEGGERI */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Dati Passeggeri</h3>
                  {passeggeri.map((passeggero, index) => (
                    <div key={index} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-black">Passeggero {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => rimuoviPasseggero(index)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Cognome *"
                          value={passeggero.cognome}
                          onChange={(e) => handlePasseggeroChange(index, 'cognome', e.target.value)}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Nome *"
                          value={passeggero.nome}
                          onChange={(e) => handlePasseggeroChange(index, 'nome', e.target.value)}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Codice Fiscale *"
                          value={passeggero.codiceFiscale}
                          onChange={(e) => handlePasseggeroChange(index, 'codiceFiscale', e.target.value)}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Cellulare *"
                          value={passeggero.cellulare}
                          onChange={(e) => handlePasseggeroChange(index, 'cellulare', e.target.value)}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email *"
                          value={passeggero.email}
                          onChange={(e) => handlePasseggeroChange(index, 'email', e.target.value)}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none md:col-span-2"
                          required
                        />
                      </div>
                      {/* Upload documento passeggero */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Documento di Identità Passeggero *
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, 'passeggero', index)}
                            className="hidden"
                            id={`passeggero-doc-${index}`}
                          />
                          <label
                            htmlFor={`passeggero-doc-${index}`}
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors"
                          >
                            <UploadIcon className="w-4 h-4" />
                            <span>{passeggero.documento ? passeggero.documento.name : 'Carica Documento'}</span>
                          </label>
                          {passeggero.documento && (
                            <span className="text-sm text-gray-600">{passeggero.documento.name}</span>
                          )}
                        </div>
                      </div>
                      {/* Esigenze alimentari passeggero */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Esigenze Alimentari Passeggero:
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passeggero.esigenzeAlimentari}
                              onChange={(e) => handlePasseggeroChange(index, 'esigenzeAlimentari', e.target.checked)}
                              className="mr-2"
                            />
                            SI
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={!passeggero.esigenzeAlimentari}
                              onChange={(e) => handlePasseggeroChange(index, 'esigenzeAlimentari', !e.target.checked)}
                              className="mr-2"
                            />
                            NO
                          </label>
                        </div>
                        {passeggero.esigenzeAlimentari && (
                          <input
                            type="text"
                            placeholder="Intolleranze/Allergie"
                            value={passeggero.intolleranze}
                            onChange={(e) => handlePasseggeroChange(index, 'intolleranze', e.target.value)}
                            className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none mt-2 w-full"
                          />
                        )}
                      </div>
                      {/* Autorizzazioni passeggero */}
                      <div className="mt-4 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="autorizzaFoto"
                            checked={passeggero.autorizzaFoto}
                            onChange={(e) => handlePasseggeroChange(index, 'autorizzaFoto', e.target.checked)}
                            className="mr-2"
                          />
                          Autorizzo la pubblicazione di foto/video in cui sono presente
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="autorizzaTrattamento"
                            checked={passeggero.autorizzaTrattamento}
                            onChange={(e) => handlePasseggeroChange(index, 'autorizzaTrattamento', e.target.checked)}
                            className="mr-2"
                            required
                          />
                          Autorizzo il trattamento dei dati personali (GDPR) *
                        </label>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={aggiungiPasseggero}
                    className="mt-4 bg-gray-200 text-black hover:bg-gray-300 py-2 px-4 rounded-lg flex items-center gap-2"
                  >
                    <PlusIcon className="w-4 h-4" /> Aggiungi Passeggero
                  </Button>
                </div>

                {/* DATI AUTO */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Dati Autovettura</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="autoModello"
                      placeholder="Modello Auto *"
                      value={formData.autoModello}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="number"
                      name="autoAnno"
                      placeholder="Anno Immatricolazione *"
                      value={formData.autoAnno}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="autoColore"
                      placeholder="Colore *"
                      value={formData.autoColore}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      name="autoTarga"
                      placeholder="Targa *"
                      value={formData.autoTarga}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* PACCHETTO */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Pacchetto di Partecipazione</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['QUOTA 1', 'QUOTA 2', 'QUOTA 3', 'QUOTA 4', 'QUOTA 5', 'QUOTA 6'].map(quota => (
                      <label key={quota} className="flex items-center bg-white p-3 rounded-lg shadow-sm">
                        <input
                          type="radio"
                          name="quotaSelezionata"
                          value={quota}
                          checked={formData.quotaSelezionata === quota}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        {quota}
                      </label>
                    ))}
                  </div>
                </div>

                {/* ESIGENZE ALIMENTARI GUIDATORE */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Esigenze Alimentari Guidatore</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="guidatoreEsigenzeAlimentari"
                        checked={formData.guidatoreEsigenzeAlimentari}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      SI
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="guidatoreEsigenzeAlimentari"
                        checked={!formData.guidatoreEsigenzeAlimentari}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      NO
                    </label>
                  </div>
                  {formData.guidatoreEsigenzeAlimentari && (
                    <input
                      type="text"
                      name="guidatoreIntolleranze"
                      placeholder="Intolleranze/Allergie"
                      value={formData.guidatoreIntolleranze}
                      onChange={handleInputChange}
                      className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                    />
                  )}
                </div>

                {/* AUTORIZZAZIONI GUIDATORE */}
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-4 text-black">Autorizzazioni Guidatore</h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="guidatoreAutorizzaFoto"
                        checked={formData.guidatoreAutorizzaFoto}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Autorizzo la pubblicazione di foto/video in cui sono presente
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="guidatoreAutorizzaTrattamento"
                        checked={formData.guidatoreAutorizzaTrattamento}
                        onChange={handleInputChange}
                        className="mr-2"
                        required
                      />
                      Autorizzo il trattamento dei dati personali (GDPR) *
                    </label>
                  </div>
                </div>

                {/* BOTTONE GENERAZIONE PDF */}
                <Button
                  type="button"
                  onClick={generatePDF}
                  className="w-full bg-black text-white hover:bg-gray-800 py-3 font-semibold text-lg"
                >
                  Genera Modulo di Iscrizione
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

