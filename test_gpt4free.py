import g4f
from typing import List, Dict, Optional

def ask_gpt4free(prompt: str = '', messages: Optional[List[Dict]] = None, model: str = 'gpt-4o-mini') -> str:
    try:
        # model = "qwen-2.5-coder-32b" # Если нужно писать код
        if messages is None:
            messages = [{"role": "user", "content": prompt}]
        response = g4f.ChatCompletion.create(
            model=model,
            messages=messages
        )
        return str(response)
    except Exception as e:
        return f"Ошибка при использовании модели {model}: {str(e)}"

# Рекомендуемые бесплатные и стабильные модели (No auth required):
# - gpt-4o-mini (Blackbox, Chatai, Pollinations, LegacyLMArena)
# - qwen-2.5-coder-32b (LambdaChat, Pollinations, HuggingChat, Together)
# - deepseek-r1 (LambdaChat, Pollinations, DeepInfraChat, Together, LegacyLMArena)
# - llama-3.3-70b (Pollinations, Together, LambdaChat, LegacyLMArena)
# - phi-3-mini (HuggingChat)
# - gemini-1.5-pro (Free2GPT, FreeGpt, TeachAnything, DocsBot, GizAI)
# - gpt-4.1-mini (Blackbox, OIVSCodeSer5, OIVSCodeSer0501, LegacyLMArena)
# - gpt-4o (DocsBot, LegacyLMArena, Copilot, Pollinations, ChatGLM, Yqcloud)

def test_gpt4free():
    prompt = "Привет! Как дела?"
    models = [
        "gpt-4o-mini",
        "qwen-2.5-coder-32b",
        "deepseek-r1",
        "llama-3.3-70b",
        "phi-3-mini",
        "gemini-1.5-pro",
        "gpt-4.1-mini",
        "gpt-4o",
    ]
    for model in models:
        print(f"\nТестируем модель: {model}")
        try:
            response = g4f.ChatCompletion.create(
                model=model,
                messages=[{"role": "user", "content": prompt}]
            )
            print(f"Ответ: {response}")
        except Exception as e:
            print(f"Ошибка при использовании модели {model}: {str(e)}")

if __name__ == "__main__":
    test_gpt4free() 