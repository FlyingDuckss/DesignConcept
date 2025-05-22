from transformers import pipeline
from typing import Dict
from config import get_mode

# Load Models (once)
binary_model = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english",
    device=-1)
multi_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Threat categories
# CATEGORIES = [
#   "safe", 
#   "phishing", 
#   "HTML injection", 
#   "malware"  # includes download bait, encoded script, suspicious links
# ]

CATEGORIES = ["phishing", "HTML injection", "malware", "safe"]

def classify_input(text: str) -> Dict:
    print("########RUNNING CLASSIFICATION....")

    mode = get_mode()
    print(f"MODE: {mode}")

    if mode == "binary-only":
        print("########RUNNING binary-only.....")
        result1 = binary_model(text)[0]
        return {
            "is_malicious": result1["label"] == "NEGATIVE",
            "binary_score": round(result1["score"] * 100, 2),
            "threat_type": "unknown",
            "threat_score": 0.0,
            "highlighted_tokens": extract_keywords(text),
        }

    elif mode == "multi-only":
        print("########RUNNING multi-only.....")
        result2 = multi_model(text, candidate_labels=CATEGORIES)
        return {
            "is_malicious": True,  # assume true if a threat type is predicted
            "binary_score": None,
            "threat_type": result2["labels"][0],
            "threat_score": round(result2["scores"][0] * 100, 2),
            "highlighted_tokens": extract_keywords(text),
        }

    else:  # hybrid mode
        print("########RUNNING hybrid.....")
        result1 = binary_model(text)[0]
        result2 = multi_model(text, candidate_labels=CATEGORIES)
        return {
            "is_malicious": result1["label"] == "NEGATIVE",
            "binary_score": round(result1["score"] * 100, 2),
            "threat_type": result2["labels"][0],
            "threat_score": round(result2["scores"][0] * 100, 2),
            "highlighted_tokens": extract_keywords(text),
        }

def extract_keywords(text: str) -> list:
    # Dummy keyword extractor
    keywords = []
    for word in ["account", "verify", "login", "click", "script"]:
        if word.lower() in text.lower():
            keywords.append(word)
    return keywords
