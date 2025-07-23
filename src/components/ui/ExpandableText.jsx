"use client";

import { useState } from "react";

export default function ExpandableText({ children, lines = 3 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative text-gray-600 mb-6 flex-grow">
      <div className={expanded ? "line-clamp-none" : `line-clamp-${lines}`}>
        {children}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-blue-600 hover:underline focus:outline-none"
      >
        {expanded ? "Mostra meno" : "Maggiori dettagli"}
      </button>
    </div>
  );
}
