import React, { useState, useEffect, useRef } from 'react';

const YearSelector = ({ invoiceYear, setInvoiceYear }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const wheelRef = useRef(null);

  // Genera gli anni dal 1950 al 2025
  const years = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i).reverse();

  // Inizializza currentIndex basato su invoiceYear
  useEffect(() => {
    if (invoiceYear && years.includes(parseInt(invoiceYear))) {
      const index = years.findIndex(year => year === parseInt(invoiceYear));
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [invoiceYear]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestione touch per mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentY = e.touches[0].clientY;
    const diff = startY - currentY;
    const sensitivity = 50;
    
    if (Math.abs(diff) > sensitivity) {
      const direction = diff > 0 ? 1 : -1;
      const newIndex = Math.max(0, Math.min(years.length - 1, currentIndex + direction));
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        setInvoiceYear(years[newIndex].toString());
        setStartY(currentY);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Gestione scroll per desktop sulla rotella
  const handleWheel = (e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(years.length - 1, currentIndex + direction));
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      setInvoiceYear(years[newIndex].toString());
    }
  };

  const getItemStyle = (index) => {
    const distance = Math.abs(index - currentIndex);
    const isActive = index === currentIndex;
    
    if (isActive) {
      return {
        transform: 'scale(1.2) translateZ(0)',
        opacity: 1,
        color: '#059669',
        fontWeight: 'bold',
        zIndex: 10
      };
    } else if (distance === 1) {
      return {
        transform: 'scale(0.9) translateZ(0)',
        opacity: 0.7,
        color: '#6B7280',
        zIndex: 5
      };
    } else if (distance === 2) {
      return {
        transform: 'scale(0.8) translateZ(0)',
        opacity: 0.4,
        color: '#9CA3AF',
        zIndex: 1
      };
    } else {
      return {
        transform: 'scale(0.7) translateZ(0)',
        opacity: 0.2,
        color: '#D1D5DB',
        zIndex: 0
      };
    }
  };

  if (!isMobile) {
    // Versione desktop - select classico
    return (
      <select
        id="invoice-year"
        value={invoiceYear || ""}
        onChange={(e) => setInvoiceYear(e.target.value)}
        className="w-full max-w-full text-base border border-gray-400 focus:border-black focus:ring-1 focus:ring-black rounded-lg p-4 transition-colors"
      >
        <option value="">Seleziona anno</option>
        {years.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
    );
  }

  // Versione mobile - rotella touch
  return (
    <div className="relative bg-white border border-gray-400 rounded-lg p-4 overflow-hidden">
      {/* Indicatori laterali */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-30"></div>
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-400 to-transparent opacity-30"></div>
      
      {/* Area rotella */}
      <div
        ref={wheelRef}
        className="relative h-24 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ userSelect: 'none', touchAction: 'none' }}
      >
        
        {/* Lista anni */}
        <div className="relative h-full flex flex-col items-center justify-center">
          {years.map((year, index) => {
            const style = getItemStyle(index);
            const offset = (index - currentIndex) * 25;
            
            return (
              <div
                key={year}
                className="absolute transition-all duration-200 ease-out cursor-pointer"
                style={{
                  ...style,
                  transform: `${style.transform} translateY(${offset}px)`,
                }}
                onClick={() => {
                  setCurrentIndex(index);
                  setInvoiceYear(year.toString());
                }}
              >
                {year}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Placeholder quando nessun anno è selezionato */}
      {!invoiceYear && (
        <div className="absolute top-2 left-2 pointer-events-none">
          <span className="text-gray-400 text-sm">Seleziona anno</span>
        </div>
      )}
    </div>
  );
};

export default YearSelector;