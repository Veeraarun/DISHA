import json
import re
from pathlib import Path


DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "standards.json"
)


def load_standards():
    """
    Load prototype standards from the local knowledge base.
    """
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def normalize(text: str) -> str:
    """
    Normalize text for deterministic prototype matching.
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def get_matched_keywords(
    text: str,
    standard: dict,
) -> list:
    """
    Identify keywords from the standard that appear
    in the procurement specification.
    """

    normalized_text = normalize(text)

    matched = []

    for keyword in standard.get("keywords", []):
        normalized_keyword = normalize(keyword)

        if normalized_keyword in normalized_text:
            matched.append(keyword)

    return matched


def get_keyword_weights(
    standard: dict,
) -> dict:
    """
    Return configured keyword weights.

    If a keyword does not have an explicit weight,
    a default weight of 1 is used.
    """

    configured_weights = standard.get(
        "keyword_weights",
        {},
    )

    weights = {}

    for keyword in standard.get("keywords", []):
        weights[keyword] = configured_weights.get(
            keyword,
            1,
        )

    return weights


def calculate_weighted_match(
    standard: dict,
    matched_keywords: list,
) -> tuple:
    """
    Calculate the raw weighted match.

    Returns:
        matched_weight
        total_weight
    """

    weights = get_keyword_weights(standard)

    matched_weight = sum(
        weights.get(keyword, 1)
        for keyword in matched_keywords
    )

    total_weight = sum(
        weights.values()
    )

    return matched_weight, total_weight


def calculate_relevance_score(
    standard: dict,
    matched_keywords: list,
) -> float:
    """
    Calculate a prototype relevance score.

    The score represents weighted keyword coverage
    within the prototype knowledge-base record.

    This is NOT an official BIS scoring methodology.
    """

    if not matched_keywords:
        return 0.0

    matched_weight, total_weight = (
        calculate_weighted_match(
            standard,
            matched_keywords,
        )
    )

    if total_weight == 0:
        return 0.0

    score = (
        matched_weight
        / total_weight
    ) * 100

    return round(score, 2)


def determine_match_strength(
    score: float,
    matched_keywords: list,
) -> str:
    """
    Convert the prototype relevance score into
    an easy-to-understand evidence strength.

    Thresholds are prototype heuristics.
    """

    if not matched_keywords:
        return "NONE"

    if score >= 50:
        return "HIGH"

    if score >= 25:
        return "MEDIUM"

    return "LOW"


def build_match_evidence(
    standard: dict,
    matched_keywords: list,
    score: float,
) -> dict:
    """
    Build transparent evidence explaining how
    the prototype recommendation was produced.
    """

    weights = get_keyword_weights(
        standard
    )

    matched_weight = sum(
        weights.get(keyword, 1)
        for keyword in matched_keywords
    )

    total_weight = sum(
        weights.values()
    )

    unmatched_keywords = [
        keyword
        for keyword in standard.get(
            "keywords",
            [],
        )
        if keyword not in matched_keywords
    ]

    return {
        "matched_terms": matched_keywords,
        "unmatched_terms": unmatched_keywords,
        "weighted_match": matched_weight,
        "total_weight": total_weight,
        "match_strength": determine_match_strength(
            score,
            matched_keywords,
        ),
    }


def classify_recommendation(
    standard: dict,
    matched_keywords: list,
):
    """
    Classify the recommendation into:

    primary
    supporting
    testing
    """

    standard_id = standard["standard_id"]
    category = standard.get(
        "category",
        "",
    ).lower()

    # Testing-related standards
    if (
        "test" in category
        or "testing" in category
        or "test" in standard_id.lower()
    ):
        return "testing"

    # Safety / protection / environmental standards
    if any(
        word in category
        for word in [
            "safety",
            "protection",
            "environment",
        ]
    ):
        return "supporting"

    # Standards with multiple matching terms
    if len(matched_keywords) >= 2:
        return "primary"

    return "supporting"


def generate_reason(
    standard: dict,
    matched_keywords: list,
    recommendation_type: str,
) -> str:
    """
    Generate a deterministic explanation for
    why the prototype engine recommended
    the standard.
    """

    title = standard["title"]

    if recommendation_type == "primary":

        if matched_keywords:
            keywords = ", ".join(
                matched_keywords[:4]
            )

            return (
                f"{title} is directly relevant to the core "
                f"procurement requirement. Matching terms include: "
                f"{keywords}."
            )

        return (
            f"{title} is directly associated with the main "
            f"procurement requirement."
        )

    if recommendation_type == "testing":

        if matched_keywords:
            keywords = ", ".join(
                matched_keywords[:4]
            )

            return (
                f"{title} is relevant to the testing and "
                f"verification requirements identified in the "
                f"specification. Matching terms include: "
                f"{keywords}."
            )

        return (
            f"{title} is associated with testing and verification "
            f"requirements."
        )

    if matched_keywords:

        keywords = ", ".join(
            matched_keywords[:4]
        )

        return (
            f"{title} addresses an additional requirement in the "
            f"specification. Matching terms include: "
            f"{keywords}."
        )

    return (
        f"{title} addresses an additional procurement requirement."
    )


def recommend_standards(text: str):
    """
    Recommend applicable prototype standards.

    The engine currently uses deterministic weighted
    keyword matching. The verified knowledge base
    remains the source of recommendation evidence.
    """

    standards = load_standards()

    candidates = []

    for standard in standards:

        matched_keywords = get_matched_keywords(
            text,
            standard,
        )

        # Ignore standards with no matching evidence.
        if not matched_keywords:
            continue

        score = calculate_relevance_score(
            standard,
            matched_keywords,
        )

        recommendation_type = (
            classify_recommendation(
                standard,
                matched_keywords,
            )
        )

        reason = generate_reason(
            standard,
            matched_keywords,
            recommendation_type,
        )

        match_evidence = build_match_evidence(
            standard,
            matched_keywords,
            score,
        )

        candidates.append(
            {
                "standard_id": standard["standard_id"],
                "title": standard["title"],
                "year": standard["year"],
                "status": standard["status"],
                "category": standard["category"],
                "relevance_score": score,
                "description": standard["description"],
                "recommendation_type": recommendation_type,
                "reason": reason,
                "matched_keywords": matched_keywords,
                "match_evidence": match_evidence,
                "clauses": standard.get(
                    "clauses",
                    [],
                ),
                "related_standards": standard.get(
                    "related_standards",
                    [],
                ),
            }
        )

    # Recommendation category ordering.
    type_order = {
        "primary": 0,
        "supporting": 1,
        "testing": 2,
    }

    candidates.sort(
        key=lambda item: (
            type_order.get(
                item["recommendation_type"],
                99,
            ),
            -item["relevance_score"],
        )
    )

    return candidates