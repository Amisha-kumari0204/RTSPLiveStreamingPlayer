import os
import cv2
import numpy as np
from flask import Flask, Response, request, jsonify
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Configure MongoDB
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    # This will stop the app with a clear message if the .env file is missing or misconfigured.
    raise RuntimeError("FATAL ERROR: MONGO_URI environment variable is not set. Please create and configure the .env file.")

app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)
overlays_collection = mongo.db.overlays

# Helper to convert MongoDB ObjectId to string
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# --- CRUD API for Overlays [cite: 10] ---

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    """Create a new overlay setting. [cite: 11]"""
    data = request.get_json()
    # Basic validation
    if not data or 'type' not in data or 'content' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    new_overlay = {
        "type": data["type"], # 'text' or 'logo'
        "content": data["content"], # text string or path to logo
        "x": data.get("x", 10),
        "y": data.get("y", 30),
        "size": data.get("size", 1), # Font scale or logo scale
        "color": data.get("color", (255, 255, 255)), # BGR color for text
    }
    result = overlays_collection.insert_one(new_overlay)
    created_overlay = overlays_collection.find_one({"_id": result.inserted_id})
    return jsonify(serialize_doc(created_overlay)), 201

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    """Retrieve all saved overlay settings. [cite: 12]"""
    all_overlays = overlays_collection.find()
    return jsonify([serialize_doc(overlay) for overlay in all_overlays]), 200

@app.route('/api/overlays/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    """Modify an existing overlay setting. [cite: 13]"""
    data = request.get_json()
    result = overlays_collection.update_one(
        {"_id": ObjectId(overlay_id)},
        {"$set": data}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    
    updated_overlay = overlays_collection.find_one({"_id": ObjectId(overlay_id)})
    return jsonify(serialize_doc(updated_overlay)), 200

@app.route('/api/overlays/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    """Delete a saved overlay setting. [cite: 14]"""
    result = overlays_collection.delete_one({"_id": ObjectId(overlay_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Overlay not found"}), 404
    return "", 204

# --- Video Streaming [cite: 19] ---

def apply_overlays(frame):
    """Applies all active overlays from the database onto a video frame. [cite: 8]"""
    try:
        overlays = list(overlays_collection.find())
        for overlay in overlays:
            # Position and resize overlays as needed [cite: 9]
            x, y = int(overlay.get('x', 10)), int(overlay.get('y', 30))
            
            if overlay['type'] == 'text':
                text = overlay.get('content', '')
                font_scale = float(overlay.get('size', 1))
                color_bgr = tuple(overlay.get('color', [255, 255, 255]))
                cv2.putText(frame, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, font_scale, color_bgr, 2)
                
            elif overlay['type'] == 'logo':
                # For simplicity, logo is fetched from a static path.
                # In a real app, this would handle file uploads or URLs.
                logo_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'logo-overlay.png')
                if os.path.exists(logo_path):
                    logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
                    scale = float(overlay.get('size', 0.2))
                    
                    # Resize logo
                    w, h = int(logo.shape[1] * scale), int(logo.shape[0] * scale)
                    logo_resized = cv2.resize(logo, (w, h))

                    # Overlay logic with transparency
                    img_h, img_w, _ = frame.shape
                    y1, y2 = y, y + h
                    x1, x2 = x, x + w
                    
                    if y2 > img_h or x2 > img_w: continue # Skip if out of bounds

                    alpha_s = logo_resized[:, :, 3] / 255.0
                    alpha_l = 1.0 - alpha_s

                    for c in range(0, 3):
                        frame[y1:y2, x1:x2, c] = (alpha_s * logo_resized[:, :, c] +
                                                 alpha_l * frame[y1:y2, x1:x2, c])
    except Exception as e:
        print(f"Error applying overlays: {e}")
    return frame


def generate_frames(rtsp_url):
    """A generator function that captures video from RTSP, applies overlays, and yields frames. [cite: 3]"""
    cap = cv2.VideoCapture(rtsp_url)
    if not cap.isOpened():
        print("Error: Could not open RTSP stream.")
        return

    while True:
        success, frame = cap.read()
        if not success:
            print("Stream ended or failed. Reconnecting...")
            cap.release()
            cap = cv2.VideoCapture(rtsp_url)
            continue
        
        # Apply overlays to the frame
        frame = apply_overlays(frame)
        
        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue
        
        frame_bytes = buffer.tobytes()
        # Yield the frame in multipart format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    """Endpoint to serve the processed video stream. [cite: 6]"""
    rtsp_url = request.args.get('url')
    if not rtsp_url:
        return "Error: No RTSP URL provided.", 400
    return Response(generate_frames(rtsp_url), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)