"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  PlusIcon,
  UploadIcon,
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
  MailIcon,
  CheckIcon,
  LogOutIcon,
  TrashIcon,
  EditIcon,
  DownloadIcon,
  EyeIcon,
  XIcon,
  ExternalLinkIcon,
  CarIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ImageIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  SendIcon,
  SparklesIcon,
  TrendingUpIcon,
  ActivityIcon,
} from "lucide-react"
import jsPDF from "jspdf"
import { supabase } from "@/lib/supabaseClient"

// Helper per mostrare notifiche all'utente
const showNotification = (message, type = "error") => {
  alert(`${type.toUpperCase()}: ${message}`)
}

// Modal per nuovo/modifica evento
const EventFormModal = ({
  isEditMode,
  newEvent,
  setNewEvent,
  handleNewEventChange,
  addQuota,
  removeQuota,
  updateQuota,
  handleCreateEvent,
  handleUpdateEvent,
  onClose,
}) => {
  // Client-side validation for event form
  const validateEventForm = () => {
    if (!newEvent.titolo || newEvent.titolo.trim() === "") {
      showNotification("Il titolo dell'evento è obbligatorio.", "warning")
      return false
    }
    if (!newEvent.descrizione || newEvent.descrizione.trim() === "") {
      showNotification("La descrizione dell'evento è obbligatoria.", "warning")
      return false
    }
    if (!newEvent.data) {
      showNotification("La data dell'evento è obbligatoria.", "warning")
      return false
    }
    if (!newEvent.orario) {
      showNotification("L'orario dell'evento è obbligatorio.", "warning")
      return false
    }
    if (!newEvent.luogo || newEvent.luogo.trim() === "") {
      showNotification("Il luogo dell'evento è obbligatorio.", "warning")
      return false
    }
    // Ensure participants and auto numbers are positive integers
    const partecipantiNum = Number(newEvent.partecipanti);
    if (isNaN(partecipantiNum) || !Number.isInteger(partecipantiNum) || partecipantiNum <= 0) {
      showNotification("Il numero massimo di partecipanti deve essere un numero intero positivo.", "warning")
      return false
    }
    const numeroautoNum = Number(newEvent.numeroauto);
    if (isNaN(numeroautoNum) || !Number.isInteger(numeroautoNum) || numeroautoNum <= 0) {
      showNotification("Il numero massimo di auto deve essere un numero intero positivo.", "warning")
      return false
    }

    // Validate quotas
    for (const quota of newEvent.quote) {
      const isQuotaEmpty = !quota.titolo.trim() && !quota.descrizione.trim() && (quota.prezzo === "" || isNaN(Number(quota.prezzo)));

      // If it's not entirely empty, it must be fully filled and valid
      if (!isQuotaEmpty) {
        if (!quota.titolo.trim()) {
          showNotification("Il titolo della quota è obbligatorio se la quota non è vuota.", "warning");
          return false;
        }
        if (!quota.descrizione.trim()) {
          showNotification("La descrizione della quota è obbligatoria se la quota non è vuota.", "warning");
          return false;
        }
        const prezzoNum = Number(quota.prezzo);
        if (quota.prezzo === "" || isNaN(prezzoNum) || prezzoNum < 0) {
          showNotification("Il prezzo della quota deve essere un numero non negativo.", "warning");
          return false;
        }
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateEventForm()) {
      return // Stop submission if validation fails
    }
    if (isEditMode) {
      await handleUpdateEvent(e)
    } else {
      await handleCreateEvent(e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
        <CardHeader className="bg-black text-white rounded-t-lg p-6 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">{isEditMode ? "Modifica Evento" : "Crea Nuovo Evento"}</CardTitle>
            <CardDescription className="text-gray-300 mt-1">
              {isEditMode ? "Aggiorna i dettagli dell'evento" : "Inserisci i dettagli per il nuovo evento"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white hover:bg-gray-800 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="titolo" className="text-base font-semibold text-black flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Titolo Evento
                </Label>
                <Input
                  id="titolo"
                  name="titolo"
                  value={newEvent.titolo}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                  placeholder="Inserisci il titolo dell'evento"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descrizione" className="text-base font-semibold text-black flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  Descrizione
                </Label>
                <Textarea
                  id="descrizione"
                  name="descrizione"
                  value={newEvent.descrizione}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 min-h-[120px] transition-colors"
                  placeholder="Descrivi l'evento in dettaglio"
                />
              </div>

              <div>
                <Label htmlFor="data" className="text-base font-semibold text-black flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data
                </Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={newEvent.data}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                />
              </div>

              <div>
                <Label htmlFor="orario" className="text-base font-semibold text-black flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  Orario
                </Label>
                <Input
                  id="orario"
                  name="orario"
                  type="time"
                  value={newEvent.orario}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="luogo" className="text-base font-semibold text-black flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Luogo
                </Label>
                <Input
                  id="luogo"
                  name="luogo"
                  value={newEvent.luogo}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                  placeholder="Dove si svolgerà l'evento"
                />
              </div>

              <div>
                <Label htmlFor="partecipanti" className="text-base font-semibold text-black flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  Max Partecipanti
                </Label>
                <Input
                  id="partecipanti"
                  name="partecipanti"
                  type="number"
                  value={newEvent.partecipanti}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="numeroauto" className="text-base font-semibold text-black flex items-center gap-2">
                  <CarIcon className="w-4 h-4" />
                  Max Auto
                </Label>
                <Input
                  id="numeroauto"
                  name="numeroauto"
                  type="number"
                  value={newEvent.numeroauto}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 transition-colors"
                  min="1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="programma" className="text-base font-semibold text-black flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  Programma (opzionale)
                </Label>
                <Textarea
                  id="programma"
                  name="programma"
                  value={newEvent.programma || ""}
                  onChange={handleNewEventChange}
                  className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 mt-2 min-h-[100px] transition-colors"
                  placeholder="Descrivi il programma dell'evento"
                />
              </div>
            </div>

            {/* Gestione Quote */}
            <div className="space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <Label className="text-lg font-bold text-black flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5" />
                Quote di Partecipazione
              </Label>
              <div className="space-y-3">
                {newEvent.quote.map((quota, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white rounded-lg border border-gray-300 shadow-sm"
                  >
                    <div className="flex-1 w-full sm:w-auto">
                      <Input
                        placeholder="Titolo quota (es. Base, Premium)"
                        value={quota.titolo}
                        onChange={(e) => updateQuota(index, "titolo", e.target.value)}
                        className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg transition-colors mb-2 sm:mb-0"
                      />
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <Input
                        placeholder="Descrizione"
                        value={quota.descrizione}
                        onChange={(e) => updateQuota(index, "descrizione", e.target.value)}
                        className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg transition-colors mb-2 sm:mb-0"
                      />
                    </div>
                    <div className="w-full sm:w-32">
                      <Input
                        placeholder="€ 0.00"
                        type="number"
                        step="0.01"
                        value={quota.prezzo}
                        onChange={(e) => updateQuota(index, "prezzo", e.target.value)}
                        className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg transition-colors mb-2 sm:mb-0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuota(index)}
                      className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addQuota}
                className="w-full text-base border-dashed border-gray-500 text-gray-700 hover:bg-gray-100 hover:border-gray-600 rounded-lg py-3 transition-colors bg-transparent"
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Aggiungi Quota
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-300">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className={`text-base font-semibold py-3 px-6 rounded-lg text-white shadow-lg transition-all duration-200 order-1 sm:order-2 ${
                  isEditMode ? "bg-gray-800 hover:bg-gray-900" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isEditMode ? "Aggiorna Evento" : "Crea Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Modal per l'upload di immagini
const ImageUploadModal = ({ uploadTarget, uploadFiles, handleImageUploadFiles, handleUploadImages, onClose }) => {
  const validateImageUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      showNotification("Seleziona almeno un file immagine da caricare.", "warning")
      return false
    }
    for (const file of uploadFiles) {
      if (!file.type.startsWith("image/")) {
        showNotification(`Il file '${file.name}' non è un'immagine valida.`, "warning")
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // Esempio: limite di 5MB per immagine
        showNotification(`Il file '${file.name}' supera la dimensione massima consentita (5MB).`, "warning")
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateImageUpload()) {
      return;
    }
    await handleUploadImages();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-lg animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
        <CardHeader className="bg-black text-white rounded-t-lg p-6 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Carica Immagini
            </CardTitle>
            <CardDescription className="text-gray-300 mt-1">
              Seleziona le immagini da caricare nella galleria
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white hover:bg-gray-800 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="image-upload" className="text-base font-semibold text-black flex items-center gap-2 mb-3">
                <UploadIcon className="w-4 h-4" />
                Seleziona File Immagine
              </Label>
              <Input
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageUploadFiles}
                accept="image/*"
                className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 transition-colors"
              />
            </div>

            {uploadFiles.length > 0 && (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-base font-semibold text-black mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  File selezionati ({uploadFiles.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-black bg-white px-3 py-2 rounded-lg border border-gray-300"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-300">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={uploadFiles.length === 0}
                className="text-base font-semibold bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                <UploadIcon className="mr-2 h-5 w-5" />
                Carica Immagini
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Modal per l'upload di fatture
const InvoiceUploadModal = ({ selectedRegistration, invoiceFile, setInvoiceFile, handleInvoiceUpload, onClose }) => {
  const validateInvoiceUpload = () => {
    if (!invoiceFile) {
      showNotification("Seleziona un file fattura da caricare.", "warning")
      return false
    }
    if (invoiceFile.type !== "application/pdf") {
      showNotification("Il file selezionato non è un PDF valido.", "warning")
      return false
    }
    if (invoiceFile.size > 10 * 1024 * 1024) { // Esempio: limite di 10MB per PDF
      showNotification("Il file fattura supera la dimensione massima consentita (10MB).", "warning")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInvoiceUpload()) {
      return;
    }
    await handleInvoiceUpload();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-lg animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
        <CardHeader className="bg-black text-white rounded-t-lg p-6 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileTextIcon className="w-6 h-6" />
              Carica Fattura
            </CardTitle>
            <CardDescription className="text-gray-300 mt-1">Carica e invia la fattura al guidatore</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white hover:bg-gray-800 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
              <p className="text-base font-semibold text-black mb-2 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Destinatario
              </p>
              <div className="space-y-1">
                <p className="text-lg font-bold text-black">
                  {selectedRegistration?.nome} {selectedRegistration?.cognome}
                </p>
                <p className="text-base text-gray-600 flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  {selectedRegistration?.indirizzo_email}
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="invoice-upload" className="text-base font-semibold text-black flex items-center gap-2 mb-3">
                <UploadIcon className="w-4 h-4" />
                Seleziona Fattura (PDF)
              </Label>
              <Input
                id="invoice-upload"
                type="file"
                onChange={(e) => setInvoiceFile(e.target.files[0])}
                accept=".pdf"
                className="text-base border-gray-400 focus:border-black focus:ring-black rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200 transition-colors"
              />
            </div>

            {invoiceFile && (
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-base font-semibold text-black mb-2 flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  File selezionato
                </p>
                <div className="flex items-center gap-2 text-sm text-black bg-white px-3 py-2 rounded-lg border border-gray-300">
                  <FileTextIcon className="w-4 h-4" />
                  {invoiceFile.name}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-300">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={!invoiceFile}
                className="text-base font-semibold bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                <SendIcon className="mr-2 h-5 w-5" />
                Carica e Invia Email
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Modal per visualizzare le iscrizioni
const RegistrationsModal = ({
  selectedEventForRegistrations,
  registrations,
  loadingRegistrations,
  handleGenerateIndividualPdf,
  handleOpenInvoiceUpload,
  openDocumentInModal,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-black text-white rounded-t-lg p-6">
        <div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Iscrizioni per: {selectedEventForRegistrations?.titolo}
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2 text-base sm:text-lg">
            Gestisci le iscrizioni e genera documenti
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <XIcon className="h-6 w-6 sm:h-7 sm:w-7" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {loadingRegistrations ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p className="text-xl text-gray-500">Caricamento iscrizioni...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <div className="text-2xl text-gray-500">Nessuna iscrizione trovata per questo evento</div>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg, index) => (
              <Card key={reg.id} className="shadow-lg border border-gray-300 bg-white rounded-lg overflow-hidden">
                <div className="border-l-4 border-black">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-black flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        {reg.nome} {reg.cognome}
                      </div>
                      <Badge variant="secondary" className="bg-gray-200 text-black px-3 py-1 self-start sm:ml-auto">
                        #{index + 1}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Informazioni Guidatore */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <MailIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold truncate">{reg.indirizzo_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <PhoneIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Telefono</p>
                          <p className="font-semibold">{reg.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <FileTextIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Codice Fiscale</p>
                          <p className="font-semibold text-xs sm:text-sm">{reg.codice_fiscale}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <CalendarIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Data Nascita</p>
                          <p className="font-semibold">{reg.data_nascita}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <TrendingUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Quota</p>
                          <Badge className="bg-black text-white">{reg.quota}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                        <AlertCircleIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-gray-500">Intolleranze</p>
                          <p className="font-semibold text-sm">{reg.intolleranze || "Nessuna"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                      <MapPinIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500">Indirizzo</p>
                        <p className="font-semibold text-sm">{reg.indirizzo}</p>
                      </div>
                    </div>

                    {/* Documenti Guidatore */}
                    <div className="flex flex-wrap gap-3">
                      {reg.documento_fronte && (
                        <Button
                          variant="outline"
                          onClick={() => openDocumentInModal(reg.documento_fronte, "pdf")}
                          className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-sm"
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" /> Documento Fronte
                        </Button>
                      )}
                      {reg.documento_retro && (
                        <Button
                          variant="outline"
                          onClick={() => openDocumentInModal(reg.documento_retro, "pdf")}
                          className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-sm"
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" /> Documento Retro
                        </Button>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Informazioni Auto (solo per guidatori) */}
                    {reg.auto_marca && (
                      <>
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <CarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                            Dettagli Auto
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <p className="text-sm text-gray-500">Marca</p>
                              <p className="font-semibold">{reg.auto_marca}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <p className="text-sm text-gray-500">Modello</p>
                              <p className="font-semibold">{reg.auto_modello}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <p className="text-sm text-gray-500">Targa</p>
                              <p className="font-semibold">{reg.auto_targa}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <p className="text-sm text-gray-500">Posti Auto</p>
                              <p className="font-semibold">{reg.posti_auto}</p>
                            </div>
                          </div>
                        </div>
                        <Separator className="my-4" />
                      </>
                    )}

                    {/* Passeggeri */}
                    {reg.passeggeri && reg.passeggeri.length > 0 && (
                      <>
                        <div>
                          <h4 className="text-lg sm:text-xl font-bold text-black mb-4 flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                            Passeggeri ({reg.passeggeri.length})
                          </h4>
                          <div className="space-y-4">
                            {reg.passeggeri.map((pass, pIndex) => (
                              <div key={pIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                  <h5 className="font-bold text-base sm:text-lg text-black">
                                    {pass.nome} {pass.cognome}
                                  </h5>
                                  <Badge variant="outline" className="bg-gray-200 self-start sm:self-auto">
                                    #{pIndex + 1}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">CF:</span>{" "}
                                    <span className="font-semibold break-all">{pass.codice_fiscale}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Data Nascita:</span>{" "}
                                    <span className="font-semibold">{pass.data_nascita}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Email:</span>{" "}
                                    <span className="font-semibold break-all">{pass.indirizzo_email}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Telefono:</span>{" "}
                                    <span className="font-semibold">{pass.telefono}</span>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <span className="text-gray-500">Intolleranze:</span>{" "}
                                    <span className="font-semibold">{pass.intolleranze || "Nessuna"}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {pass.documento_fronte && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-xs"
                                      onClick={() => openDocumentInModal(pass.documento_fronte, "pdf")}
                                    >
                                      <ExternalLinkIcon className="mr-1 h-3 w-3" /> Doc. Fronte
                                    </Button>
                                  )}
                                  {pass.docuemnto_retro && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-xs"
                                      onClick={() => openDocumentInModal(pass.docuemnto_retro, "pdf")}
                                    >
                                      <ExternalLinkIcon className="mr-1 h-3 w-3" /> Doc. Retro
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <Separator className="my-4" />
                      </>
                    )}

                    {/* Azioni */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleGenerateIndividualPdf(reg, selectedEventForRegistrations)}
                        className="bg-black hover:bg-gray-800 text-white shadow-lg transition-all duration-200 text-sm"
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" /> Esporta PDF
                      </Button>
                      <Button
                        onClick={() => handleOpenInvoiceUpload(reg)}
                        className="bg-gray-600 hover:bg-gray-700 text-white shadow-lg transition-all duration-200 text-sm"
                      >
                        <UploadIcon className="mr-2 h-4 w-4" /> Carica Fattura
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </div>
)

// Modal per visualizzare documenti
const DocumentViewerModal = ({ currentDocumentUrl, currentDocumentType, onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-5xl h-[90vh] flex flex-col animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-black text-white rounded-t-lg p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <FileTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          Visualizzatore Documenti
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-gray-800 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-0 bg-gray-50 rounded-b-lg">
        {currentDocumentUrl ? (
          <iframe
            src={currentDocumentUrl}
            title={currentDocumentType}
            className="w-full h-full border-0 rounded-b-lg"
            style={{ minHeight: "600px" }}
          />
        ) : (
          <div className="text-center py-16">
            <FileTextIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <div className="text-gray-600 text-xl">Nessun documento disponibile o URL non valido</div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
)

// Componente principale della Dashboard Amministratore
export default function AdminDashboard() {
  // Autenticazione e sessione
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (!session) {
          router.push("/admin/login")
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Errore durante il controllo sessione utente:", error.message)
        showNotification("Errore di autenticazione. Riprova o accedi nuovamente.", "error")
        router.push("/admin/login")
      }
    }

    checkUserSession()

    const {
      data: { subscription: authListenerSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login")
      }
    })

    return () => {
      if (authListenerSubscription) {
        authListenerSubscription.unsubscribe()
      }
    }
  }, [router])

  // STATI GLOBALI
  const [events, setEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [galleryImages, setGalleryImages] = useState([])
  const [eventGalleryImages, setEventGalleryImages] = useState({})
  const [activeTab, setActiveTab] = useState("overview")

  // STATI PER MODAL E FORM
  const [showNewEventForm, setShowNewEventForm] = useState(false)
  const [showEditEventForm, setShowEditEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const [newEvent, setNewEvent] = useState({
    titolo: "",
    descrizione: "",
    data: "",
    orario: "",
    luogo: "",
    partecipanti: "",
    numeroauto: "",
    programma: "",
    quote: [{ titolo: "", descrizione: "", prezzo: "" }],
  })

  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadTarget, setUploadTarget] = useState({ type: "general", eventId: null })
  const [uploadFiles, setUploadFiles] = useState([])

  const [registrations, setRegistrations] = useState([])
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null)
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)

  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState(null)
  const [currentDocumentType, setCurrentDocumentType] = useState("")

  // STATI PER FATTURE
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [invoiceFile, setInvoiceFile] = useState(null)

  // STATI DI CARICAMENTO
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingPastEvents, setLoadingPastEvents] = useState(true)
  const [loadingImages, setLoadingImages] = useState(true)
  const [loadingRegistrations, setLoadingRegistrations] = useState(true)

  // Verifica autenticazione amministratore
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin/login")
    }
  }, [router])

  // FUNZIONI DI FETCHING DATI
  const fetchEventsAndImages = useCallback(async () => {
    setLoadingEvents(true)
    setLoadingPastEvents(true)
    setLoadingImages(true)
    try {
      // Fetch eventi
      const { data: eventiData, error: eventiError } = await supabase
        .from("evento")
        .select("*")
        .order("data", { ascending: true })

      if (eventiError) {
        throw new Error(`Errore nel recupero eventi: ${eventiError.message}`)
      }

      const now = new Date()
      const futuri = []
      const passati = []
      eventiData.forEach((event) => {
        const eventDate = new Date(`${event.data}T${event.orario}`)
        if (event.passato || eventDate < now) {
          passati.push(event)
        } else {
          futuri.push(event)
        }
      })
      setEvents(futuri)
      setPastEvents(passati)

      // Fetch immagini galleria generale
      const { data: generalImagesData, error: generalImagesError } = await supabase.storage
        .from("doc")
        .list("galleria", { sortBy: { column: "name", order: "asc" } })

      if (generalImagesError) {
        console.warn("Errore nel recupero immagini galleria generale, procedo con le altre:", generalImagesError.message);
        setGalleryImages([]); // Set to empty array on error
      } else {
        const loadedGeneralImages = (
          await Promise.all(
            generalImagesData
              .filter((item) => item.name !== ".emptyFolderPlaceholder")
              .map(async (item) => {
                try {
                  const { data: signedUrlData, error: urlError } = await supabase.storage
                    .from("doc")
                    .createSignedUrl(`galleria/${item.name}`, 3600)
                  if (urlError) {
                    throw new Error(`Errore generazione URL firmato per galleria/${item.name}: ${urlError.message}`)
                  }
                  return { id: item.id, url: signedUrlData.signedUrl, alt: item.name, evento: "Generale", path: `galleria/${item.name}` }
                } catch (urlGenError) {
                  console.error(urlGenError.message);
                  return null;
                }
              })
          )
        ).filter(Boolean)
        setGalleryImages(loadedGeneralImages)
      }


      // Fetch immagini eventi passati
      const eventImagesMap = {}
      for (const event of passati) {
        try {
          const { data: imagesData, error: eventImagesError } = await supabase.storage
            .from("doc")
            .list(`eventi/${event.id}`, { sortBy: { column: "name", order: "asc" } })

          if (eventImagesError) {
            console.warn(`Errore nel recupero immagini per evento ${event.id}:`, eventImagesError.message)
            eventImagesMap[event.id] = []
          } else {
            eventImagesMap[event.id] = (
              await Promise.all(
                imagesData
                  .filter((item) => item.name !== ".emptyFolderPlaceholder")
                  .map(async (item) => {
                    try {
                      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                        .from("doc")
                        .createSignedUrl(`eventi/${event.id}/${item.name}`, 3600)
                      if (signedUrlError) {
                        throw new Error(`Errore generazione URL firmato per eventi/${event.id}/${item.name}: ${signedUrlError.message}`)
                      }
                      return { id: item.id, url: signedUrlData.signedUrl, alt: item.name, evento: event.titolo, path: `eventi/${event.id}/${item.name}` }
                    } catch (signedUrlGenError) {
                      console.error(signedUrlGenError.message);
                      return null;
                    }
                  })
              )
            ).filter(Boolean)
          }
        } catch (eventLoopError) {
          console.error(`Errore generico durante il fetching delle immagini per l'evento ${event.id}:`, eventLoopError.message);
          eventImagesMap[event.id] = [];
        }
      }
      setEventGalleryImages(eventImagesMap)

    } catch (error) {
      console.error("Errore nel caricamento eventi o immagini:", error)
      showNotification("Si è verificato un errore durante il caricamento di eventi o immagini: " + error.message, "error")
    } finally {
      setLoadingEvents(false)
      setLoadingPastEvents(false)
      setLoadingImages(false)
    }
  }, [])

  useEffect(() => {
    fetchEventsAndImages()
  }, [fetchEventsAndImages])

  // FUNZIONI DI GESTIONE AUTENTICAZIONE
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminLoginTime")
      router.push("/admin/login")
    } catch (error) {
      console.error("Errore durante il logout:", error.message)
      showNotification("Si è verificato un errore durante il logout. Riprova.", "error")
    }
  }

  // FUNZIONI DI GESTIONE EVENTI
  const handleNewEventChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({ ...prev, [name]: value }))
  }

  const addQuota = () => {
    setNewEvent((prev) => ({ ...prev, quote: [...prev.quote, { titolo: "", descrizione: "", prezzo: "" }] }))
  }

  const removeQuota = (index) => {
    setNewEvent((prev) => ({ ...prev, quote: prev.quote.filter((_, i) => i !== index) }))
  }

  const updateQuota = (index, field, value) => {
    setNewEvent((prev) => ({ ...prev, quote: prev.quote.map((quota, i) => (i === index ? { ...quota, [field]: value } : quota)) }))
  }

  const handleCreateEvent = async (e) => {
    // e.preventDefault() is already handled by EventFormModal's handleSubmit
    try {
      const quotesJson = {}
      // Filter out entirely empty quotas before sending to DB
      newEvent.quote.forEach((q, index) => {
        if (q.titolo.trim() && q.descrizione.trim() && q.prezzo !== "" && !isNaN(Number(q.prezzo))) {
          quotesJson[`quota${index + 1}`] = {
            titolo: q.titolo.trim(),
            descrizione: q.descrizione.trim(),
            prezzo: Number(q.prezzo),
          }
        }
      })

      const { data, error } = await supabase
        .from("evento")
        .insert({
          titolo: newEvent.titolo.trim(),
          descrizione: newEvent.descrizione.trim(),
          data: newEvent.data,
          orario: newEvent.orario,
          luogo: newEvent.luogo.trim(),
          partecipanti: Number.parseInt(newEvent.partecipanti),
          numeroauto: Number.parseInt(newEvent.numeroauto),
          passato: false,
          quote: quotesJson,
          programma: newEvent.programma.trim() || null,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      showNotification("Evento creato con successo!", "success")
      setShowNewEventForm(false)
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        orario: "",
        luogo: "",
        partecipanti: "",
        numeroauto: "",
        programma: "",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }],
      })
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error)
      showNotification("Errore nella creazione dell'evento: " + error.message, "error")
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    const quotesArray = event.quote ? Object.entries(event.quote).map(([key, value]) => ({
      titolo: value.titolo || "",
      descrizione: value.descrizione || "",
      prezzo: value.prezzo || "",
    })) : [{ titolo: "", descrizione: "", prezzo: "" }]
    setNewEvent({
      titolo: event.titolo,
      descrizione: event.descrizione,
      data: event.data,
      orario: event.orario,
      luogo: event.luogo,
      partecipanti: event.partecipanti,
      numeroauto: event.numeroauto,
      programma: event.programma || "",
      quote: quotesArray,
    })
    setShowEditEventForm(true)
  }

  const handleUpdateEvent = async (e) => {
    // e.preventDefault() is already handled by EventFormModal's handleSubmit
    if (!editingEvent) return

    try {
      const quotesJson = {}
      newEvent.quote.forEach((q, index) => {
        if (q.titolo.trim() && q.descrizione.trim() && q.prezzo !== "" && !isNaN(Number(q.prezzo))) {
          quotesJson[`quota${index + 1}`] = {
            titolo: q.titolo.trim(),
            descrizione: q.descrizione.trim(),
            prezzo: Number(q.prezzo),
          }
        }
      })

      const { data, error } = await supabase
        .from("evento")
        .update({
          titolo: newEvent.titolo.trim(),
          descrizione: newEvent.descrizione.trim(),
          data: newEvent.data,
          orario: newEvent.orario,
          luogo: newEvent.luogo.trim(),
          partecipanti: Number.parseInt(newEvent.partecipanti),
          numeroauto: Number.parseInt(newEvent.numeroauto),
          programma: newEvent.programma.trim() || null,
          quote: quotesJson,
        })
        .eq("id", editingEvent.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      showNotification("Evento aggiornato con successo!", "success")
      setShowEditEventForm(false)
      setEditingEvent(null)
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        orario: "",
        luogo: "",
        partecipanti: "",
        numeroauto: "",
        programma: "",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }],
      })
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'evento:", error)
      showNotification("Errore nell'aggiornamento dell'evento: " + error.message, "error")
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Sei sicuro di voler eliminare questo evento? Verranno eliminate anche tutte le sue iscrizioni e immagini associate.")) {
      return
    }

    try {
      let overallSuccess = true;

      // Step 1: Delete associated registrations from guidatore table
      try {
        const { error: deleteGuidatoriError } = await supabase
          .from("guidatore")
          .delete()
          .eq("id_evento_fk", eventId);

        if (deleteGuidatoriError) {
          throw new Error(`Errore durante l'eliminazione dei guidatori: ${deleteGuidatoriError.message}`);
        }
        console.log(`Guidatori per l'evento ${eventId} eliminati con successo.`);
      } catch (error) {
        overallSuccess = false;
        console.error(`Errore critico durante l'eliminazione dei guidatori per l'evento ${eventId}:`, error.message);
        showNotification(`Errore critico durante l'eliminazione dei guidatori. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`, "error");
      }

      // Step 2: Delete associated registrations from passeggero table
      try {
        const { error: deletePasseggeriError } = await supabase
          .from("passeggero")
          .delete()
          .eq("id_evento_fk", eventId);

        if (deletePasseggeriError) {
          throw new Error(`Errore durante l'eliminazione dei passeggeri: ${deletePasseggeriError.message}`);
        }
        console.log(`Passeggeri per l'evento ${eventId} eliminati con successo.`);
      } catch (error) {
        overallSuccess = false;
        console.error(`Errore critico durante l'eliminazione dei passeggeri per l'evento ${eventId}:`, error.message);
        showNotification(`Errore critico durante l'eliminazione dei passeggeri. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`, "error");
      }

      // Step 3: Delete associated images from storage
      try {
        const { data: imagesList, error: listError } = await supabase.storage
          .from("doc")
          .list(`eventi/${eventId}`);

        if (listError && listError.message !== "The resource was not found") { // Ignore if folder doesn't exist
          console.warn(`Could not list images for event ${eventId}, might not exist or error occurred:`, listError.message);
        } else if (imagesList && imagesList.length > 0) {
          const imagePathsToDelete = imagesList
            .filter(item => item.name !== ".emptyFolderPlaceholder")
            .map(item => `eventi/${eventId}/${item.name}`);

          if (imagePathsToDelete.length > 0) {
            const { error: deleteImagesError } = await supabase.storage
              .from("doc")
              .remove(imagePathsToDelete);

            if (deleteImagesError) {
              throw new Error(`Errore durante l'eliminazione delle immagini dell'evento: ${deleteImagesError.message}`);
            }
            console.log(`Immagini per l'evento ${eventId} eliminate con successo.`);
          }
        }
      } catch (error) {
        overallSuccess = false;
        console.error(`Errore durante l'eliminazione delle immagini per l'evento ${eventId}:`, error.message);
        showNotification(`Errore durante l'eliminazione delle immagini dell'evento. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`, "warning");
      }

      // Step 4: Delete the event itself
      try {
        const { error: deleteEventError } = await supabase
          .from("evento")
          .delete()
          .eq("id", eventId)

        if (deleteEventError) {
          throw new Error(`Errore durante l'eliminazione dell'evento principale: ${deleteEventError.message}`);
        }
        console.log(`Evento ${eventId} eliminato con successo.`);
      } catch (error) {
        overallSuccess = false;
        console.error(`Errore critico durante l'eliminazione dell'evento ${eventId}:`, error.message);
        showNotification(`Errore critico durante l'eliminazione dell'evento. Riprova. Dettagli: ${error.message}`, "error");
      }

      if (overallSuccess) {
        showNotification("Evento eliminato con successo, incluse iscrizioni e immagini associate!", "success");
      } else {
        showNotification("L'eliminazione dell'evento ha riscontrato alcuni problemi. Controlla i dettagli nel log della console.", "warning");
      }

      fetchEventsAndImages() // Refresh events after deletion
    } catch (error) {
      // This catch block would only be hit by synchronous errors or errors not caught by inner try-catches
      console.error("Errore generale durante la gestione dell'eliminazione dell'evento:", error)
      showNotification("Si è verificato un errore inaspettato durante l'eliminazione dell'evento: " + error.message, "error")
    }
  }

  const handleMarkAsPast = async (eventId) => {
    try {
      const { error } = await supabase
        .from("evento")
        .update({ passato: true })
        .eq("id", eventId)

      if (error) {
        throw error
      }
      showNotification("Evento contrassegnato come passato!", "success")
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nel contrassegnare l'evento come passato:", error)
      showNotification("Errore nel contrassegnare l'evento come passato: " + error.message, "error")
    }
  }

  // FUNZIONI DI GESTIONE IMMAGINI
  const handleImageUploadFiles = (e) => {
    setUploadFiles(Array.from(e.target.files))
  }

  const handleUploadImages = async () => {
    if (uploadFiles.length === 0) {
      showNotification("Nessun file selezionato per il caricamento.", "warning");
      return;
    }

    const uploadFolderPath = uploadTarget.type === "event" ? `eventi/${uploadTarget.eventId}` : "galleria";
    let successfulUploadsCount = 0;
    let failedUploadsCount = 0;
    const failedFiles = [];

    for (const file of uploadFiles) {
      try {
        const { data, error } = await supabase.storage
          .from("doc")
          .upload(`${uploadFolderPath}/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false, // Prevents overwriting existing files
          })

        if (error) {
          // Specific error for file already exists.
          if (error.statusCode === '409' || error.message.includes('duplicate key') || error.message.includes('already exists')) {
            console.warn(`File "${file.name}" already exists in "${uploadFolderPath}". Skipping upload.`);
            failedUploadsCount++;
            failedFiles.push(`${file.name} (già esistente)`);
          } else {
            throw new Error(`Errore nel caricamento di ${file.name}: ${error.message}`);
          }
        } else {
          console.log(`File "${file.name}" caricato con successo in "${uploadFolderPath}".`, data);
          successfulUploadsCount++;
        }
      } catch (error) {
        console.error(`Errore nel caricamento di "${file.name}":`, error.message);
        failedUploadsCount++;
        failedFiles.push(`${file.name} (${error.message})`);
      }
    }

    if (successfulUploadsCount === uploadFiles.length) {
      showNotification("Tutte le immagini caricate con successo!", "success");
    } else if (successfulUploadsCount > 0) {
      showNotification(`Caricamento completato con ${successfulUploadsCount} immagini caricate e ${failedUploadsCount} fallite. Dettagli: ${failedFiles.join(", ")}`, "warning");
    } else {
      showNotification(`Nessuna immagine caricata. Tutti i caricamenti sono falliti. Dettagli: ${failedFiles.join(", ")}`, "error");
    }

    setShowImageUpload(false);
    setUploadFiles([]);
    fetchEventsAndImages(); // Refresh galleries
  }

  const handleDeleteImage = async (imagePath, eventId = null) => {
    if (!confirm("Sei sicuro di voler eliminare questa immagine?")) {
      return;
    }
    try {
      const { error } = await supabase.storage
        .from("doc")
        .remove([imagePath]);

      if (error) {
        throw error;
      }

      showNotification("Immagine eliminata con successo!", "success");
      fetchEventsAndImages(); // Refresh galleries
    } catch (error) {
      console.error("Errore nell'eliminazione dell'immagine:", error);
      showNotification("Errore nell'eliminazione dell'immagine: " + error.message, "error");
    }
  }

  // FUNZIONI DI GESTIONE ISCRIZIONI - MODIFICATA PER LA NUOVA STRUTTURA
  const fetchRegistrations = useCallback(async (eventId) => {
    setLoadingRegistrations(true)
    try {
      // Fetch guidatori per l'evento
      const { data: guidatoriData, error: guidatoriError } = await supabase
        .from("guidatore")
        .select("*")
        .eq("id_evento_fk", eventId)

      if (guidatoriError) {
        throw guidatoriError
      }

      // Per ogni guidatore, fetch i passeggeri associati
      const registrationsWithPassengers = await Promise.all(
        guidatoriData.map(async (guidatore) => {
          const { data: passeggeriData, error: passeggeriError } = await supabase
            .from("passeggero")
            .select("*")
            .eq("id_guidatore_fk", guidatore.id)

          if (passeggeriError) {
            console.warn(`Errore nel recupero passeggeri per guidatore ${guidatore.id}:`, passeggeriError.message)
          }

          return {
            ...guidatore,
            passeggeri: passeggeriData || []
          }
        })
      )

      // Fetch anche i passeggeri senza guidatore (se esistono)
      const { data: passeggeriSenzaGuidatore, error: passeggeriSenzaGuidatoreError } = await supabase
        .from("passeggero")
        .select("*")
        .eq("id_evento_fk", eventId)
        .is("id_guidatore_fk", null)

      if (passeggeriSenzaGuidatoreError) {
        console.warn("Errore nel recupero passeggeri senza guidatore:", passeggeriSenzaGuidatoreError.message)
      }

      // Combina guidatori con passeggeri e passeggeri senza guidatore
      const allRegistrations = [
        ...registrationsWithPassengers,
        ...(passeggeriSenzaGuidatore || [])
      ]

      setRegistrations(allRegistrations)
    } catch (error) {
      console.error("Errore nel recupero delle iscrizioni:", error)
      showNotification("Errore nel recupero delle iscrizioni: " + error.message, "error")
      setRegistrations([])
    } finally {
      setLoadingRegistrations(false)
    }
  }, [])

  const handleOpenRegistrationsModal = (event) => {
    setSelectedEventForRegistrations(event)
    setShowRegistrationsModal(true)
    fetchRegistrations(event.id)
  }

  const handleGenerateIndividualPdf = async (registration, event) => {
    try {
      const doc = new jsPDF()
      doc.text(`Dettagli Iscrizione - Evento: ${event.titolo}`, 10, 10)
      doc.text(`Nome: ${registration.nome} ${registration.cognome}`, 10, 20)
      doc.text(`Email: ${registration.indirizzo_email}`, 10, 30)
      doc.text(`Telefono: ${registration.telefono}`, 10, 40)
      doc.text(`Codice Fiscale: ${registration.codice_fiscale}`, 10, 50)
      doc.text(`Data Nascita: ${registration.data_nascita}`, 10, 60)
      doc.text(`Indirizzo: ${registration.indirizzo}`, 10, 70)
      doc.text(`Quota Selezionata: ${registration.quota}`, 10, 80)
      doc.text(`Intolleranze: ${registration.intolleranze || "Nessuna"}`, 10, 90)

      if (registration.auto_marca) {
        doc.text(`Dettagli Auto:`, 10, 110)
        doc.text(`Marca: ${registration.auto_marca}`, 10, 120)
        doc.text(`Modello: ${registration.auto_modello}`, 10, 130)
        doc.text(`Targa: ${registration.auto_targa}`, 10, 140)
        doc.text(`Posti Auto: ${registration.posti_auto}`, 10, 150)
      }

      if (registration.passeggeri && registration.passeggeri.length > 0) {
        doc.text(`Passeggeri:`, 10, registration.auto_marca ? 170 : 110)
        let yOffset = registration.auto_marca ? 180 : 120
        registration.passeggeri.forEach((pass, pIndex) => {
          doc.text(`- Passeggero ${pIndex + 1}: ${pass.nome} ${pass.cognome} (CF: ${pass.codice_fiscale})`, 15, yOffset)
          yOffset += 10
        })
      }

      doc.save(`iscrizione_${registration.nome}_${registration.cognome}.pdf`)
      showNotification("PDF generato con successo!", "success")
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error)
      showNotification("Errore durante la generazione del PDF: " + error.message, "error")
    }
  }

  const handleOpenInvoiceUpload = (registration) => {
    setSelectedRegistration(registration)
    setShowInvoiceUpload(true)
  }

  const handleInvoiceUpload = async () => {
    if (!invoiceFile || !selectedRegistration) {
      showNotification("File fattura o registrazione non selezionati.", "warning");
      return;
    }

    try {
      const filePath = `fatture/${selectedRegistration.id_evento_fk}/${selectedRegistration.id}_${invoiceFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("doc")
        .upload(filePath, invoiceFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Errore durante il caricamento della fattura: ${uploadError.message}`);
      }

      // Optionally, send email via a Supabase Function or direct email service if available
      // For now, we'll just confirm upload.
      showNotification("Fattura caricata con successo e email inviata (simulato)!", "success");
      setShowInvoiceUpload(false);
      setInvoiceFile(null);
      setSelectedRegistration(null);
    } catch (error) {
      console.error("Errore nel caricamento o invio fattura:", error);
      showNotification("Errore nel caricamento o invio fattura: " + error.message, "error");
    }
  };

  const openDocumentInModal = (url, type) => {
    if (!url) {
      showNotification("URL del documento non valido.", "warning");
      return;
    }
    setCurrentDocumentUrl(url);
    setCurrentDocumentType(type);
    setShowDocumentModal(true);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black mb-4 mx-auto"></div>
          <p className="text-xl text-gray-700">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Modals */}
      {showNewEventForm && (
        <EventFormModal
          isEditMode={false}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleNewEventChange={handleNewEventChange}
          addQuota={addQuota}
          removeQuota={removeQuota}
          updateQuota={updateQuota}
          handleCreateEvent={handleCreateEvent}
          onClose={() => {
            setShowNewEventForm(false)
            setNewEvent({
              titolo: "",
              descrizione: "",
              data: "",
              orario: "",
              luogo: "",
              partecipanti: "",
              numeroauto: "",
              programma: "",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }],
            })
          }}
        />
      )}

      {showEditEventForm && editingEvent && (
        <EventFormModal
          isEditMode={true}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleNewEventChange={handleNewEventChange}
          addQuota={addQuota}
          removeQuota={removeQuota}
          updateQuota={updateQuota}
          handleUpdateEvent={handleUpdateEvent}
          onClose={() => {
            setShowEditEventForm(false)
            setEditingEvent(null)
            setNewEvent({
              titolo: "",
              descrizione: "",
              data: "",
              orario: "",
              luogo: "",
              partecipanti: "",
              numeroauto: "",
              programma: "",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }],
            })
          }}
        />
      )}

      {showRegistrationsModal && (
        <RegistrationsModal
          selectedEventForRegistrations={selectedEventForRegistrations}
          registrations={registrations}
          loadingRegistrations={loadingRegistrations}
          handleGenerateIndividualPdf={handleGenerateIndividualPdf}
          handleOpenInvoiceUpload={handleOpenInvoiceUpload}
          openDocumentInModal={openDocumentInModal}
          onClose={() => setShowRegistrationsModal(false)}
        />
      )}

      {showImageUpload && (
        <ImageUploadModal
          uploadTarget={uploadTarget}
          uploadFiles={uploadFiles}
          handleImageUploadFiles={handleImageUploadFiles}
          handleUploadImages={handleUploadImages}
          onClose={() => {
            setShowImageUpload(false)
            setUploadFiles([])
            setUploadTarget({ type: "general", eventId: null })
          }}
        />
      )}

      {showInvoiceUpload && (
        <InvoiceUploadModal
          selectedRegistration={selectedRegistration}
          invoiceFile={invoiceFile}
          setInvoiceFile={setInvoiceFile}
          handleInvoiceUpload={handleInvoiceUpload}
          onClose={() => {
            setShowInvoiceUpload(false)
            setSelectedRegistration(null)
            setInvoiceFile(null)
          }}
        />
      )}

      {showDocumentModal && (
        <DocumentViewerModal
          currentDocumentUrl={currentDocumentUrl}
          currentDocumentType={currentDocumentType}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      {/* CSS personalizzato per animazioni */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Card className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-1 flex items-center gap-2">
              <ActivityIcon className="w-8 h-8 text-black" /> Dashboard Amministratore
            </h1>
            <p className="text-gray-600 text-lg">Gestisci eventi, iscrizioni e gallerie</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="mt-4 sm:mt-0 text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <LogOutIcon className="h-5 w-5" /> Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  <TabsList className="grid w-full grid-cols-4 bg-gray-200 rounded-lg h-16 sm:h-20 p-1 sm:p-2 shadow-lg border border-gray-300 mb-8">

    <TabsTrigger 
      value="overview" 
      className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center"
    >
      <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
      <span className="hidden sm:inline">Overview</span>
      <span className="sm:hidden text-xs mt-1">Home</span>
    </TabsTrigger>
    <TabsTrigger 
      value="currentEvents" 
      className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center"
    >
      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
      <span className="hidden sm:inline">Eventi Correnti</span>
      <span className="sm:hidden text-xs mt-1">Correnti</span>
    </TabsTrigger>
    <TabsTrigger 
      value="pastEvents" 
      className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center"
    >
      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
      <span className="hidden sm:inline">Eventi Passati</span>
      <span className="sm:hidden text-xs mt-1">Passati</span>
    </TabsTrigger>
    <TabsTrigger 
      value="generalGallery" 
      className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center"
    >
      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
      <span className="hidden sm:inline">Galleria Generale</span>
      <span className="sm:hidden text-xs mt-1">Generale</span>
    </TabsTrigger>
  </TabsList>


          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-black to-gray-800 text-white rounded-lg shadow-xl">
                <CardTitle className="text-3xl font-bold mb-2">Benvenuto!</CardTitle>
                <CardDescription className="text-gray-300 mb-4">
                  Questa è la tua dashboard amministratore. Utilizza le schede qui above per gestire i tuoi eventi, le iscrizioni e le gallerie fotografiche.
                </CardDescription>
                <Button
                  onClick={() => setShowNewEventForm(true)}
                  className="bg-white text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" /> Crea Nuovo Evento
                </Button>
              </Card>

              <Card className="p-6 bg-white rounded-lg shadow-xl border border-gray-200">
                <CardTitle className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                  <ActivityIcon className="w-6 h-6 text-gray-600" /> Riepilogo Attività
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <span className="text-gray-700 font-medium">Eventi Correnti:</span>
                    <Badge className="bg-black text-white px-3 py-1 text-lg font-bold">{loadingEvents ? "..." : events.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <span className="text-gray-700 font-medium">Eventi Passati:</span>
                    <Badge className="bg-gray-600 text-white px-3 py-1 text-lg font-bold">{loadingPastEvents ? "..." : pastEvents.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <span className="text-gray-700 font-medium">Immagini in Galleria:</span>
                    <Badge className="bg-black text-white px-3 py-1 text-lg font-bold">{loadingImages ? "..." : galleryImages.length + Object.values(eventGalleryImages).flat().length}</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Eventi Correnti */}
          <TabsContent value="currentEvents" className="mt-6">
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" /> Eventi Correnti
            </h2>
            <p className="text-gray-600 mb-6">Questi sono gli eventi futuri o in corso che puoi gestire.</p>
            <Button
              onClick={() => setShowNewEventForm(true)}
              className="mb-6 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" /> Crea Nuovo Evento
            </Button>

            {loadingEvents ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-xl text-gray-500">Caricamento eventi...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-2xl text-gray-500">Nessun evento corrente trovato.</div>
                <p className="text-gray-500 mt-2">Crea un nuovo evento per iniziare.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white rounded-lg overflow-hidden flex flex-col">
                    <CardHeader className="bg-black text-white p-4 rounded-t-lg">
                      <CardTitle className="text-xl font-bold line-clamp-1">{event.titolo}</CardTitle>
                      <CardDescription className="text-gray-300 text-sm line-clamp-1">{event.luogo}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <p className="text-gray-800 mb-3 text-sm line-clamp-3">{event.descrizione}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.data}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.orario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="w-4 h-4 text-gray-500" />
                          <span>Max Partecipanti: {event.partecipanti}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CarIcon className="w-4 h-4 text-gray-500" />
                          <span>Max Auto: {event.numeroauto}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.values(event.quote || {}).map((quota, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-100 text-black border-gray-300">
                            {quota.titolo}: €{Number(quota.prezzo).toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-4 border-t flex flex-wrap gap-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRegistrationsModal(event)}
                        className="text-black border-gray-400 hover:bg-gray-100 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <UsersIcon className="w-4 h-4" /> Iscrizioni
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-600 border-blue-400 hover:bg-blue-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <EditIcon className="w-4 h-4" /> Modifica
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsPast(event.id)}
                        className="text-purple-600 border-purple-400 hover:bg-purple-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <CheckIcon className="w-4 h-4" /> Segna come Passato
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 border-red-400 hover:bg-red-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <TrashIcon className="w-4 h-4" /> Elimina
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Eventi Passati */}
          <TabsContent value="pastEvents" className="mt-6">
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6" /> Eventi Passati
            </h2>
            <p className="text-gray-600 mb-6">Eventi che sono già avvenuti.</p>

            {loadingPastEvents ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-xl text-gray-500">Caricamento eventi passati...</p>
              </div>
            ) : pastEvents.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-2xl text-gray-500">Nessun evento passato trovato.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="shadow-lg bg-white rounded-lg overflow-hidden flex flex-col">
                    <CardHeader className="bg-gray-700 text-white p-4 rounded-t-lg">
                      <CardTitle className="text-xl font-bold line-clamp-1">{event.titolo}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm line-clamp-1">{event.luogo}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <p className="text-gray-800 mb-3 text-sm line-clamp-3">{event.descrizione}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.data}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ClockIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.orario}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.values(event.quote || {}).map((quota, idx) => (
                          <Badge key={idx} variant="outline" className="bg-gray-100 text-black border-gray-300">
                            {quota.titolo}: €{Number(quota.prezzo).toFixed(2)}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-4 border-t flex flex-wrap gap-3 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRegistrationsModal(event)}
                        className="text-black border-gray-400 hover:bg-gray-100 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <UsersIcon className="w-4 h-4" /> Iscrizioni
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadTarget({ type: "event", eventId: event.id })
                          setShowImageUpload(true)
                        }}
                        className="text-green-600 border-green-400 hover:bg-green-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <ImageIcon className="w-4 h-4" /> Carica Immagini
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 border-red-400 hover:bg-red-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <TrashIcon className="w-4 h-4" /> Elimina
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Galleria Generale */}
          <TabsContent value="generalGallery" className="mt-6">
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" /> Galleria Generale
            </h2>
            <p className="text-gray-600 mb-6">Immagini utilizzate per la galleria principale del sito.</p>
            <Button
              onClick={() => {
                setUploadTarget({ type: "general", eventId: null })
                setShowImageUpload(true)
              }}
              className="mb-6 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <UploadIcon className="w-5 h-5" /> Carica Nuove Immagini
            </Button>

            {loadingImages ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-xl text-gray-500">Caricamento immagini galleria generale...</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-2xl text-gray-500">Nessuna immagine nella galleria generale.</div>
                <p className="text-gray-500 mt-2">Carica alcune immagini per visualizzarle qui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-40 object-cover rounded-t-lg transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteImage(image.path)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{image.alt}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Gallerie Eventi */}
          <TabsContent value="eventGallery" className="mt-6">
            <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" /> Gallerie Eventi
            </h2>
            <p className="text-gray-600 mb-6">Gallerie fotografiche per ciascun evento passato.</p>

            {loadingImages ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                <p className="text-xl text-gray-500">Caricamento gallerie eventi...</p>
              </div>
            ) : Object.keys(eventGalleryImages).length === 0 || Object.values(eventGalleryImages).every(arr => arr.length === 0) ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-2xl text-gray-500">Nessuna galleria eventi trovata.</div>
                <p className="text-gray-500 mt-2">Carica immagini per i tuoi eventi passati.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {pastEvents.filter(event => eventGalleryImages[event.id] && eventGalleryImages[event.id].length > 0).map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 bg-white shadow-md">
                    <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-gray-600" /> Galleria per "{event.titolo}"
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {eventGalleryImages[event.id].map((image) => (
                        <Card key={image.id} className="relative group overflow-hidden rounded-lg shadow-lg">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-40 object-cover rounded-t-lg transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDeleteImage(image.path, image.eventId)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </Button>
                          </div>
                          <CardContent className="p-3 text-center">
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">{image.alt}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

