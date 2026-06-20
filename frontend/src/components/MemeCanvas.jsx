const MemeCanvas = ({ canvasRef, onImageDrop, hasImage, onMouseDown, onMouseMove, onMouseUp }) => {

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageDrop(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-400 text-xs">16:9 canvas</span>
      <div
        className="relative rounded-lg overflow-hidden"
        style={{ backgroundColor: '#1a1a2e', minHeight: '400px' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!hasImage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Glissez une image ici</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={700}
          height={450}
          className="w-full cursor-move"
          style={{ display: 'block' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        />
      </div>
      {hasImage && (
        <p className="text-xs text-gray-400 text-center">
          💡 Clique et glisse le texte pour le repositionner
        </p>
      )}
    </div>
  );
};

export default MemeCanvas;