import React, { useState } from 'react';
import { Sparkles, RefreshCw, Info, Lightbulb, Edit3, LogOut, FileText, Clock } from 'lucide-react';
import { Mode, FormData, Tone } from '../types';
import { shouldUseMockData } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface HomeProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  onViewHistory: () => void;
}

const Home: React.FC<HomeProps> = ({ onSubmit, isLoading, onViewHistory }) => {
  const { signOut, user } = useAuth();
  const [mode, setMode] = useState<Mode>('optimize');
  const [input, setInput] = useState('');
  const [tone, setTone] = useState<Tone>('neutral');
  const isUsingMockData = shouldUseMockData();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSubmit({
      mode,
      tone,
      input: input.trim()
    });
  };

  const getActionIcon = () => {
    if (mode === 'generate') {
      return <Lightbulb className="w-4 h-4" />;
    }
    if (mode === 'fill') {
      return <FileText className="w-4 h-4" />;
    }
    return <Edit3 className="w-4 h-4" />;
  };

  const getInputPlaceholder = () => {
    if (mode === 'generate') {
      return "e.g. AI career tips, remote work challenges, startup lessons...";
    }
    if (mode === 'fill') {
      return "e.g. I discovered [something amazing] that changed my [career/life]...";
    }
    return "e.g. I left my job in tech to go solo…";
  };

  const getInputLabel = () => {
    if (mode === 'generate') {
      return "What topics do you want to write about?";
    }
    if (mode === 'fill') {
      return "Paste your post with [gaps] to fill";
    }
    return "Paste your LinkedIn post";
  };

  const getButtonText = () => {
    if (mode === 'generate') return 'Generate Posts';
    if (mode === 'fill') return 'Fill Gaps';
    return 'Improve Post';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8 relative">
          <div className="absolute right-0 top-0 flex items-center space-x-2">
            {user && (
              <>
                <button
                  onClick={onViewHistory}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200"
                >
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">History</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            )}
          </div>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ReachLinkAI</h1>
          <p className="text-gray-600 text-lg">AI LinkedIn Growth Tool — Reach More. Engage Better. Grow Faster.</p>
          {user && (
            <div className="mt-2 text-sm text-gray-500">
              {user.email}
            </div>
          )}
          <div className="mt-4 inline-flex items-center space-x-4 text-sm text-gray-500">
            <span>✨ AI LinkedIn Post Optimizer</span>
            <span>•</span>
            <span>🚀 LinkedIn Reach Gainer</span>
            <span>•</span>
            <span>📈 Starter Plan: $9/month</span>
          </div>
        </div>

        {isUsingMockData && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-1">Demo Mode</h3>
                <p className="text-sm text-amber-700">
                  You're using mock data since no Gemini API key is configured.
                  The app will show sample results to demonstrate functionality.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                What would you like to do?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('optimize')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    mode === 'optimize'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">Optimize</div>
                    <div className="text-xs opacity-75">Improve existing</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('generate')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    mode === 'generate'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <Lightbulb className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">Generate</div>
                    <div className="text-xs opacity-75">Create new posts</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fill')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                    mode === 'fill'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">Fill Gaps</div>
                    <div className="text-xs opacity-75">Complete [gaps]</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose your tone
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setTone('neutral')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    tone === 'neutral'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="font-semibold text-sm">Neutral</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTone('viral')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    tone === 'viral'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="font-semibold text-sm">Viral</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTone('professional')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    tone === 'professional'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="font-semibold text-sm">Professional</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTone('concise')}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                    tone === 'concise'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="font-semibold text-sm">Concise</div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="input" className="block text-sm font-semibold text-gray-700 mb-2">
                {getInputLabel()}
              </label>
              <textarea
                id="input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{mode === 'generate' ? 'Generating...' : mode === 'fill' ? 'Filling Gaps...' : 'Improving...'}</span>
                </>
              ) : (
                <>
                  {getActionIcon()}
                  <span>{getButtonText()}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          @ReachLinkAI 2025 All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Home;
