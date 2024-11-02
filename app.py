from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from groq import Groq
import folium

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Initialize the Groq client
client = Groq(api_key="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")

# Initialize conversation history
conversation_history = [
    {
        "role": "system",
        "content": "You are a customer care AI chatbot for real-time support and guidance. The chatbot should be capable of responding to user queries immediately, offering solutions, and directing them to appropriate resources. Keep all messages short like text messages."
    }
]

def ask(user_input):
    conversation_history.append({
        "role": "user",
        "content": user_input
    })
    try:
        chat_completion = client.chat.completions.create(
            messages=conversation_history,
            model="llama3-70b-8192",
            temperature=0.5,
            max_tokens=1024,
            top_p=1,
            stop=None,
            stream=False
        )
        response = chat_completion.choices[0].message.content
        conversation_history.append({
            "role": "assistant",
            "content": response
        })
        return response
    except Exception as e:
        print(f"Error in Groq API call: {e}")
        return "Sorry, I couldn't process your request. Please try again."

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"response": "No message received."}), 400

    bot_response = ask(user_message)
    return jsonify({"response": bot_response})


@app.route('/generate_map_with_current', methods=['POST'])
def generate_map_with_current():
    data = request.get_json()

    start_latitude = data.get('start_latitude')
    start_longitude = data.get('start_longitude')
    end_latitude = data.get('end_latitude')
    end_longitude = data.get('end_longitude')
    current_latitude = data.get('current_latitude')
    current_longitude = data.get('current_longitude')

    # Create a map centered around the current location
    m = folium.Map(location=[current_latitude, current_longitude], zoom_start=12)

    # Add markers for current, from, and to locations
    folium.Marker([current_latitude, current_longitude], tooltip='Current Location', icon=folium.Icon(color='blue')).add_to(m)
    folium.Marker([start_latitude, start_longitude], tooltip='From Location', icon=folium.Icon(color='green')).add_to(m)
    folium.Marker([end_latitude, end_longitude], tooltip='To Location', icon=folium.Icon(color='red')).add_to(m)

    # Optionally, draw lines connecting the locations
    folium.PolyLine(locations=[[current_latitude, current_longitude], [start_latitude, start_longitude], [end_latitude, end_longitude]],
                    color='purple').add_to(m)

    # Convert map to HTML
    map_html = m._repr_html_()

    return map_html

if __name__ == '__main__':
    app.run(port=5000, debug=True)
