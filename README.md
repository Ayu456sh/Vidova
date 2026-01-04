# Vidova (SafeStream) 🎥

Vidova (SafeStream) is a full-stack video content management application powered by **Google Gemini AI**. It allows users to upload videos, automatically analyzes them for sensitive content (NSFW/Violence) using AI, and provides detailed feedback on content safety.

## 🚀 Features

-   **User Authentication**: Secure JWT-based authentication with Login and Registration.
-   **Role-Based Access Control (RBAC)**:
    -   **Viewer**: Read-only access to videos.
    -   **Editor**: Can upload and manage videos.
    -   **Admin**: Full system access.
-   **AI Video Analysis**: Integrates **Google Gemini 2.0 Flash** to analyze video content frame-by-frame for safety compliance.
-   **Real-Time Assessment**: Uses Socket.io to provide instant feedback on video analysis status.
-   **User Isolation**: Strict data segregation ensures users only see their own content.
-   **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium, glassmorphism-inspired aesthetic.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios.
-   **Backend**: Node.js, Express.js, Socket.io.
-   **Database**: MongoDB (Mongoose Schema).
-   **AI Engine**: Google Generative AI (Gemini 2.0 Flash).
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Ayu456sh/Vidova.git
    cd Vidova
    ```

2.  **Install Dependencies:**

    *Server:*
    ```bash
    cd server
    npm install
    ```

    *Client:*
    ```bash
    cd ../client
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the `server` directory:
    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

4.  **Run the Application:**

    *Start Backend (Port 5001):*
    ```bash
    cd server
    npm start
    ```

    *Start Frontend:*
    ```bash
    cd client
    npm run dev
    ```

## 🛡️ API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login user | Public |
| `GET` | `/api/videos` | Get user's videos | Private |
| `POST` | `/api/videos/upload` | Upload video for analysis | Private (Editor+) |
| `GET` | `/api/videos/stream/:id` | Stream video content | Public |

## 🤝 License

This project is licensed under the MIT License.
