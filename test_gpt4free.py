import g4f
from typing import List, Dict, Optional

def ask_gpt4free(prompt: str = '', messages: Optional[List[Dict]] = None) -> str:
    try:
        model = "qwen-2.5-coder-32b"
        if messages is None:
            messages = [{"role": "user", "content": prompt}]
        response = g4f.ChatCompletion.create(
            model=model,
            messages=messages
        )
        return str(response)
    except Exception as e:
        return f"Ошибка при использовании модели {model}: {str(e)}"

def test_gpt4free():
    # Тестовый запрос
    prompt = "Привет! Как дела?"
    
    try:
        # model = "gpt-4o-mini" # Работает
        # model = "deepseek-r1" # Работает
        model = "qwen-2.5-coder-32b" # Работает
        # model = "claude-3.5-sonnet" # Нужен провайдер не blackbox
        
        print(f"\nТестируем модель: {model}")
        
        response = g4f.ChatCompletion.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )
        print(f"Ответ: {response}")
    except Exception as e:
        print(f"Ошибка при использовании модели {model}: {str(e)}")

if __name__ == "__main__":
    test_gpt4free() 