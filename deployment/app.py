from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from predict import predict_purchase, preprocess_input
import joblib
import os
from datetime import datetime
import traceback
import base64
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, auc, accuracy_score
import io

app = Flask(__name__)
CORS(app)  # TODO: Restrict CORS to your frontend domain in production

# Load the model and preprocessor
model = joblib.load('model/Gradient_Boosting.pkl')
preprocessor = joblib.load('model/preprocessor.pkl')

# Load test data globally
X_test = joblib.load('model/X_test.pkl')
y_test = joblib.load('model/y_test.pkl')

# Map model names to file paths
MODEL_PATHS = {
    'Gradient_Boosting': 'model/Gradient_Boosting.pkl',
    'Random_Forest': 'model/Random_Forest.pkl',
    'XGBoost': 'model/XGBoost.pkl',
    'Adaboost': 'model/Adaboost.pkl',
    'Logistic_Regression': 'model/Logistic_Regression.pkl',
}
ALLOWED_MODELS = set(MODEL_PATHS.keys())

# Helper to load model by name
def load_model(model_name):
    path = MODEL_PATHS.get(model_name, MODEL_PATHS['Gradient_Boosting'])
    return joblib.load(path)

# Helper to generate ROC curve as base64
def get_roc_curve_base64(model, X, y):
    y_proba = model.predict_proba(X)[:, 1]
    fpr, tpr, _ = roc_curve(y, y_proba)
    roc_auc = auc(fpr, tpr)
    plt.figure()
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (AUC = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic')
    plt.legend(loc='lower right')
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close()
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    return img_base64

# Helper to get feature importances
def get_feature_importance(model):
    if hasattr(model, 'feature_importances_'):
        return model.feature_importances_.tolist()
    elif hasattr(model, 'coef_'):
        return model.coef_[0].tolist()
    else:
        return None

# Input validation for session data
def validate_session_data(data):
    required_fields = [
        'Administrative', 'Administrative_Duration', 'Informational', 'Informational_Duration',
        'ProductRelated', 'ProductRelated_Duration', 'BounceRates', 'ExitRates', 'PageValues',
        'SpecialDay', 'Month', 'OperatingSystems', 'Browser', 'Region', 'TrafficType', 'VisitorType', 'Weekend'
    ]
    for field in required_fields:
        if field not in data:
            return False, f"Missing field: {field}"
    return True, None

@app.route('/')
def home():
    return jsonify({
        "message": "OSPI ML API is running",
        "status": "success",
        "endpoints": {
            "predict": "/predict",
            "health": "/health"
        }
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get session data and model name from request
        session_data = request.json
        if not session_data:
            return jsonify({"error": "No session data provided"}), 400
        model_name = session_data.get('model_name', 'Gradient_Boosting')
        if model_name not in ALLOWED_MODELS:
            return jsonify({"error": f"Invalid model_name. Allowed: {list(ALLOWED_MODELS)}"}), 400
        if 'model_name' in session_data:
            del session_data['model_name']
        valid, err = validate_session_data(session_data)
        if not valid:
            return jsonify({"error": err}), 400
        print(f"Received session data: {session_data}")
        print(f"Model selected: {model_name}")
        # Convert to DataFrame
        df = pd.DataFrame([session_data])
        # Load selected model
        selected_model = load_model(model_name)
        # Preprocess input for user data
        processed_data = preprocess_input(df)
        # Make prediction
        prediction = selected_model.predict(processed_data)[0]
        probability = selected_model.predict_proba(processed_data)[0]
        confidence = probability[1] if prediction == 1 else probability[0]
        # Use X_test as-is for metrics (assume already preprocessed)
        X_test_processed = X_test
        # Get ROC and accuracy
        y_proba_test = selected_model.predict_proba(X_test_processed)[:, 1]
        y_pred_test = selected_model.predict(X_test_processed)
        acc = accuracy_score(y_test, y_pred_test)
        roc_base64 = get_roc_curve_base64(selected_model, X_test_processed, y_test)
        # Feature importance
        feature_importance = get_feature_importance(selected_model)
        return jsonify({
            "prediction": int(prediction),
            "confidence": float(confidence),
            "result": "Purchase Likely ✅" if prediction == 1 else "Not Likely ❌",
            "session_data": session_data,
            "model_name": model_name,
            "accuracy": acc,
            "roc_curve_base64": roc_base64,
            "feature_importance": feature_importance
        })
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({
            "error": str(e),
            "message": "Error processing prediction request",
            "traceback": traceback.format_exc()
        }), 500

@app.route('/metrics', methods=['GET'])
def metrics():
    results = {}
    for model_name in ALLOWED_MODELS:
        model = load_model(model_name)
        X_test_processed = X_test
        y_pred = model.predict(X_test_processed)
        y_proba = model.predict_proba(X_test_processed)[:, 1]
        acc = accuracy_score(y_test, y_pred)
        fpr, tpr, _ = roc_curve(y_test, y_proba)
        roc_auc = auc(fpr, tpr)
        results[model_name] = {
            'accuracy': acc,
            'roc_auc': roc_auc
        }
    return jsonify(results)

@app.route('/api/features', methods=['GET'])
def get_features():
    """Return the list of required features for the frontend"""
    features = [
        'Administrative', 'Administrative_Duration', 'Informational', 
        'Informational_Duration', 'ProductRelated', 'ProductRelated_Duration',
        'BounceRates', 'ExitRates', 'PageValues', 'SpecialDay', 'Month',
        'OperatingSystems', 'Browser', 'Region', 'TrafficType', 
        'VisitorType', 'Weekend'
    ]
    return jsonify({"features": features})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 