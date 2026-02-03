import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Scanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 150 },
      aspectRatio: 1.0
    }, false);

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
        onClose();
      },
      (error) => { /* ignora erros de leitura contínua */ }
    );

    return () => scanner.clear();
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-[999] p-4">
      <div className="bg-white p-2 rounded-xl w-full max-w-sm">
        <div id="reader"></div>
      </div>
      <button
        onClick={onClose}
        className="mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-red-700 transition"
      >
        FECHAR CÂMERA
      </button>
    </div>
  );
}