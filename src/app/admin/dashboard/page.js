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
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex-1">
                      <Input
                        placeholder="Nome Quota (es. Standard, Premium)"
                        value={quota.nome}
                        onChange={(e) => updateQuota(index, "nome", e.target.value)}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors"
                      />
                    </div>
                    <div className="w-32">
                      <Input
                        placeholder="€ 0.00"
                        type="number"
                        step="0.01"
                        value={quota.prezzo}
                        onChange={(e) => updateQuota(index, "prezzo", e.target.value)}
                        className="text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-colors"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeQuota(index)}
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-lg transition-colors"
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
  handleGenerateIndividualPdf,
  handleOpenInvoiceUpload,
  openDocumentInModal,
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

                    {/* Documenti Guidatore */}
                    <div className="flex flex-wrap gap-3">
                      {reg.guidatore.patenteDocUrl && (
                        <Button
                          variant="outline"
                          onClick={() => openDocumentInModal(reg.guidatore.patenteDocUrl, "pdf")}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-colors"
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" /> Vedi Patente
                        </Button>
                      )}
                      {reg.guidatore.ricevutaDocUrl && (
                        <Button
                          variant="outline"
                          onClick={() => openDocumentInModal(reg.guidatore.ricevutaDocUrl, "pdf")}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 transition-colors"
                        >
                          <ExternalLinkIcon className="mr-2 h-4 w-4" /> Vedi Ricevuta
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
                                {pass.documentoDocUrl && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-colors"
                                    onClick={() => openDocumentInModal(pass.documentoDocUrl, "pdf")}
                                  >
                                    <ExternalLinkIcon className="mr-2 h-4 w-4" /> Vedi Documento
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
                      <Button
                        onClick={() => handleGenerateIndividualPdf(reg, selectedEventForRegistrations)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transition-all duration-200"
                      >
                        <DownloadIcon className="mr-2 h-5 w-5" /> Esporta PDF
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

// Modale per visualizzare documenti
const DocumentViewerModal = ({ currentDocumentUrl, currentDocumentType, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <Card className="w-full max-w-5xl h-[90vh] flex flex-col animate-scale-in bg-white text-gray-900 rounded-2xl shadow-2xl border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl p-6">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <FileTextIcon className="w-6 h-6" />
          Visualizzatore Documenti
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
      <CardContent className="flex-grow flex items-center justify-center p-0 bg-gray-50 rounded-b-2xl">
        {currentDocumentUrl ? (
          <iframe
            src={currentDocumentUrl}
            title={currentDocumentType}
            className="w-full h-full border-0 rounded-b-2xl"
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
    numeroAuto: "",
    tipo: "AUTO",
    quote: [{ nome: "", prezzo: "" }],
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
                return {
                  id: item.id,
                  url: signedUrlData.signedUrl,
                  alt: item.descrizione || item.path.split("/").pop(),
                  evento: event.titolo,
                  path: item.path,
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
      quote: [...prev.quote, { nome: "", prezzo: "" }],
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
        if (q.nome && q.prezzo !== "") {
          quotesJson[`quota${index + 1}`] = {
            descrizione: q.nome,
            prezzo: Number.parseFloat(q.prezzo),
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
          numeroauto: Number.parseInt(newEvent.numeroAuto),
          passato: false,
          quote: quotesJson,
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
        numeroAuto: "",
        tipo: "AUTO",
        quote: [{ nome: "", prezzo: "" }],
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
          nome: value.descrizione,
          prezzo: value.prezzo,
        }))
      : [{ nome: "", prezzo: "" }]

    setNewEvent({
      titolo: event.titolo,
      descrizione: event.descrizione,
      data: event.data,
      orario: event.orario,
      luogo: event.luogo,
      partecipanti: event.partecipanti,
      numeroAuto: event.numeroAuto,
      tipo: event.tipo,
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
        if (q.nome && q.prezzo !== "") {
          quotesJson[`quota${index + 1}`] = {
            descrizione: q.nome,
            prezzo: Number.parseFloat(q.prezzo),
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
          numeroAuto: Number.parseInt(newEvent.numeroAuto),
          quote: quotesJson,
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
        numeroAuto: "",
        tipo: "AUTO",
        quote: [{ nome: "", prezzo: "" }],
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
      await supabase.from("eventoimmagine").delete().eq("id_evento_fk", eventId)

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
    let isEventImage = false
    if (uploadTarget.type === "general") {
      uploadBasePath = "galleria"
    } else if (uploadTarget.type === "event" && uploadTarget.eventId) {
      uploadBasePath = `eventi/${uploadTarget.eventId}`
      isEventImage = true
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

        if (isEventImage) {
          const { error: dbInsertError } = await supabase.from("eventoimmagine").insert({
            id_evento_fk: uploadTarget.eventId,
            path: uploadedFile.path,
            descrizione: file.name,
          })

          if (dbInsertError) {
            console.error(`Errore nell'inserimento del record eventoimmagine per ${file.name}:`, dbInsertError)
            alert(
              `Errore nel salvare il riferimento dell'immagine nel database per ${file.name}: ${dbInsertError.message}`,
            )
          }
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
    const dbRecordId = imageToDelete.id

    try {
      if (imageToDelete.evento !== "Generale") {
        const { error: dbDeleteError } = await supabase.from("eventoimmagine").delete().eq("id", dbRecordId)

        if (dbDeleteError) {
          console.error("Errore nell'eliminazione del record eventoimmagine:", dbDeleteError)
          alert("Errore nell'eliminazione del record dell'immagine dal database: " + dbDeleteError.message)
          return
        }
      }

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

      const { data: guidatoriData, error: guidatoriError } = await supabase
        .from("guidatore")
        .select(`
          *,
          passeggero ( * )
        `)
        .eq("id_evento_fk", eventId)
      if (guidatoriError) throw guidatoriError

      const formattedRegistrations = await Promise.all(
        guidatoriData.map(async (guidatore) => {
          let patenteDocUrl = null
          if (guidatore.patente) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from("doc")
              .createSignedUrl(guidatore.patente, 60)
            if (signedUrlError) console.error("Errore generazione URL firmato patente:", signedUrlError)
            else patenteDocUrl = signedUrlData?.signedUrl
          }

          let ricevutaDocUrl = null
          if (guidatore.ricevuta) {
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from("doc")
              .createSignedUrl(guidatore.ricevuta, 60)
            if (signedUrlError) console.error("Errore generazione URL firmato ricevuta:", signedUrlError)
            else ricevutaDocUrl = signedUrlData?.signedUrl
          }

          const passeggeriFormatted = await Promise.all(
            guidatore.passeggero.map(async (p) => {
              let documentoDocUrl = null
              if (p.documento) {
                const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                  .from("doc")
                  .createSignedUrl(p.documento, 60)
                if (signedUrlError)
                  console.error("Errore generazione URL firmato documento passeggero:", signedUrlError)
                else documentoDocUrl = signedUrlData?.signedUrl
              }
              return {
                nome: p.nome,
                cognome: p.cognome,
                codiceFiscale: p.codice_fiscale,
                dataNascita: p.data_nascita,
                indirizzo: p.indirizzo,
                email: p.indirizzo_email,
                cellulare: p.telefono,
                documentoDocUrl: documentoDocUrl,
                intolleranze: p.intolleranze,
              }
            }),
          )

          return {
            id: guidatore.id,
            guidatore: {
              nome: guidatore.nome,
              cognome: guidatore.cognome,
              codiceFiscale: guidatore.codice_fiscale,
              dataNascita: guidatore.data_nascita,
              indirizzo: guidatore.indirizzo,
              email: guidatore.indirizzo_email,
              cellulare: guidatore.telefono,
              patenteDocUrl: patenteDocUrl,
              ricevutaDocUrl: ricevutaDocUrl,
              intolleranze: guidatore.intolleranze,
              quota: guidatore.quota,
            },
            auto: {
              marca: guidatore.auto_marca,
              modello: guidatore.auto_modello,
              targa: guidatore.auto_targa,
              postiAuto: guidatore.posti_auto,
            },
            passeggeri: passeggeriFormatted,
            dataIscrizione: guidatore.data_inserimento,
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

    // Informazioni guidatore
    doc.setFontSize(14)
    doc.text("GUIDATORE", margin, y)
    y += lineHeight
    doc.setFontSize(12)

    doc.text(`Nome: ${registration.guidatore.nome} ${registration.guidatore.cognome}`, margin, y)
    y += lineHeight
    doc.text(`Codice Fiscale: ${registration.guidatore.codiceFiscale}`, margin, y)
    y += lineHeight
    doc.text(`Data Nascita: ${registration.guidatore.dataNascita}`, margin, y)
    y += lineHeight
    doc.text(`Email: ${registration.guidatore.email}`, margin, y)
    y += lineHeight
    doc.text(`Cellulare: ${registration.guidatore.cellulare}`, margin, y)
    y += lineHeight
    doc.text(`Indirizzo: ${registration.guidatore.indirizzo}`, margin, y)
    y += lineHeight
    doc.text(`Quota Selezionata: ${registration.guidatore.quota}`, margin, y)
    y += lineHeight
    doc.text(`Intolleranze: ${registration.guidatore.intolleranze || "Nessuna"}`, margin, y)
    y += lineHeight * 2

    // Informazioni auto
    doc.setFontSize(14)
    doc.text("AUTO", margin, y)
    y += lineHeight
    doc.setFontSize(12)

    doc.text(`Marca: ${registration.auto.marca}`, margin, y)
    y += lineHeight
    doc.text(`Modello: ${registration.auto.modello}`, margin, y)
    y += lineHeight
    doc.text(`Targa: ${registration.auto.targa}`, margin, y)
    y += lineHeight
    doc.text(`Posti Auto: ${registration.auto.postiAuto}`, margin, y)
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
        doc.text(`   CF: ${pass.codiceFiscale}`, margin, y)
        y += lineHeight
        doc.text(`   Data Nascita: ${pass.dataNascita}`, margin, y)
        y += lineHeight
        doc.text(`   Email: ${pass.email}`, margin, y)
        y += lineHeight
        doc.text(`   Cellulare: ${pass.cellulare}`, margin, y)
        y += lineHeight
        doc.text(`   Intolleranze: ${pass.intolleranze || "Nessuna"}`, margin, y)
        y += lineHeight * 2
      })
    } else {
      doc.setFontSize(14)
      doc.text("PASSEGGERI", margin, y)
      y += lineHeight
      doc.setFontSize(12)
      doc.text("Nessun passeggero.", margin, y)
    }

    const fileName = `iscrizione_${registration.guidatore.nome}_${registration.guidatore.cognome}_${event.titolo.replace(/\s/g, "_")}.pdf`
    doc.save(fileName)
  }

  const handleOpenInvoiceUpload = (registration) => {
    setSelectedRegistration(registration)
    setInvoiceFile(null)
    setShowInvoiceUpload(true)
  }

  // FUNZIONE MODIFICATA: Solo caricamento fattura e invio email (senza salvataggio DB)
  const handleInvoiceUpload = async () => {
    if (!invoiceFile || !selectedRegistration) {
      alert("Seleziona un file fattura e assicurati che l'iscrizione sia selezionata.")
      return
    }

    try {
      // 1. Carica la fattura su Supabase Storage
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

      // 2. Simula invio email (qui dovresti implementare la logica di invio email reale)
      console.log(`Simulazione invio email a: ${selectedRegistration.guidatore.email}`)
      console.log(`Allegato fattura: ${uploadedFile.path}`)
      alert(`Fattura caricata con successo e email inviata a ${selectedRegistration.guidatore.email}!`)

      // 3. Chiudi il modal e resetta lo stato
      setShowInvoiceUpload(false)
      setSelectedRegistration(null)
      setInvoiceFile(null)

      // 4. Ricarica le iscrizioni per aggiornare l'UI
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-xl text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8 font-inter antialiased">
      {/* Header con design migliorato */}
      <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <ActivityIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Dashboard Amministratore
            </h1>
            <p className="text-gray-600 mt-1">Gestisci eventi, iscrizioni e gallerie</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200"
        >
          <LogOutIcon className="mr-2 h-6 w-6" /> Logout
        </Button>
      </header>

      {/* Tabs con design migliorato */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200 mb-8">
          <TabsTrigger
            value="overview"
            className="text-lg font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"
          >
            <ActivityIcon className="w-5 h-5 mr-2" />
            Panoramica
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="text-lg font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Eventi Futuri
          </TabsTrigger>
          <TabsTrigger
            value="past-events"
            className="text-lg font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"
          >
            <ClockIcon className="w-5 h-5 mr-2" />
            Eventi Passati
          </TabsTrigger>
          <TabsTrigger
            value="gallery"
            className="text-lg font-semibold px-6 py-4 rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-gray-100"
          >
            <ImageIcon className="w-5 h-5 mr-2" />
            Galleria
          </TabsTrigger>
        </TabsList>

        {/* Tab: Panoramica con design migliorato */}
        <TabsContent value="overview" className="mt-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-8">
              <CardTitle className="text-4xl font-extrabold flex items-center gap-3">
                <SparklesIcon className="w-10 h-10" />
                Panoramica Generale
              </CardTitle>
              <CardDescription className="text-indigo-100 text-xl mt-2">
                Riepilogo delle attività e scorciatoie rapide per la gestione della piattaforma
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {events.length}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-xl mt-3 font-semibold">Eventi Futuri</CardDescription>
                </Card>

                <Card className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ClockIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {pastEvents.length}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-xl mt-3 font-semibold">Eventi Passati</CardDescription>
                </Card>

                <Card className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {galleryImages.length + Object.values(eventGalleryImages).flat().length}
                  </CardTitle>
                  <CardDescription className="text-gray-700 text-xl mt-3 font-semibold">
                    Immagini Totali
                  </CardDescription>
                </Card>
              </div>

              <Separator className="my-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

              <h3 className="text-4xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                <TrendingUpIcon className="w-10 h-10 text-indigo-600" />
                Operazioni Rapide
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Button
                  onClick={() => {
                    setShowNewEventForm(true)
                    setActiveTab("events")
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-semibold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <PlusIcon className="mr-3 h-7 w-7" /> Crea Nuovo Evento
                </Button>
                <Button
                  onClick={() => {
                    setShowImageUpload(true)
                    setUploadTarget({ type: "general", eventId: null })
                    setActiveTab("gallery")
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xl font-semibold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <UploadIcon className="mr-3 h-7 w-7" /> Carica Immagini
                </Button>
                <Button
                  onClick={() => setActiveTab("events")}
                  variant="outline"
                  className="text-xl font-semibold py-6 px-8 rounded-2xl shadow-lg transition-all duration-200 hover:scale-105 border-2 border-gray-300 text-gray-800 hover:bg-gray-50"
                >
                  <EyeIcon className="mr-3 h-7 w-7" /> Visualizza Eventi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Eventi Futuri con design migliorato */}
        <TabsContent value="events" className="mt-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl p-8">
              <div>
                <CardTitle className="text-4xl font-extrabold flex items-center gap-3">
                  <CalendarIcon className="w-10 h-10" />
                  Eventi Futuri
                </CardTitle>
                <CardDescription className="text-blue-100 text-xl mt-2">
                  Gestisci gli eventi in programma
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowNewEventForm(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
              >
                <PlusIcon className="mr-2 h-6 w-6" /> Nuovo Evento
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {loadingEvents ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-2xl text-gray-500">Caricamento eventi futuri...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16">
                  <CalendarIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <div className="text-2xl text-gray-500">Nessun evento futuro in programma</div>
                  <Button
                    onClick={() => setShowNewEventForm(true)}
                    className="mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" /> Crea il primo evento
                  </Button>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden"
                    >
                      <div className="border-l-4 border-blue-500">
                        <CardHeader className="pb-4 px-6 pt-6">
                          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6 text-blue-500" />
                            {event.titolo}
                          </CardTitle>
                          <CardDescription className="text-lg text-gray-700 mt-2">{event.descrizione}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg px-6 pb-6">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <CalendarIcon className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold">
                                {event.data} alle {event.orario}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <MapPinIcon className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold">{event.luogo}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                                <UsersIcon className="w-5 h-5 text-gray-500" />
                                <span className="font-semibold">{event.partecipanti}</span>
                              </div>
                              <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                                <CarIcon className="w-5 h-5 text-gray-500" />
                                <span className="font-semibold">{event.numeroauto}</span>
                              </div>
                            </div>
                          </div>

                          {event.quote && Object.values(event.quote).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {Object.values(event.quote).map((q, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-green-100 text-green-800 text-base px-3 py-1.5 font-semibold rounded-lg"
                                >
                                  {q.descrizione}: €{q.prezzo}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                            <Button
                              variant="outline"
                              onClick={() => handleEditEvent(event)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-orange-300 text-orange-700 hover:bg-orange-50 transition-colors duration-200"
                            >
                              <EditIcon className="mr-2 h-4 w-4" /> Modifica
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleViewRegistrations(event.id)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <EyeIcon className="mr-2 h-4 w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => markEventAsPast(event.id, true)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-green-300 text-green-700 hover:bg-green-50 transition-colors duration-200"
                            >
                              <CheckIcon className="mr-2 h-4 w-4" /> Completato
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" /> Elimina
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

        {/* Tab: Eventi Passati con design migliorato */}
        <TabsContent value="past-events" className="mt-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-2xl p-8">
              <CardTitle className="text-4xl font-extrabold flex items-center gap-3">
                <ClockIcon className="w-10 h-10" />
                Eventi Passati
              </CardTitle>
              <CardDescription className="text-purple-100 text-xl mt-2">
                Gestisci gli eventi completati e le loro gallerie
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {loadingPastEvents ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  <p className="text-2xl text-gray-500">Caricamento eventi passati...</p>
                </div>
              ) : pastEvents.length === 0 ? (
                <div className="text-center py-16">
                  <ClockIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <div className="text-2xl text-gray-500">Nessun evento passato</div>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden"
                    >
                      <div className="border-l-4 border-purple-500">
                        <CardHeader className="pb-4 px-6 pt-6">
                          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CheckCircleIcon className="w-6 h-6 text-purple-500" />
                            {event.titolo}
                          </CardTitle>
                          <CardDescription className="text-lg text-gray-700 mt-2">{event.descrizione}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg px-6 pb-6">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <CalendarIcon className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold">
                                {event.data} alle {event.orario}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <MapPinIcon className="w-5 h-5 text-gray-500" />
                              <span className="font-semibold">{event.luogo}</span>
                            </div>
                          </div>

                          {event.quote && Object.values(event.quote).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {Object.values(event.quote).map((q, idx) => (
                                <Badge
                                  key={idx}
                                  className="bg-purple-100 text-purple-800 text-base px-3 py-1.5 font-semibold rounded-lg"
                                >
                                  {q.descrizione}: €{q.prezzo}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                            <Button
                              variant="outline"
                              onClick={() => handleViewRegistrations(event.id)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                            >
                              <EyeIcon className="mr-2 h-4 w-4" /> Iscrizioni
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowImageUpload(true)
                                setUploadTarget({ type: "event", eventId: event.id })
                              }}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-orange-300 text-orange-700 hover:bg-orange-50 transition-colors duration-200"
                            >
                              <UploadIcon className="mr-2 h-4 w-4" /> Carica Immagini
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => markEventAsPast(event.id, false)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg border-green-300 text-green-700 hover:bg-green-50 transition-colors duration-200"
                            >
                              <CheckIcon className="mr-2 h-4 w-4" /> Riattiva
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-base font-semibold py-2.5 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors duration-200"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" /> Elimina
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

        {/* Tab: Galleria Immagini con design migliorato */}
        <TabsContent value="gallery" className="mt-0">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-2xl p-8">
              <div>
                <CardTitle className="text-4xl font-extrabold flex items-center gap-3">
                  <ImageIcon className="w-10 h-10" />
                  Galleria Immagini
                </CardTitle>
                <CardDescription className="text-green-100 text-xl mt-2">
                  Gestisci le immagini della galleria generale e degli eventi
                </CardDescription>
              </div>
              <Button
                onClick={() => {
                  setShowImageUpload(true)
                  setUploadTarget({ type: "general", eventId: null })
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
              >
                <UploadIcon className="mr-2 h-6 w-6" /> Carica Immagini
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              {loadingImages ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <div className="text-2xl text-gray-500">Caricamento immagini galleria...</div>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Galleria Generale */}
                  <div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <SparklesIcon className="w-8 h-8 text-green-600" />
                      Immagini Galleria Generale
                    </h3>
                    {galleryImages.length === 0 ? (
                      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-xl text-gray-500 mb-4">Nessuna immagine nella galleria generale</div>
                        <Button
                          onClick={() => {
                            setShowImageUpload(true)
                            setUploadTarget({ type: "general", eventId: null })
                          }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                        >
                          <UploadIcon className="mr-2 h-5 w-5" /> Carica prima immagine
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {galleryImages.map((image) => (
                          <div
                            key={image.path}
                            className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-square hover:shadow-xl transition-all duration-300"
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src =
                                  "https://placehold.co/400x400/E0E0E0/A0A0A0?text=Immagine+non+disponibile"
                              }}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDeleteImage(image)}
                                className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                              >
                                <TrashIcon className="h-6 w-6" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="my-12 bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px" />

                  {/* Gallerie per Eventi Passati */}
                  <div>
                    <h3 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <ClockIcon className="w-8 h-8 text-purple-600" />
                      Immagini per Eventi Passati
                    </h3>
                    {pastEvents.length === 0 ? (
                      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300">
                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <div className="text-xl text-gray-500">Nessun evento passato disponibile</div>
                      </div>
                    ) : (
                      pastEvents.map((event) => (
                        <div
                          key={event.id}
                          className="mb-10 p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                              </div>
                              {event.titolo}
                            </h4>
                            <Button
                              onClick={() => {
                                setShowImageUpload(true)
                                setUploadTarget({ type: "event", eventId: event.id })
                              }}
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            >
                              <UploadIcon className="mr-2 h-4 w-4" /> Aggiungi Immagini
                            </Button>
                          </div>
                          {eventGalleryImages[event.id] && eventGalleryImages[event.id].length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                              {eventGalleryImages[event.id].map((image) => (
                                <div
                                  key={image.path}
                                  className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-200 aspect-square hover:shadow-xl transition-all duration-300"
                                >
                                  <img
                                    src={image.url || "/placeholder.svg"}
                                    alt={image.alt}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                      e.target.onerror = null
                                      e.target.src =
                                        "https://placehold.co/400x400/E0E0E0/A0A0A0?text=Immagine+non+disponibile"
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => handleDeleteImage(image)}
                                      className="bg-red-500 hover:bg-red-600 text-white w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                                    >
                                      <TrashIcon className="h-6 w-6" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
                              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <div className="text-lg text-gray-500">Nessuna immagine per questo evento</div>
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
              numeroAuto: "",
              tipo: "AUTO",
              quote: [{ nome: "", prezzo: "" }],
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
              numeroAuto: "",
              tipo: "AUTO",
              quote: [{ nome: "", prezzo: "" }],
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
      `}</style>
    </div>
  )
}
