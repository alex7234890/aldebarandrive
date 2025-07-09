This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




#file prova con dati preimpostati che crea pdf

import React from "react";
import jsPDF from "jspdf";

export default function TestPdfButton() {
  const generaPDF = () => {
    const doc = new jsPDF();

    // Dati finti predefiniti
    const dati = {
      nome: "Mario Rossi",
      email: "mario.rossi@example.com",
      messaggio: "Questo è un messaggio di prova generato da codice.",
    };

    // Scrittura nel PDF
    doc.setFontSize(16);
    doc.text("Anteprima PDF con dati finti", 10, 10);
    doc.setFontSize(12);
    doc.text(`Nome: ${dati.nome}`, 10, 20);
    doc.text(`Email: ${dati.email}`, 10, 30);
    doc.text(`Messaggio: ${dati.messaggio}`, 10, 40);

    // Salvataggio
    doc.save("test-dati.pdf");
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={generaPDF}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:opacity-80 transition"
      >
        Genera PDF di Test
      </button>
    </div>
  );
}

#file che crea pdf con dati presi da form

import React, { useState } from "react";
import jsPDF from "jspdf";

export default function FormToPDF() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    messaggio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Dettagli del modulo:", 10, 10);
    doc.text(`Nome: ${formData.nome}`, 10, 20);
    doc.text(`Email: ${formData.email}`, 10, 30);
    doc.text(`Messaggio: ${formData.messaggio}`, 10, 40);
    doc.save("dati_form.pdf");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Compila il modulo</h2>
      <input
        type="text"
        name="nome"
        placeholder="Nome"
        value={formData.nome}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="messaggio"
        placeholder="Messaggio"
        value={formData.messaggio}
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={generaPDF}
        className="mt-2 w-full bg-indigo-600 hover:opacity-80 text-white font-semibold py-2 px-4 rounded"
      >
        Genera PDF
      </button>
    </div>
  );
}
