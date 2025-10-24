import pandas as pd
import json

# Load Excel file
df = pd.read_excel("full/questions_with_tips.xlsx")

# Convert each row into a JSON object
result = []
for _, row in df.iterrows():
    # Split multiline tips into a list
    tips = [tip.strip() for tip in row['exam_tips'].split('\n') if tip.strip()]
    result.append({
        "domain": row['domain'],
        "exam_tips": tips
    })

# Save JSON to file
with open("flashcards/study_notes.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("JSON file created successfully!")
