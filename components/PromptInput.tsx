import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  Text,
  ActivityIndicator,
  Keyboard,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

// Example prompts for inspiration
const EXAMPLE_PROMPTS = [
  "A futuristic city with flying cars",
  "A cat wearing sunglasses on a beach",
  "A magical forest with glowing mushrooms",
  "An astronaut riding a horse on Mars",
  "A steampunk-inspired train station",
  "A cyberpunk street scene at night with neon lights",
  "A peaceful mountain landscape at sunset",
];

export default function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim()) {
      Keyboard.dismiss();
      onSubmit(prompt);
      setShowExamples(false);
    }
  };

  const handleExamplePress = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setShowExamples(false);
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChangeText={setPrompt}
          multiline
          maxLength={500}
          editable={!isLoading}
          onFocus={() => setShowExamples(false)}
        />
        <TouchableOpacity 
          style={styles.exampleButton} 
          onPress={toggleExamples}
          disabled={isLoading}
        >
          <Ionicons name="bulb-outline" size={24} color="#6a5acd" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled, !prompt.trim() && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      {showExamples && (
        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Try these prompts:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.examplesScrollContent}
          >
            {EXAMPLE_PROMPTS.map((examplePrompt, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.exampleItem}
                onPress={() => handleExamplePress(examplePrompt)}
              >
                <Text style={styles.exampleText}>{examplePrompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      <Text style={styles.hint}>
        Try adding details like style, lighting, and mood for better results
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 16,
    color: '#333',
  },
  exampleButton: {
    padding: 8,
    marginRight: 5,
  },
  button: {
    backgroundColor: '#6a5acd',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a29dcc',
  },
  hint: {
    marginTop: 8,
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  examplesContainer: {
    marginTop: 16,
    width: '100%',
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  examplesScrollContent: {
    paddingBottom: 8,
  },
  exampleItem: {
    backgroundColor: '#e8e4ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d8d4ff',
  },
  exampleText: {
    color: '#6a5acd',
    fontSize: 14,
  },
});