"use client";

// Import delle librerie e componenti necessari
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  XIcon,
  UploadIcon,
  LogInIcon,
  MenuIcon,
  CameraIcon,
  FileTextIcon,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import ExpandableText from "@/components/ui/ExpandableText";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

// Funzioni di validazione avanzate
const validateCodiceFiscale = (cf) => {
  if (!cf) return { valid: false, message: "Il codice fiscale è obbligatorio" };
  const cfUpper = cf.toUpperCase().trim();
  if (cfUpper.length !== 16) {
    return {
      valid: false,
      message: "Il codice fiscale deve essere di 16 caratteri",
    };
  }
  if (
    !/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/.test(
      cfUpper,
    )
  ) {
    return {
      valid: false,
      message: "Il formato del codice fiscale non è valido",
    };
  }
  return { valid: true, message: "" };
};

const validatePhone = (phone) => {
  if (!phone)
    return { valid: false, message: "Il numero di telefono è obbligatorio" };
  const cleanPhone = phone.replace(/\s+/g, "");
  if (!/^(\+39)?[0-9]{8,11}$/.test(cleanPhone)) {
    return {
      valid: false,
      message: "Il numero di telefono non è valido (es. 3331234567)",
    };
  }
  return { valid: true, message: "" };
};

const validateEmail = (email) => {
  if (!email) return { valid: false, message: "L'email è obbligatoria" };
  const emailLower = email.toLowerCase().trim();
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailLower)) {
    return { valid: false, message: "L'indirizzo email non è valido" };
  }
  return { valid: true, message: "" };
};

const validatePatente = (patente) => {
  if (!patente)
    return { valid: false, message: "Il numero di patente è obbligatorio" };
  const patenteUpper = patente.toUpperCase().trim();
  if (!/^[A-Z]{2}[0-9]{6,7}[A-Z]{1,2}$/.test(patenteUpper)) {
    return {
      valid: false,
      message: "Il formato della patente non è valido (es. AB123456C)",
    };
  }
  return { valid: true, message: "" };
};

const validateTarga = (targa) => {
  if (!targa) return { valid: false, message: "La targa è obbligatoria" };
  const targaUpper = targa.toUpperCase().trim();
  if (!/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(targaUpper)) {
    return {
      valid: false,
      message: "Il formato della targa non è valido (es. AB123CD)",
    };
  }
  return { valid: true, message: "" };
};

const validateRequiredField = (value, fieldName) => {
  if (!value || value.toString().trim() === "") {
    return { valid: false, message: `${fieldName} è obbligatorio` };
  }
  return { valid: true, message: "" };
};

const validateDate = (date, fieldName) => {
  if (!date) return { valid: false, message: `${fieldName} è obbligatoria` };
  const selectedDate = new Date(date);
  const today = new Date();
  if (fieldName.includes("Nascita") && selectedDate >= today) {
    return {
      valid: false,
      message: "La data di nascita deve essere nel passato",
    };
  }
  if (fieldName.includes("Scadenza") && selectedDate <= today) {
    return {
      valid: false,
      message: "La data di scadenza deve essere nel futuro",
    };
  }
  return { valid: true, message: "" };
};

// Componente principale della pagina di iscrizione
export default function Home() {
  // Stati per la gestione della UI e dei dati
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [passeggeri, setPasseggeri] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [cover, setCover] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  // Stati per il caricamento e la categorizzazione degli eventi
  const [eventi, setEventi] = useState([]);
  const [eventiPassati, setEventiPassati] = useState([]);
  const [eventiPassatiImmagini, setEventiPassatiImmagini] = useState({});
  const [loadingEventiPassati, setLoadingEventiPassati] = useState(true);
  const [loadingEventi, setLoadingEventi] = useState(true);
  const [loadingGalleria, setLoadingGalleria] = useState(true);
  const [loadingEventiPassatiImmagini, setLoadingEventiPassatiImmagini] =
    useState(true);

  // Stati per la camera
  const [isMobile, setIsMobile] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentCameraField, setCurrentCameraField] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(null);
  const [cameraType, setCameraType] = useState("front"); // 'front' o 'back'
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Stati per la gestione degli errori di validazione
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stati per la gestione dei banner di notifica
  const [showBanner, setShowBanner] = useState(false);
  const [bannerType, setBannerType] = useState(''); // 'success', 'error'
  const [bannerMessage, setBannerMessage] = useState('');

  // Stato per i dati del form di iscrizione
  const [formData, setFormData] = useState({
    // Dati guidatore
    guidatoreCognome: "",
    guidatoreNome: "",
    guidatoreCodiceFiscale: "",
    guidatoreDataNascita: "",
    guidatoreIndirizzo: "",
    guidatoreCellulare: "",
    guidatoreEmail: "",
    guidatorePatente: "",
    guidatorePatenteScadenza: "",
    guidatoreDocumentoFronte: null,
    guidatoreDocumentoRetro: null,
    // Dati auto
    autoMarca: "",
    autoColore: "",
    autoImmatricolazione: "",
    autoModello: "",
    autoTarga: "",
    postiAuto: 4,
    // Pacchetto di partecipazione
    quotaSelezionata: "",
    // Esigenze alimentari del guidatore
    guidatoreEsigenzeAlimentari: false,
    guidatoreIntolleranze: "",
    // Autorizzazioni del guidatore
    guidatoreAutorizzaFoto: true,
    guidatoreAutorizzaTrattamento: true,
  });

  // Rileva se è mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ),
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // useEffect per il caricamento degli eventi futuri e passati all'avvio della pagina
  useEffect(() => {
    const fetchEventi = async () => {
      setLoadingEventi(true);
      setLoadingEventiPassati(true);
      try {
        const { data, error } = await supabase
          .from("evento")
          .select("*")
          .order("data", { ascending: true });

        if (error) {
          console.error("Errore durante il fetch degli eventi:", error);
          return;
        }

        const now = new Date();
        const futuri = [];
        const passati = [];

        data.forEach((evento) => {
          if (evento.passato) {
            passati.push(evento);
          } else {
            // Parse the 'quote' JSON string if it exists
            if (evento.quote && typeof evento.quote === "string") {
              try {
                evento.quote = JSON.parse(evento.quote);
              } catch (jsonError) {
                console.error(
                  `Error parsing quote JSON for event ${evento.id}:`,
                  jsonError,
                );
                evento.quote = {}; // Set to empty object if parsing fails
              }
            } else if (!evento.quote) {
              evento.quote = {}; // Ensure it's an object even if null/undefined
            }
            futuri.push(evento);
          }
        });

        setEventiPassati(passati);
        setEventi(futuri);

        // Caricamento delle immagini di copertina degli eventi
        const fetchImagesEvents = async () => {
          try {
            // Crea un oggetto per mappare gli eventi con le loro immagini di copertina
            const coverImages = {};
            
            // Per ogni evento, genera il signed URL della copertina se esiste
            for (const evento of data) {
              if (evento.copertina) {
                const validExtensions = [
                  ".jpg",
                  ".jpeg",
                  ".png",
                  ".gif",
                  ".webp",
                ];
                const lower = evento.copertina.toLowerCase();
              
                // Verifica se il path della copertina è valido
                if (
                  validExtensions.some((ext) => lower.endsWith(ext)) &&
                  !lower.includes("placeholder") &&
                  !lower.includes("immagine1") &&
                  !lower.startsWith(".")
                ) {
                  try {
                    // Usa il bucket "eventi" e il path relativo della copertina
                    const { data: signedUrl, error: urlError } =
                      await supabase.storage
                        .from("eventi") // Bucket corretto per gli eventi
                        .createSignedUrl(evento.copertina, 60 * 60); // validità 1h
                        
                    if (!urlError && signedUrl?.signedUrl) {
                      coverImages[evento.id] = signedUrl.signedUrl;
                      console.log(`URL copertina generato per evento ${evento.id}: eventi/${evento.copertina}`);
                    } else if (urlError) {
                      console.error(`Errore nella generazione URL per evento ${evento.id}:`, urlError);
                    }
                  } catch (urlError) {
                    console.error(
                      `Errore URL per evento ${evento.id}:`,
                      urlError,
                    );
                  }
                }
              }
            }
            
            setCover(coverImages);
          } catch (error) {
            console.error("Errore nel caricamento delle copertine:", error);
          }
        };

        // Chiama la funzione per caricare le immagini di copertina
        await fetchImagesEvents();
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
      } finally {
        setLoadingEventi(false);
        setLoadingEventiPassati(false);
      }
    };

    const fetchImages = async () => {
      setLoadingGalleria(true);
      try {
        const { data, error } = await supabase.storage
          .from("galleria")
          .list("", {
            limit: 100,
            offset: 0,
            sortBy: { column: "name", order: "asc" },
          });

        if (error) {
          console.error("Errore durante il caricamento delle immagini:", error);
          return;
        }

        const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

        const validImageFiles = data.filter(({ name, metadata }) => {
          if (!name || metadata === null) return false;
          const lowerName = name.toLowerCase();
          return (
            validExtensions.some((ext) => lowerName.endsWith(ext)) &&
            !lowerName.includes("placeholder") &&
            !lowerName.includes("immagine1") &&
            !lowerName.startsWith(".") &&
            name !== ".emptyFolderPlaceholder"
          );
        });

        const urls = await Promise.all(
          validImageFiles.map(async ({ name }) => {
            const { data: signedUrl, error: urlError } = await supabase.storage
              .from("galleria")
              .createSignedUrl(name, 60 * 60);
            if (urlError) {
              console.error(`Errore URL per ${name}:`, urlError);
              return null;
            }
            return signedUrl?.signedUrl ?? null;
          }),
        );

        setImages(urls.filter(Boolean));
      } catch (error) {
        console.error("Errore nel caricamento della galleria:", error);
      } finally {
        setLoadingGalleria(false);
      }
    };

    const fetchEventiPassatiImmagini = async () => {
      setLoadingEventiPassatiImmagini(true);
      
      try {
        // Prima ottieni tutti gli eventi passati
        const { data: eventiPassatiData, error: eventiError } = await supabase
          .from("evento")
          .select("*")
          .eq("passato", true)
          .order("data", { ascending: false });
          
        if (eventiError) {
          console.error("Errore nel recupero eventi passati:", eventiError);
          return;
        }
        
        const immaginiPerEvento = {};
        
        // Per ogni evento passato, recupera le immagini dalla tabella eventoimmagine
        for (const evento of eventiPassatiData) {
          try {
            const { data: immaginiData, error: immaginiError } = await supabase
              .from("eventoimmagine")
              .select("*")
              .eq("id_evento_fk", evento.id)
              .order("id", { ascending: true });
              
            if (immaginiError) {
              console.warn(
                `Errore nel recupero immagini per evento ${evento.id}:`,
                immaginiError.message,
              );
              immaginiPerEvento[evento.id] = [];
              continue;
            }
            
            // Genera signed URLs per ogni immagine
            const immaginiConUrl = await Promise.all(
              immaginiData.map(async (immagine) => {
                try {
                  // Usa il bucket "eventi" con il path relativo dell'immagine
                  // Il path nel database dovrebbe essere nel formato: id_evento/immagine.jpg
                  const { data: signedUrlData, error: signedUrlError } =
                    await supabase.storage
                      .from("eventi") // Bucket corretto per gli eventi
                      .createSignedUrl(immagine.path, 3600); // 1 ora di validità
                      
                  if (signedUrlError) {
                    console.error(
                      `Errore generazione URL per ${immagine.path}:`,
                      signedUrlError.message,
                    );
                    return null;
                  }
                  
                  return {
                    id: immagine.id,
                    url: signedUrlData.signedUrl,
                    alt: immagine.descrizione || immagine.path.split("/").pop(),
                    path: immagine.path,
                  };
                } catch (urlError) {
                  console.error(
                    `Errore nel processare l'immagine ${immagine.id}:`,
                    urlError,
                  );
                  return null;
                }
              }),
            );
            
            // Filtra le immagini valide
            immaginiPerEvento[evento.id] = immaginiConUrl.filter(Boolean);
            console.log(`Caricate ${immaginiConUrl.filter(Boolean).length} immagini per evento ${evento.id}`);
          } catch (eventoError) {
            console.error(
              `Errore nel processare l'evento ${evento.id}:`,
              eventoError,
            );
            immaginiPerEvento[evento.id] = [];
          }
        }
        
        setEventiPassatiImmagini(immaginiPerEvento);
      } catch (error) {
        console.error("Errore nel caricamento immagini eventi passati:", error);
      } finally {
        setLoadingEventiPassatiImmagini(false);
      }
    };

    fetchEventi();
    fetchImages();
    fetchEventiPassatiImmagini();
  }, []);

  // useEffect per la gestione della fotocamera basato sull'esempio funzionante
  useEffect(() => {
    if (isCameraActive) {
      const constraints = {
        video: {
          facingMode: cameraType === "back" ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Errore nell'accesso alla fotocamera:", err);
          showErrorBanner("Errore nell'accesso alla fotocamera: " + err.message);
          setIsCameraActive(false);
          setShowCamera(false);
        });
    } else {
      // Ferma lo stream se disattivato
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive, cameraType]);

  // Funzioni per la camera
  const startCamera = async (fieldName, index = null, type = "back") => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showErrorBanner(
        "Il tuo browser non supporta l'accesso alla fotocamera. Prova ad aggiornare o usare un altro browser."
      );
      return;
    }

    setCurrentCameraField(fieldName);
    setCurrentCameraIndex(index);
    setCameraType(type);
    setShowCamera(true);
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setShowCamera(false);
    setCurrentCameraField(null);
    setCurrentCameraIndex(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas.");
            showErrorBanner("Impossibile catturare l'immagine. Riprova.");
            return;
          }

          const file = new File(
            [blob],
            `${currentCameraField}_${cameraType}_${Date.now()}.jpg`,
            {
              type: "image/jpeg",
            },
          );

          if (currentCameraIndex !== null) {
            // Per i passeggeri
            const newPasseggeri = [...passeggeri];
            newPasseggeri[currentCameraIndex] = {
              ...newPasseggeri[currentCameraIndex],
              [currentCameraField]: file,
            };
            setPasseggeri(newPasseggeri);
          } else {
            // Per il guidatore
            setFormData((prev) => ({
              ...prev,
              [currentCameraField]: file,
            }));
          }

          stopCamera();
        },
        "image/jpeg",
        0.8,
      );
    }
  };

  // FUNZIONI PER LA GESTIONE DEI BANNER
  const showSuccessBanner = (message) => {
    setBannerType('success');
    setBannerMessage(message);
    setShowBanner(true);
    // Auto-hide dopo 8 secondi per il successo (più tempo per leggere)
    setTimeout(() => {
      setShowBanner(false);
    }, 8000);
  };

  const showErrorBanner = (message) => {
    setBannerType('error');
    setBannerMessage(message);
    setShowBanner(true);
    // Auto-hide dopo 10 secondi per gli errori (ancora più tempo per leggere)
    setTimeout(() => {
      setShowBanner(false);
    }, 10000);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  // FUNZIONI DI GESTIONE DEL FORM
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    // Trasforma in maiuscolo per i campi specificati
    if (
      ["guidatoreCodiceFiscale", "guidatorePatente", "autoTarga"].includes(name)
    ) {
      finalValue = finalValue.toUpperCase();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handlePasseggeroChange = (
    index,
    field,
    value,
    type = "text",
    checked = false,
  ) => {
    const newPasseggeri = [...passeggeri];
    let finalValue = type === "checkbox" ? checked : value;

    if (["codiceFiscale"].includes(field)) {
      finalValue = finalValue.toUpperCase();
    }

    newPasseggeri[index] = {
      ...newPasseggeri[index],
      [field]: finalValue,
    };
    setPasseggeri(newPasseggeri);
  };

  const handleFileUpload = (e, fieldName, index = null) => {
    const file = e.target.files[0];
    if (file) {
      if (index !== null) {
        const newPasseggeri = [...passeggeri];
        newPasseggeri[index] = {
          ...newPasseggeri[index],
          [fieldName]: file,
        };
        setPasseggeri(newPasseggeri);
      } else {
        setFormData((prev) => ({
          ...prev,
          [fieldName]: file,
        }));
      }
    }
  };

  const removeFile = (fieldName, index = null) => {
    if (index !== null) {
      const newPasseggeri = [...passeggeri];
      newPasseggeri[index] = {
        ...newPasseggeri[index],
        [fieldName]: null,
      };
      setPasseggeri(newPasseggeri);
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
  };

  const aggiungiPasseggero = () => {
    if (formData.postiAuto > 0 && passeggeri.length >= formData.postiAuto - 1) {
      showErrorBanner(
        `Non è possibile aggiungere più di ${formData.postiAuto - 1} passeggeri per un'auto con ${formData.postiAuto} posti (uno è per il guidatore).`
      );
      return;
    }
    setPasseggeri((prev) => [
      ...prev,
      {
        cognome: "",
        nome: "",
        codiceFiscale: "",
        dataNascita: "",
        indirizzo: "",
        cellulare: "",
        email: "",
        documentoFronte: null,
        documentoRetro: null,
        esigenzeAlimentari: false,
        intolleranze: "",
        autorizzaFoto: true,
        autorizzaTrattamento: true,
      },
    ]);
  };

  const rimuoviPasseggero = (index) => {
    setPasseggeri((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const handleIscriviti = (evento) => {
    setSelectedEvent(evento);
    setShowForm(true);
    // Set the first available quote as selected by default, if any
    if (evento.quote && Object.keys(evento.quote).length > 0) {
      const firstQuotaKey = Object.keys(evento.quote)[0];
      setFormData((prev) => ({
        ...prev,
        quotaSelezionata: firstQuotaKey,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        quotaSelezionata: "", // No quote selected if none are available
      }));
    }
  };

  const handleShowProgram = (evento) => {
    setSelectedEvent(evento);
    setShowProgramModal(true);
  };

  // Funzione helper per convertire file in base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Rimuovi il prefisso data:image/...;base64,
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

const handleSubmitRegistration = async () => {
  if (!selectedEvent) {
    showErrorBanner("Nessun evento selezionato per l'iscrizione.");
    return;
  }

  // Imposta immediatamente lo stato di caricamento per disabilitare il pulsante
  setIsSubmitting(true);
  setValidationErrors({});

  try {
    // Validazione completa guidatore (mantengo la validazione esistente)
    const guidatoreErrors = {};
    const cognomeValidation = validateRequiredField(
      formData.guidatoreCognome,
      "Cognome",
    );
    if (!cognomeValidation.valid)
      guidatoreErrors.guidatoreCognome = cognomeValidation.message;
    const nomeValidation = validateRequiredField(
      formData.guidatoreNome,
      "Nome",
    );
    if (!nomeValidation.valid)
      guidatoreErrors.guidatoreNome = nomeValidation.message;
    const cfValidation = validateCodiceFiscale(
      formData.guidatoreCodiceFiscale,
    );
    if (!cfValidation.valid)
      guidatoreErrors.guidatoreCodiceFiscale = cfValidation.message;
    const phoneValidation = validatePhone(formData.guidatoreCellulare);
    if (!phoneValidation.valid)
      guidatoreErrors.guidatoreCellulare = phoneValidation.message;
    const emailValidation = validateEmail(formData.guidatoreEmail);
    if (!emailValidation.valid)
      guidatoreErrors.guidatoreEmail = emailValidation.message;
    const dataNascitaValidation = validateDate(
      formData.guidatoreDataNascita,
      "Data di Nascita",
    );
    if (!dataNascitaValidation.valid)
      guidatoreErrors.guidatoreDataNascita = dataNascitaValidation.message;
    const patenteScadenzaValidation = validateDate(
      formData.guidatorePatenteScadenza,
      "Scadenza Patente",
    );
    if (!patenteScadenzaValidation.valid)
      guidatoreErrors.guidatorePatenteScadenza =
        patenteScadenzaValidation.message;
    const indirizzoValidation = validateRequiredField(
      formData.guidatoreIndirizzo,
      "Indirizzo",
    );
    if (!indirizzoValidation.valid)
      guidatoreErrors.guidatoreIndirizzo = indirizzoValidation.message;
    if (!formData.guidatoreAutorizzaTrattamento)
      guidatoreErrors.guidatoreAutorizzaTrattamento =
        "Obbligatorio autorizzare trattamento dati";

    // Validazione dati auto
    const targaValidation = validateTarga(formData.autoTarga);
    if (!targaValidation.valid)
      guidatoreErrors.autoTarga = targaValidation.message;
    const marcaValidation = validateRequiredField(
      formData.autoMarca,
      "Marca Auto",
    );
    if (!marcaValidation.valid)
      guidatoreErrors.autoMarca = marcaValidation.message;
    const modelloValidation = validateRequiredField(
      formData.autoModello,
      "Modello Auto",
    );
    if (!modelloValidation.valid)
      guidatoreErrors.autoModello = modelloValidation.message;
    const coloreValidation = validateRequiredField(
      formData.autoColore,
      "Colore Auto",
    );
    if (!coloreValidation.valid)
      guidatoreErrors.autoColore = coloreValidation.message;
    const immatricolazioneValidation = validateRequiredField(
      formData.autoImmatricolazione,
      "Anno Immatricolazione",
    );
    if (!immatricolazioneValidation.valid)
      guidatoreErrors.autoImmatricolazione =
        immatricolazioneValidation.message;

    if (!formData.quotaSelezionata)
      guidatoreErrors.quotaSelezionata =
        "Seleziona un pacchetto di partecipazione";
    if (!formData.guidatoreDocumentoFronte)
      guidatoreErrors.guidatoreDocumentoFronte =
        "Documento fronte obbligatorio";
    if (!formData.guidatoreDocumentoRetro)
      guidatoreErrors.guidatoreDocumentoRetro =
        "Documento retro obbligatorio";

    // Validazione passeggeri (mantengo la validazione esistente)
    const passeggeriErrors = {};
    passeggeri.forEach((p, i) => {
      const pCognomeValidation = validateRequiredField(p.cognome, "Cognome");
      if (!pCognomeValidation.valid)
        passeggeriErrors[`cognome_${i}`] = pCognomeValidation.message;
      const pNomeValidation = validateRequiredField(p.nome, "Nome");
      if (!pNomeValidation.valid)
        passeggeriErrors[`nome_${i}`] = pNomeValidation.message;
      const pCfValidation = validateCodiceFiscale(p.codiceFiscale);
      if (!pCfValidation.valid)
        passeggeriErrors[`codiceFiscale_${i}`] = pCfValidation.message;
      const pPhoneValidation = validatePhone(p.cellulare);
      if (!pPhoneValidation.valid)
        passeggeriErrors[`cellulare_${i}`] = pPhoneValidation.message;
      const pEmailValidation = validateEmail(p.email);
      if (!pEmailValidation.valid)
        passeggeriErrors[`email_${i}`] = pEmailValidation.message;
      const pDataNascitaValidation = validateDate(
        p.dataNascita,
        "Data di Nascita",
      );
      if (!pDataNascitaValidation.valid)
        passeggeriErrors[`dataNascita_${i}`] = pDataNascitaValidation.message;
      const pIndirizzoValidation = validateRequiredField(
        p.indirizzo,
        "Indirizzo",
      );
      if (!pIndirizzoValidation.valid)
        passeggeriErrors[`indirizzo_${i}`] = pIndirizzoValidation.message;
      if (!p.autorizzaTrattamento)
        passeggeriErrors[`autorizzaTrattamento_${i}`] =
          `Il passeggero ${i + 1} deve autorizzare GDPR`;
      if (!p.documentoFronte)
        passeggeriErrors[`documentoFronte_${i}`] =
          `Documento fronte passeggero ${i + 1} obbligatorio`;
      if (!p.documentoRetro)
        passeggeriErrors[`documentoRetro_${i}`] =
          `Documento retro passeggero ${i + 1} obbligatorio`;
    });

    const allErrors = { ...guidatoreErrors, ...passeggeriErrors };
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      showErrorBanner(
        `Errore di validazione: ${Object.values(allErrors)[0]}\nTotale errori: ${Object.keys(allErrors).length}`
      );
      setIsSubmitting(false);
      return;
    }

    // Upload documenti guidatore tramite API
    let guidatoreFrontePath = null;
    let guidatoreRetroPath = null;

    if (formData.guidatoreDocumentoFronte && formData.guidatoreDocumentoRetro) {
      try {
        // Converti i file in base64
        const fronteBase64 = await convertFileToBase64(formData.guidatoreDocumentoFronte);
        const retroBase64 = await convertFileToBase64(formData.guidatoreDocumentoRetro);

        // Imposto nomi per i documenti
        

        const uploadResponse = await fetch("/api/uploadDocumentoGuidatore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            codiceFiscale: formData.guidatoreCodiceFiscale,
            documentoFronte: {
              data: fronteBase64,
              name: formData.guidatoreDocumentoFronte.name,
              type: formData.guidatoreDocumentoFronte.type
            },
            documentoRetro: {
              data: retroBase64,
              name: formData.guidatoreDocumentoRetro.name,
              type: formData.guidatoreDocumentoRetro.type
            }
          }),
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.text();
          throw new Error("Errore upload documenti guidatore: " + error);
        }

        const uploadData = await uploadResponse.json();
        guidatoreFrontePath = uploadData.frontePath;
        guidatoreRetroPath = uploadData.retroPath;
      } catch (uploadError) {
        throw new Error("Errore durante l'upload dei documenti del guidatore: " + uploadError.message);
      }
    }

    // Preparazione dati guidatore
    const guidatorePayload = {
      nome: formData.guidatoreNome.trim(),
      cognome: formData.guidatoreCognome.trim(),
      data_nascita: formData.guidatoreDataNascita,
      codice_fiscale: formData.guidatoreCodiceFiscale.toUpperCase().trim(),
      indirizzo: formData.guidatoreIndirizzo.trim(),
      indirizzo_email: formData.guidatoreEmail.toLowerCase().trim(),
      telefono: formData.guidatoreCellulare.replace(/\s+/g, ""),
      patente: formData.guidatorePatente.toUpperCase().trim(),
      patente_scadenza: formData.guidatorePatenteScadenza,
      auto_marca: formData.autoMarca.trim(),
      auto_colore: formData.autoColore.trim(),
      auto_immatricolazione: formData.autoImmatricolazione,
      auto_modello: formData.autoModello.trim(),
      auto_targa: formData.autoTarga.toUpperCase().trim(),
      posti_auto: formData.postiAuto,
      intolleranze: formData.guidatoreEsigenzeAlimentari
        ? formData.guidatoreIntolleranze.trim()
        : "",
      id_evento_fk: selectedEvent.id,
      quota: formData.quotaSelezionata,
      documento_fronte: guidatoreFrontePath || null,
      documento_retro: guidatoreRetroPath || null,
    };

    const guidatoreRes = await fetch("/api/inserisciGuidatore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guidatorePayload),
    });

    if (!guidatoreRes.ok) {
      const error = await guidatoreRes.text();
      throw new Error("Errore inserimento guidatore: " + error);
    }

    const guidatoreData = await guidatoreRes.json();
    const guidatoreId = guidatoreData.id;

    // Inserimento passeggeri
    for (let i = 0; i < passeggeri.length; i++) {
      const p = passeggeri[i];
      let passeggeroFrontePath = null;
      let passeggeroRetroPath = null;

      // Upload documenti passeggero tramite API
      if (p.documentoFronte && p.documentoRetro) {
        try {
          // Converti i file in base64
          const fronteBase64 = await convertFileToBase64(p.documentoFronte);
          const retroBase64 = await convertFileToBase64(p.documentoRetro);

          const uploadPasseggeroResponse = await fetch("/api/uploadDocumentoPasseggero", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              codiceFiscale: p.codiceFiscale,
              passeggeroIndex: i + 1,
              documentoFronte: {
                data: fronteBase64,
                name: p.documentoFronte.name,
                type: p.documentoFronte.type
              },
              documentoRetro: {
                data: retroBase64,
                name: p.documentoRetro.name,
                type: p.documentoRetro.type
              }
            }),
          });

          if (!uploadPasseggeroResponse.ok) {
            const error = await uploadPasseggeroResponse.text();
            throw new Error(`Errore upload documenti passeggero ${i + 1}: ${error}`);
          }

          const uploadPasseggeroData = await uploadPasseggeroResponse.json();
          passeggeroFrontePath = uploadPasseggeroData.frontePath;
          passeggeroRetroPath = uploadPasseggeroData.retroPath;
        } catch (uploadError) {
          throw new Error(`Errore durante l'upload dei documenti del passeggero ${i + 1}: ${uploadError.message}`);
        }
      }

      // Preparazione payload JSON passeggero
      const passeggeroPayload = {
        nome: p.nome.trim(),
        cognome: p.cognome.trim(),
        data_nascita: p.dataNascita,
        codice_fiscale: p.codiceFiscale.toUpperCase().trim(),
        indirizzo: p.indirizzo.trim(),
        indirizzo_email: p.email.toLowerCase().trim(),
        telefono: p.cellulare.replace(/\s+/g, ""),
        documento_fronte: passeggeroFrontePath || null,
        documento_retro: passeggeroRetroPath || null,
        intolleranze: p.esigenzeAlimentari ? p.intolleranze.trim() : "",
        id_guidatore_fk: guidatoreId,
        id_evento_fk: selectedEvent.id,
        verificato: false,
      };

      const passeggeroRes = await fetch("/api/inserisciPasseggero", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passeggeroPayload),
      });

      if (!passeggeroRes.ok) {
        const error = await passeggeroRes.text();
        throw new Error(`Errore inserimento passeggero ${i + 1}: ${error}`);
      }

      const passeggeroData = await passeggeroRes.json();
    }

    // Invia mail di conferma
    try {
      await handleConfirmationMail(
        0,
        formData.guidatoreEmail,
        formData,
        passeggeri,
        selectedEvent,
      );
    } catch (emailError) {
      console.warn("Errore invio email di conferma:", emailError);
    }

    showSuccessBanner("Iscrizione completata con successo! È stata inviata una mail di riepilogo all'indirizzo email del guidatore.");
    setShowForm(false);

    // Reset form e stato
    setFormData({
      guidatoreCognome: "",
      guidatoreNome: "",
      guidatoreCodiceFiscale: "",
      guidatoreDataNascita: "",
      guidatoreIndirizzo: "",
      guidatoreCellulare: "",
      guidatoreEmail: "",
      guidatorePatente: "",
      guidatorePatenteScadenza: "",
      guidatoreDocumentoFronte: null,
      guidatoreDocumentoRetro: null,
      autoMarca: "",
      autoColore: "",
      autoImmatricolazione: "",
      autoModello: "",
      autoTarga: "",
      postiAuto: 4,
      quotaSelezionata: "",
      guidatoreEsigenzeAlimentari: false,
      guidatoreIntolleranze: "",
      guidatoreAutorizzaFoto: true,
      guidatoreAutorizzaTrattamento: true,
    });
    setPasseggeri([]);
    setValidationErrors({});
  } catch (err) {
    console.error("Errore durante la registrazione:", err);
    showErrorBanner(
      "Si è verificato un errore durante l'iscrizione: " +
        (err.message || "Verifica i dati inseriti e riprova.")
    );
  } finally {
    setIsSubmitting(false);
  }
};

  // Funzione per l'invio della mail conferma iscrizione
  async function handleConfirmationMail(
    type,
    email,
    formData,
    passeggeri,
    selectedEvent,
  ) {
    try {
      const res = await fetch("/api/resendApi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          formData,
          passeggeri,
          selectedEvent,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        const text = await res.text(); // fallback se non è JSON
        console.error("Risposta non JSON:", text);
        throw new Error("Risposta non valida dal server");
      }

      if (res.ok) {
        // Non mostriamo più il banner qui perché viene gestito nella funzione principale
        console.log("Email di conferma inviata con successo!");
      } else {
        showErrorBanner(
          "Errore nell'invio dell'email di conferma: " +
            (data?.error || "Errore sconosciuto")
        );
      }
    } catch (err) {
      showErrorBanner("Errore di rete durante l'invio dell'email: " + err.message);
    }
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <main className="min-h-screen bg-white text-black overflow-x-hidden">
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
            } animate-pulse`} style={{
              width: '100%',
              animation: `shrink ${bannerType === 'success' ? '8' : '10'}s linear forwards`
            }}></div>
          </div>
        )}
        {/* HEADER MIGLIORATO */}
        <header className="bg-black shadow-lg border-b-2 border-gray-800">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative w-72 h-28 md:w-32 md:h-32">
                  <Image
                    src="/logo.png"
                    alt="AldebaranDrive Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    AldebaranDrive
                  </h1>
                </div>
              </div>

              <nav className="hidden md:flex gap-8 text-lg font-medium items-center">
                <a
                  href="#chi-siamo"
                  className="text-white hover:text-gray-200 transition-colors relative group"
                >
                  Chi Siamo
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#prossimi-eventi"
                  className="text-white hover:text-gray-200 transition-colors relative group"
                >
                  Prossimi Eventi
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#galleria-eventi"
                  className="text-white hover:text-gray-200 transition-colors relative group"
                >
                  Galleria Eventi
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a
                  href="#galleria-foto"
                  className="text-white hover:text-gray-200 transition-colors relative group"
                >
                  Galleria Foto
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </nav>
              <button
                className="md:hidden p-2 text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE MENU OVERLAY */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8 md:hidden">
            <button
              className="absolute top-6 right-6 text-white p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <XIcon className="w-8 h-8" />
            </button>
            <nav className="flex flex-col gap-6 text-xl font-medium text-white">
              <a
                href="#chi-siamo"
                className="hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Chi Siamo
              </a>
              <a
                href="#prossimi-eventi"
                className="hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prossimi Eventi
              </a>
              <a
                href="#galleria-eventi"
                className="hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galleria Eventi
              </a>
              <a
                href="#galleria-foto"
                className="hover:text-gray-200 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Galleria Foto
              </a>
            </nav>
          </div>
        )}

        {/* SEZIONE HERO */}
        <section
          className="text-center px-4 py-20 bg-cover bg-center text-white relative"
          style={{ backgroundImage: "url('/11.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vivi la Passione
            </h1>
            <p className="text-gray-200 max-w-3xl mx-auto mb-8 text-lg md:text-xl">
              Un’esperienza riservata a chi vive la strada come un privilegio.
            </p>
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold relative group overflow-hidden">
              <span className="relative z-10">Scopri i Prossimi Eventi</span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
            </Button>
          </div>
        </section>

        {/* SEZIONE PROSSIMI EVENTI */}
        <section id="prossimi-eventi" className="px-6 py-20 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
              Prossimi Eventi
            </h2>
            <p className="text-center text-gray-700 mb-12 text-lg max-w-2xl mx-auto">
              Scopri i nostri eventi esclusivi e iscriviti per vivere esperienze
              indimenticabili
            </p>
            {loadingEventi ? (
              <div className="text-center text-gray-700 text-lg">
                Caricamento eventi...
              </div>
            ) : eventi.length === 0 ? (
              <div className="text-center text-gray-700 text-lg">
                Nessun evento futuro in programma.
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {eventi.map((evento) => (
                  <div
                    key={evento.id}
                    className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:border-black group"
                  >
                    {/* Immagine evento */}
                    <div className="relative aspect-[3/2] bg-gray-200 overflow-hidden">
                      <Image
                        src={cover[evento.id] || "/hero.png"}
                        alt={evento.titolo}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    <div className="p-6 flex flex-col">
                      <h3 className="text-xl font-bold mb-3 text-black">
                        {evento.titolo}
                      </h3>
                     <ExpandableText>
                        <ReactMarkdown>{evento.descrizione}</ReactMarkdown>
                      </ExpandableText>

                      <div className="flex flex-col gap-3 text-sm text-gray-700 mb-6">
                        <p className="flex items-center gap-2">
                          <CalendarDaysIcon className="w-4 h-4 text-black" />{" "}
                          Dal {new Date(evento.data).toLocaleDateString()} al{" "}
                          {new Date(evento.fine).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPinIcon className="w-4 h-4 text-black" />{" "}
                          {evento.luogo}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() => handleShowProgram(evento)}
                          className="bg-gray-600 text-white hover:bg-gray-700 py-3 font-semibold relative group overflow-hidden"
                        >
                          <FileTextIcon className="w-4 h-4 mr-2" />
                          <span className="relative z-10">Vedi Programma</span>
                        </Button>
                        <Button
                          onClick={() => handleIscriviti(evento)}
                          className="bg-black text-white hover:bg-gray-800 py-3 font-semibold relative group overflow-hidden"
                        >
                          <span className="relative z-10">Iscriviti Ora</span>
                          <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SEZIONE CHI SIAMO */}
        <section id="chi-siamo" className="px-6 py-20 bg-black text-white">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Chi Siamo
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  La Nostra Passione
                </h3>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Aldebaran Drive è specializzata nell'organizzazione di eventi
                  a due e quattro ruote, offrendo un servizio completo e curato
                  nei minimi dettagli per tutti gli appassionati di motori.
                  Fondata da professionisti con una lunga esperienza nel
                  settore, l'azienda nasce con una doppia missione: celebrare la
                  passione motoristica e promuovere la solidarietà.
                </p>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Collaborando attivamente con associazioni benefiche, Aldebaran
                  Drive organizza raduni di beneficenza che uniscono
                  divertimento e impegno sociale, contribuendo concretamente a
                  sostenere comunità e iniziative locali
                </p>
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                  Il nostro team si occupa di ogni fase dell'organizzazione:
                  dalla selezione di location suggestive alla gestione della
                  logistica, garantendo eventi coinvolgenti e indimenticabili,
                  nel rispetto delle norme di sicurezza. Ogni raduno è
                  un'occasione per condividere esperienze, stringere nuove
                  amicizie e vivere la passione per i motori in un'atmosfera
                  esclusiva
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-gray-800 hover:scale-105 transition-transform duration-300"
                  >
                    <Image
                      src="/hero.png"
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

        {/* SEZIONE GALLERIA GENERALE MIGLIORATA */}
        <section
          id="galleria-foto"
          className="px-6 py-20 bg-black relative overflow-hidden"
        >
          {/* Sfondo rimosso: niente racing stripe */}
          {/* Nessuna decorazione racing qui */}

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                🏁 Galleria Generale 🏁
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                I momenti più emozionanti dei nostri eventi motoristici
              </p>
              <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full"></div>
            </div>

            {loadingGalleria ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(15)].map((_, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl bg-gray-800 animate-pulse relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏎️</div>
                <p className="text-gray-300 text-xl">
                  Nessuna immagine disponibile al momento
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Le foto degli eventi verranno caricate presto!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((url, index) => (
                  <div
                    key={index}
                    className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-10"
                    onClick={() => handleImageClick(url)}
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Galleria foto ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onLoad={(e) => {
                        e.target.classList.add("loaded");
                      }}
                      style={{
                        filter: "brightness(0.9) contrast(1.1)",
                      }}
                    />

                    {/* Overlay gradiente sempre visibile ma sottile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Icona zoom su hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <span className="text-2xl">🔍</span>
                      </div>
                    </div>

                    {/* Numero foto in basso */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      #{index + 1}
                    </div>

                    {/* Effetto riflesso racing */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Bordo su hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/50 rounded-xl transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Sezione finale racing rimossa */}
          </div>
        </section>

        {/* SEZIONE GALLERIA EVENTI PASSATI MIGLIORATA */}
        <section id="galleria-eventi" className="px-6 py-20 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-black">
              Galleria Eventi Passati
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Rivivi le emozioni dei nostri eventi precedenti
            </p>

            {loadingEventiPassatiImmagini ? (
              <div className="text-center text-gray-700 text-lg">
                Caricamento gallerie eventi...
              </div>
            ) : Object.keys(eventiPassatiImmagini).length === 0 ||
              Object.values(eventiPassatiImmagini).every(
                (arr) => arr.length === 0,
              ) ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏎️</div>
                <p className="text-gray-600 text-xl">
                  Nessuna galleria eventi disponibile al momento
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Le foto degli eventi passati verranno caricate presto!
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {eventiPassati
                  .filter(
                    (evento) =>
                      eventiPassatiImmagini[evento.id] &&
                      eventiPassatiImmagini[evento.id].length > 0,
                  )
                  .map((evento) => (
                    <div
                      key={evento.id}
                      className="bg-white rounded-2xl p-8 shadow-lg"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-2 h-12 bg-gradient-to-b from-red-500 via-white to-green-500 rounded-full"></div>
                        <div>
                          <h3 className="text-2xl font-semibold text-black">
                            {evento.titolo}
                          </h3>
                          <p className="text-gray-600">
                            {new Date(evento.data).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {eventiPassatiImmagini[evento.id].map(
                          (immagine, index) => (
                            <div
                              key={immagine.id}
                              className="group relative aspect-square overflow-hidden rounded-xl bg-gray-200 hover:shadow-xl transition-all duration-500 cursor-pointer"
                              onClick={() => handleImageClick(immagine.url)}
                            >
                              <img
                                src={immagine.url}
                                alt={immagine.alt}
                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 text-white">
                                  <p className="text-sm font-medium">
                                    Foto {index + 1}
                                  </p>
                                </div>
                              </div>
                              {/* Icona zoom su hover */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                  <span className="text-xl">🔍</span>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* MODAL PROGRAMMA EVENTO */}
{/* MODAL PROGRAMMA EVENTO */}
{showProgramModal && selectedEvent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-20">
        <h2 className="text-2xl font-bold text-black">
          Programma - {selectedEvent?.titolo}
        </h2>
        <button
          onClick={() => setShowProgramModal(false)}
          className="text-gray-500 hover:text-black"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-6">
        <div className="space-y-8">
          {selectedEvent.programma ? (
            (() => {
              // Parsing del programma
              const lines = selectedEvent.programma.split('\n').filter(line => line.trim());
              const days = [];
              let currentDay = null;
              
              lines.forEach(line => {
                const trimmedLine = line.trim();
                
                // Controlla se la riga è un giorno (non contiene orario)
                if (!trimmedLine.match(/^\d{1,2}[:\.]?\d{0,2}\s*[-–—]\s*/)) {
                  // È un nuovo giorno
                  currentDay = {
                    day: trimmedLine,
                    events: []
                  };
                  days.push(currentDay);
                } else if (currentDay) {
                  // È un evento con orario
                  const match = trimmedLine.match(/^(\d{1,2}[:\.]?\d{0,2})\s*[-–—]\s*(.+)$/);
                  if (match) {
                    currentDay.events.push({
                      time: match[1],
                      description: match[2]
                    });
                  }
                }
              });
              
              return days.map((day, dayIndex) => (
                <div key={dayIndex} className="border-l-4 border-black pl-6 relative">
                  {/* Pallino indicatore */}
                  <div className="absolute -left-3 top-2 w-6 h-6 bg-black rounded-full flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Nome del giorno */}
                  <h3 className="text-2xl font-bold text-black mb-6 uppercase tracking-wide">
                    {day.day}
                  </h3>
                  
                  {/* Eventi del giorno */}
                  <div className="space-y-4 ml-2">
                    {day.events.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-start gap-4">
                        <div className="bg-gray-100 px-3 py-1 rounded-full min-w-fit">
                          <span className="text-sm font-bold text-gray-800">
                            {event.time}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed pt-1">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-8 text-lg">
                Programma in fase di definizione
              </p>
              
              {/* Programma placeholder migliorato */}
              <div className="border-l-4 border-gray-300 pl-6 relative">
                <div className="absolute -left-3 top-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-500 mb-6 uppercase tracking-wide">
                  GIORNO DELL'EVENTO
                </h3>
                
                <div className="space-y-4 ml-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full min-w-fit">
                      <span className="text-sm font-bold text-gray-600">09:00</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      Ritrovo e registrazione partecipanti
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full min-w-fit">
                      <span className="text-sm font-bold text-gray-600">09:30</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      Briefing e presentazione del percorso
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full min-w-fit">
                      <span className="text-sm font-bold text-gray-600">10:00</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      Partenza e tour guidato
                    </p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 px-3 py-1 rounded-full min-w-fit">
                      <span className="text-sm font-bold text-gray-600">12:30</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed pt-1">
                      Pranzo e momento conviviale
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <Button
            onClick={() => {
              setShowProgramModal(false);
              handleIscriviti(selectedEvent);
            }}
            className="w-full bg-black text-white hover:bg-gray-800 py-3 font-semibold text-lg"
          >
            Iscriviti a questo Evento
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

        {/* MODAL FORM ISCRIZIONE MIGLIORATO */}
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
                <form
                  className="space-y-8"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitRegistration();
                  }}
                >
                  {/* SEZIONE DATI GUIDATORE */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Dati Guidatore
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="guidatore-cognome"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Cognome *
                        </label>
                        <input
                          id="guidatore-cognome"
                          type="text"
                          name="guidatoreCognome"
                          placeholder="Es. Rossi"
                          value={formData.guidatoreCognome}
                          onChange={handleInputChange}
                          className={`border-2 p-3 rounded-lg focus:outline-none w-full ${
                            validationErrors.guidatoreCognome
                              ? "border-red-500 bg-red-50 focus:border-red-600"
                              : "border-gray-300 focus:border-black"
                          }`}
                          required
                        />
                        {validationErrors.guidatoreCognome && (
                          <p className="text-red-600 text-sm mt-1">
                            {validationErrors.guidatoreCognome}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-nome"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nome *
                        </label>
                        <input
                          id="guidatore-nome"
                          type="text"
                          name="guidatoreNome"
                          placeholder="Es. Mario"
                          value={formData.guidatoreNome}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-codice-fiscale"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Codice Fiscale *
                        </label>
                        <input
                          id="guidatore-codice-fiscale"
                          type="text"
                          name="guidatoreCodiceFiscale"
                          placeholder="Es. RSSMRA80A01H501U"
                          value={formData.guidatoreCodiceFiscale}
                          onChange={handleInputChange}
                          className={`border-2 p-3 rounded-lg focus:outline-none w-full ${
                            validationErrors.guidatoreCodiceFiscale
                              ? "border-red-500 bg-red-50 focus:border-red-600"
                              : "border-gray-300 focus:border-black"
                          }`}
                          required
                        />
                        {validationErrors.guidatoreCodiceFiscale && (
                          <p className="text-red-600 text-sm mt-1 font-semibold">
                            {validationErrors.guidatoreCodiceFiscale}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-data-nascita"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Data di Nascita *
                        </label>
                        <input
                          id="guidatore-data-nascita"
                          type="date"
                          name="guidatoreDataNascita"
                          value={formData.guidatoreDataNascita}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-indirizzo"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Indirizzo *
                        </label>
                        <input
                          id="guidatore-indirizzo"
                          type="text"
                          name="guidatoreIndirizzo"
                          placeholder="Es. Via Roma 1, Milano"
                          value={formData.guidatoreIndirizzo}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-cellulare"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Cellulare *
                        </label>
                        <input
                          id="guidatore-cellulare"
                          type="tel"
                          name="guidatoreCellulare"
                          placeholder="Es. 3331234567"
                          value={formData.guidatoreCellulare}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label
                          htmlFor="guidatore-email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email *
                        </label>
                        <input
                          id="guidatore-email"
                          type="email"
                          name="guidatoreEmail"
                          placeholder="Es. mario.rossi@example.com"
                          value={formData.guidatoreEmail}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-patente"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Numero patente *
                        </label>
                        <input
                          id="guidatore-patente"
                          type="text"
                          name="guidatorePatente"
                          placeholder="Es. XX000XX"
                          value={formData.guidatorePatente}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="guidatore-patente-scadenza"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Scadenza Patente *
                        </label>
                        <input
                          id="guidatore-patente-scadenza"
                          type="date"
                          name="guidatorePatenteScadenza"
                          value={formData.guidatorePatenteScadenza}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                    </div>

                    {/* Upload documenti guidatore */}
                    <div className="mt-6 space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Documento di Identità Guidatore - Fronte *
    </label>
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleFileUpload(e, "guidatoreDocumentoFronte")
        }
        className="hidden"
        id="guidatore-doc-fronte"
      />
      <label
        htmlFor="guidatore-doc-fronte"
        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm"
      >
        <UploadIcon className="w-4 h-4" />
        {isMobile ? "Carica" : "Carica da PC"}
      </label>
      {isMobile && (
        <Button
          type="button"
          onClick={() =>
            startCamera(
              "guidatoreDocumentoFronte",
              null,
              "back",
            )
          }
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm"
        >
          <CameraIcon className="w-4 h-4 mr-2" />
          Scatta Foto
        </Button>
      )}
    </div>
    {formData.guidatoreDocumentoFronte && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-green-600 min-w-0 flex-1">
            <span className="text-green-500">✓</span>
            <span className="truncate">{formData.guidatoreDocumentoFronte.name}</span>
          </div>
          <Button
            type="button"
            onClick={() => removeFile("guidatoreDocumentoFronte")}
            className="flex-shrink-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            title="Rimuovi file"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Documento di identità Guidatore - Retro *
    </label>
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleFileUpload(e, "guidatoreDocumentoRetro")
        }
        className="hidden"
        id="guidatore-doc-retro"
      />
      <label
        htmlFor="guidatore-doc-retro"
        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm"
      >
        <UploadIcon className="w-4 h-4" />
        {isMobile ? "Carica" : "Carica da PC"}
      </label>
      {isMobile && (
        <Button
          type="button"
          onClick={() =>
            startCamera(
              "guidatoreDocumentoRetro",
              null,
              "back",
            )
          }
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm"
        >
          <CameraIcon className="w-4 h-4 mr-2" />
          Scatta Foto
        </Button>
      )}
    </div>
    {formData.guidatoreDocumentoRetro && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-green-600 min-w-0 flex-1">
            <span className="text-green-500">✓</span>
            <span className="truncate">{formData.guidatoreDocumentoRetro.name}</span>
          </div>
          <Button
            type="button"
            onClick={() => removeFile("guidatoreDocumentoRetro")}
            className="flex-shrink-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            title="Rimuovi file"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )}
  </div>
</div>

                    {/* ESIGENZE ALIMENTARI GUIDATORE */}
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-4 text-black">
                        Esigenze Alimentari Guidatore
                      </h4>
                      <div className="flex items-center gap-4 mb-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="guidatoreEsigenzeAlimentari"
                            checked={formData.guidatoreEsigenzeAlimentari}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          Ho esigenze alimentari particolari
                        </label>
                      </div>
                      {formData.guidatoreEsigenzeAlimentari && (
                        <div>
                          <label
                            htmlFor="guidatore-intolleranze"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Intolleranze/Allergie
                          </label>
                          <input
                            id="guidatore-intolleranze"
                            type="text"
                            name="guidatoreIntolleranze"
                            placeholder="Specificare intolleranze o allergie"
                            value={formData.guidatoreIntolleranze}
                            onChange={handleInputChange}
                            className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEZIONE DATI PASSEGGERI */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Dati Passeggeri
                    </h3>
                    {passeggeri.map((passeggero, index) => (
                      <div
                        key={index}
                        className="border-b pb-6 mb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-medium text-black">
                            Passeggero {index + 1}
                          </h4>
                          <Button
                            type="button"
                            onClick={() => rimuoviPasseggero(index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                          >
                            <XIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cognome *
                            </label>
                            <input
                              type="text"
                              placeholder="Es. Verdi"
                              value={passeggero.cognome}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "cognome",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome *
                            </label>
                            <input
                              type="text"
                              placeholder="Es. Luigi"
                              value={passeggero.nome}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "nome",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Codice Fiscale *
                            </label>
                            <input
                              type="text"
                              placeholder="Es. VRDLGU85B15F205P"
                              value={passeggero.codiceFiscale}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "codiceFiscale",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Data di Nascita *
                            </label>
                            <input
                              type="date"
                              value={passeggero.dataNascita}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "dataNascita",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Indirizzo *
                            </label>
                            <input
                              type="text"
                              placeholder="Es. Via Verdi 10, Roma"
                              value={passeggero.indirizzo}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "indirizzo",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cellulare *
                            </label>
                            <input
                              type="tel"
                              placeholder="Es. 3459876543"
                              value={passeggero.cellulare}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "cellulare",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email *
                            </label>
                            <input
                              type="email"
                              placeholder="Es. luigi.verdi@example.com"
                              value={passeggero.email}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "email",
                                  e.target.value,
                                )
                              }
                              className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              required
                            />
                          </div>
                        </div>

                        {/* Upload documenti passeggero */}
                        <div className="mt-4 space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Documento Passeggero - Fronte *
    </label>
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleFileUpload(e, "documentoFronte", index)
        }
        className="hidden"
        id={`passeggero-doc-fronte-${index}`}
      />
      <label
        htmlFor={`passeggero-doc-fronte-${index}`}
        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm"
      >
        <UploadIcon className="w-4 h-4" />
        {isMobile ? "Carica" : "Carica da PC"}
      </label>
      {isMobile && (
        <Button
          type="button"
          onClick={() =>
            startCamera(
              "documentoFronte",
              index,
              "back",
            )
          }
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm"
        >
          <CameraIcon className="w-4 h-4 mr-2" />
          Scatta Foto
        </Button>
      )}
    </div>
    {passeggero.documentoFronte && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-green-600 min-w-0 flex-1">
            <span className="text-green-500">✓</span>
            <span className="truncate">{passeggero.documentoFronte.name}</span>
          </div>
          <Button
            type="button"
            onClick={() => removeFile("documentoFronte", index)}
            className="flex-shrink-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            title="Rimuovi file"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )}
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Documento Passeggero - Retro *
    </label>
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) =>
          handleFileUpload(e, "documentoRetro", index)
        }
        className="hidden"
        id={`passeggero-doc-retro-${index}`}
      />
      <label
        htmlFor={`passeggero-doc-retro-${index}`}
        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors text-sm"
      >
        <UploadIcon className="w-4 h-4" />
        {isMobile ? "Carica" : "Carica da PC"}
      </label>
      {isMobile && (
        <Button
          type="button"
          onClick={() =>
            startCamera("documentoRetro", index, "back")
          }
          className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm"
        >
          <CameraIcon className="w-4 h-4 mr-2" />
          Scatta Foto
        </Button>
      )}
    </div>
    {passeggero.documentoRetro && (
      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-green-600 min-w-0 flex-1">
            <span className="text-green-500">✓</span>
            <span className="truncate">{passeggero.documentoRetro.name}</span>
          </div>
          <Button
            type="button"
            onClick={() => removeFile("documentoRetro", index)}
            className="flex-shrink-0 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            title="Rimuovi file"
          >
            <XIcon className="w-3 h-3" />
          </Button>
        </div>
      </div>
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
                                onChange={(e) =>
                                  handlePasseggeroChange(
                                    index,
                                    "esigenzeAlimentari",
                                    e.target.checked,
                                    "checkbox",
                                    e.target.checked,
                                  )
                                }
                                className="mr-2"
                              />
                              Ho esigenze alimentari particolari
                            </label>
                          </div>
                          {passeggero.esigenzeAlimentari && (
                            <div className="mt-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Intolleranze/Allergie
                              </label>
                              <input
                                type="text"
                                placeholder="Specificare intolleranze o allergie"
                                value={passeggero.intolleranze}
                                onChange={(e) =>
                                  handlePasseggeroChange(
                                    index,
                                    "intolleranze",
                                    e.target.value,
                                  )
                                }
                                className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                              />
                            </div>
                          )}
                        </div>

                        {/* Autorizzazioni passeggero */}
                        <div className="mt-4 space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              required
                              checked={passeggero.autorizzaFoto}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "autorizzaFoto",
                                  e.target.checked,
                                  "checkbox",
                                  e.target.checked,
                                )
                              }
                              className="mr-2"
                            />
                            Autorizzo la pubblicazione di foto/video in cui sono presente
                          </label>

                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={passeggero.autorizzaTrattamento}
                              onChange={(e) =>
                                handlePasseggeroChange(
                                  index,
                                  "autorizzaTrattamento",
                                  e.target.checked,
                                  "checkbox",
                                  e.target.checked,
                                )
                              }
                              className="mr-2"
                              required
                            />
                            Autorizzo il trattamento dei dati personali (GDPR) *         <a
                                                                                            href="/privacy_policy"
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="text-blue-600 underline hover:text-blue-800"
                                                                                          >
                                                                                              Leggi l'informativa
                                                                                          </a>
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

                  {/* SEZIONE DATI AUTO */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Dati Autovettura
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="auto-marca"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Marca Auto *
                        </label>
                        <input
                          id="auto-marca"
                          type="text"
                          name="autoMarca"
                          placeholder="Es. Ferrari"
                          value={formData.autoMarca}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="auto-modello"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Modello Auto *
                        </label>
                        <input
                          id="auto-modello"
                          type="text"
                          name="autoModello"
                          placeholder="Es. F8 Tributo"
                          value={formData.autoModello}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="auto-targa"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Targa *
                        </label>
                        <input
                          id="auto-targa"
                          type="text"
                          name="autoTarga"
                          placeholder="Es. AB123CD"
                          value={formData.autoTarga}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="auto-posti-auto"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Numero Posti Auto *
                        </label>
                        <input
                          id="auto-posti-auto"
                          type="number"
                          name="postiAuto"
                          placeholder="Es. 4"
                          value={formData.postiAuto}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          min="1"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="auto-colore"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Colore *
                        </label>
                        <input
                          id="auto-colore"
                          type="text"
                          name="autoColore"
                          placeholder="Es. blu metallizzata"
                          value={formData.autoColore}
                          onChange={handleInputChange}
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="auto-immatricolazione"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Anno immatricolazione *
                        </label>
                        <select
                          id="auto-immatricolazione"
                          name="autoImmatricolazione"
                          value={formData.autoImmatricolazione}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-gray-300 p-3 rounded-lg focus:border-black focus:outline-none w-full bg-white"
                        >
                          <option value="">Seleziona anno</option>
                          {Array.from({ length: 2025 - 1930 + 1 }, (_, i) => {
                            const year = 1930 + i;
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Pacchetto di Partecipazione
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Render quotes dynamically from selectedEvent.quote */}
                      {selectedEvent?.quote &&
                      Object.keys(selectedEvent.quote).length > 0 ? (
                        Object.entries(selectedEvent.quote).map(
                          ([key, quota]) => (
                            <label
                              key={key}
                              htmlFor={`quota-${key}`}
                              className="flex flex-col sm:flex-row sm:items-start bg-white p-4 sm:p-6 rounded-lg shadow-sm border-2 border-gray-200 hover:border-black transition-colors cursor-pointer"
                            >
                              <div className="flex items-start w-full">
                                <input
                                  id={`quota-${key}`}
                                  type="radio"
                                  name="quotaSelezionata"
                                  value={key}
                                  checked={formData.quotaSelezionata === key}
                                  onChange={handleInputChange}
                                  className="mr-3 sm:mr-4 mt-1 w-5 h-5 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  {/* Header con titolo e prezzo - responsive */}
                                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                                    <h4 className="text-lg sm:text-xl font-bold text-black pr-2 break-words">
                                      {quota.titolo || key}
                                    </h4>
                                    <div className="text-left sm:text-right flex-shrink-0">
                                      <div className="text-2xl sm:text-3xl font-bold text-green-600">
                                        €{parseFloat(quota.prezzo).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>

                                  {quota.descrizione && (
                                    <div className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                                      {quota.descrizione
                                        .split("\n")
                                        .map((line, index) => (
                                          <div key={index} className="mb-1">
                                            {line.trim().startsWith("•") ||
                                            line.trim().startsWith("-") ? (
                                              <div className="flex items-start gap-2">
                                                <span className="text-green-600 mt-1 flex-shrink-0">
                                                  ✓
                                                </span>
                                                <span className="break-words">
                                                  {line.replace(/^[•-]\s*/, "")}
                                                </span>
                                              </div>
                                            ) : (
                                              <p className="break-words">
                                                {line}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </label>
                          ),
                        )
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-4">🎫</div>
                          <p className="text-gray-600 text-lg">
                            Nessuna quota disponibile per questo evento.
                          </p>
                          <p className="text-500 text-sm mt-2">
                            Le opzioni di partecipazione verranno pubblicate
                            presto!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEZIONE INVITO AL PAGAMENTO IMMEDIATO */}
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Pagamento Iscrizione
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-blue-300">
                      <div className="space-y-2 text-sm text-gray-700">
                        <p className="text-red-600 font-semibold">
                          ⚠️ Per poter confermare la propria iscrizione si prega
                          di eseguire il prima possibile il pagamento (la
                          fattura verrà ricevuta in seguito alla mail del
                          guidatore registrato)
                        </p>
                        <p>
                          <strong>IBAN:</strong>IT89 P0832 5709 60000 0002 03250
                        </p>
                        <p>
                          <strong>BIC/SWIFT:</strong>ICRAITRR910
                        </p>
                        <p>
                          <strong>Banca:</strong> BANCO FIORENTINO – MUGELLO –
                          IMPRUNETA – SIGNA - CRED. COOP. SOCIETA’ COOPERATIVA
                        </p>
                        <p>
                          <strong>Intestatario:</strong>MARLAN SRL
                        </p>
                        <p>
                          <strong>Causale:</strong> Iscrizione evento{" "}
                          {selectedEvent?.titolo} – {formData.guidatoreCognome}{" "}
                          {formData.guidatoreNome}
                        </p>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Importante:</strong> Usa esattamente la
                          causale indicata per facilitare l’identificazione del
                          pagamento.
                        </p>
                      </div>
                      <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-sm text-green-800">
                          📞 Per qualsiasi informazione o supporto, contatta il
                          numero <strong>344 685 3979</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SEZIONE AUTORIZZAZIONI GUIDATORE */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-black">
                      Autorizzazioni Guidatore
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center">
                      
                              <input
                                type="checkbox"
                                name="guidatoreAutorizzaFoto"
                                required
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
                        Autorizzo il trattamento dei dati personali (GDPR) *            <a
                                                                                          href="/privacy_policy"
                                                                                          target="_blank"
                                                                                          rel="noopener noreferrer"
                                                                                          className="text-blue-600 underline hover:text-blue-800"
                                                                                        >
                                                                                            Leggi l'informativa
                                                                                        </a>
                      </label>
           
                    </div>
                  </div>

                  {/* BOTTONE INVIA ISCRIZIONE */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 font-semibold text-lg relative group overflow-hidden transition-all duration-300 ${
                      isSubmitting 
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed" 
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                          Caricamento...
                        </>
                      ) : (
                        "Invia Iscrizione"
                      )}
                    </span>
                    {!isSubmitting && (
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-500 via-white to-red-500 group-hover:w-full transition-all duration-300"></span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CAMERA */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Scatta Foto Documento</h3>
                <button
                  onClick={stopCamera}
                  className="text-gray-500 hover:text-black"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4">
                <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={capturePhoto}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center gap-2"
                  >
                    <CameraIcon className="w-5 h-5" />
                    Scatta Foto
                  </Button>
                  <Button
                    onClick={stopCamera}
                    className="bg-gray-600 text-white hover:bg-gray-700 px-6 py-3 rounded-lg"
                  >
                    Annulla
                  </Button>
                </div>

                <p className="text-sm text-gray-600 text-center mt-2">
                  Posiziona il documento nel riquadro e scatta la foto
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Informazioni Azienda */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16">
                    <Image
                      src="/logo.png"
                      alt="AldebaranDrive Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold">AldebaranDrive</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Specializzata nell'organizzazione di eventi a due e quattro
                  ruote, offrendo un servizio completo per tutti gli
                  appassionati di motori.
                </p>
                <p className="text-gray-400 text-sm">P.IVA: 02254520591</p>
              </div>

              {/* Informazioni di Contatto */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contatti</h4>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Via dell'acero, 17 - 56022 - Castelfranco di sotto (PI)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      📞
                    </span>
                    +39 392.019.1272 +39 344.6853.979
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      📧
                    </span>
                    info@aldebarandrive.it
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      🌐
                    </span>
                    www.aldebarandrive.it
                  </p>
                </div>
              </div>

              {/* Links e Admin */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Links Utili</h4>
                <div className="space-y-3 mb-6">
                  <a
                    href="#chi-siamo"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Chi Siamo
                  </a>
                  <a
                    href="#prossimi-eventi"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Prossimi Eventi
                  </a>
                  <a
                    href="#galleria-eventi"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Galleria Eventi
                  </a>
                  <a
                    href="#galleria-foto"
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Galleria Foto
                  </a>
                  <a href="/privacy_policy" className="underline hover:text-blue-600">
                    Privacy Policy
                  </a>
                </div>
                

                <Link href="/admin/login">
                  <Button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
                    <LogInIcon className="w-4 h-4" />
                    Admin Login
                  </Button>
                </Link>
              </div>

              {/* Sezione Social */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Social</h4>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/aldebarandrive"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://instagram.com/aldebarandrive"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
                  </a>
                  <a
                    href="https://tiktok.com/@aldebarandrive"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                  >
                    <FaTiktok className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>&copy; 2025 AldebaranDrive. Tutti i diritti riservati.</p>
            </div>
          </div>
        </footer>

        {/* MODAL VISUALIZZAZIONE IMMAGINI */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={handleCloseImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <XIcon className="w-8 h-8" />
              </button>
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Immagine ingrandita"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}