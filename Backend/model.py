import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline  # Use imblearn's Pipeline
from xgboost import XGBClassifier
import joblib
import os

# Ensure the data directory exists
if not os.path.exists("data"):
    os.makedirs("data")

# Load dataset
try:
    data = pd.read_csv("data/transaction_data.csv")
    print("Dataset loaded successfully!")
    print(data.head())  # Print the first few rows of the dataset
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

# Check for missing values in the target variable
print("Missing values in 'fraud' column:", data['fraud'].isnull().sum())

# Check unique values in the 'fraud' column
print("Unique values in 'fraud' column:", data['fraud'].unique())

# Clean the 'fraud' column
data = data[data['fraud'].isin([0, 1])]  # Drop rows with invalid values
# OR
# data['fraud'] = data['fraud'].replace([np.nan, 2, 3], 0)  # Replace invalid values with 0

# Check if the dataset has the required columns
required_columns = ['amount', 'time', 'category', 'location', 'merchant', 'day_of_week', 'transaction_type', 'user_age', 'user_income', 'device_used', 'previous_frauds', 'fraud']
if not all(column in data.columns for column in required_columns):
    print(f"Dataset must contain the following columns: {required_columns}")
    exit()

# Prepare features and target
X = data.drop(columns=['fraud'])
y = data['fraud']

# Define categorical and numerical columns
categorical_cols = ['category', 'location', 'merchant', 'day_of_week', 'transaction_type', 'device_used']
numerical_cols = ['amount', 'time', 'user_age', 'user_income', 'previous_frauds']

# Create a column transformer for preprocessing
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),  # Scale numerical columns
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)  # One-hot encode categorical columns
    ])

# Apply SMOTE after preprocessing
smote = SMOTE(random_state=42)

# Create a pipeline with preprocessing, SMOTE, and XGBoost model
model = ImbPipeline(steps=[
    ('preprocessor', preprocessor),  # Preprocess the data
    ('smote', smote),  # Apply SMOTE to balance the dataset
    ('classifier', XGBClassifier(random_state=42))  # Train the model
])

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model.fit(X_train, y_train)

# Test the model
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred)}")
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))  # Print confusion matrix
print("Classification Report:")
print(classification_report(y_test, y_pred))  # Print classification report

# Save the model
joblib.dump(model, "fraud_detection_model.pkl")
print("Model saved as fraud_detection_model.pkl")