import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import { generateImage, checkImageAvailability } from './services/imageGenerationService';

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

  const handleGenerateImage = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentPrompt(prompt);
    setImageUrl(null);

    try {
      const result = await generateImage(prompt);
      
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        // Add a small delay to allow the image to be generated
        setTimeout(async () => {
          // Optional: Check if the image is available
          // const isAvailable = await checkImageAvailability(result.imageUrl!);
          // if (isAvailable) {
          //   setImageUrl(result.imageUrl);
          // } else {
          //   setError('Image generation failed. Please try again with a different prompt.');
          // }
          
          // Since Pollinations.ai generates on demand, we can just set the URL
          setImageUrl(result.imageUrl);
          setIsLoading(false);
        }, 1500); // Small delay for better UX
        return; // Don't set isLoading to false yet
      }
    } catch (err) {
      setError('Failed to generate image. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>AI Image Generator</Text>
              <Text style={styles.subtitle}>Create images from text descriptions</Text>
              <Text style={styles.poweredBy}>Powered by Pollinations.ai</Text>
            </View>
            
            <ImageDisplay 
              imageUrl={imageUrl}
              isLoading={isLoading}
              error={error}
              prompt={currentPrompt}
            />
            
            <PromptInput 
              onSubmit={handleGenerateImage}
              isLoading={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6a5acd',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  poweredBy: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});