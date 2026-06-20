import { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import MemeCanvas from '../components/MemeCanvas';
import EditorControls from '../components/EditorControls';
import RecentGallery from '../components/RecentGallery';
import { useMemeEditor } from '../hooks/useMemeEditor';
import { uploadMeme, getAllMemes } from '../services/api';

const EditorPage = () => {
  const {
    canvasRef,
    image,
    options,
    isLoading,
    setIsLoading,
    loadImage,
    updateOption,
    downloadMeme,
    getCanvasBlob,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useMemeEditor();

  const [recentMemes, setRecentMemes] = useState([]);

  const fetchMemes = useCallback(async () => {
    try {
      const data = await getAllMemes();
      setRecentMemes(data.memes);
    } catch (error) {
      console.error('Erreur récupération mèmes:', error);
    }
  }, []);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const blob = await getCanvasBlob();
      if (!blob) throw new Error('Canvas vide');
      const file = new File([blob], `meme-${Date.now()}.png`, { type: 'image/png' });
      await uploadMeme(file, options.topText, options.bottomText);
      alert('✅ Mème sauvegardé en galerie !');
      fetchMemes();
    } catch (error) {
      alert(`❌ Erreur : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [getCanvasBlob, options, setIsLoading, fetchMemes]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-4">

          {/* Canvas - 7 colonnes */}
          <div className="col-span-7">
            <MemeCanvas
              canvasRef={canvasRef}
              onImageDrop={loadImage}
              hasImage={!!image}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            />
          </div>

          {/* Contrôles - 3 colonnes */}
          <div className="col-span-3 bg-white rounded-lg p-4 shadow-sm">
            <EditorControls
              options={options}
              onUpdate={updateOption}
              onImageSelect={loadImage}
              onDownload={downloadMeme}
              onSave={handleSave}
              isLoading={isLoading}
            />
          </div>

          {/* Galerie récente - 2 colonnes */}
          <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm">
            <RecentGallery memes={recentMemes} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditorPage;