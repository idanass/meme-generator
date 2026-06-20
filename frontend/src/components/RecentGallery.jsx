const RecentGallery = ({ memes }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        Galerie Récente
      </h3>
      <div className="flex flex-col gap-2">
        {memes.length === 0 ? (
          <p className="text-xs text-gray-400">Aucun mème encore</p>
        ) : (
          memes.slice(0, 6).map((meme) => (
            <div key={meme.id} className="flex flex-col gap-1">
              <img
                src={meme.url}
                alt={meme.top_text || 'mème'}
                className="w-full h-20 object-cover rounded"
              />
              <span className="text-xs text-gray-400">
                {new Date(meme.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentGallery;