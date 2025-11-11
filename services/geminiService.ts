
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      if (base64Data) {
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


export const generateTattooImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A minimalist, clean background tattoo design of: ${prompt}`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating tattoo image:", error);
    throw error;
  }
};

export const editTattooImage = async (imageFile: File, prompt: string): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No edited image returned.");
  } catch (error) {
    console.error("Error editing tattoo image:", error);
    throw error;
  }
};

export const analyzeTattooImage = async (imageFile: File): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "Analyze this tattoo. Describe its style, potential symbolism, and what makes it unique. Be descriptive and artistic." },
                    imagePart,
                ],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing tattoo image:", error);
        throw error;
    }
};

export const generateComplexConcept = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: `Generate a deep and complex tattoo concept based on this idea: "${prompt}". Include historical context, symbolism, suggestions for body placement, and stylistic variations. Format the output as clean markdown.`,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating complex concept:", error);
        throw error;
    }
};

export const findTattooStudios = async (location: string, userLocation?: { latitude: number; longitude: number }): Promise<GroundingChunk[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Find the best rated tattoo studios in ${location}`,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: userLocation ? {
                    retrievalConfig: {
                        latLng: userLocation,
                    }
                } : undefined,
            },
        });
        return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    } catch (error) {
        console.error("Error finding tattoo studios:", error);
        throw error;
    }
};

export const getTattooTrends = async (): Promise<{text: string; chunks: GroundingChunk[]}> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: "What are the latest tattoo trends right now? Summarize them and provide links.",
       config: {
         tools: [{googleSearch: {}}],
       },
    });
    const text = response.text;
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text, chunks };
  } catch(error) {
    console.error("Error fetching tattoo trends:", error);
    throw error;
  }
};


export const chatWithBot = async (message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-lite',
            contents: message,
            config: {
                systemInstruction: "You are a helpful assistant for the InkedIn app. You know about tattoos, artists, and styles. Keep your answers concise and friendly.",
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error with chatbot:", error);
        throw error;
    }
};
