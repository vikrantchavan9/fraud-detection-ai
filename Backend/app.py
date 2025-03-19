from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check if the model file exists
if not os.path.exists("fraud_detection_model.pkl"):
    print("Error: Model file 'fraud_detection_model.pkl' not found. Please run model.py first.")
    exit()

# Load the trained model
try:
    model = joblib.load("fraud_detection_model.pkl")
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)  # Print the received data
        df = pd.DataFrame([data])
        prediction = model.predict(df)
        print("Prediction:", prediction)  # Print the prediction
        return jsonify({'fraud': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)