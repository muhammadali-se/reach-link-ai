import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Home from './components/Home';
import Results from './components/Results';
import { fetchResults } from './services/api';
import { savePost } from './services/postsService';
import { FormData } from './types';

type AppView = 'home' | 'results' | 'auth';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<AppView>('home');
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);

  useEffect(() => {
    const savedTrial = localStorage.getItem('reachlink_used_trial');
    if (savedTrial === 'true') {
      setHasUsedFreeTrial(true);
    }
  }, []);

  const handleSubmit = async (data: FormData) => {
    if (hasUsedFreeTrial && !user) {
      setView('auth');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFormData(data);

    try {
      const generatedResults = await fetchResults(data);
      setResults(generatedResults);
      setView('results');
      setHasUsedFreeTrial(true);
      localStorage.setItem('reachlink_used_trial', 'true');

      if (user) {
        const { error: saveError } = await savePost(data, generatedResults);
        if (saveError) {
          console.error('Error saving post to database:', saveError);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuery = () => {
    if (hasUsedFreeTrial && !user) {
      setView('auth');
      return;
    }
    setResults([]);
    setFormData(null);
    setError(null);
    setView('home');
  };

  const handleAuthComplete = () => {
    setView('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleNewQuery}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return <Auth onAuthComplete={handleAuthComplete} />;
  }

  if (view === 'results' && results.length > 0 && formData) {
    return (
      <Results
        results={results}
        onNewQuery={handleNewQuery}
        mode={formData.mode}
        originalInput={formData.input}
      />
    );
  }

  return <Home onSubmit={handleSubmit} isLoading={isLoading} hasUsedFreeTrial={hasUsedFreeTrial} user={user} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
