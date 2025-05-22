from models.hybrid_model import classify_input

# List of sample inputs with mixed threats
test_inputs = [
    "Click here to verify your account or it will be suspended.",          # Phishing
    "You won a free iPhone! Claim your prize now!",                        # Spam
    "<script>alert('XSS');</script> This is a test.",                      # HTML Injection
    "Hey, can we meet tomorrow at 5pm?",                                   # Safe
    "Login now to update your banking credentials immediately."            # Phishing
]

# Run each input through the hybrid model
for idx, text in enumerate(test_inputs, start=1):
    result = classify_input(text)
    print(f"\nTest #{idx}")
    print(f"Input: {text}")
    print(f"Malicious: {result['is_malicious']}")
    print(f"Threat Type: {result['threat_type']}")
    print(f"Binary Confidence: {result['binary_score']}%")
    print(f"Threat Confidence: {result['threat_score']}%")
    print(f"Highlighted Tokens: {result['highlighted_tokens']}")
