export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">📄 Informativa sulla Privacy</h1>
          <p className="text-gray-400 text-lg">Aldebaran Drive - Raduni Automobilistici</p>
          <p className="text-sm text-gray-500 mt-2">Ultimo aggiornamento: 23/07/2025</p>
        </div>

        {/* Content */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="prose prose-invert max-w-none">
            
            {/* Intro */}
            <div className="mb-8 p-6 bg-blue-900/30 rounded-lg border border-blue-500/30">
              <p className="text-gray-200 leading-relaxed">
                Ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR), l'associazione{' '}
                <strong className="text-blue-300">Aldebaran Drive by Marlan srl</strong>, con sede in{' '}
                <strong className="text-blue-300">Via dell'acero, 17 – 56022 Castelfranco di Sotto (PI), Italia</strong>, 
                in qualità di Titolare del trattamento, informa gli utenti che i dati personali forniti tramite il sito{' '}
                <strong className="text-blue-300">www.aldebarandrive.it</strong> saranno trattati nel rispetto dei principi 
                di liceità, correttezza, trasparenza e tutela della riservatezza.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">🏎️</span>
                1. Tipologie di dati raccolti
              </h2>
              <p className="text-gray-300 mb-4">
                Attraverso i moduli di registrazione agli eventi/raduni, raccogliamo i seguenti dati:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Nome e cognome</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Codice fiscale</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Data e luogo di nascita</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Residenza</li>
                </ul>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Numero di patente di guida e documento d'identità</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Dati del veicolo: marca, modello, colore, targa, data di immatricolazione</li>
                  <li className="flex items-center"><span className="text-blue-400 mr-2">•</span>Dati equivalenti relativi ai passeggeri indicati (esclusi i dati dell'auto)</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">🎯</span>
                2. Finalità del trattamento
              </h2>
              <div className="bg-gray-700/50 p-6 rounded-lg">
                <p className="text-gray-300 mb-4">I dati sono trattati per le seguenti finalità:</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">✓</span>Registrazione e gestione della partecipazione agli eventi/raduni</li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">✓</span>Comunicazioni organizzative relative all'evento (tramite email)</li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">✓</span>Verifica dell'identità e della regolarità dei partecipanti</li>
                  <li className="flex items-start"><span className="text-green-400 mr-2 mt-1">✓</span>Adempimenti legali, assicurativi e di sicurezza</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">⚖️</span>
                3. Base giuridica del trattamento
              </h2>
              <p className="text-gray-300">
                Il trattamento dei dati si fonda sul <strong className="text-yellow-400">consenso esplicito</strong> dell'interessato 
                (art. 6, par. 1, lett. a GDPR), prestato al momento dell'invio del modulo di registrazione.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">🔐</span>
                4. Modalità di trattamento
              </h2>
              <p className="text-gray-300">
                Il trattamento avviene mediante strumenti informatici e telematici, nel rispetto delle misure di sicurezza 
                previste dal GDPR. I dati sono conservati su server localizzati all'interno dello Spazio Economico Europeo 
                tramite il servizio <strong className="text-green-400">Supabase</strong>{' '}
                (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-400 hover:text-blue-300 underline">Privacy Policy Supabase</a>) e{' '}
                <strong className="text-green-400">Vercel</strong>{' '}
                (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" 
                   className="text-blue-400 hover:text-blue-300 underline">Privacy Policy Vercel</a>).
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">📢</span>
                5. Comunicazione e accesso ai dati
              </h2>
              <p className="text-gray-300">
                I dati non saranno diffusi né comunicati a terzi, salvo soggetti incaricati per finalità strettamente 
                legate all'organizzazione dell'evento (es. autorità competenti, enti assicurativi) e solo se necessario.
              </p>
            </section>

            {/* Section 6 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">⏰</span>
                6. Conservazione dei dati
              </h2>
              <div className="bg-orange-900/30 p-6 rounded-lg border border-orange-500/30">
                <p className="text-gray-300">
                  I dati saranno conservati per un periodo massimo di <strong className="text-orange-400">12 mesi dalla data dell'evento</strong>, 
                  dopodiché saranno cancellati o anonimizzati.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">👤</span>
                7. Diritti degli interessati
              </h2>
              <p className="text-gray-300 mb-4">
                Ai sensi degli articoli 15-22 del GDPR, hai il diritto di:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="text-purple-400 mr-2">•</span>Accedere ai tuoi dati</li>
                  <li className="flex items-center"><span className="text-purple-400 mr-2">•</span>Richiederne la rettifica o la cancellazione</li>
                </ul>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center"><span className="text-purple-400 mr-2">•</span>Limitare o opporti al trattamento</li>
                  <li className="flex items-center"><span className="text-purple-400 mr-2">•</span>Richiedere la portabilità dei dati</li>
                </ul>
              </div>
              <div className="mt-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                <p className="text-gray-300">
                  Le richieste vanno inoltrate a: <strong className="text-blue-300">info@aldebarandrive.it</strong>
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">👥</span>
                8. Trattamento dei dati dei passeggeri
              </h2>
              <div className="bg-red-900/30 p-6 rounded-lg border border-red-500/30">
                <p className="text-gray-300">
                  L'iscrivente, fornendo dati personali di terzi (passeggeri), <strong className="text-red-400">dichiara di averli 
                  informati preventivamente</strong> e di aver ottenuto il loro consenso al trattamento secondo quanto previsto 
                  dalla presente informativa.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center">
                <span className="mr-3">🏢</span>
                9. Titolare del trattamento
              </h2>
              <div className="bg-gray-700 p-6 rounded-lg border-l-4 border-blue-500">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-blue-300">Aldebaran Drive by Marlan srl</p>
                  <p className="text-gray-300">Via dell'acero, 17 – 56022 Castelfranco di Sotto (PI), Italia</p>
                  <p className="text-gray-300 flex items-center">
                    <span className="mr-2">📧</span>
                    Email: <a href="mailto:info@aldebarandrive.it" className="text-blue-400 hover:text-blue-300 ml-1">info@aldebarandrive.it</a>
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            © 2024 Aldebaran Drive - Tutti i diritti riservati
          </p>
        </div>
      </div>
    </div>
  );
}