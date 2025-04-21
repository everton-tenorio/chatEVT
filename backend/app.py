from flask import Flask, request, jsonify
from flask_cors import CORS
# from gemini import prompt
import requests

app = Flask(__name__)

# Habilitar CORS para todas as rotas, permitindo origens do frontend
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://chatevt.azurewebsites.net"]}})


MOCK_RESPONSES = {
    "hi": "I am a highly specialized AI, trained and designed to act as a Senior Specialist in DevOps/DevSecOps, computer networks, and cybersecurity. I bring a wealth of knowledge and experience from these fields, allowing me to provide insights, solutions, and guidance on a wide range of technical challenges. My expertise includes cloud infrastructure, automation, security protocols, network architectures, and the integration of security practices into the software development lifecycle.",
    "oi": "Opa",
    "qual é a capital do brasil?": "A capital do Brasil é Brasília.",
    "o que é devops?": "DevOps é uma cultura que combina desenvolvimento (Dev) e operações (Ops) para melhorar a colaboração e automatizar processos, como CI/CD.",
    "quem criou o linux?": "O Linux foi criado por Linus Torvalds em 1991.",
    "como está o tempo?": "Não tenho dados reais, mas posso dizer que está ensolarado na nuvem! ☀️"
}


@app.route('/', methods=['GET'])
def home():
    return "<h1>Acesse: chatevt.azurewebsites.net</h1>"


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    # user_message = data.get('message', '')
    user_message = data.get('message', '').lower().strip()

    # Conectar ao container llama.cpp
    try:
        # Busca resposta mockada ou retorna padrão
        reply = MOCK_RESPONSES.get(user_message, "Desculpe, não tenho uma resposta para isso. Tente outra pergunta! kkkk. Obs.: Devido aos milhões quase zilhões de acessos, desativamos a LLM por tempo inderteminado. Para reativar/conversar sobre o projeto: https://dev.evttenorio.com")
    
        # reply = prompt(user_message)

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