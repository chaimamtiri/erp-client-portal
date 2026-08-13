import os
import requests
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot', __name__)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.1-8b-instant"  # free tier friendly

SYSTEM_PROMPT = (
    "Tu es un assistant client pour un ERP. Réponds en français, de façon brève, "
    "claire et utile. Tu peux aider avec les commandes, factures, adresses et "
    "questions générales sur le compte client."
)


@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    if not GROQ_API_KEY:
        return jsonify({"error": "GROQ_API_KEY not configured on server"}), 500

    data = request.get_json(silent=True) or {}
    history = data.get("history", [])

    if not history:
        return jsonify({"error": "Missing 'history' in request body"}), 400

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history

    try:
        resp = requests.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": GROQ_MODEL,
                "messages": messages,
                "max_tokens": 400,
                "temperature": 0.6,
            },
            timeout=30,
        )
        resp.raise_for_status()
        result = resp.json()
        reply = result["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": reply})
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Upstream API error: {str(e)}"}), 502
    except (KeyError, IndexError):
        return jsonify({"error": "Unexpected response format from AI provider"}), 502