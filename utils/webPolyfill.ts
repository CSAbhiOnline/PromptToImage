// This file provides polyfills and utilities for web platform

// Safely check if we're in a web environment
export const isWeb = () => typeof document !== 'undefined';

// Download an image on web
export const downloadImageOnWeb = async (url: string, filename: string): Promise<boolean> => {
  if (!isWeb()) return false;
  
  try {
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'ai-generated-image.jpg';
    link.target = '_blank';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Error downloading image on web:', error);
    return false;
  }
};

// Open image in new tab as fallback
export const openImageInNewTab = (url: string): boolean => {
  if (!isWeb()) return false;
  
  try {
    window.open(url, '_blank');
    return true;
  } catch (error) {
    console.error('Error opening image in new tab:', error);
    return false;
  }
};