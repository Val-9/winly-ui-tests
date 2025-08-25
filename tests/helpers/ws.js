// WebSocket helper (placeholder).
export const attachWsLogger = async (page) => {
  page.on('websocket', (ws) => {
    ws.on('framereceived', () => {});
  });
};
