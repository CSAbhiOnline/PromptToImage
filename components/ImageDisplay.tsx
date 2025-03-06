import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, TouchableOpacity, Share, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

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

  const handleShare = async () => {
    if (!imageUrl) return;
    
    try {
      await Share.share({
        url: imageUrl,
        message: `AI generated image for: "${prompt}" - Created with Pollinations.ai`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
      Alert.alert('Sharing Failed', 'Could not share the image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    
    Alert.alert(
      'Save Image',
      'To save this image, press and hold on the image, then select "Save Image" from the menu.',
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
    );
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
          contentFit="cover"
          transition={300}
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
          <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
            <Ionicons name="download-outline" size={24} color="#fff" />
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
});