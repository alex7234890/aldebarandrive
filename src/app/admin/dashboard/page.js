"use client"

// Import delle librerie e componenti necessari
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
import Link from "next/link" // <--- AGGIUNTO QUESTO IMPORT
import Image from "next/image" // <--- AGGIUNTO QUESTO IMPORT PER Image componente di next/image

// Modale per nuovo/modifica evento
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-6 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">{isEditMode ? "Modifica Evento" : "Crea Nuovo Evento"}</CardTitle>
            <CardDescription className="text-indigo-100 mt-1">
              {isEditMode ? "Aggiorna i dettagli dell'evento" : "Inserisci i dettagli per il nuovo evento"}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <XIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={isEditMode ? handleUpdateEvent : handleCreateEvent} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="titolo" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Titolo Evento
                </Label>
                <Input
                  id="titolo"
                  name="titolo"
                  value={newEvent.titolo}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                  placeholder="Inserisci il titolo dell'evento"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="descrizione" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4" />
                  Descrizione
                </Label>
                <Textarea
                  id="descrizione"
                  name="descrizione"
                  value={newEvent.descrizione}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 min-h-[120px] transition-colors"
                  placeholder="Descrivi l'evento in dettaglio"
                />
              </div>

              <div>
                <Label htmlFor="data" className="text-base font-semibold text-gray-800 flex items-center gap-2">
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
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                />
              </div>

              <div>
                <Label htmlFor="orario" className="text-base font-semibold text-gray-800 flex items-center gap-2">
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
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="luogo" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Luogo
                </Label>
                <Input
                  id="luogo"
                  name="luogo"
                  value={newEvent.luogo}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                  placeholder="Dove si svolgerà l'evento"
                />
              </div>

              <div>
                <Label htmlFor="partecipanti" className="text-base font-semibold text-gray-800 flex items-center gap-2">
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
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                  min="1"
                />
              </div>

              <div>
                <Label htmlFor="numeroAuto" className="text-base font-semibold text-gray-800 flex items-center gap-2">
                  <CarIcon className="w-4 h-4" />
                  Max Auto
                </Label>
                <Input
                  id="numeroAuto"
                  name="numeroAuto"
                  type="number"
                  value={newEvent.numeroAuto}
                  onChange={handleNewEventChange}
                  required
                  className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-3 mt-2 transition-colors"
                  min="1"
                />
              </div>
            </div>

            {/* Gestione Quote con design migliorato */}
            <div className="space-y-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white">
              <Label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUpIcon className="w-5 h-5" />
                Quote di Partecipazione
              </Label>
              <div className="space-y-3">
                {newEvent.quote.map((quota, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex-1 w-full">
                      <Input
                        placeholder="Titolo Quota (es. Partecipazione Base)"
                        value={quota.titolo}
                        onChange={(e) => updateQuota(index, "titolo", e.target.value)}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors mb-2 md:mb-0"
                        required
                      />
                      <Textarea
                        placeholder="Descrizione della quota (es. Accesso al raduno e welcome kit)"
                        value={quota.descrizione}
                        onChange={(e) => updateQuota(index, "descrizione", e.target.value)}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors min-h-[60px]"
                        required
                      />
                    </div>
                    <div className="w-full md:w-32 flex-shrink-0">
                      <Input
                        placeholder="Prezzo (€)"
                        type="number"
                        step="0.01"
                        value={quota.prezzo}
                        onChange={(e) => updateQuota(index, "prezzo", e.target.value)}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors"
                        required
                        min="0"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuota(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition-colors flex-shrink-0"
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
                className="w-full text-base border-dashed border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 rounded-lg py-3 transition-colors bg-transparent"
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Aggiungi Quota
              </Button>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors bg-transparent"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className={`text-base font-semibold py-3 px-6 rounded-lg text-white shadow-lg transition-all duration-200 ${
                  isEditMode
                    ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
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

// Modale per l'upload di immagini con design migliorato
const ImageUploadModal = ({ uploadTarget, uploadFiles, handleImageUploadFiles, handleUploadImages, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-lg animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl p-6 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="w-6 h-6" />
            Carica Immagini
          </CardTitle>
          <CardDescription className="text-blue-100 mt-1">
            Seleziona le immagini da caricare nella galleria
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label
              htmlFor="image-upload"
              className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3"
            >
              <UploadIcon className="w-4 h-4" />
              Seleziona File Immagine
            </Label>
            <Input
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUploadFiles}
              accept="image/*"
              className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
            />
          </div>

          {uploadFiles.length > 0 && (
            <div className="p-4 border-2 border-dashed border-blue-200 rounded-xl bg-blue-50">
              <p className="text-base font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                File selezionati ({uploadFiles.length})
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-blue-700 bg-white px-3 py-2 rounded-lg"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors bg-transparent"
            >
              Annulla
            </Button>
            <Button
              onClick={handleUploadImages}
              disabled={uploadFiles.length === 0}
              className="text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

// Modale per l'upload di fatture (MODIFICATA - solo caricamento e invio email)
const InvoiceUploadModal = ({ selectedRegistration, invoiceFile, setInvoiceFile, handleInvoiceUpload, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-lg animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl p-6 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileTextIcon className="w-6 h-6" />
            Carica Fattura
          </CardTitle>
          <CardDescription className="text-green-100 mt-1">Carica e invia la fattura al guidatore</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
            <p className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              Destinatario
            </p>
            <div className="space-y-1">
              <p className="text-lg font-bold text-gray-900">
                {selectedRegistration?.guidatore.nome} {selectedRegistration?.guidatore.cognome}
              </p>
              <p className="text-base text-gray-600 flex items-center gap-2">
                <MailIcon className="w-4 h-4" />
                {selectedRegistration?.guidatore.email}
              </p>
            </div>
          </div>

          <div>
            <Label
              htmlFor="invoice-upload"
              className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3"
            >
              <UploadIcon className="w-4 h-4" />
              Seleziona Fattura (PDF)
            </Label>
            <Input
              id="invoice-upload"
              type="file"
              onChange={(e) => setInvoiceFile(e.target.files[0])}
              accept=".pdf"
              className="text-base border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-colors"
            />
          </div>

          {invoiceFile && (
            <div className="p-4 border-2 border-dashed border-green-200 rounded-xl bg-green-50">
              <p className="text-base font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                File selezionato
              </p>
              <div className="flex items-center gap-2 text-sm text-green-700 bg-white px-3 py-2 rounded-lg">
                <FileTextIcon className="w-4 h-4" />
                {invoiceFile.name}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors bg-transparent"
            >
              Annulla
            </Button>
            <Button
              onClick={handleInvoiceUpload}
              disabled={!invoiceFile}
              className="text-base font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

// Modale per visualizzare le iscrizioni con design migliorato
const RegistrationsModal = ({
  selectedEventForRegistrations,
  registrations,
  loadingRegistrations,
  handleGenerateIndividualPdf, // This function will be removed or repurposed later
  handleOpenInvoiceUpload,
  openImagesInModal, // Changed from openDocumentInModal
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl p-6">
        <div>
          <CardTitle className="text-3xl font-bold">Iscrizioni per: {selectedEventForRegistrations?.titolo}</CardTitle>
          <CardDescription className="text-purple-100 mt-2 text-lg">
            Gestisci le iscrizioni e genera documenti
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <XIcon className="h-7 w-7" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {loadingRegistrations ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
              <Card
                key={reg.id}
                className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden"
              >
                <div className="border-l-4 border-purple-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      {reg.guidatore.nome} {reg.guidatore.cognome}
                      <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-800 px-3 py-1">
                        #{index + 1}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Informazioni Guidatore */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <MailIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-semibold">{reg.guidatore.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <PhoneIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Cellulare</p>
                          <p className="font-semibold">{reg.guidatore.cellulare}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <FileTextIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Codice Fiscale</p>
                          <p className="font-semibold">{reg.guidatore.codiceFiscale}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <CalendarIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Data Nascita</p>
                          <p className="font-semibold">{reg.guidatore.dataNascita}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <TrendingUpIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Quota</p>
                          <Badge className="bg-green-100 text-green-800">{reg.guidatore.quota}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <AlertCircleIcon className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Intolleranze</p>
                          <p className="font-semibold">{reg.guidatore.intolleranze || "Nessuna"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <MapPinIcon className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Indirizzo</p>
                        <p className="font-semibold">{reg.guidatore.indirizzo}</p>
                      </div>
                    </div>

                    {/* Documenti Guidatore - Ora Immagini Fronte/Retro */}
                    <div className="flex flex-wrap gap-3">
                      {(reg.guidatore.patenteFronteUrl || reg.guidatore.patenteRetroUrl) && (
                        <Button
                          variant="outline"
                          onClick={() => openImagesInModal([reg.guidatore.patenteFronteUrl, reg.guidatore.patenteRetroUrl].filter(Boolean), "Patente")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-colors"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" /> Vedi Patente
                        </Button>
                      )}
                      {(reg.guidatore.ricevutaFronteUrl || reg.guidatore.ricevutaRetroUrl) && (
                        <Button
                          variant="outline"
                          onClick={() => openImagesInModal([reg.guidatore.ricevutaFronteUrl, reg.guidatore.ricevutaRetroUrl].filter(Boolean), "Ricevuta")}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 transition-colors"
                        >
                          <ImageIcon className="mr-2 h-4 w-4" /> Vedi Ricevuta
                        </Button>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Informazioni Auto */}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CarIcon className="w-6 h-6 text-gray-600" />
                        Dettagli Auto
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Marca</p>
                          <p className="font-semibold">{reg.auto.marca}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Modello</p>
                          <p className="font-semibold">{reg.auto.modello}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Targa</p>
                          <p className="font-semibold">{reg.auto.targa}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Posti Auto</p>
                          <p className="font-semibold">{reg.auto.postiAuto}</p>
                        </div>
                      </div>
                    </div>

                    {/* Passeggeri */}
                    {reg.passeggeri && reg.passeggeri.length > 0 && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-gray-600" />
                            Passeggeri ({reg.passeggeri.length})
                          </h4>
                          <div className="space-y-4">
                            {reg.passeggeri.map((pass, pIndex) => (
                              <div key={pIndex} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-bold text-lg text-gray-800">
                                    {pass.nome} {pass.cognome}
                                  </h5>
                                  <Badge variant="outline" className="bg-gray-100">
                                    #{pIndex + 1}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500">CF:</span>{" "}
                                    <span className="font-semibold">{pass.codiceFiscale}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Data Nascita:</span>{" "}
                                    <span className="font-semibold">{pass.dataNascita}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Email:</span>{" "}
                                    <span className="font-semibold">{pass.email}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Cellulare:</span>{" "}
                                    <span className="font-semibold">{pass.cellulare}</span>
                                  </div>
                                  <div className="md:col-span-2">
                                    <span className="text-gray-500">Intolleranze:</span>{" "}
                                    <span className="font-semibold">{pass.intolleranze || "Nessuna"}</span>
                                  </div>
                                </div>
                                {(pass.documentoFronteUrl || pass.documentoRetroUrl) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-colors"
                                    onClick={() => openImagesInModal([pass.documentoFronteUrl, pass.documentoRetroUrl].filter(Boolean), "Documento Passeggero")}
                                  >
                                    <ImageIcon className="mr-2 h-4 w-4" /> Vedi Documento
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator className="my-4" />

                    {/* Azioni */}
                    <div className="flex flex-wrap gap-3">
                      {/* handleGenerateIndividualPdf will likely be removed or adapted, keeping placeholder for now */}
                      <Button
                        onClick={() => handleGenerateIndividualPdf(reg, selectedEventForRegistrations)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transition-all duration-200"
                      >
                        <DownloadIcon className="mr-2 h-5 w-5" /> Esporta PDF {/* This will need review if PDF export is still desired for images */}
                      </Button>
                      <Button
                        onClick={() => handleOpenInvoiceUpload(reg)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg transition-all duration-200"
                      >
                        <UploadIcon className="mr-2 h-5 w-5" /> Carica Fattura
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

// Modale per visualizzare documenti - Adattato per Immagini
const ImageViewerModal = ({ currentImageUrls, currentDocumentTitle, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-5xl h-[90vh] flex flex-col animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl p-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Visualizzatore {currentDocumentTitle}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-4 bg-gray-50 rounded-b-2xl overflow-y-auto">
        {currentImageUrls && currentImageUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full justify-center items-center">
            {currentImageUrls.map((url, index) => (
              <div key={index} className="flex flex-col items-center justify-center h-full w-full">
                <p className="text-gray-700 text-lg font-semibold mb-2">
                  {index === 0 ? "Fronte" : "Retro"}
                </p>
                <img
                  src={url}
                  alt={`${currentDocumentTitle} - ${index === 0 ? "Fronte" : "Retro"}`}
                  className="max-w-full max-h-[40vh] object-contain rounded-lg shadow-md border border-gray-200"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ImageIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <div className="text-gray-600 text-xl">Nessuna immagine disponibile o URL non valido</div>
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
    numeroAuto: "",
    tipo: "AUTO",
    quote: [{ titolo: "", descrizione: "", prezzo: "" }], // MODIFICATO: Struttura quote
  })
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadTarget, setUploadTarget] = useState({ type: "general", eventId: null })
  const [uploadFiles, setUploadFiles] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState(null)
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false)
  const [showDocumentModal, setShowDocumentModal] = useState(false) // This is now for image viewer
  const [currentImageUrls, setCurrentImageUrls] = useState([]) // MODIFICATO: Per array di URL immagine
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState("") // MODIFICATO: Titolo del documento (es. Patente)

  // STATI PER FATTURE (MODIFICATI - solo caricamento)
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
        if (eventDate < now) {
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
              return { id: item.id, url: signedUrlData.signedUrl, alt: item.name, evento: "Generale", path: `galleria/${item.name}`, }
            }),
        )
      ).filter(Boolean)
      setGalleryImages(loadedGeneralImages)

      // Fetch immagini eventi passati
      const eventImagesMap = {}
      for (const event of passati) {
        const { data: imagesData, error: eventImagesError } = await supabase
          .from("eventoimmagine")
          .select("*")
          .eq("id_evento_fk", event.id)
          .order("id", { ascending: true })
        if (eventImagesError) {
          console.warn(
            `Errore nel recupero immagini dalla tabella eventoimmagine per evento ${event.id}:`,
            eventImagesError.message,
          )
          eventImagesMap[event.id] = []
        } else {
          eventImagesMap[event.id] = (
            await Promise.all(
              imagesData.map(async (item) => {
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                  .from("doc")
                  .createSignedUrl(item.path, 3600)
                if (signedUrlError) {
                  console.warn(`Errore generazione URL firmato per ${item.path}:`, signedUrlError.message)
                  return null
                }
                return { id: item.id, url: signedUrlData.signedUrl, alt: item.descrizione || item.path.split("/").pop(), evento: event.titolo, path: item.path, }
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
    setNewEvent((prev) => ({ ...prev, [name]: value, }))
  }

  const addQuota = () => {
    setNewEvent((prev) => ({ ...prev, quote: [...prev.quote, { titolo: "", descrizione: "", prezzo: "" }], }))
  }

  const removeQuota = (index) => {
    setNewEvent((prev) => ({ ...prev, quote: prev.quote.filter((_, i) => i !== index), }))
  }

  const updateQuota = (index, field, value) => {
    setNewEvent((prev) => ({ ...prev, quote: prev.quote.map((quota, i) => (i === index ? { ...quota, [field]: value } : quota)), }))
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
            prezzo: Number.parseFloat(q.prezzo),
          }
        }
      })

      const { data, error } = await supabase
        .from("evento")
        .insert([{ ...newEvent, quote: quotesJson }]) // MODIFICATO: Inserisce quotesJson
        .select()

      if (error) throw error

      alert("Evento creato con successo!")
      setShowNewEventForm(false)
      fetchEventsAndImages()
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        orario: "",
        luogo: "",
        partecipanti: "",
        numeroAuto: "",
        tipo: "AUTO",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }], // Reset con nuova struttura
      })
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error.message)
      alert(`Errore nella creazione dell'evento: ${error.message}`)
    }
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
            prezzo: Number.parseFloat(q.prezzo),
          }
        }
      })

      const { data, error } = await supabase
        .from("evento")
        .update({ ...newEvent, quote: quotesJson }) // MODIFICATO: Aggiorna quotesJson
        .eq("id", editingEvent.id)
        .select()

      if (error) throw error

      alert("Evento aggiornato con successo!")
      setShowEditEventForm(false)
      setEditingEvent(null)
      fetchEventsAndImages()
      setNewEvent({
        titolo: "",
        descrizione: "",
        data: "",
        orario: "",
        luogo: "",
        partecipanti: "",
        numeroAuto: "",
        tipo: "AUTO",
        quote: [{ titolo: "", descrizione: "", prezzo: "" }], // Reset con nuova struttura
      })
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'evento:", error.message)
      alert(`Errore nell'aggiornamento dell'evento: ${error.message}`)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Sei sicuro di voler eliminare questo evento?")) return
    try {
      const { error } = await supabase.from("evento").delete().eq("id", eventId)
      if (error) throw error
      alert("Evento eliminato con successo!")
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'eliminazione dell'evento:", error.message)
      alert(`Errore nell'eliminazione dell'evento: ${error.message}`)
    }
  }

  const openEditEventForm = (event) => {
    setEditingEvent(event)
    // Convert the quotes object back to an array for the form
    const quotesArray = Object.keys(event.quote).map(key => ({
      titolo: event.quote[key].titolo,
      descrizione: event.quote[key].descrizione,
      prezzo: event.quote[key].prezzo.toString(), // Convert to string for input
    }));

    setNewEvent({ ...event, quote: quotesArray }); // MODIFICATO: Popola form con struttura array
    setShowEditEventForm(true);
  };


  // FUNZIONI DI GESTIONE IMMAGINI GALLERIA
  const handleImageUploadFiles = (e) => {
    setUploadFiles(Array.from(e.target.files))
  }

  const handleUploadImages = async () => {
    if (uploadFiles.length === 0) return

    setLoadingImages(true)
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        const filePath = uploadTarget.type === "general"
          ? `galleria/${file.name}`
          : `event_gallery/${uploadTarget.eventId}/${file.name}`; // Supposing event specific folder
        const { error: uploadError } = await supabase.storage
          .from("doc")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          if (uploadError.statusCode === '409' && uploadError.message.includes('already exists')) {
            console.warn(`File ${file.name} already exists, skipping upload.`);
            return { success: true, message: `File ${file.name} already exists.` };
          } else {
            throw uploadError;
          }
        }

        // If it's an event-specific image, save metadata to eventoimmagine table
        if (uploadTarget.type === "event" && uploadTarget.eventId) {
          const { data: { signedUrl } } = await supabase.storage.from('doc').createSignedUrl(filePath, 3600);
          const { error: insertError } = await supabase
            .from('eventoimmagine')
            .insert([
              {
                id_evento_fk: uploadTarget.eventId,
                path: filePath,
                descrizione: file.name, // Or a more descriptive name
                url: signedUrl,
              },
            ]);
          if (insertError) {
            console.error("Error inserting image metadata into eventoimmagine:", insertError.message);
            throw insertError;
          }
        }
        return { success: true, message: `File ${file.name} uploaded successfully.` };
      });

      await Promise.all(uploadPromises);

      alert("Immagini caricate con successo!");
      setShowImageUpload(false);
      setUploadFiles([]);
      fetchEventsAndImages(); // Refresh images
    } catch (error) {
      console.error("Errore nel caricamento delle immagini:", error.message);
      alert(`Errore nel caricamento delle immagini: ${error.message}`);
    } finally {
      setLoadingImages(false);
    }
  };


  const handleDeleteImage = async (path, eventId = null) => {
    if (!confirm("Sei sicuro di voler eliminare questa immagine?")) return
    setLoadingImages(true)
    try {
      const { error: storageError } = await supabase.storage.from("doc").remove([path])
      if (storageError) throw storageError

      if (eventId) {
        const { error: dbError } = await supabase
          .from("eventoimmagine")
          .delete()
          .eq("path", path)
        if (dbError) throw dbError
      }

      alert("Immagine eliminata con successo!")
      fetchEventsAndImages()
    } catch (error) {
      console.error("Errore nell'eliminazione dell'immagine:", error.message)
      alert(`Errore nell'eliminazione dell'immagine: ${error.message}`)
    } finally {
      setLoadingImages(false)
    }
  }

  // FUNZIONI DI GESTIONE ISCRIZIONI
  const fetchRegistrationsForEvent = useCallback(async (eventId) => {
    setLoadingRegistrations(true)
    try {
      const { data: registrationsData, error } = await supabase
        .from("iscrizione")
        .select(
          `
            *,
            guidatore:guidatore_id_fk(*),
            auto:auto_id_fk(*),
            passeggeri:passeggeri_rel(*)
          `,
        )
        .eq("evento_id_fk", eventId)
      if (error) throw error

      setRegistrations(registrationsData)
    } catch (error) {
      console.error("Errore nel recupero delle iscrizioni:", error.message)
      alert(`Errore nel recupero delle iscrizioni: ${error.message}`)
      setRegistrations([])
    } finally {
      setLoadingRegistrations(false)
    }
  }, [])

  const openRegistrationsModal = (event) => {
    setSelectedEventForRegistrations(event)
    setShowRegistrationsModal(true)
    fetchRegistrationsForEvent(event.id)
  }

  // MODIFICATO: Funzione per aprire il visualizzatore di immagini (fronte/retro)
  const openImagesInModal = (urls, title) => {
    setCurrentImageUrls(urls);
    setCurrentDocumentTitle(title);
    setShowDocumentModal(true);
  };


  const handleOpenInvoiceUpload = (registration) => {
    setSelectedRegistration(registration)
    setShowInvoiceUpload(true)
  }

  const handleInvoiceUpload = async () => {
    if (!invoiceFile || !selectedRegistration) {
      alert("Seleziona un file di fattura e una registrazione.")
      return
    }

    const filePath = `invoices/${selectedRegistration.id}-${invoiceFile.name}`
    setLoading(true) // Use general loading state for simplicity for now
    try {
      const { error: uploadError } = await supabase.storage
        .from("doc")
        .upload(filePath, invoiceFile, {
          cacheControl: "3600",
          upsert: true,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("doc")
        .getPublicUrl(filePath)

      // Send email logic (requires a Supabase Function or external service)
      // For now, just log to console or show an alert that it would be sent
      console.log(`Fattura caricata: ${publicUrlData.publicUrl}. Inviata a ${selectedRegistration.guidatore.email}`);
      alert("Fattura caricata e email inviata con successo!");

      // Update the registration record with the invoice URL if needed
      const { error: updateError } = await supabase
        .from('iscrizione')
        .update({ invoice_url: publicUrlData.publicUrl })
        .eq('id', selectedRegistration.id);

      if (updateError) {
        console.error("Errore nell'aggiornamento dell'URL della fattura nel DB:", updateError.message);
      }

      setShowInvoiceUpload(false)
      setInvoiceFile(null)
      setSelectedRegistration(null)
      fetchRegistrationsForEvent(selectedEventForRegistrations.id); // Refresh registrations to show updated invoice status
    } catch (error) {
      console.error("Errore durante il caricamento della fattura o l'invio dell'email:", error.message)
      alert(`Errore: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Funzione per generare PDF individuale (ADATTATA: solo per info iscrizione, non per documenti originali)
  const handleGenerateIndividualPdf = (registration, event) => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text(`Dettagli Iscrizione - ${event.titolo}`, 10, 10)
    doc.setFontSize(12)
    doc.text(`Data Evento: ${event.data} ${event.orario}`, 10, 20)
    doc.text(`Luogo Evento: ${event.luogo}`, 10, 30)

    doc.setFontSize(14)
    doc.text("Dati Guidatore:", 10, 50)
    doc.setFontSize(12)
    doc.text(`Nome: ${registration.guidatore.nome} ${registration.guidatore.cognome}`, 10, 60)
    doc.text(`Email: ${registration.guidatore.email}`, 10, 70)
    doc.text(`Cellulare: ${registration.guidatore.cellulare}`, 10, 80)
    doc.text(`Codice Fiscale: ${registration.guidatore.codiceFiscale}`, 10, 90)
    doc.text(`Data Nascita: ${registration.guidatore.dataNascita}`, 10, 100)
    doc.text(`Indirizzo: ${registration.guidatore.indirizzo}`, 10, 110)
    doc.text(`Quota Selezionata: ${registration.guidatore.quota}`, 10, 120)
    doc.text(`Intolleranze: ${registration.guidatore.intolleranze || "Nessuna"}`, 10, 130)

    doc.setFontSize(14)
    doc.text("Dati Auto:", 10, 150)
    doc.setFontSize(12)
    doc.text(`Marca: ${registration.auto.marca}`, 10, 160)
    doc.text(`Modello: ${registration.auto.modello}`, 10, 170)
    doc.text(`Targa: ${registration.auto.targa}`, 10, 180)
    doc.text(`Posti Auto: ${registration.auto.postiAuto}`, 10, 190)

    if (registration.passeggeri && registration.passeggeri.length > 0) {
      doc.setFontSize(14)
      doc.text("Passeggeri:", 10, 210)
      doc.setFontSize(12)
      let yOffset = 220
      registration.passeggeri.forEach((pass, index) => {
        doc.text(`Passeggero ${index + 1}: ${pass.nome} ${pass.cognome}`, 10, yOffset)
        doc.text(`  CF: ${pass.codiceFiscale}`, 20, yOffset + 10)
        doc.text(`  Data Nascita: ${pass.dataNascita}`, 20, yOffset + 20)
        doc.text(`  Email: ${pass.email}`, 20, yOffset + 30)
        doc.text(`  Cellulare: ${pass.cellulare}`, 20, yOffset + 40)
        doc.text(`  Intolleranze: ${pass.intolleranze || "Nessuna"}`, 20, yOffset + 50)
        yOffset += 60
      })
    }

    doc.save(`iscrizione_${registration.guidatore.cognome}_${registration.guidatore.nome}.pdf`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 text-gray-900">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-gradient-to-r from-gray-800 to-gray-900 px-4 md:px-6 shadow-lg">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold text-white md:text-base">
            <ActivityIcon className="h-6 w-6" />
            <span className="sr-only">AldebaranDrive Dashboard</span>
          </Link>
          <Link
            href="#"
            className={`transition-colors text-white ${
              activeTab === "overview" ? "font-bold" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Link>
          <Link
            href="#"
            className={`transition-colors text-white ${
              activeTab === "events" ? "font-bold" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Eventi
          </Link>
          <Link
            href="#"
            className={`transition-colors text-white ${
              activeTab === "gallery" ? "font-bold" : "text-gray-300 hover:text-white"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            Galleria
          </Link>
        </nav>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
            onClick={handleLogout}
          >
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-8 p-6 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard Amministratore</h1>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventi Futuri</CardTitle>
                <CalendarIcon className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
                <p className="text-xs text-blue-100">Eventi programmati</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eventi Passati</CardTitle>
                <ClockIcon className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pastEvents.length}</div>
                <p className="text-xs text-green-100">Eventi completati</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-lg border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Immagini Galleria</CardTitle>
                <ImageIcon className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{galleryImages.length}</div>
                <p className="text-xs text-purple-100">Totale immagini caricate</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Gestione Eventi</h2>
              <Button
                onClick={() => setShowNewEventForm(true)}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-md transition-all duration-200"
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Nuovo Evento
              </Button>
            </div>

            <Tabs defaultValue="futuri" className="w-full">
              <TabsList className="grid w-fit grid-cols-2 bg-gray-200 rounded-lg p-1 shadow-inner">
                <TabsTrigger
                  value="futuri"
                  className="px-6 py-2 rounded-md text-gray-700 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm transition-all"
                >
                  Futuri
                </TabsTrigger>
                <TabsTrigger
                  value="passati"
                  className="px-6 py-2 rounded-md text-gray-700 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:active:shadow-sm transition-all"
                >
                  Passati
                </TabsTrigger>
              </TabsList>
              <TabsContent value="futuri" className="mt-6">
                {loadingEvents ? (
                  <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-xl text-gray-500">Caricamento eventi futuri...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-2xl text-gray-500">Nessun evento futuro trovato.</div>
                    <p className="text-gray-500 mt-2">Crea un nuovo evento per iniziare.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                      <Card key={event.id} className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold text-gray-800">{event.titolo}</CardTitle>
                          <CardDescription className="text-gray-600">{event.descrizione}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm text-gray-700">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.data} - {event.orario}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.luogo}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <UsersIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.partecipanti} partecipanti max
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <CarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.numeroAuto} auto max
                          </div>
                          <div className="pt-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-indigo-600 hover:text-white hover:bg-indigo-600 border-indigo-600 transition-colors"
                              onClick={() => openRegistrationsModal(event)}
                            >
                              <EyeIcon className="mr-2 h-4 w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-orange-600 hover:text-white hover:bg-orange-600 border-orange-600 transition-colors"
                              onClick={() => openEditEventForm(event)}
                            >
                              <EditIcon className="mr-2 h-4 w-4" /> Modifica
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white transition-colors"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" /> Elimina
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="passati" className="mt-6">
                {loadingPastEvents ? (
                  <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-xl text-gray-500">Caricamento eventi passati...</p>
                  </div>
                ) : pastEvents.length === 0 ? (
                  <div className="text-center py-16">
                    <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-2xl text-gray-500">Nessun evento passato trovato.</div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((event) => (
                      <Card key={event.id} className="shadow-lg border-0 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-xl font-bold text-gray-800">{event.titolo}</CardTitle>
                          <CardDescription className="text-gray-600">{event.descrizione}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center text-sm text-gray-700">
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.data} - {event.orario}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <MapPinIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.luogo}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <UsersIcon className="mr-2 h-4 w-4 text-gray-500" />
                            {event.partecipanti} partecipanti max
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <CarIcon className="mr-2 h-4 w-4" />
                            {event.numeroAuto} auto max
                          </div>
                          <div className="pt-4 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-indigo-600 hover:text-white hover:bg-indigo-600 border-indigo-600 transition-colors"
                              onClick={() => openRegistrationsModal(event)}
                            >
                              <EyeIcon className="mr-2 h-4 w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-white hover:bg-blue-600 border-blue-600 transition-colors"
                              onClick={() => {
                                setUploadTarget({ type: "event", eventId: event.id });
                                setShowImageUpload(true);
                              }}
                            >
                              <UploadIcon className="mr-2 h-4 w-4" /> Carica Immagini Evento
                            </Button>
                          </div>
                          {eventGalleryImages[event.id] && eventGalleryImages[event.id].length > 0 && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="text-md font-semibold mb-2">Immagini Evento:</h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                {eventGalleryImages[event.id].map((image) => (
                                  <div key={image.id} className="relative group">
                                    <Image // Utilizzo del componente Image
                                      src={image.url}
                                      alt={image.alt}
                                      width={100}
                                      height={100}
                                      className="w-full h-24 object-cover rounded-md"
                                    />
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleDeleteImage(image.path, event.id)}
                                    >
                                      <TrashIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Galleria Immagini Generale</h2>
              <Button
                onClick={() => {
                  setUploadTarget({ type: "general", eventId: null });
                  setShowImageUpload(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md transition-all duration-200"
              >
                <PlusIcon className="mr-2 h-5 w-5" /> Carica Nuove Immagini
              </Button>
            </div>

            {loadingImages ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-xl text-gray-500">Caricamento galleria...</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="text-center py-16">
                <AlertCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <div className="text-2xl text-gray-500">Nessuna immagine nella galleria.</div>
                <p className="text-gray-500 mt-2">Carica alcune immagini per visualizzarle qui.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryImages.map((image) => (
                  <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md">
                    <Image // Utilizzo del componente Image
                      src={image.url}
                      alt={image.alt}
                      width={200}
                      height={150}
                      className="w-full h-36 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 mr-2"
                        onClick={() => openImagesInModal([image.url], image.alt)} // Can extend to handle multiple images if needed for general gallery
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteImage(image.path)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL NUOVO EVENTO */}
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
              numeroAuto: "",
              tipo: "AUTO",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }], // Reset con nuova struttura
            })
          }}
        />
      )}

      {/* MODAL MODIFICA EVENTO */}
      {showEditEventForm && (
        <EventFormModal
          isEditMode={true}
          newEvent={newEvent} // Using newEvent state which is populated by openEditEventForm
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
              numeroAuto: "",
              tipo: "AUTO",
              quote: [{ titolo: "", descrizione: "", prezzo: "" }], // Reset con nuova struttura
            })
          }}
        />
      )}

      {/* MODAL CARICAMENTO IMMAGINI */}
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

      {/* MODAL VISUALIZZAZIONE ISCRIZIONI */}
      {showRegistrationsModal && (
        <RegistrationsModal
          selectedEventForRegistrations={selectedEventForRegistrations}
          registrations={registrations}
          loadingRegistrations={loadingRegistrations}
          handleGenerateIndividualPdf={handleGenerateIndividualPdf}
          handleOpenInvoiceUpload={handleOpenInvoiceUpload}
          openImagesInModal={openImagesInModal} // Changed prop name
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
      {/* MODAL VISUALIZZATORE IMMAGINI (ex DocumentViewerModal) */}
      {showDocumentModal && (
        <ImageViewerModal
          currentImageUrls={currentImageUrls}
          currentDocumentTitle={currentDocumentTitle}
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
      `}</style>
    </div>
  )
}