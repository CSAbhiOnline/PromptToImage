// Using Pollinations.ai for image generation
// Documentation: https://pollinations.ai/

export interface ImageGenerationResponse {
  imageUrl: string | null;
  error: string | null;
}

export async function generateImage(prompt: string): Promise<ImageGenerationResponse> {
  try {
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(prompt);
    
    // Pollinations.ai URL format
    // This uses their image generation endpoint with the stable diffusion model
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
    
    // Add a random parameter to prevent caching
    const finalImageUrl = `${imageUrl}?random=${Math.random()}`;
    
    // Pollinations.ai generates the image on demand when the URL is accessed
    // We don't need to make an API call, just return the URL
    
    return {
      imageUrl: finalImageUrl,
      error: null
    };
  } catch (error) {
    console.error('Error generating image URL:', error);
    return {
      imageUrl: null,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Optional: Function to check if the image is ready
// This can be used to verify the image has been generated before displaying it
export async function checkImageAvailability(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image availability:', error);
    return false;
  }
}