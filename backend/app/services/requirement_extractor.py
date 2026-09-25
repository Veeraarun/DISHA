import re

def calculate_confidence(requirements: dict) -> float:
    score = 0

    if requirements["product"]:
        score += 40

    if requirements["environment"]:
        score += 15

    if requirements["safety"]:
        score += 15

    if requirements["protection"]:
        score += 15

    if requirements["testing"]:
        score += 15

    return min(score, 100)


def extract_requirements(text: str) -> dict:
    normalized = text.lower()

    requirements = {
        "product": None,
        "environment": [],
        "safety": [],
        "protection": [],
        "testing": [],
        "technical_terms": [],
    }

    # Product detection
    product_patterns = [
        "led street lighting",
        "street lighting",
        "led lighting",
        "lighting system",
        "luminaire",
    ]

    for pattern in product_patterns:
        if pattern in normalized:
            requirements["product"] = pattern
            break

    # Environment
    if "outdoor" in normalized:
        requirements["environment"].append("outdoor")

    if "indoor" in normalized:
        requirements["environment"].append("indoor")

    # Safety
    if "electrical safety" in normalized:
        requirements["safety"].append("electrical safety")
    elif "safety" in normalized:
        requirements["safety"].append("safety")

    # Protection
    if "ingress protection" in normalized:
        requirements["protection"].append("ingress protection")

    ip_matches = re.findall(r"\bIP\s*\d{2}\b", text, re.IGNORECASE)

    for match in ip_matches:
        requirements["protection"].append(match.upper())

    # Testing
    if "testing" in normalized:
        requirements["testing"].append("testing")

    if "performance test" in normalized:
        requirements["testing"].append("performance testing")

    # Technical terms
    technical_terms = [
        "voltage",
        "current",
        "power",
        "watt",
        "wattage",
        "efficiency",
        "lumens",
        "illumination",
        "ip65",
        "ip66",
    ]

    for term in technical_terms:
        if term in normalized:
            requirements["technical_terms"].append(term)

    return requirements