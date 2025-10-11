import React, { useState } from 'react';
import Home from './components/Home';
import Results from './components/Results';
import Auth from './components/Auth';
import { FormData } from './types';
import { fetchResults } from './services/api';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type Screen = 'home' | 'results' | 'auth';

function App() {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [results, setResults] = useState<string[]>([]);
  const [originalInput, setOriginalInput] = useState<string>('');
  const [currentMode, setCurrentMode] = useState<'generate' | 'optimize'>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTriedOnce, setHasTriedOnce] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    if (hasTriedOnce && !user) {
      setCurrentScreen('auth');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentMode(data.mode);
    setOriginalInput(data.input);

    try {
      const apiResults = await fetchResults(data);

      if (apiResults.length === 0) {
        throw new Error(`No ${data.mode === 'generate' ? 'content generated' : 'improved versions generated'}. Please try again with different input.`);
      }

      setResults(apiResults);
      setCurrentScreen('results');
      setHasTriedOnce(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);

      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuery = () => {
    if (!user) {
      setCurrentScreen('auth');
      return;
    }
    setCurrentScreen('home');
    setResults([]);
    setOriginalInput('');
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {currentScreen === 'auth' ? (
        <Auth />
      ) : currentScreen === 'home' ? (
        <Home
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      ) : (
        <Results
          results={results}
          onNewQuery={handleNewQuery}
          mode={currentMode}
          originalInput={originalInput}
        />
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg max-w-md mx-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;