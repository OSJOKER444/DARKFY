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
          let errorMessage = `Failed to call Gemini API (Status: ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            if (response.status === 404 || response.status === 405) {
               errorMessage = "O backend da aplicação não foi encontrado (Erro 404). Se você hospedou este aplicativo fora do AI Studio (ex: Vercel, Netlify, Firebase Hosting), lembre-se de que ele requer um servidor Node.js rodando o arquivo server.ts para funcionar as chamadas da inteligência artificial, e não apenas o frontend estático.";
            } else {
               errorMessage = `Erro do servidor (HTTP ${response.status}): O backend não retornou uma resposta válida.`;
            }
          }
          throw new Error(errorMessage);
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
              let errorMessage = `Failed to call Gemini API (Status: ${response.status})`;
              try {
                const errorData = await response.json();
                if (errorData.error) {
                  errorMessage = errorData.error;
                }
              } catch (e) {
                if (response.status === 404 || response.status === 405) {
                   errorMessage = "O backend da aplicação não foi encontrado (Erro 404). Se você hospedou este aplicativo fora do AI Studio (ex: Vercel, Netlify, Firebase Hosting), lembre-se de que ele requer um servidor Node.js rodando o arquivo server.ts para funcionar as chamadas da inteligência artificial, e não apenas o frontend estático.";
                } else {
                   errorMessage = `Erro do servidor (HTTP ${response.status}): O backend não retornou uma resposta válida.`;
                }
              }
              throw new Error(errorMessage);
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
