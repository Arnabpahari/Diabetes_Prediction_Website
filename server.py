from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS  # Important for React connection

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load your trained model
try:
    model = joblib.load('diabetes_model.pkl')
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Get data from React form
        data = request.get_json()
        print("Received data:", data)  # Debug log

        # Prepare features (MODIFY THIS TO MATCH YOUR MODEL'S INPUT)
        features = np.array([[
            float(data['pregnancies']),
            float(data['glucose']),
            float(data['bloodPressure']),
            float(data['skinThickness']),
            float(data['insulin']),
            float(data['bmi']),
            float(data['diabetesPedigree']),
            float(data['age'])
        ]])
        
        print("Features array:", features)  # Debug log

        # Make prediction
        prediction = model.predict(features)
        result = int(prediction[0])
        
        print(f"Prediction result: {result} (1 = Diabetic, 0 = Not Diabetic)")
        return jsonify({
            "prediction": result,
            "message": "High risk of diabetes" if result == 1 else "Low risk of diabetes"
        })

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e)}), 400

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is running"""
    return jsonify({
        "status": "Server is working!",
        "model_loaded": bool(model)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)