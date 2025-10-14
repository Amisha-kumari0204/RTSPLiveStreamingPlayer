import React from 'react';

const VideoPlayer = ({ rtspUrl, isPlaying }) => {
  // Construct the video feed URL. It's empty if not playing.
  const streamUrl = isPlaying && rtspUrl 
    ? `http://localhost:5000/video_feed?url=${encodeURIComponent(rtspUrl)}` 
    : '';

  return (
    <div className="video-container">
      <h3>Livestream</h3>
      {streamUrl ? (
        <img src={streamUrl} alt="Video Stream" width="720" />
      ) : (
        <div className="video-placeholder">
          <span>Enter an RTSP URL and press Play to start the stream.</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;