import shap
import joblib
import numpy as np
from scipy.sparse import csr_matrix

def save_explainer(model, X_train, save_path):
    """Save SHAP explainer for the model"""
    try:
        # Process training data and convert to dense if sparse
        processed_data = model.named_steps['preprocessor'].transform(X_train)
        if isinstance(processed_data, csr_matrix):
            processed_data = processed_data.toarray()
        
        # Create explainer
        explainer = shap.TreeExplainer(model.named_steps['classifier'])
        
        # Get feature names
        num_features = model.named_steps['preprocessor'].transformers_[0][2]
        cat_features = model.named_steps['preprocessor'].named_transformers_['cat'].get_feature_names_out(
            model.named_steps['preprocessor'].transformers_[1][2]
        )
        feature_names = num_features + list(cat_features)
        
        # Save explainer with metadata
        joblib.dump({
            'explainer': explainer,
            'feature_names': feature_names,
            'expected_value': explainer.expected_value,
            'is_sparse': isinstance(processed_data, csr_matrix)  # Track if data was sparse
        }, save_path)
        
        print(f"SHAP explainer saved to {save_path}")
        
    except Exception as e:
        print(f"Error saving SHAP explainer: {str(e)}")
        raise

def generate_explanation(explainer_data, processed_input):
    """Generate SHAP explanation for a single prediction"""
    try:
        # Convert sparse matrix to dense if needed
        if isinstance(processed_input, csr_matrix):
            processed_input = processed_input.toarray()
        
        # Get SHAP values
        shap_values = explainer_data['explainer'].shap_values(processed_input)
        
        # Format explanation
        explanation = []
        for i in np.argsort(-np.abs(shap_values[0]))[:5]:  # Top 5 features
            feature = explainer_data['feature_names'][i]
            value = processed_input[0][i]
            impact = shap_values[0][i]
            
            direction = "increased" if impact > 0 else "decreased"
            explanation.append({
                'feature': feature,
                'value': round(float(value), 2),
                'impact': round(float(impact), 4),
                'direction': direction,
                'abs_impact': round(float(abs(impact)), 4)
            })
        
        return {
            'base_value': float(explainer_data['expected_value'][0]),
            'shap_values': [float(x) for x in shap_values[0]],
            'feature_importances': explanation
        }
        
    except Exception as e:
        print(f"Error generating explanation: {str(e)}")
        raise