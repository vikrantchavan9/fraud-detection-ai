import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from imblearn.pipeline import Pipeline as ImbPipeline
from xgboost import XGBClassifier
import joblib
import shap
from utils.explainer import save_explainer

# Configuration
CONFIG = {
    "data_path": "data/transaction_data.csv",
    "model_dir": "model",  # Directory for model artifacts
    "model_file": "fraud_model.pkl",
    "explainer_file": "shap_explainer.pkl",
    "test_size": 0.2,
    "random_state": 42
}

def ensure_dir_exists():
    """Ensure model directory exists"""
    os.makedirs(CONFIG["model_dir"], exist_ok=True)

def get_model_path():
    return os.path.join(CONFIG["model_dir"], CONFIG["model_file"])

def get_explainer_path():
    return os.path.join(CONFIG["model_dir"], CONFIG["explainer_file"])

def load_data():
    try:
        data = pd.read_csv(CONFIG["data_path"])
        print("Data loaded successfully. Shape:", data.shape)
        
        # Validate columns
        required_cols = [
            'amount', 'time', 'category', 'location', 'merchant',
            'day_of_week', 'transaction_type', 'user_age',
            'user_income', 'device_used', 'previous_frauds', 'fraud'
        ]
        
        missing_cols = [col for col in required_cols if col not in data.columns]
        if missing_cols:
            raise ValueError(f"Missing columns in data: {missing_cols}")
            
        return data
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        raise

def build_pipeline():
    numerical = ['amount', 'time', 'user_age', 'user_income', 'previous_frauds']
    categorical = ['category', 'location', 'merchant', 'day_of_week', 'transaction_type', 'device_used']
    
    preprocessor = ColumnTransformer([
        ('num', StandardScaler(), numerical),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical)
    ])
    
    return ImbPipeline([
        ('preprocessor', preprocessor),
        ('classifier', XGBClassifier(
            eval_metric='logloss',
            random_state=CONFIG["random_state"],
            use_label_encoder=False
        ))
    ])

def train_model():
    try:
        ensure_dir_exists()
        data = load_data()
        
        X = data.drop('fraud', axis=1)
        y = data['fraud']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=CONFIG["test_size"], 
            random_state=CONFIG["random_state"],
            stratify=y
        )
        
        print("\nTraining model...")
        model = build_pipeline()
        model.fit(X_train, y_train)
        
        # Evaluation
        print("\nModel Evaluation:")
        y_pred = model.predict(X_test)
        print("Accuracy:", accuracy_score(y_test, y_pred))
        print("\nClassification Report:\n", classification_report(y_test, y_pred))
        
        # Save artifacts
        print("\nSaving model artifacts...")
        joblib.dump(model, get_model_path())
        save_explainer(model, X_train, get_explainer_path())
        
        print(f"\nModel saved to {get_model_path()}")
        print(f"Explainer saved to {get_explainer_path()}")
        
    except Exception as e:
        print(f"\nError during model training: {str(e)}")
        raise

if __name__ == "__main__":
    train_model()