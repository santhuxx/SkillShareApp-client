# SkillShare App Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

A modern, responsive frontend for the SkillShare platform, enabling users to share knowledge, create and manage posts with multimedia, interact through comments, likes, and direct messaging, and build personalized learning plans.

## Features

- **User Authentication**: Seamless OAuth2 login/logout with Google and GitHub.
- **Post Management**: Create, edit, view, and delete posts with image and video uploads.
- **Social Interactions**: Add comments, like posts, and message other users.
- **Messaging**: Direct messaging between users with chat session management.
- **Learning Plans**: Create and manage personalized learning plans.
- **Media Support**: Upload and display images and videos.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **RESTful API Integration**: Communicates with the SkillShare backend API.

## Tech Stack

- **React**: JavaScript library for building user interfaces.
- **Vite**: Fast build tool and development server.
- **Material-UI (MUI)**: Component library for responsive UI design.
- **Axios**: HTTP client for API requests.
- **React Router**: Client-side routing.
- **JavaScript (ES6+)**: Modern JavaScript for development.

## Prerequisites

- Node.js 16 or higher
- npm 8 or higher
- SkillShare backend server running at `http://localhost:8080`
- OAuth2 credentials configured in the backend

## Getting Started

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/santhuxx/SkillShareApp-client.git
   cd SkillShareApp-client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the backend API URL:
   ```plaintext
   VITE_API_URL=http://localhost:8080
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173`.

5. **Build for production**:
   ```bash
   npm run build
   ```

   The production-ready files will be in the `dist` directory. Serve them using a static server (e.g., `npm run preview`).

## Key Components

### Pages
- **Home**: Displays all posts.
- **MyPosts**: Lists user’s posts with edit/delete options.
- **PostDetails**: Shows post details, comments, and likes.
- **Messages**: Manages user-to-user messaging and chat sessions.
- **LearningPlans**: Manages user’s learning plans.
- **Login**: Handles OAuth2 authentication.

### Components
- **EditPost**: Form for creating/editing posts with multimedia uploads.
- **PostCard**: Displays individual post summaries.
- **CommentSection**: Manages comments for a post.
- **LikeButton**: Toggles like status for a post.
- **Chat**: Displays messaging interface for user conversations.
- **AuthButton**: Handles login/logout actions.

### Services
- **api.js**: Axios instance for making API requests to the backend.

## Environment Variables

Create a `.env` file in the root directory with:

```plaintext
VITE_API_URL=http://localhost:8080
```

- `VITE_API_URL`: URL of the SkillShare backend server. Update if the backend runs on a different host/port.

## API Integration

The frontend communicates with the backend via RESTful API endpoints. Ensure the backend is running and configured with OAuth2 and Firebase. Key endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/logout`
- **Posts**: `/api/posts`, `/api/posts/{postId}`, `/api/posts/all`
- **Comments**: `/api/comments/post/{postId}`, `/api/comments/{commentId}`
- **Likes**: `/api/likes/{postId}`, `/api/likes/{postId}/status`
- **Messages**: `/messages`, `/messages/{messageId}`, `/chat_sessions`
- **Learning Plans**: `/api/learning/plans`, `/api/learning/plans/{planId}`

## Testing

Run tests with:

```bash
npm test
```

(Assuming a testing setup with Jest or Vitest. Add testing dependencies and scripts if needed.)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for sharing skills and knowledge
