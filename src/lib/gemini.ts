export const getGeminiClient = () => {
  return {
    models: {
      generateContent: async ({ model, contents, config }: any) => {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, contents, config }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to call Gemini API: ${response.statusText}`);
        }

        const data = await response.json();
        return { text: data.text };
      }
    },
    chats: {
      create: ({ model, config, history }: any) => {
        let currentHistory = history || [];
        const systemInstruction = config?.systemInstruction;

        return {
          sendMessage: async ({ message }: any) => {
            const response = await fetch('/api/gemini-chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model,
                message,
                history: currentHistory,
                systemInstruction
              }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to call Gemini API: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Note: we don't strictly need to manage history purely on client 
            // if we just refetch it, but keeping it in sync helps.
            currentHistory.push({ role: "user", parts: [{ text: message }] });
            currentHistory.push({ role: "model", parts: [{ text: data.text }] });

            return { text: data.text };
          }
        };
      }
    }
  } as any;
};
