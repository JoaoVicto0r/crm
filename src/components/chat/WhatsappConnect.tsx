"use client"

import { useEffect, useState } from "react";
import  QRCode  from "qrcode.react";
import { connectSocket } from "../../utils/socket";
import { Button } from "../../components/ui/button";

export default function WhatsappConnect() {
  const [qr, setQr] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = connectSocket();

    // Recebe QR code do backend
    socket.on("whatsapp:qr", (data: string) => {
      setQr(data);
    });

    // Recebe status de conexão
    socket.on("whatsapp:connected", () => {
      setConnected(true);
      setQr(null); // Limpa QR code após conexão
    });

    return () => {
      socket.off("whatsapp:qr");
      socket.off("whatsapp:connected");
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
      {!connected ? (
        <>
          <p className="text-white">Escaneie o QR code com o WhatsApp Web</p>
          {qr ? (
            <QRCode value={qr} size={200} />
          ) : (
            <p className="text-gray-400">Aguardando QR code...</p>
          )}
        </>
      ) : (
        <p className="text-green-500 font-bold">WhatsApp conectado!</p>
      )}
      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => window.location.reload()}
      >
        Atualizar QR
      </Button>
    </div>
  );
}
