import json
import time
from openai import OpenAI

client = OpenAI()

INPUT_FILE = "questions.json"   # input JSON file with questions
OUTPUT_FILE = "saa_flashcards.json"

# Meta info for the flashcard set
FLASHCARD_META = {
    "id": "saa-c03",
    "title": "AWS Solutions Architect Associate",
    "description": "Key concepts and services for AWS SAA-C03 certification",
    "totalCards": 50,
    "category": "AWS",
    "difficulty": "Associate",
}


def generate_flashcard(question_obj, idx):
    """Generate flashcard front/back using OpenAI API"""
    question_text = question_obj["question"]
    options = question_obj["options"]
    correct_idx = question_obj["correctAnswer"][0]
    correct_option = options[correct_idx]
    domain = question_obj.get("domain", "General AWS Concepts")
    explanation = question_obj.get("explanation", "")

    prompt = f"""
You are creating AWS certification flashcards.

Question:
{question_text}

Correct Answer:
{correct_option}

Explanation:
{explanation}

Generate a flashcard in this structure:
Front: a short, engaging flashcard question (can start with '🧠 What does this mean?' or similar) using markdown and emojis if possible.
Back: a short, clear explanation or answer derived from the correct option.

Return only JSON like:
{{
  "front": "<front text>",
  "back": "<back text>"
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",  # use GPT-4o-mini for efficiency
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    try:
        flashcard_json = json.loads(response.choices[0].message.content)
    except Exception:
        # fallback: if not valid JSON, wrap text manually
        flashcard_json = {
            "front": f"🧠 {question_text.strip()}",
            "back": correct_option,
        }

    # Add structured metadata
    flashcard = {
        "id": str(idx + 1),
        "front": flashcard_json["front"],
        "back": flashcard_json["back"],
        "category": domain.replace("Domain ", "").strip(),
        "difficulty": "Medium",
        "tags": [domain.split(":")[-1].strip()],
        "explanation": f"This concept belongs to {domain} and is commonly tested in the SAA-C03 exam.",
    }

    return flashcard


def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        questions = json.load(f)

    flashcards = []
    for idx, q in enumerate(questions[:100]):  # only first 100 questions
        print(f"Processing question {idx + 1}/{len(questions)}: {q['id']}")
        try:
            flashcard = generate_flashcard(q, idx)
            flashcards.append(flashcard)
        except Exception as e:
            print(f"⚠️ Error generating flashcard {q['id']}: {e}")
        time.sleep(1)  # small delay to respect API limits

    # Final output structure
    output = {"saa-c03": {**FLASHCARD_META, "flashcards": flashcards}}

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Generated {len(flashcards)} flashcards and saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
