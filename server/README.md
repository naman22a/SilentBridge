# 🌉 Silent Bridge Server

## ⚙️ Technologies used

-   📌 NodeJS
-   🚂 Express JS
-   🎉 TypeScript
-   🕸️ Socket.io (Web Sockets)
-   ⚙️ Dotenv - Supports environment variables
-   🦋 Prettier - Opinionated Code Formatter

## 🚶🏻‍♂️ Getting started

```bash
# 1. Clone the repository
$ git clone https://github.com/naman22a/SilentBridge

# 2. Enter your newly-cloned folder.
$ cd SilentBridge/server

# 3. Create Environment variables file.
$ cp .env.example .env

# 4. Install dependencies (preferred: yarn)
$ yarn install

# 5. Setup whisper and ffmpeg
$ pip install openai-whisper

# on windows
$ choco install ffmpeg

# on linux use apt or pacman
# on mac use brew
```

## 🏃🏻‍♂️ Running the app

```bash
# development
$ yarn run dev

# build
$ yarn build

# production
$ yarn run start
```
