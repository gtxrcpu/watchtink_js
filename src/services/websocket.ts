import { create } from 'zustand';

type WebSocketMessage = unknown;

type WebSocketStore = {
    isConnected: boolean;
    lastMessage: WebSocketMessage | null;
    socket: WebSocket | null;
    connect: (url: string) => void;
    disconnect: () => void;
    sendMessage: (msg: WebSocketMessage) => void;
};

export const useWebSocket = create<WebSocketStore>((set, get) => ({
    isConnected: false,
    lastMessage: null,
    socket: null,

    connect: (url: string) => {
        if (get().isConnected) return;

        try {
            const socket = new WebSocket(url);

            socket.onopen = () => {
                console.log('WebSocket Connected');
                set({ isConnected: true, socket });
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    set({ lastMessage: data });
                } catch (e) {
                    console.error('Failed to parse WebSocket message', e);
                }
            };

            socket.onclose = () => {
                console.log('WebSocket Disconnected');
                set({ isConnected: false, socket: null });
            };

            socket.onerror = (error) => {
                console.error('WebSocket Error', error);
            };

            // Store socket instance in a way that doesn't trigger re-renders if likely not needed in state directly, 
            // but for Zustand we keep it simple. Actually, storing non-serializable data in Zustand is fine but quirky.
            // Better to just keep state.

        } catch (e) {
            console.error('Connection failed', e);
        }
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket && socket.readyState !== WebSocket.CLOSED) {
            socket.close();
        }
        set({ isConnected: false, socket: null });
    },

    sendMessage: (msg: WebSocketMessage) => {
        const socket = get().socket;
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            return;
        }
        const payload = typeof msg === 'string' ? msg : JSON.stringify(msg);
        socket.send(payload);
    }
}));
