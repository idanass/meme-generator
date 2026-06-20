const FONT_OPTIONS = [
  'Impact',
  'Arial Black',
  'Comic Sans MS',
  'Georgia',
  'Courier New',
];

const COLOR_PRESETS = ['#00C853', '#FF5252', '#7C4DFF', '#FFFFFF', '#000000'];

const EditorControls = ({ options, onUpdate, onImageSelect, onDownload, onSave, isLoading }) => {

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) onImageSelect(file);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Upload */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Téléchargement & Aperçu
        </h3>
        <input
          type="file"
          id="file-input"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
        <label
          htmlFor="file-input"
          className="flex flex-col items-center justify-center gap-2 w-full py-6
                     border-2 border-dashed border-gray-300 rounded-lg cursor-pointer
                     hover:border-orange-400 transition-colors"
        >
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-xs text-gray-500 uppercase tracking-wide">
            Cliquez ou glissez vos images ici
          </span>
          <span className="px-4 py-1.5 text-white text-xs font-bold rounded"
            style={{ backgroundColor: '#FF6B00' }}>
            TÉLÉCHARGER UNE IMAGE
          </span>
        </label>
      </div>

      {/* Texte */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Ajout de texte
        </h3>

        <label className="block text-xs text-gray-500 mb-1">TITRE (OPTIONNEL)</label>
        <input
          type="text"
          value={options.topText}
          onChange={(e) => onUpdate('topText', e.target.value)}
          placeholder="Ajoutez un titre..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded mb-3
                     focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <label className="block text-xs text-gray-500 mb-1">TEXTE DU MÈME</label>
        <textarea
          value={options.bottomText}
          onChange={(e) => onUpdate('bottomText', e.target.value)}
          placeholder="Ajoutez votre texte..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded mb-3
                     focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
        />

        {/* Police + Couleur */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">POLICE DE CARACTÈRES</label>
            <select
              value={options.fontFamily}
              onChange={(e) => onUpdate('fontFamily', e.target.value)}
              className="w-full px-2 py-2 text-sm border border-gray-200 rounded
                         focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {FONT_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">COULEUR DU TEXTE</label>
            <div className="flex items-center gap-1 flex-wrap">
              {COLOR_PRESETS.map(color => (
                <button
                  key={color}
                  onClick={() => onUpdate('textColor', color)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: options.textColor === color ? '#FF6B00' : '#ddd',
                  }}
                />
              ))}
              <input
                type="color"
                value={options.textColor}
                onChange={(e) => onUpdate('textColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Taille */}
        <div className="mb-3">
          <label className="block text-xs text-gray-500 mb-1">TAILLE DU TEXTE</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">12pt</span>
            <input
              type="range"
              min="16"
              max="72"
              value={options.fontSize}
              onChange={(e) => onUpdate('fontSize', parseInt(e.target.value))}
              className="flex-1 accent-orange-500"
            />
            <span className="text-xs text-gray-400">72pt</span>
          </div>
        </div>

        {/* Effets */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">CADRE ET EFFETS</label>
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={options.addShadow}
                onChange={(e) => onUpdate('addShadow', e.target.checked)}
                className="accent-orange-500"
              />
              Ajouter une ombre
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={options.addStroke}
                onChange={(e) => onUpdate('addStroke', e.target.checked)}
                className="accent-orange-500"
              />
              Ajouter un contour
            </label>
          </div>
        </div>

        <button
          onClick={onSave}
          className="w-full py-2.5 text-white text-sm font-bold rounded uppercase tracking-wide"
          style={{ backgroundColor: '#FF6B00' }}
        >
          SAUVEGARDER EN GALERIE
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onDownload}
          className="flex-1 flex items-center justify-center gap-2 py-2.5
                     bg-gray-800 text-white text-xs font-bold rounded uppercase"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger le mème
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 py-2.5
                     text-white text-xs font-bold rounded uppercase"
          style={{ backgroundColor: '#FF6B00' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Partager sur les réseaux
        </button>
      </div>

    </div>
  );
};

export default EditorControls;