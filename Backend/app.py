from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from utils.explainer import generate_explanation
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load model and explainer
MODEL = joblib.load("model/fraud_model.pkl")
EXPLAINER = joblib.load("model/shap_explainer.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate input
        required = ['amount', 'time', 'category', 'location', 'merchant',
                   'day_of_week', 'transaction_type', 'user_age',
                   'user_income', 'device_used', 'previous_frauds']
        
        if not all(field in data for field in required):
            return jsonify({
                "status": "error",
                "message": "Missing required fields",
                "required_fields": required
            }), 400
        
        # Process input
        df = pd.DataFrame([data])
        processed = MODEL.named_steps['preprocessor'].transform(df)
        
        # Get prediction
        prediction = int(MODEL.predict(df)[0])
        probability = float(MODEL.predict_proba(df)[0][1])
        
        # Generate explanation
        explanation = generate_explanation(EXPLAINER, processed)
        
        return jsonify({
            "status": "success",
            "prediction": prediction,
            "probability": probability,
            "explanation": explanation,
            "risk_level": get_risk_level(probability),
            "timestamp": pd.Timestamp.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

def get_risk_level(prob):
    if prob < 0.3:
        return "low"
    elif prob < 0.7:
        return "medium"
    else:
        return "high"

@app.route('/model-info', methods=['GET'])
def model_info():
    return jsonify({
        "model_type": "XGBoost",
        "version": "1.0",
        "last_trained": "2023-11-15",
        "metrics": {
            "accuracy": 0.95,
            "precision": 0.93,
            "recall": 0.91
        }
    })

if __name__ == '__main__':
    app.run(host=os.getenv('HOST', '0.0.0.0'),
            port=int(os.getenv('PORT', 5000)),
            debug=os.getenv('DEBUG', True))