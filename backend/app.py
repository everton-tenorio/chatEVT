from flask import Flask, request, jsonify
from flask_cors import CORS
from gemini import prompt
import requests

app = Flask(__name__)

# Habilitar CORS para todas as rotas, permitindo origens do frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://chatevt.azurewebsites.net"]}})


@app.route('/', methods=['GET'])
def home():
    return "<h1>Acesse: chatevt.azurewebsites.net</h1>"

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')

    # Conectar ao container llama.cpp
    try:
        reply = prompt(user_message)
        #response = requests.post(
        #    'http://llama:8000/v1/completions',
        #    json={'prompt': user_message, 'max_tokens': 100},
        #)
        #reply = response.json()['choices'][0]['text']
    except Exception as e:
        reply = f"Error: {str(e)}"
        print(e)

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)