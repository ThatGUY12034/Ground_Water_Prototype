# ml_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class GroundWaterMLModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.model_path = 'models/groundwater_model.pkl'
        self.scaler_path = 'models/scaler.pkl'
        self.encoder_path = 'models/label_encoders.pkl'
        
    def preprocess_data(self, df):
        """Preprocess the groundwater data for ML training"""
        if df.empty:
            return pd.DataFrame()
            
        # Create a copy to avoid warnings
        processed_df = df.copy()
        
        # Convert date columns
        date_columns = ['date', 'createdDate', 'modifiedDate']
        for col in date_columns:
            if col in processed_df.columns:
                processed_df[col] = pd.to_datetime(processed_df[col], errors='coerce')
                processed_df[f'{col}_year'] = processed_df[col].dt.year
                processed_df[f'{col}_month'] = processed_df[col].dt.month
                processed_df[f'{col}_day'] = processed_df[col].dt.day
        
        # Handle categorical columns
        categorical_columns = ['stateName', 'districtName', 'agencyName', 'stationName']
        for col in categorical_columns:
            if col in processed_df.columns:
                if col not in self.label_encoders:
                    self.label_encoders[col] = LabelEncoder()
                    # Handle NaN values before fitting
                    processed_df[col] = processed_df[col].fillna('Unknown')
                    self.label_encoders[col].fit(processed_df[col])
                processed_df[f'{col}_encoded'] = self.label_encoders[col].transform(processed_df[col])
        
        # Select numerical features for training
        numerical_features = [
            'wlDepthBelowGls', 'wlDepthBelowGlsInMonsoons', 
            'wlDepthBelowGlsInPostmonsoons', 'wlDepthBelowGlsInPremonsoons',
            'date_year', 'date_month', 'date_day'
        ]
        
        # Only use features that exist in the dataframe
        available_features = [f for f in numerical_features if f in processed_df.columns]
        
        return processed_df[available_features]
    
    def train_model(self, df):
        """Train the ML model on groundwater data"""
        if df.empty:
            print("❌ No data available for training")
            return False
            
        try:
            # Preprocess data
            features_df = self.preprocess_data(df)
            
            if features_df.empty:
                print("❌ No features available after preprocessing")
                return False
            
            # Define target variable (water level depth)
            target_column = 'wlDepthBelowGls'
            if target_column not in df.columns:
                print(f"❌ Target column '{target_column}' not found")
                return False
            
            # Prepare features and target
            X = features_df.fillna(0)
            y = df[target_column].fillna(0)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            
            self.model.fit(X_train_scaled, y_train)
            
            # Calculate score
            train_score = self.model.score(X_train_scaled, y_train)
            test_score = self.model.score(X_test_scaled, y_test)
            
            print(f"✅ Model trained successfully!")
            print(f"📊 Train Score: {train_score:.4f}")
            print(f"📊 Test Score: {test_score:.4f}")
            
            # Save model and preprocessing objects
            self.save_model()
            
            return True
            
        except Exception as e:
            print(f"❌ Error training model: {e}")
            return False
    
    def predict(self, new_data):
        """Make predictions on new data"""
        if self.model is None:
            self.load_model()
            
        if self.model is None:
            return {"error": "Model not trained yet"}
        
        try:
            # Preprocess the new data
            features_df = self.preprocess_data(new_data)
            
            if features_df.empty:
                return {"error": "No features available for prediction"}
            
            # Scale features and predict
            features_scaled = self.scaler.transform(features_df.fillna(0))
            predictions = self.model.predict(features_scaled)
            
            return {
                "predictions": predictions.tolist(),
                "features_used": features_df.columns.tolist()
            }
            
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}
    
    def save_model(self):
        """Save model and preprocessing objects"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        joblib.dump(self.label_encoders, self.encoder_path)
        print("💾 Model saved successfully!")
    
    def load_model(self):
        """Load saved model and preprocessing objects"""
        try:
            self.model = joblib.load(self.model_path)
            self.scaler = joblib.load(self.scaler_path)
            self.label_encoders = joblib.load(self.encoder_path)
            print("📥 Model loaded successfully!")
            return True
        except:
            print("❌ No saved model found. Please train first.")
            return False