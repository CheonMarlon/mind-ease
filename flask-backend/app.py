from flask import Flask, jsonify, request
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db, auth
import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
cred_path = os.getenv("FIREBASE_KEY_PATH")
database_url = os.getenv("DATABASE_URL")

if not cred_path or not database_url:
    raise Exception("Missing FIREBASE_KEY_PATH or DATABASE_URL in environment variables.")

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {'databaseURL': database_url})

@app.route('/emotes', methods=['POST'])
def save_emotes():
    try:
        data = request.get_json()
        id_token = data.get('idToken')
        emoji_clicked = data.get('emotes')

        # Basic validation
        if not id_token or not emoji_clicked:
            return jsonify({'message': 'Missing ID Token or emoji'}), 400

        # Verify Firebase ID Token
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # Check if user exists in the database
        user_ref = db.reference(f'users/{uid}')
        user_data = user_ref.get()

        if not user_data:
            return jsonify({'message': 'User not found in Firebase'}), 404

        # Get current day and timestamp
        today = datetime.datetime.now().strftime('%A')
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Store emoji in Realtime Database under emoji_tracker
        emoji_ref = db.reference(f'emoji_tracker/{uid}/{today}')
        emoji_ref.push({
            'emotes': emoji_clicked,
            'timestamp': timestamp
        })

        return jsonify({'message': f'{emoji_clicked} saved for {today} at {timestamp}'}), 200

    except auth.InvalidIdTokenError:
        return jsonify({'message': 'Invalid ID Token'}), 401
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
