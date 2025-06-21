# Torexxx AI Terminal

[![GitHub release](https://img.shields.io/github/v/release/SkvorikovCode/Torexxx)](https://github.com/SkvorikovCode/Torexxx/releases/latest)
[![Made with Electron](https://img.shields.io/badge/made%20with-electron-47848f.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![FastAPI](https.img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)

AI-ассистент нового поколения для терминала. Мощь нейросетей, премиум-UI и мгновенное выполнение команд — всё в одном приложении.

<p align="center">
  <img src="./docs/screenshot.png" alt="Скриншот интерфейса" width="700"/>
</p>

## 🚀 Установка

Скачайте последнюю версию приложения со [страницы релизов](https://github.com/SkvorikovCode/Torexxx/releases/latest).

- **macOS**: `Torexxx-X.X.X-arm64.dmg` или `Torexxx-X.X.X-x64.dmg`
- **Windows**: `Torexxx-Setup-X.X.X.exe`
- **Linux**: `Torexxx-X.X.X.AppImage`

*Замените `X.X.X` на актуальную версию релиза.*

## 🛠️ Для разработчиков

### Запуск проекта

1. **Клонируйте репозиторий:**
   ```sh
   git clone https://github.com/SkvorikovCode/Torexxx.git
   cd Torexxx
   ```

2. **Настройка бэкенда (FastAPI):**
   ```sh
   # Перейдите в папку backend
   cd backend

   # Создайте и активируйте виртуальное окружение
   python3 -m venv venv
   source venv/bin/activate  # Для macOS/Linux
   # venv\Scripts\activate   # Для Windows

   # Установите зависимости
   pip install -r requirements.txt

   # Запустите бэкенд
   uvicorn main:app --reload
   ```
   Бэкенд будет доступен по адресу `http://127.0.0.1:8000`.

3. **Настройка фронтенда (React + Electron):**
   ```sh
   # Откройте новый терминал и перейдите в папку frontend
   cd frontend

   # Установите зависимости
   npm install

   # Запустите в режиме разработки (React + Electron)
   npm start
   ```

### Сборка приложения

Для сборки десктопного приложения из исходного кода:

```sh
# В директории frontend
npm run pack
```
Собранное приложение появится в папке `frontend/dist-electron`.

## ⚙️ Технологии

- **Frontend:** React, Vite, Electron, Material-UI
- **Backend:** FastAPI
- **AI Core:** g4f
- **База данных:** MongoDB (для пользователей)
- **Сборка:** Electron Builder

---

Создано [SkvorikovCode](https://github.com/SkvorikovCode) 