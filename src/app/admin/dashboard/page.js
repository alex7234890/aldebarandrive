"use client"

import React, { useState, useEffect, useCallback } from "react"
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
  ChevronDownIcon,
  ChevronUpIcon,
  TrendingUpIcon,
  ActivityIcon,
  PaperclipIcon,
} from "lucide-react"
import jsPDF from "jspdf"
import ReactMarkdown from 'react-markdown';
import { supabase } from "@/lib/supabaseClient"

// Helper per mostrare notifiche all'utente - RIMOSSO, ora usiamo i banner

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
  showErrorBanner,
  isCreatingEvent,
  isUpdatingEvent,
  coverImagePreview,
}) => {
  // Client-side validation for event form
  const validateEventForm = () => {
    if (!newEvent.titolo || newEvent.titolo.trim() === "") {
      showErrorBanner("Il titolo dell'evento è obbligatorio.")
      return false
    }
    if (!newEvent.descrizione || newEvent.descrizione.trim() === "") {
      showErrorBanner("La descrizione dell'evento è obbligatoria.")
      return false
    }
    if (!newEvent.data) {
      showErrorBanner("La data dell'evento è obbligatoria.")
      return false
    }
    if (!newEvent.fine) {
      showErrorBanner("La data di fine dell'evento è obbligatoria.")
      return false
    }
    // Validazione che la data di fine non sia prima della data di inizio
    if (new Date(newEvent.fine) < new Date(newEvent.data)) {
      showErrorBanner("La data di fine evento non può essere precedente alla data di inizio.")
      return false
    }
    if (!newEvent.orario) {
      showErrorBanner("L'orario dell'evento è obbligatorio.")
      return false
    }
    if (!newEvent.luogo || newEvent.luogo.trim() === "") {
      showErrorBanner("Il luogo dell'evento è obbligatorio.")
      return false
    }

    // Validate quotas
    for (const quota of newEvent.quote) {
      const isQuotaEmpty = !quota.titolo.trim() && !quota.descrizione.trim() && (quota.prezzo === "" || isNaN(Number(quota.prezzo)));

      // If it's not entirely empty, it must be fully filled and valid
      if (!isQuotaEmpty) {
        if (!quota.titolo.trim()) {
          showErrorBanner("Il titolo della quota è obbligatorio se la quota non è vuota.");
          return false;
        }
        if (!quota.descrizione.trim()) {
          showErrorBanner("La descrizione della quota è obbligatoria se la quota non è vuota.");
          return false;
        }
        const prezzoNum = Number(quota.prezzo);
        if (quota.prezzo === "" || isNaN(prezzoNum) || prezzoNum < 0) {
          showErrorBanner("Il prezzo della quota deve essere un numero non negativo.");
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
  <Label
    htmlFor="descrizione"
    className="text-base font-semibold text-black flex items-center gap-2"
  >
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
    placeholder="Descrivi l'evento in dettaglio. Usa **grassetto** per evidenziare."
  />

  {/* ANTEPRIMA */}
 {newEvent.descrizione && (
  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
    <h4 className="font-semibold mb-2 text-sm text-gray-600">Anteprima:</h4>
    <div className="prose prose-sm">
      <ReactMarkdown>{newEvent.descrizione}</ReactMarkdown>
    </div>
  </div>
)}

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
                <Label htmlFor="fine" className="text-base font-semibold text-black flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Data di fine
                </Label>
                <Input
                  id="fine"
                  name="fine"
                  type="date"
                  value={newEvent.fine}
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

              <div className="md:col-span-2">
                <Label htmlFor="copertina" className="text-base font-semibold text-black flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Immagine di Copertina (opzionale)
                </Label>
            
                <label
                  htmlFor="copertina"
                  className="flex items-center justify-center border border-gray-400 rounded-lg p-6 cursor-pointer transition-colors hover:bg-gray-100"
                >
                  <span className="text-base font-medium text-black">Carica immagine di copertina</span>
                  <Input
                    id="copertina"
                    name="copertina"
                    type="file"
                    accept="image/*"
                    onChange={handleNewEventChange}
                    className="hidden"
                  />
                </label>

                {/* Anteprima immagine di copertina */}
                {coverImagePreview && (
                  <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">Anteprima immagine di copertina:</h4>
                    <div className="relative inline-block">
                      <img
                        src={coverImagePreview}
                        alt="Anteprima copertina"
                        className="max-w-full max-h-48 object-contain rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-1">
                  Seleziona un'immagine che rappresenti l'evento. Verrà salvata nel bucket doc/eventi/id_evento.
                </p>
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
                disabled={isCreatingEvent || isUpdatingEvent}
                className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isCreatingEvent || isUpdatingEvent}
                className={`text-base font-semibold py-3 px-6 rounded-lg text-white shadow-lg transition-all duration-200 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEditMode ? "bg-gray-800 hover:bg-gray-900" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isEditMode ? (
                  isUpdatingEvent ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Caricamento...
                    </>
                  ) : (
                    "Aggiorna Evento"
                  )
                ) : (
                  isCreatingEvent ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Caricamento...
                    </>
                  ) : (
                    "Crea Evento"
                  )
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Modal per l'upload di immagini
const ImageUploadModal = ({ 
  uploadTarget, 
  uploadFiles, 
  handleImageUploadFiles, 
  handleUploadImages, 
  onClose, 
  showErrorBanner, 
  isUploadingImages,
  uploadProgress,
  uploadedCount,
  totalCount
}) => {
  const validateImageUpload = () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      showErrorBanner("Seleziona almeno un file immagine da caricare.")
      return false
    }
    for (const file of uploadFiles) {
      if (!file.type.startsWith("image/")) {
        showErrorBanner(`Il file '${file.name}' non è un'immagine valida.`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // Esempio: limite di 5MB per immagine
        showErrorBanner(`Il file '${file.name}' supera la dimensione massima consentita (5MB).`)
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

              <label
                htmlFor="image-upload"
                className="flex items-center justify-center border border-gray-400 rounded-lg p-6 cursor-pointer transition-colors hover:bg-gray-100"
              >
                <span className="text-base font-medium text-black">Seleziona file immagine</span>
                <Input
                  id="image-upload"
                  name="galleria"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUploadFiles}
                  className="hidden"
                />
              </label>
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

            {/* Progress Bar durante l'upload */}
            {isUploadingImages && (
              <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                <p className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 inline-block"></span>
                  Caricamento in corso... ({uploadedCount}/{totalCount})
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-700 text-center">{Math.round(uploadProgress)}% completato</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-300">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isUploadingImages}
                className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-3 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={uploadFiles.length === 0 || isUploadingImages}
                className="text-base font-semibold bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                {isUploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Caricamento...
                  </>
                ) : (
                  <>
                    <UploadIcon className="mr-2 h-5 w-5" />
                    Carica Immagini
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Modal per l'upload di fatture
const InvoiceUploadModal = ({ selectedRegistration, invoiceFile, setInvoiceFile, handleInvoiceUpload, onClose, showErrorBanner }) => {
  const validateInvoiceUpload = () => {
    if (!invoiceFile) {
      showErrorBanner("Seleziona un file fattura da caricare.")
      return false
    }
    if (invoiceFile.type !== "application/pdf") {
      showErrorBanner("Il file selezionato non è un PDF valido.")
      return false
    }
    if (invoiceFile.size > 10 * 1024 * 1024) { // Esempio: limite di 10MB per PDF
      showErrorBanner("Il file fattura supera la dimensione massima consentita (10MB).")
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
            <label
                htmlFor="invoice-upload"
                className="flex items-center justify-center border border-gray-400 rounded-lg p-6 cursor-pointer transition-colors hover:bg-gray-100"
              >
                <span className="text-base font-medium text-black">Carica fattura (PDF)</span>
                <Input
                  id="invoice-upload"
                  type="file"
                  onChange={(e) => setInvoiceFile(e.target.files[0])}
                  accept=".pdf"
                  className="hidden"
                />
              </label>
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
}) => {
  const [expandedRegistrations, setExpandedRegistrations] = React.useState(new Set());

  const toggleExpanded = (regId) => {
    const newExpanded = new Set(expandedRegistrations);
    if (newExpanded.has(regId)) {
      newExpanded.delete(regId);
    } else {
      newExpanded.add(regId);
    }
    setExpandedRegistrations(newExpanded);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
        <CardHeader className="flex flex-row items-start sm:items-center justify-between space-y-0 pb-3 sm:pb-4 bg-black text-white rounded-t-lg p-3 sm:p-6">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-2xl lg:text-3xl font-bold leading-tight">
              Iscrizioni per: {selectedEventForRegistrations?.titolo}
            </CardTitle>
            <CardDescription className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
              Gestisci le iscrizioni e genera documenti
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white hover:bg-gray-800 transition-colors ml-2 flex-shrink-0"
          >
            <XIcon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          {loadingRegistrations ? (
            <div className="flex flex-col justify-center items-center h-48 sm:h-64 space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-black"></div>
              <p className="text-lg sm:text-xl text-gray-500">Caricamento iscrizioni...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <AlertCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-xl sm:text-2xl text-gray-500 px-4">Nessuna iscrizione trovata per questo evento</div>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map((reg, index) => {
                const totalPartecipanti = 1 + (reg.passeggeri ? reg.passeggeri.length : 0);
                const fatturaInviata = reg.verificato || false;
                const isExpanded = expandedRegistrations.has(reg.id);
                
                return (
                  <Card key={reg.id} className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-3 sm:p-4">
                      {/* Vista minimale - Layout mobile first */}
                      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                        
                        {/* Nome Guidatore e numero */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <UserIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base sm:text-lg text-black truncate">
                              {reg.nome} {reg.cognome}
                            </h3>
                            <p className="text-sm text-gray-500">#{index + 1}</p>
                          </div>
                        </div>
                        
                        {/* Info partecipanti e status - layout mobile */}
                        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:gap-2">
                          {/* Numero Partecipanti */}
                          <div className="flex items-center gap-2">
                            <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                            <span className="font-semibold text-base sm:text-lg">{totalPartecipanti}</span>
                            <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                              {totalPartecipanti === 1 ? 'partecipante' : 'partecipanti'}
                            </span>
                          </div>
                          
                          {/* Status Fattura */}
                          <div className="flex items-center gap-2">
                            {fatturaInviata ? (
                              <div className="flex items-center gap-1 sm:gap-2 text-green-600">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">Inviata</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 sm:gap-2 text-red-600">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 flex items-center justify-center">
                                  <XIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium">Fattura Mancante</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Azioni - sempre in basso su mobile */}
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 sm:border-t-0 sm:pt-0 sm:mt-0 sm:ml-auto sm:flex-shrink-0">
                        <Button
                          onClick={() => toggleExpanded(reg.id)}
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm flex-1 sm:flex-none"
                          size="sm"
                        >
                          {isExpanded ? <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> : <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
                          {isExpanded ? 'Riduci' : 'Dettagli'}
                        </Button>
                        
                        <Button
                          onClick={() => handleGenerateIndividualPdf(reg, selectedEventForRegistrations)}
                          className="bg-black hover:bg-gray-800 text-white shadow-sm transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                          size="sm"
                        >
                          <DownloadIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                          <span className="hidden sm:inline">Esporta </span>PDF
                        </Button>
                        
                        {!fatturaInviata && (
                          <Button
                            onClick={() => handleOpenInvoiceUpload(reg)}
                            className="bg-gray-600 hover:bg-gray-700 text-white shadow-sm transition-all duration-200 text-xs sm:text-sm flex-1 sm:flex-none"
                            size="sm"
                          >
                            <UploadIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> 
                            <span className="hidden sm:inline">Carica </span>Fattura
                          </Button>
                        )}
                      </div>

                      {/* Vista dettagliata espandibile */}
                      {isExpanded && (
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                          {/* Informazioni Guidatore */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <MailIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                                <p className="font-semibold text-sm break-all">{reg.indirizzo_email}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Telefono</p>
                                <p className="font-semibold text-sm">{reg.telefono}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <FileTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Codice Fiscale</p>
                                <p className="font-semibold text-xs break-all">{reg.codice_fiscale}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Data Nascita</p>
                                <p className="font-semibold text-sm">{reg.data_nascita}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <TrendingUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Quota</p>
                                <Badge className="bg-black text-white text-xs">{reg.quota}</Badge>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <AlertCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Intolleranze</p>
                                <p className="font-semibold text-sm">{reg.intolleranze || "Nessuna"}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <PaperclipIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Numero patente</p>
                                <p className="font-semibold text-sm break-all">{reg.Patente}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm text-gray-500">Scadenza patente</p>
                                <p className="font-semibold text-sm">{reg.PatenteS}</p>
                              </div>
                            </div>
                          </div>

                          {/* Indirizzo - Elemento a larghezza piena */}
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300 mb-4 sm:mb-6">
                            <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs sm:text-sm text-gray-500">Indirizzo</p>
                              <p className="font-semibold text-sm break-words">{reg.indirizzo}</p>
                            </div>
                          </div>

                          {/* Documenti Guidatore */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                            {reg.documento_fronte && (
                              <Button
                                variant="outline"
                                onClick={() => openDocumentInModal(reg.documento_fronte, "jpg", false)}
                                className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-sm flex-1 sm:flex-none"
                                size="sm"
                              >
                                <ExternalLinkIcon className="mr-2 h-4 w-4" /> Documento Fronte
                              </Button>
                            )}
                            {reg.documento_retro && (
                              <Button
                                variant="outline"
                                onClick={() => openDocumentInModal(reg.documento_retro, "jpg", false)}
                                className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-sm flex-1 sm:flex-none"
                                size="sm"
                              >
                                <ExternalLinkIcon className="mr-2 h-4 w-4" /> Documento Retro
                              </Button>
                            )}
                          </div>

                          {/* Informazioni Auto */}
                          {reg.auto_marca && (
                            <>
                              <div className="mb-4 sm:mb-6">
                                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-3 sm:mb-4 flex items-center gap-2">
                                  <CarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                                  Dettagli Auto
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Marca</p>
                                    <p className="font-semibold text-sm break-words">{reg.auto_marca}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Modello</p>
                                    <p className="font-semibold text-sm break-words">{reg.auto_modello}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Targa</p>
                                    <p className="font-semibold text-sm break-all">{reg.auto_targa}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Posti Auto</p>
                                    <p className="font-semibold text-sm">{reg.posti_auto}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Colore</p>
                                    <p className="font-semibold text-sm break-words">{reg.auto_colore}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-300">
                                    <p className="text-xs sm:text-sm text-gray-500">Anno</p>
                                    <p className="font-semibold text-sm">{reg.auto_immatricolazione}</p>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Passeggeri */}
                          {reg.passeggeri && reg.passeggeri.length > 0 && (
                            <div>
                              <h4 className="text-base sm:text-lg lg:text-xl font-bold text-black mb-3 sm:mb-4 flex items-center gap-2">
                                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
                                Passeggeri ({reg.passeggeri.length})
                              </h4>
                              <div className="space-y-4">
                                {reg.passeggeri.map((pass, pIndex) => (
                                  <div key={pIndex} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-300 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                      <h5 className="font-bold text-sm sm:text-base lg:text-lg text-black break-words">
                                        {pass.nome} {pass.cognome}
                                      </h5>
                                      <Badge variant="outline" className="bg-gray-200 self-start sm:self-auto text-xs">
                                        #{pIndex + 1}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                                      <div className="break-words">
                                        <span className="text-gray-500">CF:</span>{" "}
                                        <span className="font-semibold break-all">{pass.codice_fiscale}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Data Nascita:</span>{" "}
                                        <span className="font-semibold">{pass.data_nascita}</span>
                                      </div>
                                      <div className="break-words">
                                        <span className="text-gray-500">Email:</span>{" "}
                                        <span className="font-semibold break-all">{pass.indirizzo_email}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Telefono:</span>{" "}
                                        <span className="font-semibold">{pass.telefono}</span>
                                      </div>
                                      <div className="sm:col-span-2 break-words">
                                        <span className="text-gray-500">Intolleranze:</span>{" "}
                                        <span className="font-semibold">{pass.intolleranze || "Nessuna"}</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                                      {pass.documento_fronte && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-xs flex-1 sm:flex-none"
                                          onClick={() => openDocumentInModal(pass.documento_fronte, "jpg", true)}
                                        >
                                          <ExternalLinkIcon className="mr-1 h-3 w-3" /> Doc. Fronte
                                        </Button>
                                      )}
                                      {pass.documento_retro && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="bg-gray-100 hover:bg-gray-200 text-black border-gray-400 transition-colors text-xs flex-1 sm:flex-none"
                                          onClick={() => openDocumentInModal(pass.documento_retro, "jpg", true)}
                                        >
                                          <ExternalLinkIcon className="mr-1 h-3 w-3" /> Doc. Retro
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
// Modal di conferma personalizzato
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Conferma", cancelText = "Annulla", type = "warning" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertCircleIcon className="w-12 h-12 text-red-500" />;
      case "success":
        return <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      default:
        return <AlertCircleIcon className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "success":
        return "bg-green-600 hover:bg-green-700";
      default:
        return "bg-yellow-600 hover:bg-yellow-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md animate-scale-in bg-white text-black rounded-lg shadow-2xl border border-gray-300">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-base font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 py-2 px-6 rounded-lg transition-colors bg-transparent order-2 sm:order-1"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`text-base font-semibold text-white py-2 px-6 rounded-lg shadow-lg transition-all duration-200 order-1 sm:order-2 ${getButtonColor()}`}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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
          currentDocumentType === "jpg" ? (
            <img src={currentDocumentUrl} alt="Documento" className="max-w-full max-h-full object-contain" />
          ) : (
            <iframe
              src={currentDocumentUrl}
              title={currentDocumentType}
              className="w-full h-full border-0 rounded-b-lg"
              style={{ minHeight: "600px" }}
            />
          )
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
        // Non possiamo usare showErrorBanner qui perché il componente non è ancora montato
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
    fine:"",
    orario: "",
    luogo: "",
    programma: "",
    quote: [{ titolo: "", descrizione: "", prezzo: "" }],
    copertina: null,
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

  // STATI PER BANNER DI NOTIFICA E CARICAMENTO
  const [showBanner, setShowBanner] = useState(false)
  const [bannerType, setBannerType] = useState('') // 'success', 'error'
  const [bannerMessage, setBannerMessage] = useState('')
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [isUpdatingEvent, setIsUpdatingEvent] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [coverImagePreview, setCoverImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // STATI PER MODAL DI CONFERMA
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationConfig, setConfirmationConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Conferma',
    cancelText: 'Annulla',
    type: 'warning'
  })

  // Verifica autenticazione amministratore
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn")
    if (!isLoggedIn) {
      router.push("/admin/login")
    }
  }, [router])

  // FUNZIONI PER LA GESTIONE DEI BANNER
  const showSuccessBanner = (message) => {
    setBannerType('success');
    setBannerMessage(message);
    setShowBanner(true);
    // Auto-hide dopo 8 secondi per il successo
    setTimeout(() => {
      setShowBanner(false);
    }, 8000);
  };

  const showErrorBanner = (message) => {
    setBannerType('error');
    setBannerMessage(message);
    setShowBanner(true);
    // Auto-hide dopo 10 secondi per gli errori
    setTimeout(() => {
      setShowBanner(false);
    }, 10000);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  // FUNZIONE HELPER PER MODAL DI CONFERMA
  const showConfirmationModal = (title, message, onConfirm, options = {}) => {
    setConfirmationConfig({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setShowConfirmation(false);
      },
      confirmText: options.confirmText || 'Conferma',
      cancelText: options.cancelText || 'Annulla',
      type: options.type || 'warning'
    });
    setShowConfirmation(true);
  };

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
        .from("galleria")
        .list("", { sortBy: { column: "name", order: "asc" } })

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
                    .from("galleria")
                    .createSignedUrl(item.name, 3600)
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


      // Fetch immagini eventi passati dalla tabella eventoimmagine
      const eventImagesMap = {}
      for (const event of passati) {
        try {
          const { data: imagesData, error: eventImagesError } = await supabase
            .from("eventoimmagine")
            .select("*")
            .eq("id_evento_fk", event.id)
            .order("id", { ascending: true })

          if (eventImagesError) {
            console.warn(`Errore nel recupero immagini per evento ${event.id}:`, eventImagesError.message)
            eventImagesMap[event.id] = []
          } else {
            eventImagesMap[event.id] = (
              await Promise.all(
                imagesData.map(async (imageRecord) => {
                  try {
                    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                      .from("doc")
                      .createSignedUrl(imageRecord.path, 3600)
                    if (signedUrlError) {
                      throw new Error(`Errore generazione URL firmato per ${imageRecord.path}: ${signedUrlError.message}`)
                    }
                    return { 
                      id: imageRecord.id, 
                      url: signedUrlData.signedUrl, 
                      alt: imageRecord.descrizione || imageRecord.path.split('/').pop(), 
                      evento: event.titolo, 
                      path: imageRecord.path 
                    }
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
      showErrorBanner("Si è verificato un errore durante il caricamento di eventi o immagini: " + error.message)
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
      showErrorBanner("Si è verificato un errore durante il logout. Riprova.")
    }
  }

  // FUNZIONI DI GESTIONE EVENTI
  const handleNewEventChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file' && name === 'copertina') {
      const file = files[0]
      setNewEvent((prev) => ({ ...prev, [name]: file }))
      
      // Crea anteprima dell'immagine
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setCoverImagePreview(e.target.result)
        }
        reader.readAsDataURL(file)
      } else {
        setCoverImagePreview(null)
      }
    } else {
      setNewEvent((prev) => ({ ...prev, [name]: value }))
    }
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


  // API
  const handleCreateEvent = async (e) => {
    // e.preventDefault() is already handled by EventFormModal's handleSubmit
    setIsCreatingEvent(true)
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

      // Prima crea l'evento per ottenere l'ID
      const { data, error } = await supabase
        .from("evento")
        .insert({
          titolo: newEvent.titolo.trim(),
          descrizione: newEvent.descrizione.trim(),
          data: newEvent.data,
          fine: newEvent.fine,
          orario: newEvent.orario,
          luogo: newEvent.luogo.trim(),
          passato: false,
          quote: quotesJson,
          programma: newEvent.programma.trim() || null,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      // Se c'è un'immagine di copertina, caricala
      if (newEvent.copertina) {
        try {
          const fileExtension = newEvent.copertina.name.split('.').pop()
          const fileName = `copertina.${fileExtension}`
          const filePath = `eventi/${data.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("doc")
            .upload(filePath, newEvent.copertina, {
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            throw new Error(`Errore nel caricamento dell'immagine di copertina: ${uploadError.message}`)
          }

          // Aggiorna l'evento con il path dell'immagine di copertina
          const { error: updateError } = await supabase
            .from("evento")
            .update({ copertina: filePath })
            .eq("id", data.id)

          if (updateError) {
            throw new Error(`Errore nell'aggiornamento del path della copertina: ${updateError.message}`)
          }
        } catch (uploadError) {
          console.error("Errore durante l'upload della copertina:", uploadError)
          showErrorBanner("Evento creato ma errore nel caricamento della copertina: " + uploadError.message)
        }
      }

      showSuccessBanner("Evento creato con successo!")
      setShowNewEventForm(false)
      setCoverImagePreview(null) // Reset anteprima
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        fine:"",
        orario: "",
        luogo: "",
        programma: "",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }],
        copertina: null,
      })
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error)
      showErrorBanner("Errore nella creazione dell'evento: " + error.message)
    } finally {
      setIsCreatingEvent(false)
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
      fine: event.fine,
      orario: event.orario,
      luogo: event.luogo,
      programma: event.programma || "",
      quote: quotesArray,
      copertina: null, // Reset file input for editing
    })
    setCoverImagePreview(null) // Reset anteprima per editing
    setShowEditEventForm(true)
  }

  const handleUpdateEvent = async (e) => {
    // e.preventDefault() is already handled by EventFormModal's handleSubmit
    if (!editingEvent) return

    setIsUpdatingEvent(true)
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

      let copertinePath = editingEvent.copertina // Mantieni la copertina esistente se non viene caricata una nuova

      // Se c'è una nuova immagine di copertina, caricala
      if (newEvent.copertina) {
        try {
          const fileExtension = newEvent.copertina.name.split('.').pop()
          const fileName = `copertina.${fileExtension}`
          const filePath = `eventi/${editingEvent.id}/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from("doc")
            .upload(filePath, newEvent.copertina, {
              cacheControl: "3600",
              upsert: true,
            })

          if (uploadError) {
            throw new Error(`Errore nel caricamento dell'immagine di copertina: ${uploadError.message}`)
          }

          copertinePath = filePath
        } catch (uploadError) {
          console.error("Errore durante l'upload della copertina:", uploadError)
          showErrorBanner("Errore nel caricamento della nuova copertina: " + uploadError.message)
        }
      }

      const { data, error } = await supabase
        .from("evento")
        .update({
          titolo: newEvent.titolo.trim(),
          descrizione: newEvent.descrizione.trim(),
          data: newEvent.data,
          fine: newEvent.fine,
          orario: newEvent.orario,
          luogo: newEvent.luogo.trim(),
          programma: newEvent.programma.trim() || null,
          quote: quotesJson,
          copertina: copertinePath,
        })
        .eq("id", editingEvent.id)
        .select()
        .single()

      if (error) {
        throw error
      }

      showSuccessBanner("Evento aggiornato con successo!")
      setShowEditEventForm(false)
      setEditingEvent(null)
      setCoverImagePreview(null) // Reset anteprima
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        fine:"",
        orario: "",
        luogo: "",
        programma: "",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }],
        copertina: null,
      })
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'evento:", error)
      showErrorBanner("Errore nell'aggiornamento dell'evento: " + error.message)
    } finally {
      setIsUpdatingEvent(false)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    showConfirmationModal(
      "Elimina Evento",
      "Sei sicuro di voler eliminare questo evento? Verranno eliminate anche tutte le sue iscrizioni e immagini associate.",
      async () => {
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
            showErrorBanner(`Errore critico durante l'eliminazione dei guidatori. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`);
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
            showErrorBanner(`Errore critico durante l'eliminazione dei passeggeri. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`);
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
            showErrorBanner(`Errore durante l'eliminazione delle immagini dell'evento. L'evento potrebbe non essere completamente rimosso. Dettagli: ${error.message}`);
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
            showErrorBanner(`Errore critico durante l'eliminazione dell'evento. Riprova. Dettagli: ${error.message}`);
          }

          if (overallSuccess) {
            showSuccessBanner("Evento eliminato con successo, incluse iscrizioni e immagini associate!");
          } else {
            showErrorBanner("L'eliminazione dell'evento ha riscontrato alcuni problemi. Controlla i dettagli nel log della console.");
          }

          fetchEventsAndImages() // Refresh events after deletion
        } catch (error) {
          // This catch block would only be hit by synchronous errors or errors not caught by inner try-catches
          console.error("Errore generale durante la gestione dell'eliminazione dell'evento:", error)
          showErrorBanner("Si è verificato un errore inaspettato durante l'eliminazione dell'evento: " + error.message)
        }
      },
      {
        confirmText: "Elimina",
        cancelText: "Annulla",
        type: "danger"
      }
    );
  }

  const handleMarkAsPast = async (eventId) => {
    showConfirmationModal(
      "Segna come Passato",
      "Sei sicuro di voler segnare questo evento come passato? L'evento verrà spostato nella sezione eventi passati.",
      async () => {
        try {
          const { error } = await supabase
            .from("evento")
            .update({ passato: true })
            .eq("id", eventId)

          if (error) {
            throw error
          }
          showSuccessBanner("Evento contrassegnato come passato!")
          fetchEventsAndImages()
        } catch (error) {
          console.error("Errore nel contrassegnare l'evento come passato:", error)
          showErrorBanner("Errore nel contrassegnare l'evento come passato: " + error.message)
        }
      },
      {
        confirmText: "Segna come Passato",
        cancelText: "Annulla",
        type: "warning"
      }
    );
  }

  const handleRestoreToCurrent = async (eventId) => {
    showConfirmationModal(
      "Ripristina come Corrente",
      "Sei sicuro di voler ripristinare questo evento come corrente? L'evento verrà spostato nella sezione eventi correnti.",
      async () => {
        try {
          const { error } = await supabase
            .from("evento")
            .update({ passato: false })
            .eq("id", eventId)

          if (error) {
            throw error
          }
          showSuccessBanner("Evento ripristinato come corrente!")
          fetchEventsAndImages()
        } catch (error) {
          console.error("Errore nel ripristinare l'evento come corrente:", error)
          showErrorBanner("Errore nel ripristinare l'evento come corrente: " + error.message)
        }
      },
      {
        confirmText: "Ripristina",
        cancelText: "Annulla",
        type: "success"
      }
    );
  }

  // FUNZIONI DI GESTIONE IMMAGINI
  const handleImageUploadFiles = (e) => {
    setUploadFiles(Array.from(e.target.files))
  }

  const handleUploadImages = async () => {
    if (uploadFiles.length === 0) {
      showErrorBanner("Nessun file selezionato per il caricamento.");
      return;
    }

    setIsUploadingImages(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setTotalCount(uploadFiles.length);
    
    const bucket = uploadTarget.type === "event" ? "eventi" : "galleria";
    let successfulUploadsCount = 0;
    let failedUploadsCount = 0;
    const failedFiles = [];

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i];
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(file.name, file, {
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

          // Se è un upload per un evento, salva i metadati nella tabella eventoimmagine
          if (uploadTarget.type === "event" && uploadTarget.eventId) {
            try {
              const { error: dbError } = await supabase
                .from("eventoimmagine")
                .insert({
                  id_evento_fk: uploadTarget.eventId,
                  path: `${uploadFolderPath}/${file.name}`,
                  descrizione: file.name
                });

              if (dbError) {
                console.error(`Errore nel salvare i metadati dell'immagine ${file.name} nel database:`, dbError.message);
                // Non consideriamo questo un errore fatale, l'immagine è comunque caricata
              } else {
                console.log(`Metadati dell'immagine ${file.name} salvati nel database con successo.`);
              }
            } catch (dbError) {
              console.error(`Errore nel salvare i metadati dell'immagine ${file.name}:`, dbError.message);
            }
          }
        }
      } catch (error) {
        console.error(`Errore nel caricamento di "${file.name}":`, error.message);
        failedUploadsCount++;
        failedFiles.push(`${file.name} (${error.message})`);
      }
      
      // Aggiorna il progresso
      const completed = i + 1;
      setUploadedCount(completed);
      setUploadProgress((completed / uploadFiles.length) * 100);
    }

    if (successfulUploadsCount === uploadFiles.length) {
      showSuccessBanner("Tutte le immagini caricate con successo!");
    } else if (successfulUploadsCount > 0) {
      showErrorBanner(`Caricamento completato con ${successfulUploadsCount} immagini caricate e ${failedUploadsCount} fallite. Dettagli: ${failedFiles.join(", ")}`);
    } else {
      showErrorBanner(`Nessuna immagine caricata. Tutti i caricamenti sono falliti. Dettagli: ${failedFiles.join(", ")}`);
    }

    setShowImageUpload(false);
    setUploadFiles([]);
    setUploadProgress(0);
    setUploadedCount(0);
    setTotalCount(0);
    fetchEventsAndImages(); // Refresh galleries
    setIsUploadingImages(false);
  }

  const handleDeleteImage = async (imagePath, eventId = null) => {
    showConfirmationModal(
      "Elimina Immagine",
      "Sei sicuro di voler eliminare questa immagine?",
      async () => {
        try {
          // Elimina il file dal storage
          const { error } = await supabase.storage
            .from("doc")
            .remove([imagePath]);

          if (error) {
            throw error;
          }

          // Se l'immagine appartiene a un evento, elimina anche il record dalla tabella eventoimmagine
          if (imagePath.startsWith("eventi/")) {
            try {
              const { error: dbError } = await supabase
                .from("eventoimmagine")
                .delete()
                .eq("path", imagePath);

              if (dbError) {
                console.error(`Errore nell'eliminazione del record dell'immagine dal database:`, dbError.message);
                showErrorBanner("Immagine eliminata dal storage ma errore nell'eliminazione dal database: " + dbError.message);
              } else {
                console.log(`Record dell'immagine eliminato dal database con successo.`);
              }
            } catch (dbError) {
              console.error(`Errore nell'eliminazione del record dell'immagine:`, dbError.message);
              showErrorBanner("Immagine eliminata dal storage ma errore nell'eliminazione dal database: " + dbError.message);
            }
          }

          showSuccessBanner("Immagine eliminata con successo!");
          fetchEventsAndImages(); // Refresh galleries
        } catch (error) {
          console.error("Errore nell'eliminazione dell'immagine:", error);
          showErrorBanner("Errore nell'eliminazione dell'immagine: " + error.message);
        }
      },
      {
        confirmText: "Elimina",
        cancelText: "Annulla",
        type: "danger"
      }
    );
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
      showErrorBanner("Errore nel recupero delle iscrizioni: " + error.message)
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
    let yPos = 20
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height
    const margin = 20
    const maxWidth = pageWidth - (margin * 2)
    let currentPage = 1
    let totalPages = 1 // Sarà aggiornato alla fine

    const eventDate = new Date(event.data)

    // Formattazione in formato "gg/mm/aaaa"
    const formattedEventDate = `${eventDate.getDate().toString().padStart(2, '0')}/${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getFullYear()}`
        
    // Funzione per controllare se serve una nuova pagina
    const checkNewPage = (neededSpace = 10) => {
      if (yPos + neededSpace > pageHeight - 20) {
        // Aggiungi numero pagina corrente prima di passare alla prossima
        doc.setFontSize(10)
        doc.text(`pag. ${currentPage}/${totalPages}`, pageWidth - 25, pageHeight - 10)
        
        doc.addPage()
        currentPage++
        yPos = 20
        return true
      }
      return false
    }
    
    // Funzione per testo con wrap
    const addWrappedText = (text, x, y, maxWidth, lineHeight = 7) => {
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line, index) => {
        checkNewPage(lineHeight)
        doc.text(line, x, y + (index * lineHeight))
        yPos = y + ((index + 1) * lineHeight)
      })
      return yPos
    }
    
    // PAGINA 1
    // Intestazione
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('MODULO D\'ISCRIZIONE', pageWidth/2, yPos, { align: 'center' })
    yPos += 10
    doc.text(`EVENTO: "${event.titolo || 'SUPERCAR FOR PASSION'}"`, pageWidth/2, yPos, { align: 'center' })
    yPos += 15
    
    // Dati anagrafici del guidatore
    checkNewPage(50)
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('DATI ANAGRAFICI DEL GUIDATORE', margin, yPos)
    yPos += 8
    
    doc.setFont(undefined, 'normal')
    doc.text(`Cognome: ${registration.cognome}`, margin, yPos)
    doc.text(`Nome: ${registration.nome}`, margin + 90, yPos)
    yPos += 8
    doc.text(`Codice Fiscale: ${registration.codice_fiscale}`, margin, yPos)
    yPos += 8
    yPos = addWrappedText(`Patente di guida n.: ${registration.Patente}   Scadenza:${registration.PatenteS}  `, margin, yPos, maxWidth)
    yPos += 3
    doc.text(`Cellulare: ${registration.telefono}`, margin, yPos)
    doc.text(`e-mail: ${registration.indirizzo_email}`, margin + 90, yPos)
    yPos += 10
    
    // Dati anagrafici del passeggero
    checkNewPage(50)
    doc.setFont(undefined, 'bold')
    doc.text('DATI ANAGRAFICI DEL PASSEGGERO', margin, yPos)
    yPos += 8
    
    doc.setFont(undefined, 'normal')
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      const firstPassenger = registration.passeggeri[0]
      doc.text(`Cognome: ${firstPassenger.cognome || ''}`, margin, yPos)
      doc.text(`Nome: ${firstPassenger.nome || ''}`, margin + 90, yPos)
      yPos += 8
      doc.text(`Codice Fiscale: ${firstPassenger.codice_fiscale || ''}`, margin, yPos)
      yPos += 8
      doc.text(`Cellulare: ${firstPassenger.telefono || '________________________'}`, margin, yPos)
      doc.text(`e-mail: ${firstPassenger.indirizzo_email || '___________________________________'}`, margin + 90, yPos)
    } else {
      yPos = addWrappedText('Cognome: ___________________  Nome: _____________________', margin, yPos, maxWidth)
      yPos += 3
      yPos = addWrappedText('Codice Fiscale: ___________________________________________________', margin, yPos, maxWidth)
      yPos += 3
      yPos = addWrappedText('Cellulare: ____________________________________  e-mail: ___________________________________', margin, yPos, maxWidth)
    }
    yPos += 10
    
    // Dati autovettura
    checkNewPage(30)
    doc.setFont(undefined, 'bold')
    doc.text('DATI AUTOVETTURA UTILIZZATA PER L\'EVENTO', margin, yPos)
    yPos += 8
    
    doc.setFont(undefined, 'normal')
    yPos = addWrappedText(`Modello: ${registration.auto_modello || '___________________'}  Anno immatricolazione:${registration.auto_immatricolazione}  Colore: ${registration.auto_colore}  Targa: ${registration.auto_targa || '__________'}`, margin, yPos, maxWidth)
    yPos += 10
    
    // Chiede/chiedono
    checkNewPage(30)
    doc.setFont(undefined, 'bold')
    doc.text('CHIEDE/CHIEDONO', pageWidth/2, yPos, { align: 'center' })
    yPos += 8
    
    doc.setFont(undefined, 'normal')
    yPos = addWrappedText('di poter partecipare all\'evento in epigrafe a proprio rischio e pericolo, senza esclusiva, con l\'autovettura sopra identificata, coperta da assicurazione RCA in corso di validità.', margin, yPos, maxWidth)
    yPos += 10
    
checkNewPage(60)
doc.setFont(undefined, 'bold')
doc.text('PACCHETTO/SOLUZIONE DI PARTECIPAZIONE', margin, yPos)
yPos += 8

doc.setFont(undefined, 'normal')

// Ottieni i dati quote (stringa o oggetto)
let quoteData = event.quote

if (typeof quoteData === 'string') {
  try {
    quoteData = JSON.parse(quoteData)
  } catch (e) {
    console.error('Errore nel parsing del JSON:', e)
    quoteData = {}
  }
}

// Scorri le quote mantenendo sia chiave che oggetto
Object.entries(quoteData).forEach(([key, quotaObj]) => {
  checkNewPage(7)

  // Metti la spunta se il nome della quota corrisponde (es. 'quota2')
  const isSelected = registration.quota === key

  doc.text(isSelected ? '[X]' : '[ ]', margin, yPos)
  doc.text(quotaObj.titolo || key, margin + 15, yPos)

  yPos += 7
})

yPos += 8


    // Esigenze alimentari
    checkNewPage(30)
    const hasIntolleranze = registration.intolleranze && registration.intolleranze.trim() !== ''
    doc.text(`ESIGENZE ALIMENTARI GUIDATORE: SI ${hasIntolleranze ? '[X]' : '[ ]'}         NO ${hasIntolleranze ? '[ ]' : '[X]'}`, margin, yPos)
    yPos += 4
    yPos = addWrappedText(`Intolleranze/Allergie: ${registration.intolleranze || '____________________________________'}`, margin, yPos, maxWidth)
    yPos += 8
    
    // Esigenze alimentari passeggero
    let passengerIntolleranze = ''
    if (registration.passeggeri && registration.passeggeri.length > 0 && registration.passeggeri[0].intolleranze) {
      passengerIntolleranze = registration.passeggeri[0].intolleranze
    }
    const hasPassengerIntolleranze = passengerIntolleranze && passengerIntolleranze.trim() !== ''
    
    doc.text(`ESIGENZE ALIMENTARE PASSEGGERO: Intolleranze: SI ${hasPassengerIntolleranze ? '[X]' : '[ ]'}         NO ${hasPassengerIntolleranze ? '[ ]' : '[X]'}`, margin, yPos)
    yPos += 4
    yPos = addWrappedText(`Intolleranze/Allergie: ${passengerIntolleranze || '_______________________________'}`, margin, yPos, maxWidth)
    yPos += 10
    
    checkNewPage(20)
    yPos = addWrappedText(`Il sottoscritto (guidatore) ${registration.nome} ${registration.cognome}`, margin, yPos, maxWidth)
    
    let passengerName = ''
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      passengerName = `${registration.passeggeri[0].nome || ''} ${registration.passeggeri[0].cognome || ''}`.trim()
    }
    yPos = addWrappedText(` e il sottoscritto (passeggero) ${passengerName || '_____________________________________________'}`, margin, yPos, maxWidth)
    yPos += 10
    
    checkNewPage(15)
    doc.setFont(undefined, 'bold')
    doc.text('DICHIARA/DICHIARANO', margin, yPos)
    yPos += 8
    
    // Dichiarazioni (1-14)
    doc.setFont(undefined, 'normal')
    const dichiarazioni = [
      '1) d\'aver preso visione della brochure relativa all\'evento e di accettarne incondizionatamente il programma e le finalità;',
      '2) di voler partecipare esclusivamente a scopo turistico, senza alcun fine di gara o competizione, di essere a conoscenza che è assolutamente proibito gareggiare e che lo spirito della giornata e quello di far sì che i partecipanti possano trascorrere una o più giornate in compagnia, effettuando un giro turistico in macchina, nel pieno rispetto del vigente Codice della Strada;',
      '3) di utilizzare un mezzo di proprietà (od esserne autorizzato all\'uso dal legittimo proprietario che, pertanto, non potrà vantare alcun diritto) del quale si conferma piena efficienza, affidabilità e conformità al Codice della Strada;',
      '4) che il suddetto mezzo guidato durante l\'evento e in regola con pagamento bollo, RC Auto, revisione e tutto quanto e necessario per la circolazione;',
      '5) di ESONERARE, NEI LIMITI DI LEGGE, GLI ORGANIZZATORI E LA DITTA MARLAN S.R.L. da ogni responsabilità civile per danni a persone o cose che dovessero derivare dalla partecipazione all\'evento, esclusivamente nei casi di colpa lieve, restando espressamente escluso ogni esonero per i danni causati da dolo, colpa grave o da violazione di norme di ordine pubblico e di sicurezza. La presente clausola non limita in alcun modo i diritti dei terzi e la copertura assicurativa obbligatoria per la responsabilità civile verso terzi prevista dalla legge;',
      '6) di ASSUMERSI OGNI RESPONSABILITÀ VERSO TERZI E DI MANTENERE COPERTURA RCA OBBLIGATORIA per danni eventualmente arrecati a terzi, inclusi altri partecipanti, mezzi e passeggeri, durante l\'evento. Gli organizzatori e la ditta Marlan S.r.l. sono esonerati, nei limiti previsti dalla legge e salvo il caso di dolo, colpa grave o violazione di norme inderogabili, da ogni responsabilità per pretese avanzate da terzi a seguito della partecipazione all\'evento. Il sottoscritto dichiara di essere titolare di una polizza RCA valida per il mezzo utilizzato, quale garanzia a favore dei terzi danneggiati;',
      '7) di SOLLEVARE ED ESONERARE GLI ORGANIZZATORI (ALDEBARANDRIVE – MARLAN S.R.L.) da responsabilità per eventuali perdite, sottrazioni, danni, furti e/o danneggiamenti, e relative spese, subiti durante l\'evento, salvo che tali eventi derivino da dolo, colpa grave degli organizzatori o da violazione di norme imperative;',
      '8) di trovarsi in perfetta salute fisica e psichica;',
      '9) di PRENDERE ATTO CHE L\'ISCRIZIONE È ACCETTATA SOLO IN PRESENZA DI ESONERO NEI LIMITI DI LEGGE e che, in difetto, non sarebbe stata accettata l\'iscrizione. È fatto salvo il diritto al risarcimento nei casi di dolo, colpa grave o violazione di norme di ordine pubblico o di sicurezza da parte degli organizzatori. Resta salva la tutela dei terzi danneggiati e la piena efficacia della copertura assicurativa obbligatoria per la responsabilità civile verso terzi;',
      '10) d\'essere consapevole che l\'abuso di bevande alcoliche compromette la propria sicurezza e quella delle altre persone;',
      '11) di essere a conoscenza che gli Organizzatori, presenti all\'evento, potranno arbitrariamente decidere, per motivi di sicurezza o per comportamenti che ledono il decoro e il buon nome ALDEBARANDRIVE – MARLAN S.R.L., l\'allontanamento insindacabile dal gruppo;',
      '12) che la quota di iscrizione versata a favore dell\'Organizzazione non sarà restituibile, neppure parzialmente;',
      '13) di essere a conoscenza che gli Organizzatori potranno, nel caso lo ritenessero opportuno, intraprendere le adeguate azioni legali a tutela degli stessi e di terzi, versando eventuali risarcimenti ad Enti di beneficenza od alle parti lese;',
      '14) di impegnarsi, per tutta la durata dell\'evento, a rispettare scrupolosamente il vigente Codice della Strada e tutte le ulteriori norme di sicurezza applicabili, mantenendo sempre una condotta prudente e diligente. Il sottoscritto/a si obbliga a prestare la massima attenzione al percorso, adeguando la guida alle condizioni della strada, del traffico, della segnaletica e alle indicazioni fornite dagli organizzatori o dalle autorità preposte. Il mancato rispetto di tali obblighi potrà comportare l\'esclusione dall\'evento e la responsabilità personale per eventuali danni arrecati a sé, a terzi o a cose.'
    ]
    
    dichiarazioni.forEach(dichiarazione => {
      checkNewPage(32)
      yPos = addWrappedText(dichiarazione, margin, yPos, maxWidth)
      yPos += 5
    })
    
    // Sezioni firme GUIDATORE
    checkNewPage(70)
    yPos = addWrappedText(`IL GUIDATORE: ${registration.cognome} ${registration.nome}`, margin, yPos, maxWidth)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma __________________', margin + 90, yPos)
    yPos += 12
    
    yPos = addWrappedText(`Il/La sottoscritto/a ${registration.cognome} ${registration.nome} dichiara di aver preso visione consapevole e di approvare le clausole di cui ai punti 5) Responsabilità, 6) Pretese, 7) Esonero, 9) Rinuncia, 11) Allontanamento e 13) Azioni legali.`, margin, yPos, maxWidth)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ____________________', margin + 90, yPos)
    yPos += 12
    
    yPos = addWrappedText(`Il/La sottoscritto/a ${registration.cognome} ${registration.nome} dichiara ai sensi del DPR n.445 del 28/12/2000 la veridicità dei dati trasmessi, conferma espressamente tutto quanto sopra precede ad ogni e qualsiasi effetto di legge ed autorizza il trattamento dei dati personali ai sensi del D.lgs. 196 del 30 giugno 2003 e s.m.i.`, margin, yPos, maxWidth)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma _________________', margin + 90, yPos)
    yPos += 12
    
    // Sezione PASSEGGERO
    checkNewPage(60)
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      const firstPassenger = registration.passeggeri[0]
      yPos = addWrappedText(`IL PASSEGGERO: ${firstPassenger.cognome || ''} ${firstPassenger.nome || ''}`, margin, yPos, maxWidth)
    } else {
      yPos = addWrappedText('IL PASSEGGERO (inserire Cognome e nome): __________________________________', margin, yPos, maxWidth)
    }
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ______________________', margin + 90, yPos)
    yPos += 12
    
    // Aggiungi nome e cognome del passeggero dopo "Il/La sottoscritto/a"
    let passengerFullName = '___________________________________________'
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      const firstPassenger = registration.passeggeri[0]
      if (firstPassenger.nome && firstPassenger.cognome) {
        passengerFullName = `${firstPassenger.nome} ${firstPassenger.cognome} `
      }
    }
    
    yPos = addWrappedText(`Il/La sottoscritto/a ${passengerFullName}dichiara di aver preso visione consapevole e di approvare le clausole di cui ai punti 5) Responsabilità, 6) Pretese, 7) Esonero, 9) Rinuncia, 11) Allontanamento e 13) Azioni legali.`, margin, yPos, maxWidth)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ____________________', margin + 90, yPos)
    yPos += 12
    
    yPos = addWrappedText(`Il/La sottoscritto/a ${passengerFullName}dichiara ai sensi del DPR n.445 del 28/12/2000 la veridicità dei dati trasmessi, conferma espressamente tutto quanto sopra precede ad ogni e qualsiasi effetto di legge ed autorizza il trattamento dei dati personali ai sensi del D.lgs. 196 del 30 giugno 2003 e s.m.i.`, margin, yPos, maxWidth)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ___________________', margin + 90, yPos)
    yPos += 15
    
    // AUTORIZZAZIONI
    checkNewPage(120)
    doc.setFont(undefined, 'bold')
    doc.text('AUTORIZZA/AUTORIZZANO', pageWidth/2, yPos, { align: 'center' })
    yPos += 10
    
    doc.setFont(undefined, 'normal')
    yPos = addWrappedText('a titolo gratuito, senza limiti di tempo, anche ai sensi degli artt. 10 e 320 cod. civ. e degli artt. 96 e 97 legge 22.4.1941, n. 633, Legge sul diritto d\'autore, l\'utilizzo delle foto o video ripresi durante le iniziative e gli eventi organizzati dall\'ALDEBARANDRIVE – MARLAN S.R.L., alla pubblicazione e/o diffusione in qualsiasi forma delle proprie immagini sul sito internet dell\'ALDEBARANDRIVE – MARLAN S.R.L., su carta stampata e/o su qualsiasi altro mezzo di diffusione, nonché autorizzano la conservazione delle foto e dei video stessi negli archivi informatici dell\'ALDEBARANDRIVE – MARLAN S.R.L. e prendono atto che la finalità di tali pubblicazioni sono meramente di carattere informativo ed eventualmente promozionale.', margin, yPos, maxWidth)
    yPos += 10
    
    yPos = addWrappedText('La presente liberatoria/autorizzazione potrà essere revocata in ogni tempo con comunicazione scritta da inviare via posta comune o e-mail', margin, yPos, maxWidth)
    yPos += 10
    
    yPos = addWrappedText(`IL GUIDATORE : ${registration.cognome} ${registration.nome}`, margin, yPos, maxWidth)
    yPos += 8
    doc.text('[X] Acconsento [ ] Non acconsento', margin, yPos)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma _________________', margin + 90, yPos)
    yPos += 12
    
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      const firstPassenger = registration.passeggeri[0]
      yPos = addWrappedText(`IL PASSEGGERO: ${firstPassenger.cognome || ''} ${firstPassenger.nome || ''}`, margin, yPos, maxWidth)
    } else {
      yPos = addWrappedText('IL PASSEGGERO (inserire Cognome e nome): ____________________________', margin, yPos, maxWidth)
    }
    yPos += 8
    doc.text('[X] Acconsento [ ] Non acconsento', margin, yPos)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ____________________', margin + 90, yPos)
    yPos += 12
    
    // Seconda autorizzazione
    checkNewPage(120)
    doc.setFont(undefined, 'bold')
    doc.text('AUTORIZZA/AUTORIZZANO', pageWidth/2, yPos, { align: 'center' })
    yPos += 10
    
    doc.setFont(undefined, 'normal')
    yPos = addWrappedText('Ai sensi dell\'art. 13 del d.lg.196/2003 La informiamo che i dati personali che La riguardano verranno trattati secondo principi di correttezza, liceità e trasparenza, e di tutela della Sua riservatezza e dei Suoi diritti, al fine di garantire il corretto uso della card e a fini statistici interni. Il titolare del trattamento è l\'ALDEBARANDRIVE – MARLAN S.R.L., cui Lei potrà rivolgersi in ogni momento per esercitare i diritti di cui all\'art. 7 del d.leg.196/03. In tale ottica i dati forniti, ivi incluso il ritratto contenuto nelle fotografie o i video su indicati, verranno utilizzati per le finalità strettamente connesse e strumentali alle attività come indicate nella Vostra stessa liberatoria. Il conferimento del consenso al trattamento dei dati personali è facoltativo. In qualsiasi momento è possibile esercitare tutti i diritti indicati dall\'articolo 7 del D. Lgs. n. 196/2003, in particolare la cancellazione, la rettifica o l\'integrazione dei dati. Tali diritti potranno essere esercitati inviando comunicazione scritta. I dati saranno conservati all\'interno dell\'archivio cartaceo ed informatico, non saranno oggetto di comunicazione o diffusioni a terzi e verranno trattati nell\'ambito dell\'organizzazione del Titolare da soggetti qualificati.', margin, yPos, maxWidth)
    yPos += 10
    
    yPos = addWrappedText(`IL GUIDATORE: ${registration.cognome} ${registration.nome}`, margin, yPos, maxWidth)
    yPos += 8
    doc.text('[X] Acconsento [ ] Non acconsento', margin, yPos)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma ______________', margin + 90, yPos)
    yPos += 12
    
    if (registration.passeggeri && registration.passeggeri.length > 0) {
      const firstPassenger = registration.passeggeri[0]
      yPos = addWrappedText(`IL PASSEGGERO: ${firstPassenger.cognome || ''} ${firstPassenger.nome || ''}`, margin, yPos, maxWidth)
    } else {
      yPos = addWrappedText('IL PASSEGGERO (inserire Cognome e nome): _____________________________________________________', margin, yPos, maxWidth)
    }
    yPos += 8
    doc.text('[X] Acconsento [ ] Non acconsento', margin, yPos)
    yPos += 8
    doc.text(`Lì ${formattedEventDate}`, margin, yPos)
    doc.text('Firma _____________________', margin + 90, yPos)
    
    // Gestione passeggeri aggiuntivi (dal secondo in poi)
    if (registration.passeggeri && registration.passeggeri.length > 1) {
      for (let i = 1; i < registration.passeggeri.length; i++) {
        const passenger = registration.passeggeri[i]
        doc.addPage()
        currentPage++
        yPos = 20
        
        doc.setFontSize(16)
        doc.setFont(undefined, 'bold')
        doc.text(`PASSEGGERO AGGIUNTIVO ${i + 1}`, pageWidth/2, yPos, { align: 'center' })
        yPos += 15
        
        doc.setFontSize(12)
        doc.setFont(undefined, 'normal')
        yPos = addWrappedText(`Nome: ${passenger.nome || ''} ${passenger.cognome || ''}`, margin, yPos, maxWidth)
        yPos += 8
        yPos = addWrappedText(`Codice Fiscale: ${passenger.codice_fiscale || ''}`, margin, yPos, maxWidth)
        yPos += 8
        yPos = addWrappedText(`Cellulare: ${passenger.telefono || ''}`, margin, yPos, maxWidth)
        yPos += 8
        yPos = addWrappedText(`E-mail: ${passenger.email || ''}`, margin, yPos, maxWidth)
        yPos += 15
        
        // Esigenze alimentari passeggero aggiuntivo
        const hasPassengerIntolleranze = passenger.intolleranze && passenger.intolleranze.trim() !== ''
        doc.text(`ESIGENZE ALIMENTARI: SI ${hasPassengerIntolleranze ? '[X]' : '[ ]'}         NO ${hasPassengerIntolleranze ? '[ ]' : '[X]'}`, margin, yPos)
        yPos += 8
        yPos = addWrappedText(`se SI indicare Intolleranze/Allergie: ${passenger.intolleranze || ''}`, margin, yPos, maxWidth)
        yPos += 20
        
        yPos = addWrappedText(`IL PASSEGGERO: ${passenger.cognome || ''} ${passenger.nome || ''}`, margin, yPos, maxWidth)
        yPos += 8
        doc.text(`Lì ${formattedEventDate}`, margin, yPos)
        doc.text('Firma ______________', margin + 90, yPos)
        yPos += 12
        
        yPos = addWrappedText(`Il/La sottoscritto/a ${passenger.nome || ''} ${passenger.cognome || ''} dichiara di aver preso visione consapevole e di approvare le clausole di cui ai punti 5) Responsabilità, 6) Pretese, 7) Esonero, 9) Rinuncia, 11) Allontanamento e 13) Azioni legali.`, margin, yPos, maxWidth)
        yPos += 8
        doc.text(`Lì ${formattedEventDate}`, margin, yPos)
        doc.text('Firma ______________', margin + 90, yPos)
        yPos += 12
        
        yPos = addWrappedText(`Il/La sottoscritto/a ${passenger.nome || ''} ${passenger.cognome || ''} dichiara ai sensi del DPR n.445 del 28/12/2000 la veridicità dei dati trasmessi, conferma espressamente tutto quanto sopra precede ad ogni e qualsiasi effetto di legge ed autorizza il trattamento dei dati personali ai sensi del D.lgs. 196 del 30 giugno 2003 e s.m.i.`, margin, yPos, maxWidth)
        yPos += 8
        doc.text(`Lì ${formattedEventDate}`, margin, yPos)
        doc.text('Firma ______________', margin + 90, yPos)
        yPos += 20
        
        // Autorizzazioni per passeggero aggiuntivo
        doc.text('[X] Acconsento [ ] Non acconsento (Autorizzazione foto/video)', margin, yPos)
        yPos += 8
        doc.text(`Lì ${formattedEventDate}`, margin, yPos)
        doc.text('Firma _____________', margin + 90, yPos)
        yPos += 12
        
        doc.text('[X] Acconsento [ ] Non acconsento (Trattamento dati)', margin, yPos)
        yPos += 8
        doc.text(`Lì ${formattedEventDate}`, margin, yPos)
        doc.text('Firma ______________', margin + 90, yPos)
      }
    }
    
    // Aggiorna il numero totale di pagine
    totalPages = currentPage
    
    // Aggiungi i numeri di pagina a tutte le pagine
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(`pag. ${i}/${totalPages}`, pageWidth - 25, pageHeight - 10)
    }
    
    doc.save(`modulo_iscrizione_${registration.nome}_${registration.cognome}.pdf`)
    showSuccessBanner("PDF generato con successo!")
    
  } catch (error) {
    console.error("Errore durante la generazione del PDF:", error)
    showErrorBanner("Errore durante la generazione del PDF: " + error.message)
  }
}
  const handleOpenInvoiceUpload = (registration) => {
    setSelectedRegistration(registration)
    setShowInvoiceUpload(true)
  }

  const handleInvoiceUpload = async () => {
    if (!invoiceFile || !selectedRegistration) {
      showErrorBanner("File fattura o registrazione non selezionati.");
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
  
      // Scarica il file appena caricato (come Blob)
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from("doc")
        .download(filePath);
  
      if (downloadError || !fileBlob) {
        throw new Error("Impossibile scaricare la fattura per allegarla.");
      }
  
      // Converte il Blob in base64
      const arrayBuffer = await fileBlob.arrayBuffer();
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(arrayBuffer))
      );
  
      const email = selectedRegistration.indirizzo_email;
      if (!email) {
        throw new Error("Email non presente nella registrazione selezionata.");
      }
  
      // Costruisci soggetto e corpo personalizzati
      const subject = `Fattura per ${selectedRegistration.nome} ${selectedRegistration.cognome} - Evento: ${selectedEventForRegistrations.titolo}`;
  
      const htmlBody = `
        <p>Ciao <strong>${selectedRegistration.nome} ${selectedRegistration.cognome}</strong>,</p>
        <p>Grazie per aver partecipato all'evento <strong>${selectedEventForRegistrations.titolo}</strong>.</p>
        <p>In allegato trovi la tua fattura <strong>${invoiceFile.name}</strong>.</p>
        <p>Per qualsiasi domanda, non esitare a contattarci.</p>
        <p>Buona giornata!</p>
        <p>Il team di AldebaranDrive</p>
      `;
  
      // Invia email con allegato
      const emailResponse = await fetch('/api/resendFatturaApi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject,
          htmlBody,
          filename: invoiceFile.name,
          base64: base64String,
        }),
      });
  
      const contentType = emailResponse.headers.get("content-type");
      let emailResult;
      if (contentType && contentType.includes("application/json")) {
        emailResult = await emailResponse.json();
      } else {
        const text = await emailResponse.text();
        throw new Error("Risposta API non valida: " + text);
      }
  
      if (!emailResponse.ok) {
        throw new Error(emailResult?.error || "Errore durante l'invio dell'email");
      }
  
      showSuccessBanner("Fattura inviata via email con successo!");
      setShowInvoiceUpload(false);
      setInvoiceFile(null);
      setSelectedRegistration(null);
  
      // Settare a true verificato
      const { data, error } = await supabase
        .from('guidatore')
        .update({ verificato: true })
        .eq('id', selectedRegistration.id);
  
      if (error) {
        console.error('Errore aggiornamento guidatore:', error);
      } else {
        console.log('Guidatore aggiornato:', data);
      }
  
    } catch (error) {
      console.error("Errore invio fattura:", error);
      showErrorBanner("Errore: " + error.message);
    }
  };
  
  
  

  const openDocumentInModal = async (documentPath, type, isPassenger = false) => {
    if (!documentPath) {
      showErrorBanner("URL del documento non valido.");
      return;
    }

    try {      const fullPath = documentPath;      const { data, error } = await supabase.storage.from("doc").createSignedUrl(fullPath, 3600); // URL valido per 1 ora

      if (error) {
        throw new Error(`Errore nella generazione dell'URL firmato: ${error.message}`);
      }

      setCurrentDocumentUrl(data.signedUrl);
      setCurrentDocumentType(type);
      setShowDocumentModal(true);
    } catch (error) {
      console.error("Errore nell'apertura del documento:", error);
      showErrorBanner("Errore nell'apertura del documento: " + error.message);
    }
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
          showErrorBanner={showErrorBanner}
          isCreatingEvent={isCreatingEvent}
          isUpdatingEvent={false}
          coverImagePreview={coverImagePreview}
          onClose={() => {
            setShowNewEventForm(false)
            setCoverImagePreview(null) // Reset anteprima alla chiusura
            setNewEvent({
              titolo: "",
              descrizione: "",
              data: "",
              fine: "",
              orario: "",
              luogo: "",
              programma: "",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }],
              copertina: null,
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
          showErrorBanner={showErrorBanner}
          isCreatingEvent={false}
          isUpdatingEvent={isUpdatingEvent}
          coverImagePreview={coverImagePreview}
          onClose={() => {
            setShowEditEventForm(false)
            setEditingEvent(null)
            setCoverImagePreview(null) // Reset anteprima alla chiusura
            setNewEvent({
              titolo: "",
              descrizione: "",
              data: "",
              fine:"",
              orario: "",
              luogo: "",
              programma: "",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }],
              copertina: null,
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
          showErrorBanner={showErrorBanner}
          isUploadingImages={isUploadingImages}
          uploadProgress={uploadProgress}
          uploadedCount={uploadedCount}
          totalCount={totalCount}
          onClose={() => {
            setShowImageUpload(false)
            setUploadFiles([])
            setUploadTarget({ type: "general", eventId: null })
            setUploadProgress(0)
            setUploadedCount(0)
            setTotalCount(0)
          }}
        />
      )}

      {showInvoiceUpload && (
        <InvoiceUploadModal
          selectedRegistration={selectedRegistration}
          invoiceFile={invoiceFile}
          setInvoiceFile={setInvoiceFile}
          handleInvoiceUpload={handleInvoiceUpload}
          showErrorBanner={showErrorBanner}
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

      {/* Modal di Conferma */}
      <ConfirmationModal
        isOpen={showConfirmation}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        onConfirm={confirmationConfig.onConfirm}
        onCancel={() => setShowConfirmation(false)}
        confirmText={confirmationConfig.confirmText}
        cancelText={confirmationConfig.cancelText}
        type={confirmationConfig.type}
      />

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

      {/* BANNER DI NOTIFICA */}
      {showBanner && (
        <div className={`fixed top-0 left-0 right-0 z-[9999] p-6 text-center font-bold text-white shadow-2xl transform transition-all duration-700 ease-in-out border-b-4 ${
          bannerType === 'success' 
            ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 border-green-300' 
            : 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 border-red-300'
        }`} style={{ 
          boxShadow: bannerType === 'success' 
            ? '0 10px 25px rgba(34, 197, 94, 0.4)' 
            : '0 10px 25px rgba(239, 68, 68, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-black shadow-lg ${
                bannerType === 'success' ? 'bg-white text-green-600' : 'bg-white text-red-600'
              }`}>
                {bannerType === 'success' ? '✓' : '⚠'}
              </div>
              <span className="text-base md:text-lg whitespace-pre-line font-semibold">{bannerMessage}</span>
            </div>
            <button
              onClick={closeBanner}
              className="ml-4 text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/20"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Barra di progresso per auto-dismiss */}
          <div className={`absolute bottom-0 left-0 h-1 ${
            bannerType === 'success' ? 'bg-green-300' : 'bg-red-300'
          } animate-progress`}></div>
        </div>
      )}

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
  <TabsList className="grid w-full grid-cols-5 bg-gray-200 rounded-lg h-16 sm:h-20 p-1 sm:p-2 shadow-lg border border-gray-300 mb-8">

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
      value="eventGallery" 
      className="text-xs sm:text-base font-semibold px-1 sm:px-3 py-2 data-[state=active]:bg-black data-[state=active]:text-white rounded-md transition-colors duration-200 flex flex-col sm:flex-row items-center justify-center"
    >
      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-1" />
      <span className="hidden sm:inline">Gallerie Eventi</span>
      <span className="sm:hidden text-xs mt-1">Eventi</span>
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
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.fine}</span>
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
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span>{event.fine}</span>
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
                        onClick={() => handleRestoreToCurrent(event.id)}
                        className="text-blue-600 border-blue-400 hover:bg-blue-50 flex items-center gap-2 text-xs sm:text-sm py-2 px-3"
                      >
                        <CheckIcon className="w-4 h-4" /> Ripristina a Corrente
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
