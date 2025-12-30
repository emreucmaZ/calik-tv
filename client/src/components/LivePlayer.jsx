import { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';

export default function LivePlayer({ streamUrl, autoPlay = true }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!flvjs.isSupported()) {
      setError('Tarayıcınız FLV oynatmayı desteklemiyor');
      return;
    }

    if (!streamUrl) return;

    const initPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const player = flvjs.createPlayer({
        type: 'flv',
        url: streamUrl,
        isLive: true,
        hasAudio: true,
        hasVideo: true,
        enableStashBuffer: false
      }, {
        enableWorker: false,
        lazyLoadMaxDuration: 3 * 60,
        seekType: 'range'
      });

      player.attachMediaElement(videoRef.current);
      player.load();

      if (autoPlay) {
        player.play().catch(() => {
          // Autoplay blocked, user needs to click
          setIsPlaying(false);
        });
      }

      player.on(flvjs.Events.ERROR, (errType, errDetail) => {
        console.error('FLV Error:', errType, errDetail);
        if (errType === flvjs.ErrorTypes.NETWORK_ERROR) {
          setError('Yayın bağlantısı kurulamadı');
        }
      });

      player.on(flvjs.Events.LOADING_COMPLETE, () => {
        setError('Yayın sona erdi');
      });

      playerRef.current = player;
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [streamUrl, autoPlay]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (playerRef.current) {
      playerRef.current.unload();
      playerRef.current.load();
      playerRef.current.play();
    }
  };

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg aspect-video flex flex-col items-center justify-center">
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        muted
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-red-600 rounded-full p-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
