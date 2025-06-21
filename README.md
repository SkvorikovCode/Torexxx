# Torexxx AI Terminal

[![GitHub release](https://img.shields.io/github/v/release/SkvorikovCode/Torexxx)](https://github.com/SkvorikovCode/Torexxx/releases/latest)
[![Made with Electron](https://img.shields.io/badge/made%20with-electron-47848f.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)

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

2. **Настройка и запуск фронтенда (React + Electron):**
   ```sh
   # Перейдите в папку frontend
   cd frontend

   # Установите зависимости
   npm install

   # Запустите в режиме разработки (React + Electron)
   npm start
   ```
   *Примечание: для полноценной работы с AI требуется запущенный бэкенд, который не является частью этого open-source репозитория.*

### Сборка приложения

Для сборки десктопного приложения из исходного кода:

```sh
# В директории frontend
npm run pack
```
Собранное приложение появится в папке `frontend/dist-electron`.

## ⚙️ Технологии

- **Frontend:** React, Vite, Electron, Material-UI
- **Сборка:** Electron Builder

---

Создано [SkvorikovCode](https://github.com/SkvorikovCode) 