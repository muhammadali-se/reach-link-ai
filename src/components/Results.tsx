import React, { useState } from 'react';
import { Copy, CheckCircle2, ArrowLeft, Lightbulb, CreditCard as Edit3, Star } from 'lucide-react';

interface ResultsProps {
  results: string[];
  onNewQuery: () => void;
  mode: 'generate' | 'optimize';
  originalInput: string;
}

const Results: React.FC<ResultsProps> = ({ results, onNewQuery, mode, originalInput }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getHeaderInfo = () => {
    if (mode === 'generate') {
      return {
        icon: <Lightbulb className="w-8 h-8 text-white" />,
        title: 'Generated Content',
        subtitle: 'Fresh LinkedIn post ideas and content'
      };
    } else {
      return {
        icon: <Edit3 className="w-8 h-8 text-white" />,
        title: 'Optimized Versions',
        subtitle: 'Improved versions of your LinkedIn post'
      };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            {headerInfo.icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{headerInfo.title}</h2>
          <p className="text-gray-600">{headerInfo.subtitle}</p>
        </div>

        {/* Original Input Card */}
        {originalInput && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <span>{mode === 'generate' ? 'Your Topic' : 'Original Post'}</span>
            </h3>
            <div className="bg-gray-50 rounded-xl border-2 border-gray-300 p-6">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {originalInput}
              </div>
            </div>
          </div>
        )}

        {/* Best Result Highlighted */}
        {results.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span>Best {mode === 'generate' ? 'Post Idea' : 'Optimized Version'}</span>
            </h3>
            <div className="bg-white rounded-xl shadow-lg border-2 border-blue-500 overflow-hidden group">
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-blue-100 to-blue-200 border-b border-blue-300">
                <div className="flex items-center space-x-3">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">
                    Recommended
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(results[0], -1)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  {copiedIndex === -1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-white">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                  {results[0]}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Results */}
        {results.length > 1 && (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Alternative Options</h3>
            <div className="grid gap-5 mb-8">
              {results.slice(1).map((result, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden group"
                >
                  <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 2}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Alternative Option
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result, index)}
                      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                          <span className="text-sm font-medium text-gray-500 group-hover:text-blue-600">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {result}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onNewQuery}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>{mode === 'generate' ? 'Generate More' : 'Try Another Post'}</span>
          </button>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          {results.length} {mode === 'generate' ? 'idea' : 'version'}{results.length !== 1 ? 's' : ''} generated • Click any card to copy • @ReachLinkAI 2025 All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default Results;