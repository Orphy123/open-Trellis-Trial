# Open Trellis - Community Discussion Platform

A modern, full-stack community discussion platform built for entrepreneurs, builders, and creators. Open Trellis provides a Reddit-style experience with real-time interactions, community management, and content discovery.

## 🌟 Features

### 🔐 User Authentication
- **Anonymous Sign-in**: Quick and easy authentication system
- **User Profiles**: Personalized experience with user-specific data
- **Session Management**: Secure login/logout functionality

### 🏘️ Community Management
- **Create Communities**: Build your own discussion spaces with custom names and descriptions
- **Community Discovery**: Browse and join existing communities
- **Member Management**: Track community membership and engagement
- **Public/Private Communities**: Control who can access your community content

### 📝 Content Creation & Sharing
- **Multiple Post Types**:
  - **Text Posts**: Share thoughts, stories, and discussions
  - **Link Posts**: Share external articles, videos, and resources
  - **Image Posts**: Upload and share visual content
- **Rich Content Support**: Markdown-style text formatting
- **Media Upload**: Image storage and management

### 💬 Discussion System
- **Nested Comments**: Multi-level threaded discussions
- **Real-time Updates**: Live comment updates and interactions
- **Comment Voting**: Upvote and downvote comments
- **Reply System**: Respond to specific comments with threaded conversations

### ⬆️ Voting & Engagement
- **Post Voting**: Upvote and downvote posts to surface quality content
- **Comment Voting**: Rate individual comments
- **Score Calculation**: Automatic scoring based on votes and time
- **Hot/New/Top Sorting**: Multiple ways to discover content

### 🔍 Search & Discovery
- **Global Search**: Search across all communities and posts
- **Community Search**: Find specific communities by name
- **Post Search**: Discover posts by title and content
- **Real-time Results**: Instant search suggestions

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, modern interface with Tailwind CSS
- **Intuitive Navigation**: Easy-to-use interface with clear navigation
- **Loading States**: Smooth user experience with loading indicators

### 🚀 Performance Features
- **Real-time Updates**: Live data synchronization
- **Optimistic UI**: Instant feedback for user actions
- **Efficient Caching**: Smart data management for fast performance
- **Scalable Architecture**: Built to handle growing communities

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server
- **Lucide React**: Beautiful icon library
- **Date-fns**: Date formatting and manipulation

### Backend
- **Real-time Database**: Live data synchronization
- **Authentication System**: Secure user management
- **File Storage**: Image and media upload capabilities
- **Search Engine**: Full-text search across content
- **API Layer**: RESTful and real-time APIs

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Hot Reload**: Instant development feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Orphy123/open-Trellis-Trial.git
   cd open-Trellis-Trial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

### Development Scripts

- `npm run dev` - Start both frontend and backend development servers
- `npm run dev:frontend` - Start only the frontend development server
- `npm run dev:backend` - Start only the backend development server
- `npm run lint` - Run TypeScript and linting checks
- `npm run build` - Build the application for production

## 📁 Project Structure

```
open-Trellis-Trial/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── CommentList.tsx # Comment display and interaction
│   │   ├── CommunityList.tsx # Community browsing
│   │   ├── CreateCommunity.tsx # Community creation
│   │   ├── CreatePost.tsx  # Post creation forms
│   │   ├── PostDetail.tsx  # Individual post view
│   │   ├── PostList.tsx    # Post listing and voting
│   │   └── SearchBar.tsx   # Search functionality
│   ├── App.tsx            # Main application component
│   ├── SignInForm.tsx     # Authentication form
│   └── SignOutButton.tsx  # Logout functionality
├── convex/                # Backend API and database
│   ├── auth.ts           # Authentication logic
│   ├── comments.ts       # Comment management
│   ├── communities.ts    # Community operations
│   ├── posts.ts          # Post management
│   ├── schema.ts         # Database schema
│   └── router.ts         # API routing
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎯 Use Cases

### For Entrepreneurs
- **Market Research**: Create communities around your industry
- **Customer Feedback**: Gather insights from your target audience
- **Networking**: Connect with other entrepreneurs and investors

### For Builders & Developers
- **Technical Discussions**: Share code, tutorials, and technical insights
- **Project Showcases**: Display your work and get feedback
- **Community Building**: Create spaces for specific technologies

### For Content Creators
- **Content Sharing**: Share articles, videos, and creative work
- **Audience Engagement**: Build communities around your content
- **Collaboration**: Find collaborators and partners

## 🔧 Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying `tailwind.config.js` for theme changes
- Updating component classes in the React components
- Adding custom CSS in `src/index.css`

### Features
Extend the application by:
- Adding new post types (video, audio, etc.)
- Implementing user profiles and avatars
- Adding moderation tools for community creators
- Creating notification systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the GitHub repository
2. Create a new issue with detailed information
3. Join our community discussions for help

---

**Open Trellis** - Building better communities, one discussion at a time. 🚀
