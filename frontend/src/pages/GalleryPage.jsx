import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAllMemes, deleteMeme, downloadMeme } from '../services/api';

const GalleryPage = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMemes = useCallback(async () => {
    try {
      const data = await getAllMemes();
      setMemes(data.memes);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const handleDelete = useCallback(async (id) => {
    if (!confirm('Supprimer ce mème ?')) return;
    try {
      await deleteMeme(id);
      setMemes(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  }, []);

  const handleDownload = useCallback(async (id) => {
    try {
      const url = await downloadMeme(id);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meme-${id}.png`;
      link.click();
    } catch (error) {
      alert('Erreur lors du téléchargement');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Galerie de mèmes
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({memes.length} mèmes)
          </span>
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Chargement...</p>
          </div>
        ) : memes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-gray-400">Aucun mème sauvegardé</p>
            
              href="/"
              className="px-4 py-2 text-white text-sm font-bold rounded"
              style={{ backgroundColor: '#FF6B00' }}
            <a>
              Créer un mème
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memes.map((meme) => (
              <div
                key={meme.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={meme.url}
                  alt={meme.top_text || 'mème'}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  {meme.top_text && (
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {meme.top_text}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(meme.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleDownload(meme.id)}
                      className="flex-1 py-1.5 text-white text-xs font-bold rounded"
                      style={{ backgroundColor: '#1a237e' }}
                    >
                      Télécharger
                    </button>
                    <button
                      onClick={() => handleDelete(meme.id)}
                      className="flex-1 py-1.5 bg-red-500 text-white text-xs font-bold rounded"
                    >
                      Supprimer
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

export default GalleryPage;