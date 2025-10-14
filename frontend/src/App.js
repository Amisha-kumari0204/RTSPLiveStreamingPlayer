import React, { useState, useEffect, useCallback } from 'react';
import VideoPlayer from './components/VideoPlayer';
import OverlayForm from './components/OverlayForm';
import OverlayList from './components/OverlayList';
import * as api from './api/overlayService';
import './App.css';

function App() {
  const [rtspUrl, setRtspUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [overlays, setOverlays] = useState([]);
  const [currentOverlay, setCurrentOverlay] = useState(null);

  const fetchOverlays = useCallback(async () => {
    try {
      const response = await api.getOverlays();
      setOverlays(response.data);
    } catch (error) {
      console.error('Error fetching overlays:', error);
    }
  }, []);

  useEffect(() => {
    fetchOverlays();
  }, [fetchOverlays]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setRtspUrl('');
    } else if (inputUrl) {
      setRtspUrl(inputUrl);
      setIsPlaying(true);
    }
  };

  const handleSaveOverlay = async (overlayData) => {
    // This log will now appear in your browser's developer console
    console.log("Submitting overlay data:", overlayData);
    
    try {
      if (overlayData._id) {
        await api.updateOverlay(overlayData._id, overlayData);
      } else {
        await api.createOverlay(overlayData);
      }
      fetchOverlays();
    } catch (error) {
      console.error('Error saving overlay:', error);
    }
  };
  
  const handleDeleteOverlay = async (id) => {
    try {
      await api.deleteOverlay(id);
      fetchOverlays();
    } catch (error) {
      console.error('Error deleting overlay:', error);
    }
  };

  const handleEdit = (overlay) => {
    setCurrentOverlay(overlay);
  };

  return (
    <div className="App">
      <header>
        <h1>RTSP Livestream Player</h1>
      </header>
      
      <main>
        <div className="player-section">
          <VideoPlayer rtspUrl={rtspUrl} isPlaying={isPlaying} />
          <div className="controls">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter RTSP URL here"
            />
            <button onClick={handlePlayPause}>
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <p className="note">
              Note: Volume control is not available with this streaming method (MJPEG).
            </p>
          </div>
        </div>

        <div className="management-section">
          {/* Ensure onSave={handleSaveOverlay} is passed correctly */}
          <OverlayForm 
            onSave={handleSaveOverlay} 
            currentOverlay={currentOverlay} 
            setCurrentOverlay={setCurrentOverlay} 
          />
          <OverlayList 
            overlays={overlays} 
            onEdit={handleEdit} 
            onDelete={handleDeleteOverlay} 
          />
        </div>
      </main>
    </div>
  );
}

export default App;