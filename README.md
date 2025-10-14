# Full Stack RTSP Livestream Player

This application allows users to view a livestream from an RTSP URL, with the ability to add and manage custom overlays (text and logos) on the video feed.

## Tech Stack

-   **Backend**: Python (Flask)
-   **Database**: MongoDB
-   **Frontend**: React
-   **Video Processing**: OpenCV for RTSP compatibility

### Setup and Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Amisha-kumari0204/RTSPLiveStreamingPlayer.git
    cd RTSPLiveStreamingPlayer
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    
    # Create a .env file and add your MongoDB connection string
    # Example: MONGO_URI=mongodb://localhost:27017/rtsp_overlays
    
    cp .env.example .env 
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

### How to Run the Application

1.  **Start the Backend Server** (from the `backend` directory)
    ```bash
    python app.py
    ```
    The backend will be running on `http://localhost:5000`.

2.  **Start the Frontend Application** (from the `frontend` directory)
    ```bash
    npm start
    ```
    The frontend will open in your browser at `http://localhost:3000`.

### How to Use the App

1.  **Input RTSP URL**: Find a public RTSP stream URL to test. Enter this URL into the input box on the web page. For testing, you can use services like `rtsp.me`.
2.  **Start Streaming**: Click the "Play" button to start the livestream. The video will appear in the player.
3.  **Manage Overlays**:
    -   **Add**: Use the "Add New Overlay" form to create text or logo overlays. Specify the content, position (x, y), and size, then click "Add Overlay".
    -   **Edit/Delete**: Your saved overlays will appear in the "Saved Overlays" list. Use the "Edit" and "Delete" buttons to manage them. Changes will be reflected on the livestream in real-time.

1.  **Input RTSP URL**: Find a public RTSP stream URL to test. Enter this URL into the input box on the web page. For testing, you can use services like `rtsp.me`.
2.  **Start Streaming**: Click the "Play" button to start the livestream. The video will appear in the player.
3.  **Manage Overlays**:
    -   **Add**: Use the "Add New Overlay" form to create text or logo overlays. Specify the content, position (x, y), and size, then click "Add Overlay".
    -   **Edit/Delete**: Your saved overlays will appear in the "Saved Overlays" list. Use the "Edit" and "Delete" buttons to manage them. Changes will be reflected on the livestream in real-time.

