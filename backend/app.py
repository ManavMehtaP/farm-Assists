import os
import requests
import google.generativeai as genai
import json
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from typing import Dict, Any, Optional

# Load environment variables from a .env file
load_dotenv()

# --- Initialization ---
app = Flask(__name__)
# CORS allows your frontend (running on a different address) to talk to your backend
CORS(app) 

# --- API Key Configuration ---
# It's best practice to get API keys from environment variables
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure the Gemini API
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
else:
    print("⚠️ Gemini API key not found. Please set it in the .env file.")

# Check if keys are loaded
if not OPENWEATHER_API_KEY:
    print("⚠️ OpenWeather API key not found. Please set it in the .env file.")

# --- Helper Functions ---
def get_weather(city: str) -> Optional[Dict[str, Any]]:
    """Fetches weather data from OpenWeatherMap API."""
    try:
        if not OPENWEATHER_API_KEY:
            print("⚠️ OpenWeather API key is missing")
            return None
            
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={OPENWEATHER_API_KEY}&units=metric"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        else:
            print(f"⚠️ Weather API error: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error fetching weather data: {str(e)}")
        return None

# --- API Endpoints ---
@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint to verify the backend is running."""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response
        
    return jsonify({
        "status": "ok",
        "message": "Backend service is running",
        "version": "1.0.0"
    }), 200

@app.route('/recommend', methods=['POST', 'OPTIONS'])
def recommend_crop():
    """Recommends a crop based on city weather and soil type."""
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', '*')
        response.headers.add('Access-Control-Allow-Methods', '*')
        return response
        
    try:
        data = request.get_json()
        if not data or 'city' not in data or 'soil' not in data:
            return jsonify({"error": "Missing city or soil type"}), 400

        city = data['city']
        soil = data['soil']
        
        print(f"🌦️ Fetching weather for {city}...")
        weather_data = get_weather(city)
        
        if not weather_data:
            return jsonify({
                "status": "error",
                "error": f"Could not fetch weather for {city}. Please check the city name and try again."
            }), 400

        # Extract relevant weather info
        current_temp = weather_data.get('main', {}).get('temp')
        weather_condition = weather_data.get('weather', [{}])[0].get('main', 'Unknown')
        
        # Load crop rules
        try:
            with open('crop_rules.json', 'r', encoding='utf-8') as f:
                rules = json.load(f)
        except FileNotFoundError:
            print("⚠️ crop_rules.json not found. Using default rules.")
            rules = [
                {
                    "crop": "Wheat",
                    "advice": "Ideal for current conditions. Requires moderate watering.",
                    "conditions": {
                        "weather_main": "Clear",
                        "temp_min_celsius": 10,
                        "soil": "loamy"
                    }
                },
                {
                    "crop": "Rice",
                    "advice": "Suitable for wet conditions. Ensure proper water management.",
                    "conditions": {
                        "weather_main": "Rain",
                        "temp_min_celsius": 20,
                        "soil": "clay"
                    }
                }
            ]

        # Find matching crops
        matching_crops = []
        for rule in rules:
            conditions = rule.get('conditions', {})
            if (weather_condition.lower() == conditions.get('weather_main', '').lower() and
                current_temp >= conditions.get('temp_min_celsius', 0) and
                soil.lower() == conditions.get('soil', '').lower()):
                
                matching_crops.append({
                    "crop": rule.get('crop', 'Unknown'),
                    "advice": rule.get('advice', 'No specific advice available.'),
                    "weather_condition": weather_condition,
                    "temperature": f"{current_temp}°C"
                })

        if matching_crops:
            return jsonify({
                "status": "success",
                "city": city,
                "soil_type": soil,
                "recommendations": matching_crops,
                "weather": {
                    "temperature": current_temp,
                    "condition": weather_condition,
                    "humidity": weather_data.get('main', {}).get('humidity', 'N/A')
                }
            })

        # No exact match found, return general advice
        return jsonify({
            "status": "info",
            "message": "No specific crop recommendations found for the current conditions.",
            "suggestions": ["Consult with local agricultural experts for personalized advice."],
            "weather": {
                "temperature": current_temp,
                "condition": weather_condition,
                "humidity": weather_data.get('main', {}).get('humidity', 'N/A')
            }
        })
        
    except Exception as e:
        print(f"⚠️ Error in recommend_crop: {str(e)}")
        return jsonify({
            "status": "error",
            "error": "An unexpected error occurred. Please try again later.",
            "details": str(e)
        }), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Handles chatbot queries using the Gemini API."""
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Missing query"}), 400
        
    if not genai.api_key:
        return jsonify({"error": "Gemini API key is not configured."}), 500

    user_query = data['query']
    
    try:
        model = genai.GenerativeModel('gemini-pro')
        
        # This prompt gives the AI its personality and context
        prompt = f"""
        You are 'Kisan Mitra,' an expert AI farming assistant for farmers in Gujarat, India. 
        Your goal is to provide simple, clear, and helpful advice. 
        If possible, use common Gujarati terms for farming concepts.
        Answer the following question: {user_query}
        """
        
        response = model.generate_content(prompt)
        return jsonify({"answer": response.text})

    except Exception as e:
        return jsonify({"error": f"An error occurred with the AI model: {str(e)}"}), 500

# --- Run the App ---
if __name__ == '__main__':
    # debug=True allows the server to auto-reload when you save the file
    app.run(debug=True, port=5000)