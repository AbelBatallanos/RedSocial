// src/hooks/useWebSocket.ts
import { useEffect, useState, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext'; // Importamos tu contexto

// Pon la IP local de tu compu donde corre el backend de Django
const WS_BASE_URL = 'ws://192.168.1.12:8000/ws'; 

export const useWebSocket = (endpoint: string) => {
    // Obtenemos el token directamente de tu AuthContext
    const { token } = useAuthContext(); 
    const [socketData, setSocketData] = useState<any>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Si no hay token, no intentamos conectar
        if (!token) return;

        const url = `${WS_BASE_URL}/${endpoint}/?token=${token}`;
        ws.current = new WebSocket(url);

        ws.current.onopen = () => console.log(`[WS] Conectado a ${endpoint}`);
        
        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setSocketData(data);
        };

        ws.current.onerror = (error) => console.error(`[WS] Error en ${endpoint}:`, error);

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [endpoint, token]); // Se vuelve a ejecutar si cambia el endpoint o el token

    const sendMessage = (message: object) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    };

    return { socketData, sendMessage };
};