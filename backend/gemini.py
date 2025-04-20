import google.generativeai as genai
from environs import Env

env = Env()
env.read_env()
key = env("TOKEN")

# Gemini API
genai.configure(api_key=key)
model = genai.GenerativeModel("gemini-2.0-flash-001")

# Function to prompt
def prompt(content):
    message = (
    "Rules: Act as a senior specialist in DevOps/DevSecOps, computer networks, and cybersecurity."
    "Make: Answer the questions in a fluent and natural way."
    f"Message: {content}")

    response = model.generate_content([message])
    return response.text