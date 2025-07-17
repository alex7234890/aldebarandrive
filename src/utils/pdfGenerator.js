// /utils/pdfGenerator.js

import jsPDF from "jspdf";

export const generatePDF = (formData, passeggeri, selectedEvent) => {
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

  // --- INIZIO COSTRUZIONE PDF ---

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
    checkNewPage();
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
  checkNewPage();
  addLine('DATI AUTOVETTURA UTILIZZATA PER L\'EVENTO', '', 12);
  yPos += 5;
  addLine(`Modello: ${formData.autoModello}`, '', 10);
  addLine(`Anno immatricolazione: ${formData.autoAnno}`, '', 10);
  addLine(`Colore: ${formData.autoColore}`, '', 10);
  addLine(`Targa: ${formData.autoTarga}`, '', 10);
  yPos += 10;

  // RICHIESTA PARTECIPAZIONE
  checkNewPage();
  addLine('CHIEDE/CHIEDONO', '', 12);
  yPos += 5;
  doc.setFontSize(10);
  const richiesta = 'di poter partecipare all\'evento in epigrafe a proprio rischio e pericolo, senza esclusiva, con l\'autovettura sopra identificata, coperta da assicurazione RCA in corso di validità.';
  const splitRichiesta = doc.splitTextToSize(richiesta, pageWidth - 2 * margin);
  doc.text(splitRichiesta, margin, yPos);
  yPos += splitRichiesta.length * lineHeight + 10;

  // PACCHETTO
  checkNewPage();
  addLine('PACCHETTO/SOLUZIONE DI PARTECIPAZIONE', '', 12);
  yPos += 5;
  const quote = ['QUOTA 1', 'QUOTA 2', 'QUOTA 3', 'QUOTA 4', 'QUOTA 5', 'QUOTA 6'];
  quote.forEach(quota => {
    addCheckbox(quota, formData.quotaSelezionata === quota);
  });
  yPos += 10;

  // ESIGENZE ALIMENTARI
  checkNewPage();
  addLine('ESIGENZE ALIMENTARI GUIDATORE:', '', 10);
  addCheckbox('SI', formData.guidatoreEsigenzeAlimentari);
  addCheckbox('NO', !formData.guidatoreEsigenzeAlimentari);
  if (formData.guidatoreEsigenzeAlimentari) {
    addLine(`Intolleranze/Allergie: ${formData.guidatoreIntolleranze}`, '', 10);
  }
  yPos += 5;

  passeggeri.forEach((passeggero, index) => {
    checkNewPage();
    addLine(`ESIGENZE ALIMENTARI PASSEGGERO ${index + 1}:`, '', 10);
    addCheckbox('SI', passeggero.esigenzeAlimentari);
    addCheckbox('NO', !passeggero.esigenzeAlimentari);
    if (passeggero.esigenzeAlimentari) {
      addLine(`Intolleranze/Allergie: ${passeggero.intolleranze}`, '', 10);
    }
    yPos += 5;
  });

  // DICHIARAZIONI
  checkNewPage();
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
};
