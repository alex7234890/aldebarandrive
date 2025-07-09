'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";
import React from "react";
import jsPDF from "jspdf";
import { useState } from 'react';

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
  
   const [formData, setFormData] = useState({
    // Dati guidatore
    guidatoreCognome: '',
    guidatoreNome: '',
    guidatoreCodiceFiscale: '',
    guidatorePatente: '',
    guidatoreScadenzaPatente: '',
    guidatoreCellulare: '',
    guidatoreEmail: '',
    
    // Dati passeggero
    passeggieroCognome: '',
    passeggeroNome: '',
    passeggeroCodiceFiscale: '',
    passeggieroCellulare: '',
    passeggeroEmail: '',
    
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
    passeggeroEsigenzeAlimentari: false,
    passeggeroIntolleranze: '',
    
    // Autorizzazioni
    guidatoreAutorizzaFoto: true,
    passeggeroAutorizzaFoto: true,
    guidatoreAutorizzaTrattamento: true,
    passeggeroAutorizzaTrattamento: true,
    
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
    addCenteredText('EVENTO: "SUPERCAR FOR PASSION"', 12, true);
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
    yPos += 10;
    
    // DATI PASSEGGERO
    addLine('DATI ANAGRAFICI DEL PASSEGGERO', '', 12);
    yPos += 5;
    addLine(`Cognome: ${formData.passeggieroCognome}`, '', 10);
    addLine(`Nome: ${formData.passeggeroNome}`, '', 10);
    addLine(`Codice Fiscale: ${formData.passeggeroCodiceFiscale}`, '', 10);
    addLine(`Cellulare: ${formData.passeggieroCellulare}`, '', 10);
    addLine(`e-mail: ${formData.passeggeroEmail}`, '', 10);
    yPos += 10;
    
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
    
    addLine('ESIGENZE ALIMENTARI PASSEGGERO:', '', 10);
    addCheckbox('SI', formData.passeggeroEsigenzeAlimentari);
    addCheckbox('NO', !formData.passeggeroEsigenzeAlimentari);
    if (formData.passeggeroEsigenzeAlimentari) {
      addLine(`Intolleranze/Allergie: ${formData.passeggeroIntolleranze}`, '', 10);
    }
    yPos += 10;
    
    checkNewPage();
    
    // DICHIARAZIONI
    addLine('DICHIARA/DICHIARANO', '', 12);
    yPos += 5;
    
    const dichiarazioni = [
      "1) d'aver preso visione della brochure relativa all'evento e di accettarne incondizionatamente il programma e le finalità;",
      "2) di voler partecipare esclusivamente a scopo turistico, senza alcun fine di gara o competizione, di essere a conoscenza che è assolutamente proibito gareggiare e che lo spirito della giornata è quello di far sì che i partecipanti possano trascorrere una o più giornate in compagnia, effettuando un giro turistico in macchina, nel pieno rispetto del vigente Codice della Strada;",
      "3) di utilizzare un mezzo di proprietà (od esserne autorizzato all'uso dal legittimo proprietario che, pertanto, non potrà vantare alcun diritto) del quale si conferma piena efficienza, affidabilità e conformità al Codice della Strada;",
      "4) che il suddetto mezzo guidato durante l'evento è in regola con pagamento bollo, RC Auto, revisione e tutto quanto è necessario per la circolazione;",
      "5) di ESONERARE, NEI LIMITI DI LEGGE, GLI ORGANIZZATORI E LA DITTA MARLAN S.R.L. da ogni responsabilità civile per danni a persone o cose che dovessero derivare dalla partecipazione all'evento, esclusivamente nei casi di colpa lieve, restando espressamente escluso ogni esonero per i danni causati da dolo, colpa grave o da violazione di norme di ordine pubblico e di sicurezza.",
      "6) di ASSUMERSI OGNI RESPONSABILITÀ VERSO TERZI E DI MANTENERE COPERTURA RCA OBBLIGATORIA per danni eventualmente arrecati a terzi, inclusi altri partecipanti, mezzi e passeggeri, durante l'evento.",
      "7) di SOLLEVARE ED ESONERARE GLI ORGANIZZATORI (ALDEBARANDRIVE – MARLAN S.R.L.) da responsabilità per eventuali perdite, sottrazioni, danni, furti e/o danneggiamenti, e relative spese, subiti durante l'evento, salvo che tali eventi derivino da dolo, colpa grave degli organizzatori o da violazione di norme imperative;",
      "8) di trovarsi in perfetta salute fisica e psichica;",
      "9) di PRENDERE ATTO CHE L'ISCRIZIONE È ACCETTATA SOLO IN PRESENZA DI ESONERO NEI LIMITI DI LEGGE e che, in difetto, non sarebbe stata accettata l'iscrizione.",
      "10) d'essere consapevole che l'abuso di bevande alcoliche compromette la propria sicurezza e quella delle altre persone;",
      "11) di essere a conoscenza che gli Organizzatori, presenti all'evento, potranno arbitrariamente decidere, per motivi di sicurezza o per comportamenti che ledono il decoro e il buon nome ALDEBARANDRIVE – MARLAN S.R.L., l'allontanamento insindacabile dal gruppo;",
      "12) che la quota di iscrizione versata a favore dell'Organizzazione non sarà restituibile, neppure parzialmente;",
      "13) di essere a conoscenza che gli Organizzatori potranno, nel caso lo ritenessero opportuno, intraprendere le adeguate azioni legali a tutela degli stessi e di terzi;",
      "14) di impegnarsi, per tutta la durata dell'evento, a rispettare scrupolosamente il vigente Codice della Strada e tutte le ulteriori norme di sicurezza applicabili, mantenendo sempre una condotta prudente e diligente."
    ];
    
    doc.setFontSize(9);
    dichiarazioni.forEach(dichiarazione => {
      checkNewPage();
      const splitText = doc.splitTextToSize(dichiarazione, pageWidth - 2 * margin);
      doc.text(splitText, margin, yPos);
      yPos += splitText.length * lineHeight + 3;
    });
    
    checkNewPage();
    
    // FIRME
    yPos += 10;
    addLine(`IL GUIDATORE: ${formData.guidatoreNome} ${formData.guidatoreCognome}`, '', 10);
    addLine(`Lì ${formData.luogo}, ${formData.data}`, '', 10);
    addLine('Firma: _______________________________', '', 10);
    yPos += 10;
    
    addLine(`IL PASSEGGERO: ${formData.passeggeroNome} ${formData.passeggieroCognome}`, '', 10);
    addLine(`Lì ${formData.luogo}, ${formData.data}`, '', 10);
    addLine('Firma: _______________________________', '', 10);
    yPos += 20;
    
    // AUTORIZZAZIONI FOTO
    checkNewPage();
    addLine('AUTORIZZA/AUTORIZZANO', '', 12);
    yPos += 5;
    
    const autorizzazioneFoto = 'a titolo gratuito, senza limiti di tempo, anche ai sensi degli artt. 10 e 320 cod. civ. e degli artt. 96 e 97 legge 22.4.1941, n. 633, Legge sul diritto d\'autore, l\'utilizzo delle foto o video ripresi durante le iniziative e gli eventi organizzati dall\'ALDEBARANDRIVE – MARLAN S.R.L.';
    const splitAutorizzazione = doc.splitTextToSize(autorizzazioneFoto, pageWidth - 2 * margin);
    doc.text(splitAutorizzazione, margin, yPos);
    yPos += splitAutorizzazione.length * lineHeight + 10;
    
    addLine(`IL GUIDATORE: ${formData.guidatoreNome} ${formData.guidatoreCognome}`, '', 10);
    addCheckbox('Acconsento', formData.guidatoreAutorizzaFoto);
    addCheckbox('Non acconsento', !formData.guidatoreAutorizzaFoto);
    yPos += 10;
    
    addLine(`IL PASSEGGERO: ${formData.passeggeroNome} ${formData.passeggieroCognome}`, '', 10);
    addCheckbox('Acconsento', formData.passeggeroAutorizzaFoto);
    addCheckbox('Non acconsento', !formData.passeggeroAutorizzaFoto);
    yPos += 20;
    
    // AUTORIZZAZIONI TRATTAMENTO DATI
    checkNewPage();
    const trattamentoDati = 'Ai sensi dell\'art. 13 del d.lg.196/2003 La informiamo che i dati personali che La riguardano verranno trattati secondo principi di correttezza, liceità e trasparenza, e di tutela della Sua riservatezza e dei Suoi diritti, al fine di garantire il corretto uso della card e a fini statistici interni. Il titolare del trattamento è l\'ALDEBARANDRIVE – MARLAN S.R.L.';
    const splitTrattamento = doc.splitTextToSize(trattamentoDati, pageWidth - 2 * margin);
    doc.text(splitTrattamento, margin, yPos);
    yPos += splitTrattamento.length * lineHeight + 10;
    
    addLine(`IL GUIDATORE: ${formData.guidatoreNome} ${formData.guidatoreCognome}`, '', 10);
    addCheckbox('Acconsento', formData.guidatoreAutorizzaTrattamento);
    addCheckbox('Non acconsento', !formData.guidatoreAutorizzaTrattamento);
    yPos += 10;
    
    addLine(`IL PASSEGGERO: ${formData.passeggeroNome} ${formData.passeggieroCognome}`, '', 10);
    addCheckbox('Acconsento', formData.passeggeroAutorizzaTrattamento);
    addCheckbox('Non acconsento', !formData.passeggeroAutorizzaTrattamento);
    
    // Salva il PDF
    doc.save('modulo_iscrizione_supercar_for_passion.pdf');
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
       <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Modulo Iscrizione - Supercar for Passion
      </h1>
      
      <form className="space-y-6">
        {/* DATI GUIDATORE */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dati Guidatore</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="guidatoreCognome"
              placeholder="Cognome"
              value={formData.guidatoreCognome}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="guidatoreNome"
              placeholder="Nome"
              value={formData.guidatoreNome}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="guidatoreCodiceFiscale"
              placeholder="Codice Fiscale"
              value={formData.guidatoreCodiceFiscale}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="guidatorePatente"
              placeholder="Numero Patente"
              value={formData.guidatorePatente}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="guidatoreScadenzaPatente"
              placeholder="Scadenza Patente"
              value={formData.guidatoreScadenzaPatente}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="guidatoreCellulare"
              placeholder="Cellulare"
              value={formData.guidatoreCellulare}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="guidatoreEmail"
              placeholder="Email"
              value={formData.guidatoreEmail}
              onChange={handleInputChange}
              className="border p-2 rounded col-span-2"
            />
          </div>
        </div>

        {/* DATI PASSEGGERO */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dati Passeggero</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="passeggieroCognome"
              placeholder="Cognome"
              value={formData.passeggieroCognome}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="passeggeroNome"
              placeholder="Nome"
              value={formData.passeggeroNome}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="passeggeroCodiceFiscale"
              placeholder="Codice Fiscale"
              value={formData.passeggeroCodiceFiscale}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="passeggieroCellulare"
              placeholder="Cellulare"
              value={formData.passeggieroCellulare}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="passeggeroEmail"
              placeholder="Email"
              value={formData.passeggeroEmail}
              onChange={handleInputChange}
              className="border p-2 rounded col-span-2"
            />
          </div>
        </div>

        {/* DATI AUTO */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Dati Autovettura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="autoModello"
              placeholder="Modello"
              value={formData.autoModello}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="autoAnno"
              placeholder="Anno Immatricolazione"
              value={formData.autoAnno}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="autoColore"
              placeholder="Colore"
              value={formData.autoColore}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="autoTarga"
              placeholder="Targa"
              value={formData.autoTarga}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* PACCHETTO */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pacchetto Partecipazione</h2>
          <select
            name="quotaSelezionata"
            value={formData.quotaSelezionata}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
          >
            <option value="QUOTA 1">QUOTA 1</option>
            <option value="QUOTA 2">QUOTA 2</option>
            <option value="QUOTA 3">QUOTA 3</option>
            <option value="QUOTA 4">QUOTA 4</option>
            <option value="QUOTA 5">QUOTA 5</option>
            <option value="QUOTA 6">QUOTA 6</option>
          </select>
        </div>

        {/* ESIGENZE ALIMENTARI */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Esigenze Alimentari</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="guidatoreEsigenzeAlimentari"
                  checked={formData.guidatoreEsigenzeAlimentari}
                  onChange={handleInputChange}
                />
                <span>Guidatore ha esigenze alimentari</span>
              </label>
              {formData.guidatoreEsigenzeAlimentari && (
                <input
                  type="text"
                  name="guidatoreIntolleranze"
                  placeholder="Intolleranze/Allergie Guidatore"
                  value={formData.guidatoreIntolleranze}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mt-2"
                />
              )}
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passeggeroEsigenzeAlimentari"
                  checked={formData.passeggeroEsigenzeAlimentari}
                  onChange={handleInputChange}
                />
                <span>Passeggero ha esigenze alimentari</span>
              </label>
              {formData.passeggeroEsigenzeAlimentari && (
                <input
                  type="text"
                  name="passeggeroIntolleranze"
                  placeholder="Intolleranze/Allergie Passeggero"
                  value={formData.passeggeroIntolleranze}
                  onChange={handleInputChange}
                  className="border p-2 rounded w-full mt-2"
                />
              )}
            </div>
          </div>
        </div>

        {/* AUTORIZZAZIONI */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Autorizzazioni</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Autorizzazione Foto/Video</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="guidatoreAutorizzaFoto"
                  checked={formData.guidatoreAutorizzaFoto}
                  onChange={handleInputChange}
                />
                <span>Guidatore autorizza foto/video</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passeggeroAutorizzaFoto"
                  checked={formData.passeggeroAutorizzaFoto}
                  onChange={handleInputChange}
                />
                <span>Passeggero autorizza foto/video</span>
              </label>
            </div>
            <div>
              <h3 className="font-medium mb-2">Trattamento Dati Personali</h3>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="guidatoreAutorizzaTrattamento"
                  checked={formData.guidatoreAutorizzaTrattamento}
                  onChange={handleInputChange}
                />
                <span>Guidatore autorizza trattamento dati</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="passeggeroAutorizzaTrattamento"
                  checked={formData.passeggeroAutorizzaTrattamento}
                  onChange={handleInputChange}
                />
                <span>Passeggero autorizza trattamento dati</span>
              </label>
            </div>
          </div>
        </div>

        {/* LUOGO E DATA */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Luogo e Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="luogo"
              placeholder="Luogo"
              value={formData.luogo}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* PULSANTE GENERA PDF */}
        <div className="text-center">
          <button
            type="button"
            onClick={generatePDF}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Genera PDF
          </button>
        </div>
      </form>
    </div>

    </main>
  );
}
