import { useState, useRef, useEffect, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  topText: '',
  bottomText: '',
  fontSize: 36,
  fontFamily: 'Impact',
  textColor: '#FFFFFF',
  addShadow: false,
  addStroke: true,
};

export const useMemeEditor = () => {
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);

  // Position du texte (en pourcentage pour s'adapter à toute taille de canvas)
  const [topTextPos, setTopTextPos] = useState({ x: 0.5, y: 0.1 });
  const [bottomTextPos, setBottomTextPos] = useState({ x: 0.5, y: 0.9 });

  // Pour le drag
  const dragging = useRef(null); // 'top' | 'bottom' | null

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#444';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Téléchargez une image', canvas.width / 2, canvas.height / 2);
    }

    ctx.font = `900 ${options.fontSize}px ${options.fontFamily}`;
    ctx.fillStyle = options.textColor;

    if (options.addShadow) {
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    // Dessiner texte du haut
    if (options.topText) {
      const x = topTextPos.x * canvas.width;
      const y = topTextPos.y * canvas.height;
      ctx.textAlign = 'center';
      if (options.addStroke) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.strokeText(options.topText.toUpperCase(), x, y);
      }
      ctx.fillText(options.topText.toUpperCase(), x, y);
    }

    // Dessiner texte du bas
    if (options.bottomText) {
      const x = bottomTextPos.x * canvas.width;
      const y = bottomTextPos.y * canvas.height;
      ctx.textAlign = 'center';
      if (options.addStroke) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.strokeText(options.bottomText.toUpperCase(), x, y);
      }
      ctx.fillText(options.bottomText.toUpperCase(), x, y);
    }
  }, [image, options, topTextPos, bottomTextPos]);

  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  // Détecter quel texte est proche du clic
  const getClickedText = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const threshold = 30; // pixels de tolérance

    if (options.topText) {
      const tx = topTextPos.x * canvas.width;
      const ty = topTextPos.y * canvas.height;
      if (Math.abs(mouseX - tx) < 150 && Math.abs(mouseY - ty) < threshold) {
        return 'top';
      }
    }

    if (options.bottomText) {
      const bx = bottomTextPos.x * canvas.width;
      const by = bottomTextPos.y * canvas.height;
      if (Math.abs(mouseX - bx) < 150 && Math.abs(mouseY - by) < threshold) {
        return 'bottom';
      }
    }

    return null;
  }, [options, topTextPos, bottomTextPos]);

  const handleMouseDown = useCallback((e) => {
    const clicked = getClickedText(e);
    if (clicked) {
      dragging.current = clicked;
      e.preventDefault();
    }
  }, [getClickedText]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const newPos = {
      x: Math.min(Math.max(mouseX / canvas.width, 0.05), 0.95),
      y: Math.min(Math.max(mouseY / canvas.height, 0.05), 0.95),
    };

    if (dragging.current === 'top') setTopTextPos(newPos);
    if (dragging.current === 'bottom') setBottomTextPos(newPos);
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  const loadImage = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const maxWidth = 700;
          const ratio = Math.min(maxWidth / img.width, 500 / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
        }
        setImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  const updateOption = useCallback((key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const downloadMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const getCanvasBlob = useCallback(() => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      if (!canvas) resolve(null);
      canvas.toBlob(resolve, 'image/png');
    });
  }, []);

  return {
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
  };
};