import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Dimensions, 
  TouchableOpacity, 
  Share, 
  Alert,
  Image,
  Platform,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { isWeb, downloadImageOnWeb, openImageInNewTab } from '../utils/webPolyfill';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string | null;
}

const { width } = Dimensions.get('window');
const imageWidth = width * 0.9;
const imageHeight = imageWidth * 1.2; // 3:4 aspect ratio

export default function ImageDisplay({ imageUrl, isLoading, error, prompt }: ImageDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShare = async () => {
    if (!imageUrl) return;
    
    try {
      // For web, open in a new tab as Share API might not be available
      if (isWeb()) {
        openImageInNewTab(imageUrl);
        return;
      }
      
      await Share.share({
        url: imageUrl,
        message: `AI generated image for: "${prompt}" - Created with Pollinations.ai`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Sharing Failed', 'Could not share the image. Please try again.');
    }
  };

  const downloadImageOnNative = async (url: string) => {
    if (!FileSystem || !MediaLibrary) {
      console.error('FileSystem or MediaLibrary not available');
      return false;
    }
    
    try {
      // Request permissions first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to save images to your device.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      // Create a filename based on the prompt and current time
      const timestamp = new Date().getTime();
      const promptText = prompt ? prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_') : 'ai_image';
      const filename = `${promptText}_${timestamp}.jpg`;
      
      // Set up the file URI in the app's cache directory
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      // Download the image
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error('Failed to download image');
      }
      
      // Save the image to the media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      // Create an album if it doesn't exist and add the asset to it
      const album = await MediaLibrary.getAlbumAsync('AI Generated Images');
      if (album === null) {
        await MediaLibrary.createAlbumAsync('AI Generated Images', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
      
      Alert.alert(
        'Success',
        'Image saved to your gallery in the "AI Generated Images" album',
        [{ text: 'OK' }]
      );
      return true;
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert(
        'Download Failed',
        'Could not save the image to your device. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    
    try {
      setDownloading(true);
      
      // Create a filename based on the prompt and current time
      const timestamp = new Date().getTime();
      const promptText = prompt ? prompt.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_') : 'ai_image';
      const filename = `${promptText}_${timestamp}.jpg`;
      
      let success = false;
      
      // Handle download differently based on platform
      if (Platform.OS === 'web' || isWeb()) {
        success = await downloadImageOnWeb(imageUrl, filename);
        
        // If direct download fails, try opening in a new tab
        if (!success) {
          success = openImageInNewTab(imageUrl);
        }
      } else {
        success = await downloadImageOnNative(imageUrl);
      }
      
      if (!success) {
        Alert.alert(
          'Download Failed',
          'Could not download the image. Try right-clicking or long-pressing on the image to save it manually.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert(
        'Download Failed',
        'Could not save the image. Please try again or long-press on the image to save it manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6a5acd" />
          <Text style={styles.loadingText}>Generating your image...</Text>
          <Text style={styles.loadingSubText}>This may take a few seconds</Text>
        </View>
      </View>
    );
  }

  if (error || imageError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
          <Text style={styles.errorText}>Error generating image</Text>
          <Text style={styles.errorSubText}>
            {error || "The image couldn't be generated. Try a different prompt or check your connection."}
          </Text>
        </View>
      </View>
    );
  }

  if (!imageUrl) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContainer}>
          <Ionicons name="image-outline" size={80} color="#ddd" />
          <Text style={styles.placeholderText}>Enter a prompt to generate an image</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
        />
        {prompt && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptText} numberOfLines={2}>
              "{prompt}"
            </Text>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, downloading && styles.iconButtonDisabled]} 
            onPress={handleSave}
            disabled={downloading}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download-outline" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    borderRadius: 12,
  },
  promptContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  promptText: {
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  placeholderContainer: {
    width: imageWidth,
    height: imageHeight,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});