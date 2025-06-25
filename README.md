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

### 🧪 Testing & Development
- **Seed Data System**: Populate the platform with realistic test data for development and testing
- **Dummy Content**: Pre-populated communities, posts, comments, and users
- **Interactive Testing**: Test all features with realistic data while maintaining full functionality
- **Easy Reset**: Clear all test data with a single click

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

## 🧪 Seed Data for Testing

Open Trellis includes a comprehensive seed data system to help you test and develop the platform with realistic content.

### How to Use Seed Data

1. **Access the Seed Data Panel**:
   - Sign in to the application
   - Navigate to the sidebar and click "Seed Data"
   - Or use the navigation menu to access the seed data panel

2. **Seed the Database**:
   - Click "Seed Dummy Data" to populate the platform
   - This will create:
     - 10 dummy users with realistic names
     - 8 communities across different topics (Startup Founders, Tech News, Web Development, etc.)
     - 15+ posts with engaging content
     - Comments and votes on posts
     - Community memberships

3. **Test Functionality**:
   - All existing functionality remains intact
   - New users can still sign up and interact normally
   - You can post, comment, vote, and join communities
   - The seeded data provides a realistic testing environment

4. **Clear Data**:
   - Click "Clear All Data" to remove all test data
   - This will preserve user authentication but remove all content
   - Use this to reset the platform to a clean state

### What Gets Seeded

- **Communities**: Startup Founders, Tech News, Web Development, Product Design, Remote Work, AI & ML, Freelancing, Indie Hackers
- **Posts**: Realistic content about entrepreneurship, technology, development, design, and business
- **Users**: 10 dummy users with different names and email addresses
- **Interactions**: Comments, votes, and community memberships
- **Content**: Markdown-formatted posts with engaging discussions

### Benefits

- **Realistic Testing**: Test with content that mimics real usage patterns
- **Feature Validation**: Ensure all features work with populated data
- **Performance Testing**: Test performance with realistic data volumes
- **User Experience**: Experience the platform as end users would
- **Development Speed**: No need to manually create test content

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
│   │   ├── SearchBar.tsx   # Search functionality
│   │   └── SeedDataPanel.tsx # Seed data management
│   ├── App.tsx            # Main application component
│   ├── SignInForm.tsx     # Authentication form
│   └── SignOutButton.tsx  # Logout functionality
├── convex/                # Backend API and database
│   ├── auth.ts           # Authentication logic
│   ├── comments.ts       # Comment management
│   ├── communities.ts    # Community operations
│   ├── posts.ts          # Post management
│   ├── schema.ts         # Database schema
│   ├── seedData.ts       # Seed data functions
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
