import os
import json
from typing import List, Dict, Any, Optional

def load_env_file():
    """Load variables from .env file if available."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    env_paths = [
        os.path.join(base_dir, ".env"),
        os.path.join(base_dir, "..", ".env")
    ]
    for p in env_paths:
        if os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            key = k.strip()
                            val = v.strip().strip("'\"")
                            if key not in os.environ:
                                os.environ[key] = val
            except Exception as e:
                print(f"Error reading .env file at {p}: {e}")

load_env_file()

def generate_gemini_response(prompt: str, api_key: str) -> Optional[str]:
    """Call Google Gemini API using google.generativeai."""
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
        for model_name in models_to_try:
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(prompt)
                if response and hasattr(response, 'text') and response.text:
                    return response.text.strip()
            except Exception as me:
                print(f"Gemini model {model_name} attempt failed: {me}")
                continue
    except Exception as e:
        print(f"Google Generative AI call error: {e}")
    return None


def generate_openai_response(prompt: str, api_key: str) -> Optional[str]:
    """Call OpenAI ChatCompletion API."""
    try:
        import openai
        openai.api_key = api_key
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are Oracle of Librio, an intelligent and responsible banking AI assistant for Bank of Librio."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=600
        )
        return resp["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"OpenAI call error: {e}")
    return None


def synthesize_answer(
    query: str, 
    chunks: List[Dict[str, Any]], 
    api_key: Optional[str] = None, 
    provider: Optional[str] = "gemini"
) -> str:
    """
    Synthesizes a responsible answer for the user query.
    Transfers vector embedding document context (if present) to the LLM via API key (Gemini / OpenAI).
    Handles greetings and general queries when no document chunks match.
    """
    load_env_file()

    gemini_key = None
    openai_key = None

    if api_key:
        api_key = api_key.strip()
        if api_key.startswith("sk-"):
            openai_key = api_key
        else:
            gemini_key = api_key

    if not gemini_key:
        gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

    if not openai_key:
        openai_key = os.environ.get("OPENAI_API_KEY")

    query_clean = query.strip()
    lower_query = query_clean.lower()
    greetings = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "hi there", "hello there"]
    is_greeting = lower_query in greetings or (any(lower_query.startswith(g) for g in ["hi ", "hello ", "hey "]) and len(lower_query) < 15)

    # Prepare prompt
    if chunks:
        prompt_parts = [
            "You are Oracle of Librio, an intelligent, professional, and responsible banking assistant for Bank of Librio.",
            "Synthesize a clear, accurate, and responsible answer to the user query using the retrieved document context below.",
            "Do NOT copy text verbatim; rewrite facts in your own concise wording.",
            "Always include parenthetical citations like (Source: filename.csv) when referring to retrieved facts.",
            f"\nUser Query: {query_clean}",
            "\nRetrieved Document Context Chunks:"
        ]
        for i, c in enumerate(chunks[:6], start=1):
            meta = c.get("metadata", {})
            src = meta.get("filename") or meta.get("source") or f"doc_{i}"
            content = " ".join(c.get("content", "").split())[:400]
            prompt_parts.append(f"[{i}] (Source: {src}): {content}")

        prompt_parts.append("\nResponsible Answer:")
        prompt = "\n".join(prompt_parts)
    else:
        if is_greeting:
            prompt = (
                f"You are Oracle of Librio, an intelligent, polite, and responsible banking AI assistant for Bank of Librio. "
                f"The user greeted you with: '{query_clean}'. "
                f"Respond warmly and professionally. Introduce yourself as Oracle of Librio, and state how you can help analyze "
                f"banking customer datasets, documents, and financial queries."
            )
        else:
            prompt = (
                f"You are Oracle of Librio, an intelligent, professional, and responsible banking AI assistant for Bank of Librio. "
                f"The user asked: '{query_clean}'. "
                f"No specific document matching this query was found in the ChromaDB vector store. "
                f"Provide a helpful, responsible answer using your general banking and financial knowledge. "
                f"If the query requires specific account or document records, politely mention that they can upload their documents using the 'Upload Data' button."
            )

    # Try Gemini API if key is available
    if gemini_key:
        ans = generate_gemini_response(prompt, gemini_key)
        if ans:
            return ans

    # Try OpenAI API if key is available
    if openai_key:
        ans = generate_openai_response(prompt, openai_key)
        if ans:
            return ans

    # Fallback response when no API key is provided
    if is_greeting:
        return "Greetings, seeker! I am the **Oracle of Librio**, your intelligent banking assistant. How may I assist your document analysis or banking queries today? *(Tip: Configure your Gemini API Key in Settings for powered AI generation)*"

    if chunks:
        excerpts = []
        for c in chunks[:4]:
            meta = c.get("metadata", {})
            src = meta.get("filename") or meta.get("source") or "document"
            txt = " ".join(c.get("content", "").split())[:200]
            excerpts.append(f"- {txt} (Source: {src})")
        return (
            f"Based on the retrieved ChromaDB vector records:\n\n" + 
            "\n".join(excerpts) + 
            "\n\n*(Note: Add your Gemini API Key in the UI settings for synthesized generative AI responses)*"
        )
    else:
        return (
            f"Thank you for your inquiry: **\"{query_clean}\"**.\n\n"
            f"No matching document records were found in the ChromaDB vector database. "
            f"To get AI-synthesized responses, please enter your **Google Gemini API Key** by clicking the key icon in the top header, or upload your document via **Upload Data**."
        )

