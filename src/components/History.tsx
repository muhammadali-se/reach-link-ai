import React, { useEffect, useState } from 'react';
import { ArrowLeft, Copy, CheckCircle2, Trash2, Eye } from 'lucide-react';
import { getUserPosts, deletePost } from '../services/postsService';
import { Post } from '../services/postsService';

interface HistoryProps {
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ onBack }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await getUserPosts(50);

    if (fetchError) {
      setError('Failed to load posts');
      console.error('Error loading posts:', fetchError);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setDeletingId(id);
    const { error: deleteError } = await deletePost(id);

    if (deleteError) {
      setError('Failed to delete post');
      console.error('Error deleting post:', deleteError);
    } else {
      setPosts(posts.filter(p => p.id !== id));
    }

    setDeletingId(null);
  };

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      generate: 'Generated',
      optimize: 'Optimized',
      fill: 'Filled'
    };
    return labels[mode] || mode;
  };

  const getToneLabel = (tone: string) => {
    return tone.charAt(0).toUpperCase() + tone.slice(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (selectedPost) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Posts</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {getModeLabel(selectedPost.mode)}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  {getToneLabel(selectedPost.tone)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Created {formatDate(selectedPost.created_at)}
              </p>
            </div>

            {selectedPost.mode !== 'generate' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Original Input</h3>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedPost.original_input}
                  </p>
                </div>
              </div>
            )}

            {selectedPost.mode === 'generate' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Topic</h3>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedPost.original_input}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Generated Results</h3>
              <div className="space-y-4">
                {selectedPost.generated_results.map((result, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl border border-blue-200 p-4 group">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-semibold text-blue-700">
                        Variation {index + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(result, `result-${index}`)}
                        className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-all hover:bg-white"
                      >
                        {copiedId === `result-${index}` ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                            <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                      {result}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Your Posts</h1>
            <p className="text-gray-600 mt-1">View and manage all your generated posts</p>
          </div>
          <button
            onClick={loadPosts}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
            <p className="text-gray-600">
              Generate, optimize, or fill gaps in your LinkedIn posts and they'll appear here
            </p>
            <button
              onClick={onBack}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {getModeLabel(post.mode)}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                          {getToneLabel(post.tone)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.created_at)} • {post.generated_results.length} variation{post.generated_results.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete post"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 line-clamp-2 leading-relaxed">
                      {post.original_input}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(post.generated_results[0] || '', post.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
                    >
                      {copiedId === post.id ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Best</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View All</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
