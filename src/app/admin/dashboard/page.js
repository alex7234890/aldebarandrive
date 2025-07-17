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
          <form onSubmit={isEditMode ? handleUpdateEvent : handleCreateEvent} className="space-y-6">
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
const ImageUploadModal = ({ uploadTarget, uploadFiles, handleImageUploadFiles, handleUploadImages, onClose }) => (
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
        <div className="space-y-6">
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
              onClick={handleUploadImages}
              disabled={uploadFiles.length === 0}
              className="text-base font-semibold bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              <UploadIcon className="mr-2 h-5 w-5" />
              Carica Immagini
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Modal per l'upload di fatture
const InvoiceUploadModal = ({ selectedRegistration, invoiceFile, setInvoiceFile, handleInvoiceUpload, onClose }) => (
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
        <div className="space-y-6">
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
              onClick={handleInvoiceUpload}
              disabled={!invoiceFile}
              className="text-base font-semibold bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
            >
              <SendIcon className="mr-2 h-5 w-5" />
              Carica e Invia Email
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

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
                      {reg.docuemnto_retro && (
                        <Button
                          variant="outline"
                          onClick={() => openDocumentInModal(reg.docuemnto_retro, "pdf")}
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
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error || !session) {
        router.push("/admin/login")
      } else {
        setLoading(false)
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
  const [loadingRegistrations, setLoadingRegistrations] = useState(false)
  const [loadingImages, setLoadingImages] = useState(true)

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
      const { data: eventiData, error: eventiError } = await supabase
        .from("evento")
        .select("*")
        .order("data", { ascending: true })

      if (eventiError) throw eventiError

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

      if (generalImagesError) throw generalImagesError

      const loadedGeneralImages = (
        await Promise.all(
          generalImagesData
            .filter((item) => item.name !== ".emptyFolderPlaceholder")
            .map(async (item) => {
              const { data: signedUrlData, error: urlError } = await supabase.storage
                .from("doc")
                .createSignedUrl(`galleria/${item.name}`, 3600)

              if (urlError) {
                console.error(`Errore generazione URL firmato per galleria/${item.name}:`, urlError)
                return null
              }
              return {
                id: item.id,
                url: signedUrlData.signedUrl,
                alt: item.name,
                evento: "Generale",
                path: `galleria/${item.name}`,
              }
            }),
        )
      ).filter(Boolean)

      setGalleryImages(loadedGeneralImages)

      // Fetch immagini eventi passati
      const eventImagesMap = {}
      for (const event of passati) {
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
                  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("doc")
                    .createSignedUrl(`eventi/${event.id}/${item.name}`, 3600)

                  if (signedUrlError) {
                    console.warn(
                      `Errore generazione URL firmato per eventi/${event.id}/${item.name}:`,
                      signedUrlError.message,
                    )
                    return null
                  }
                  return {
                    id: item.id,
                    url: signedUrlData.signedUrl,
                    alt: item.name,
                    evento: event.titolo,
                    path: `eventi/${event.id}/${item.name}`,
                  }
                }),
            )
          ).filter(Boolean)
        }
      }
      setEventGalleryImages(eventImagesMap)
    } catch (error) {
      console.error("Errore nel caricamento eventi o immagini:", error)
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
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Errore durante il logout:", error.message)
      alert("Si è verificato un errore durante il logout. Riprova.")
    } else {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminLoginTime")
      router.push("/admin/login")
    }
  }

  // FUNZIONI DI GESTIONE EVENTI
  const handleNewEventChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addQuota = () => {
    setNewEvent((prev) => ({
      ...prev,
      quote: [...prev.quote, { titolo: "", descrizione: "", prezzo: "" }],
    }))
  }

  const removeQuota = (index) => {
    setNewEvent((prev) => ({
      ...prev,
      quote: prev.quote.filter((_, i) => i !== index),
    }))
  }

  const updateQuota = (index, field, value) => {
    setNewEvent((prev) => ({
      ...prev,
      quote: prev.quote.map((quota, i) => (i === index ? { ...quota, [field]: value } : quota)),
    }))
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    try {
      const quotesJson = {}
      newEvent.quote.forEach((q, index) => {
        if (q.titolo && q.descrizione && q.prezzo !== "") {
          quotesJson[`quota${index + 1}`] = {
            titolo: q.titolo,
            descrizione: q.descrizione,
            prezzo: q.prezzo,
          }
        }
      })

      const { data, error } = await supabase
        .from("evento")
        .insert({
          titolo: newEvent.titolo,
          descrizione: newEvent.descrizione,
          data: newEvent.data,
          orario: newEvent.orario,
          luogo: newEvent.luogo,
          partecipanti: Number.parseInt(newEvent.partecipanti),
          numeroauto: Number.parseInt(newEvent.numeroauto),
          passato: false,
          quote: quotesJson,
          programma: newEvent.programma || null,
        })
        .select()
        .single()

      if (error) throw error

      alert("Evento creato con successo!")
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
      alert("Errore nella creazione dell'evento: " + error.message)
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    const quotesArray = event.quote
      ? Object.entries(event.quote).map(([key, value]) => ({
          titolo: value.titolo || "",
          descrizione: value.descrizione || "",
          prezzo: value.prezzo || "",
        }))
      : [{ titolo: "", descrizione: "", prezzo: "" }]

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
    e.preventDefault()
    if (!editingEvent) return

    try {
      const quotesJson = {}
      newEvent.quote.forEach((q, index) => {
        if (q.titolo && q.descrizione && q.prezzo !== "") {
          quotesJson[`quota${index + 1}`] = {
            titolo: q.titolo,
            descrizione: q.descrizione,
            prezzo: q.prezzo,
          }
        }
      })

      const { error } = await supabase
        .from("evento")
        .update({
          titolo: newEvent.titolo,
          descrizione: newEvent.descrizione,
          data: newEvent.data,
          orario: newEvent.orario,
          luogo: newEvent.luogo,
          partecipanti: Number.parseInt(newEvent.partecipanti),
          numeroauto: Number.parseInt(newEvent.numeroauto),
          quote: quotesJson,
          programma: newEvent.programma || null,
        })
        .eq("id", editingEvent.id)

      if (error) throw error

      alert("Evento aggiornato con successo!")
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
      alert("Errore nell'aggiornamento dell'evento: " + error.message)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Sei sicuro di voler eliminare questo evento? Questa operazione è irreversibile e eliminerà anche tutte le iscrizioni e le immagini associate.",
      )
    ) {
      return
    }
    try {
      await supabase.from("guidatore").delete().eq("id_evento_fk", eventId)
      await supabase.from("passeggero").delete().eq("id_evento_fk", eventId)

      const { data: files, error: listError } = await supabase.storage.from("doc").list(`eventi/${eventId}`)
      if (listError && listError.message !== "The specified key does not exist.") {
        console.error("Errore nel listare i file dell'evento per l'eliminazione:", listError)
      } else if (files && files.length > 0) {
        const fileNames = files.map((file) => `eventi/${eventId}/${file.name}`)
        const { error: removeFilesError } = await supabase.storage.from("doc").remove(fileNames)
        if (removeFilesError) {
          console.error("Errore nell'eliminazione dei file dell'evento dallo storage:", removeFilesError)
        }
      }

      const { error } = await supabase.from("evento").delete().eq("id", eventId)

      if (error) throw error

      alert("Evento eliminato con successo!")
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'eliminazione dell'evento:", error)
      alert("Errore nell'eliminazione dell'evento: " + error.message)
    }
  }

  const markEventAsPast = async (eventId, isPast) => {
    try {
      const { error } = await supabase.from("evento").update({ passato: isPast }).eq("id", eventId)

      if (error) throw error

      alert(`Evento marcato come ${isPast ? "passato" : "futuro"}!`)
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato dell'evento:", error)
      alert("Errore nell'aggiornamento dello stato dell'evento: " + error.message)
    }
  }

  // FUNZIONI DI GESTIONE IMMAGINI
  const handleImageUploadFiles = (e) => {
    setUploadFiles(Array.from(e.target.files))
  }

  const handleUploadImages = async () => {
    if (uploadFiles.length === 0) {
      alert("Seleziona almeno un file da caricare.")
      return
    }

    let uploadBasePath = ""
    if (uploadTarget.type === "general") {
      uploadBasePath = "galleria"
    } else if (uploadTarget.type === "event" && uploadTarget.eventId) {
      uploadBasePath = `eventi/${uploadTarget.eventId}`
    } else {
      alert("Target di caricamento immagini non valido.")
      return
    }

    try {
      for (const file of uploadFiles) {
        const fileName = `${Date.now()}_${file.name}`
        const storagePath = `${uploadBasePath}/${fileName}`

        const { data: uploadedFile, error: uploadError } = await supabase.storage
          .from("doc")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

        if (uploadError) {
          console.error(`Errore nel caricamento di ${file.name}:`, uploadError)
          alert(`Errore nel caricamento di ${file.name}: ${uploadError.message}`)
          continue
        }
      }
      alert("Immagini caricate con successo!")
      setShowImageUpload(false)
      setUploadFiles([])
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore generale nel caricamento immagini:", error)
      alert("Errore generale nel caricamento immagini: " + error.message)
    }
  }

  const handleDeleteImage = async (imageToDelete) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa immagine?")) {
      return
    }

    const storagePathToRemove = imageToDelete.path

    try {
      const { error: storageDeleteError } = await supabase.storage.from("doc").remove([storagePathToRemove])

      if (storageDeleteError) {
        console.error("Errore nell'eliminazione del file dallo storage:", storageDeleteError)
        alert("Errore nell'eliminazione del file immagine dallo storage: " + storageDeleteError.message)
        return
      }

      alert("Immagine eliminata con successo!")
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore generale nell'eliminazione immagine:", error)
      alert("Errore generale nell'eliminazione immagine: " + error.message)
    }
  }

  // FUNZIONI DI GESTIONE ISCRIZIONI
  const handleViewRegistrations = async (eventId) => {
    setLoadingRegistrations(true)
    setSelectedEventForRegistrations(null)
    setRegistrations([])
    try {
      const { data: eventData, error: eventError } = await supabase
        .from("evento")
        .select("*")
        .eq("id", eventId)
        .single()
      if (eventError) throw eventError
      setSelectedEventForRegistrations(eventData)

      // Fetch guidatori
      const { data: guidatoriData, error: guidatoriError } = await supabase
        .from("guidatore")
        .select("*")
        .eq("id_evento_fk", eventId)
      if (guidatoriError) throw guidatoriError

      // Fetch passeggeri per ogni guidatore
      const formattedRegistrations = await Promise.all(
        guidatoriData.map(async (guidatore) => {
          // Genera URL firmati per i documenti del guidatore
          let documento_fronte_url = null
          let documento_retro_url = null

          if (guidatore.documento_fronte) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from("doc")
              .createSignedUrl(guidatore.documento_fronte, 3600)
            if (!signedUrlError) documento_fronte_url = signedUrlData?.signedUrl
          }

          if (guidatore.documento_retro) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from("doc")
              .createSignedUrl(guidatore.documento_retro, 3600)
            if (!signedUrlError) documento_retro_url = signedUrlData?.signedUrl
          }

          // Fetch passeggeri per questo guidatore
          const { data: passeggeriData, error: passeggeriError } = await supabase
            .from("passeggero")
            .select("*")
            .eq("id_guidatore_fk", guidatore.id)

          let passeggeriFormatted = []
          if (!passeggeriError && passeggeriData) {
            passeggeriFormatted = await Promise.all(
              passeggeriData.map(async (p) => {
                let doc_fronte_url = null
                let doc_retro_url = null

                if (p.documento_fronte) {
                  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("doc")
                    .createSignedUrl(p.documento_fronte, 3600)
                  if (!signedUrlError) doc_fronte_url = signedUrlData?.signedUrl
                }

                if (p.docuemnto_retro) {
                  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                    .from("doc")
                    .createSignedUrl(p.docuemnto_retro, 3600)
                  if (!signedUrlError) doc_retro_url = signedUrlData?.signedUrl
                }

                return {
                  ...p,
                  documento_fronte: doc_fronte_url,
                  docuemnto_retro: doc_retro_url,
                }
              }),
            )
          }

          return {
            ...guidatore,
            documento_fronte: documento_fronte_url,
            docuemnto_retro: documento_retro_url,
            passeggeri: passeggeriFormatted,
          }
        }),
      )

      setRegistrations(formattedRegistrations)
      setShowRegistrationsModal(true)
    } catch (error) {
      console.error("Errore nel recupero delle iscrizioni:", error)
      alert("Errore nel recupero delle iscrizioni: " + error.message)
    } finally {
      setLoadingRegistrations(false)
    }
  }

  const handleGenerateIndividualPdf = (registration, event) => {
    if (!registration || !event) {
      alert("Dati iscrizione o evento non disponibili.")
      return
    }

    const doc = new jsPDF()
    let y = 10
    const margin = 10
    const lineHeight = 7
    const pageHeight = doc.internal.pageSize.height

    // Titolo del documento
    doc.setFontSize(16)
    doc.text(`Iscrizione Evento: ${event.titolo}`, margin, y)
    y += lineHeight * 2

    doc.setFontSize(12)

    // Informazioni evento
    doc.text(`Data: ${event.data} alle ${event.orario}`, margin, y)
    y += lineHeight
    doc.text(`Luogo: ${event.luogo}`, margin, y)
    y += lineHeight * 2

    // Informazioni guidatore/passeggero
    if (registration.auto_marca) {
      doc.setFontSize(14)
      doc.text("GUIDATORE", margin, y)
      y += lineHeight
      doc.setFontSize(12)

      doc.text(`Nome: ${registration.nome} ${registration.cognome}`, margin, y)
      y += lineHeight
      doc.text(`Codice Fiscale: ${registration.codice_fiscale}`, margin, y)
      y += lineHeight
      doc.text(`Data Nascita: ${registration.data_nascita}`, margin, y)
      y += lineHeight
      doc.text(`Email: ${registration.indirizzo_email}`, margin, y)
      y += lineHeight
      doc.text(`Telefono: ${registration.telefono}`, margin, y)
      y += lineHeight
      doc.text(`Indirizzo: ${registration.indirizzo}`, margin, y)
      y += lineHeight
      doc.text(`Quota Selezionata: ${registration.quota}`, margin, y)
      y += lineHeight
      doc.text(`Intolleranze: ${registration.intolleranze || "Nessuna"}`, margin, y)
      y += lineHeight * 2

      // Informazioni auto
      doc.setFontSize(14)
      doc.text("AUTO", margin, y)
      y += lineHeight
      doc.setFontSize(12)

      doc.text(`Marca: ${registration.auto_marca}`, margin, y)
      y += lineHeight
      doc.text(`Modello: ${registration.auto_modello}`, margin, y)
      y += lineHeight
      doc.text(`Targa: ${registration.auto_targa}`, margin, y)
      y += lineHeight
      doc.text(`Posti Auto: ${registration.posti_auto}`, margin, y)
      y += lineHeight * 2

      // Informazioni passeggeri
      if (registration.passeggeri && registration.passeggeri.length > 0) {
        doc.setFontSize(14)
        doc.text(`PASSEGGERI (${registration.passeggeri.length})`, margin, y)
        y += lineHeight
        doc.setFontSize(12)

        registration.passeggeri.forEach((pass, index) => {
          if (y + lineHeight * 8 > pageHeight - margin) {
            doc.addPage()
            y = margin
          }

          doc.text(`${index + 1}. ${pass.nome} ${pass.cognome}`, margin, y)
          y += lineHeight
          doc.text(`   CF: ${pass.codice_fiscale}`, margin, y)
          y += lineHeight
          doc.text(`   Data Nascita: ${pass.data_nascita}`, margin, y)
          y += lineHeight
          doc.text(`   Email: ${pass.indirizzo_email}`, margin, y)
          y += lineHeight
          doc.text(`   Telefono: ${pass.telefono}`, margin, y)
          y += lineHeight
          doc.text(`   Intolleranze: ${pass.intolleranze || "Nessuna"}`, margin, y)
          y += lineHeight * 2
        })
      }
    } else {
      // È un passeggero
      doc.setFontSize(14)
      doc.text("PASSEGGERO", margin, y)
      y += lineHeight
      doc.setFontSize(12)

      doc.text(`Nome: ${registration.nome} ${registration.cognome}`, margin, y)
      y += lineHeight
      doc.text(`Codice Fiscale: ${registration.codice_fiscale}`, margin, y)
      y += lineHeight
      doc.text(`Data Nascita: ${registration.data_nascita}`, margin, y)
      y += lineHeight
      doc.text(`Email: ${registration.indirizzo_email}`, margin, y)
      y += lineHeight
      doc.text(`Telefono: ${registration.telefono}`, margin, y)
      y += lineHeight
      doc.text(`Indirizzo: ${registration.indirizzo}`, margin, y)
      y += lineHeight
      doc.text(`Intolleranze: ${registration.intolleranze || "Nessuna"}`, margin, y)
    }

    const fileName = `iscrizione_${registration.nome}_${registration.cognome}_${event.titolo.replace(/\s/g, "_")}.pdf`
    doc.save(fileName)
  }

  const handleOpenInvoiceUpload = (registration) => {
    setSelectedRegistration(registration)
    setInvoiceFile(null)
    setShowInvoiceUpload(true)
  }

  const handleInvoiceUpload = async () => {
    if (!invoiceFile || !selectedRegistration) {
      alert("Seleziona un file fattura e assicurati che l'iscrizione sia selezionata.")
      return
    }

    try {
      // Carica la fattura su Supabase Storage
      const fileName = `fattura_${selectedRegistration.id}_${Date.now()}_${invoiceFile.name}`
      const storagePath = `fatture/${fileName}`

      const { data: uploadedFile, error: uploadError } = await supabase.storage
        .from("doc")
        .upload(storagePath, invoiceFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError || !uploadedFile || !uploadedFile.path) {
        console.error(
          "Errore nel caricamento della fattura o percorso non valido:",
          uploadError || "Uploaded file or path is missing",
        )
        alert(
          "Errore nel caricamento della fattura o percorso non valido: " +
            (uploadError?.message || "File non caricato correttamente."),
        )
        return
      }

      // Simula invio email
      console.log(`Simulazione invio email a: ${selectedRegistration.indirizzo_email}`)
      console.log(`Allegato fattura: ${uploadedFile.path}`)
      alert(`Fattura caricata con successo e email inviata a ${selectedRegistration.indirizzo_email}!`)

      setShowInvoiceUpload(false)
      setSelectedRegistration(null)
      setInvoiceFile(null)

      if (selectedEventForRegistrations) {
        handleViewRegistrations(selectedEventForRegistrations.id)
      }
    } catch (error) {
      console.error("Errore generale nel caricamento fattura:", error)
      alert("Errore generale nel caricamento fattura: " + error.message)
    }
  }

  const openDocumentInModal = (url, type) => {
    setCurrentDocumentUrl(url)
    setCurrentDocumentType(type)
    setShowDocumentModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto"></div>
          <p className="text-xl text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 font-sans antialiased">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-black text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <ActivityIcon className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">Dashboard Amministratore</h1>
            <p className="text-gray-300 mt-1">Gestisci eventi, iscrizioni e gallerie</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-lg font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
        >
          <LogOutIcon className="mr-2 h-6 w-6" /> Logout
        </Button>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100 rounded-lg p-2 shadow-lg border border-gray-300 mb-8">
          <TabsTrigger
            value="overview"
            className="text-base sm:text-lg font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200"
          >
            <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Panoramica</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-base sm:text-lg font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200"
          >
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Eventi Futuri</span>
            <span className="sm:hidden">Futuri</span>
          </TabsTrigger>
          <TabsTrigger
            value="past-events"
            className="text-base sm:text-lg font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200"
          >
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Eventi Passati</span>
            <span className="sm:hidden">Passati</span>
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="text-base sm:text-lg font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-300 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-200"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="hidden sm:inline">Galleria</span>
            <span className="sm:hidden">Foto</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Panoramica */}
        <TabsContent value="overview" className="mt-0">
          <Card className="bg-white shadow-lg rounded-lg border border-gray-300">
            <CardHeader className="bg-black text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
                <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                Panoramica Generale
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg sm:text-xl mt-2">
                Riepilogo delle attività e scorciatoie rapide per la gestione della piattaforma
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
                <Card className="text-center p-6 sm:p-8 bg-gray-50 border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-4xl sm:text-6xl font-bold text-black">{events.length}</CardTitle>
                  <CardDescription className="text-gray-700 text-lg sm:text-xl mt-3 font-semibold">
                    Eventi Futuri
                  </CardDescription>
                </Card>

                <Card className="text-center p-6 sm:p-8 bg-gray-50 border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-4xl sm:text-6xl font-bold text-gray-600">{pastEvents.length}</CardTitle>
                  <CardDescription className="text-gray-700 text-lg sm:text-xl mt-3 font-semibold">
                    Eventi Passati
                  </CardDescription>
                </Card>

                <Card className="text-center p-6 sm:p-8 bg-gray-50 border-2 border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle className="text-4xl sm:text-6xl font-bold text-gray-800">
                    {galleryImages.length + Object.values(eventGalleryImages).flat().length}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-lg sm:text-xl mt-3 font-semibold">
                    Immagini Totali
                  </CardDescription>
                </Card>
              </div>

              <Separator className="my-8 sm:my-12 bg-gray-300 h-px" />

              <h3 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-black flex items-center gap-3">
                <TrendingUpIcon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                Operazioni Rapide
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Button
                  onClick={() => {
                    setShowNewEventForm(true)
                    setActiveTab("events")
                  }}
                  className="bg-black hover:bg-gray-800 text-white text-lg sm:text-xl font-semibold py-4 sm:py-6 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <PlusIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" /> Crea Nuovo Evento
                </Button>
                <Button
                  onClick={() => {
                    setShowImageUpload(true)
                    setUploadTarget({ type: "general", eventId: null })
                    setActiveTab("gallery")
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white text-lg sm:text-xl font-semibold py-4 sm:py-6 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <UploadIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" /> Carica Immagini
                </Button>
                <Button
                  onClick={() => setActiveTab("events")}
                  variant="outline"
                  className="text-lg sm:text-xl font-semibold py-4 sm:py-6 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 border-2 border-gray-400 text-black hover:bg-gray-100"
                >
                  <EyeIcon className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7" /> Visualizza Eventi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Eventi Futuri */}
        <TabsContent value="events" className="mt-0">
          <Card className="bg-white shadow-lg rounded-lg border border-gray-300">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black text-white rounded-t-lg p-6 sm:p-8 gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
                  <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                  Eventi Futuri
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg sm:text-xl mt-2">
                  Gestisci gli eventi in programma
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowNewEventForm(true)}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-base sm:text-lg font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-200"
              >
                <PlusIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Nuovo Evento
              </Button>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {loadingEvents ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                  <p className="text-xl sm:text-2xl text-gray-500">Caricamento eventi futuri...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
                  <div className="text-xl sm:text-2xl text-gray-500">Nessun evento futuro in programma</div>
                  <Button
                    onClick={() => setShowNewEventForm(true)}
                    className="mt-6 bg-black hover:bg-gray-800 text-white"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" /> Crea il primo evento
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-300 bg-white rounded-lg overflow-hidden"
                    >
                      <div className="border-l-4 border-black">
                        <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                          <CardTitle className="text-lg sm:text-2xl font-bold text-black flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                            <span className="line-clamp-2">{event.titolo}</span>
                          </CardTitle>
                          <CardDescription className="text-base sm:text-lg text-gray-700 mt-2 line-clamp-3">
                            {event.descrizione}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-base sm:text-lg px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base">
                                {event.data} alle {event.orario}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base line-clamp-1">{event.luogo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-300">
                                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base">{event.partecipanti}</span>
                              </div>
                              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-300">
                                <CarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                                <span className="font-semibold text-sm sm:text-base">{event.numeroauto}</span>
                              </div>
                            </div>
                          </div>

                          {event.quote && Object.values(event.quote).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {Object.values(event.quote).map((q, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-black text-white text-xs sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 font-semibold rounded-lg"
                                >
                                  {q.titolo}: €{q.prezzo}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 pt-4 border-t border-gray-300">
                            <Button
                              variant="outline"
                              onClick={() => handleEditEvent(event)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <EditIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Modifica
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleViewRegistrations(event.id)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <EyeIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => markEventAsPast(event.id, true)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <CheckIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Completato
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                            >
                              <TrashIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Elimina
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
        </TabsContent>

        {/* Tab: Eventi Passati */}
        <TabsContent value="past-events" className="mt-0">
          <Card className="bg-white shadow-lg rounded-lg border border-gray-300">
            <CardHeader className="bg-gray-800 text-white rounded-t-lg p-6 sm:p-8">
              <CardTitle className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
                <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                Eventi Passati
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg sm:text-xl mt-2">
                Gestisci gli eventi completati e le loro gallerie
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {loadingPastEvents ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
                  <p className="text-xl sm:text-2xl text-gray-500">Caricamento eventi passati...</p>
                </div>
              ) : pastEvents.length === 0 ? (
                <div className="text-center py-16">
                  <ClockIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-6" />
                  <div className="text-xl sm:text-2xl text-gray-500">Nessun evento passato</div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-300 bg-white rounded-lg overflow-hidden"
                    >
                      <div className="border-l-4 border-gray-800">
                        <CardHeader className="pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                          <CardTitle className="text-lg sm:text-2xl font-bold text-black flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                            <span className="line-clamp-2">{event.titolo}</span>
                          </CardTitle>
                          <CardDescription className="text-base sm:text-lg text-gray-700 mt-2 line-clamp-3">
                            {event.descrizione}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-base sm:text-lg px-4 sm:px-6 pb-4 sm:pb-6">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base">
                                {event.data} alle {event.orario}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-300">
                              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base line-clamp-1">{event.luogo}</span>
                            </div>
                          </div>

                          {event.quote && Object.values(event.quote).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {Object.values(event.quote).map((q, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-gray-800 text-white text-xs sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 font-semibold rounded-lg"
                                >
                                  {q.titolo}: €{q.prezzo}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 pt-4 border-t border-gray-300">
                            <Button
                              variant="outline"
                              onClick={() => handleViewRegistrations(event.id)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <EyeIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowImageUpload(true)
                                setUploadTarget({ type: "event", eventId: event.id })
                              }}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <UploadIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Carica Immagini
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => markEventAsPast(event.id, false)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            >
                              <CheckIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Riattiva
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-xs sm:text-base font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                            >
                              <TrashIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Elimina
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
        </TabsContent>

        {/* Tab: Galleria Immagini */}
        <TabsContent value="gallery" className="mt-0">
          <Card className="bg-white shadow-lg rounded-lg border border-gray-300">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-700 text-white rounded-t-lg p-6 sm:p-8 gap-4">
              <div>
                <CardTitle className="text-2xl sm:text-4xl font-bold flex items-center gap-3">
                  <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                  Galleria Immagini
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg sm:text-xl mt-2">
                  Gestisci le immagini della galleria generale e degli eventi
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setShowImageUpload(true)
                  setUploadTarget({ type: "general", eventId: null })
                }}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-black text-base sm:text-lg font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow-lg transition-all duration-200"
              >
                <UploadIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" /> Carica Immagini
              </Button>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              {loadingImages ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
                  <div className="text-xl sm:text-2xl text-gray-500">Caricamento immagini galleria...</div>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-12">
                  {/* Galleria Generale */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black flex items-center gap-3">
                      <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
                      Immagini Galleria Generale
                    </h3>
                    {galleryImages.length === 0 ? (
                      <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-400">
                        <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-lg sm:text-xl text-gray-500 mb-4">
                          Nessuna immagine nella galleria generale
                        </div>
                        <Button
                          onClick={() => {
                            setShowImageUpload(true)
                            setUploadTarget({ type: "general", eventId: null })
                          }}
                          className="bg-black hover:bg-gray-800 text-white"
                        >
                          <UploadIcon className="mr-2 h-5 w-5" /> Carica prima immagine
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                        {galleryImages.map((image) => (
                          <div
                            key={image.path}
                            className="relative group rounded-lg overflow-hidden shadow-lg border border-gray-300 aspect-square hover:shadow-xl transition-all duration-300"
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg?height=400&width=400"
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteImage(image)}
                                className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <TrashIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="my-8 sm:my-12 bg-gray-300 h-px" />

                  {/* Gallerie per Eventi Passati */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black flex items-center gap-3">
                      <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-800" />
                      Immagini per Eventi Passati
                    </h3>
                    {pastEvents.length === 0 ? (
                      <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-400">
                        <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-lg sm:text-xl text-gray-500">Nessun evento passato disponibile</div>
                      </div>
                    ) : (
                      pastEvents.map((event) => (
                        <div
                          key={event.id}
                          className="mb-8 sm:mb-10 p-6 sm:p-8 rounded-lg bg-gray-50 shadow-lg border border-gray-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                            <h4 className="text-xl sm:text-2xl font-bold text-black flex items-center gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <span className="line-clamp-1">{event.titolo}</span>
                            </h4>
                            <Button
                              onClick={() => {
                                setShowImageUpload(true)
                                setUploadTarget({ type: "event", eventId: event.id })
                              }}
                              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white text-sm sm:text-base"
                            >
                              <UploadIcon className="mr-2 h-4 w-4" /> Aggiungi Immagini
                            </Button>
                          </div>
                          {eventGalleryImages[event.id] && eventGalleryImages[event.id].length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                              {eventGalleryImages[event.id].map((image) => (
                                <div
                                  key={image.path}
                                  className="relative group rounded-lg overflow-hidden shadow-lg border border-gray-300 aspect-square hover:shadow-xl transition-all duration-300"
                                >
                                  <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src = "/placeholder.svg?height=400&width=400"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => handleDeleteImage(image)}
                                      className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                    >
                                      <TrashIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed border-gray-400">
                              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                              <div className="text-base sm:text-lg text-gray-500">
                                Nessuna immagine per questo evento
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modali */}
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
          handleUpdateEvent={handleUpdateEvent}
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
      {showEditEventForm && (
        <EventFormModal
          isEditMode={true}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleNewEventChange={handleNewEventChange}
          addQuota={addQuota}
          removeQuota={removeQuota}
          updateQuota={updateQuota}
          handleCreateEvent={handleCreateEvent}
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
      {showImageUpload && (
        <ImageUploadModal
          uploadTarget={uploadTarget}
          uploadFiles={uploadFiles}
          handleImageUploadFiles={handleImageUploadFiles}
          handleUploadImages={handleUploadImages}
          onClose={() => {
            setShowImageUpload(false)
            setUploadFiles([])
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
    </div>
  )
}
