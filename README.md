# Campus Connect

Campus Connect is a comprehensive platform designed to bridge the gap between junior and senior students in educational institutions. It facilitates mentorship, knowledge sharing, and community building through various interactive features.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [User Guide](#user-guide)
  - [Student Registration and Login](#student-registration-and-login)
  - [Admin Login](#admin-login)
  - [Connect with Seniors](#connect-with-seniors)
  - [Group Chat](#group-chat)
  - [Experiences](#experiences)
  - [Events](#events)
  - [Profile Management](#profile-management)
- [Admin Guide](#admin-guide)
  - [Student Management](#student-management)
  - [Event Management](#event-management)
- [Technical Features](#technical-features)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Students

- **Connect with Seniors**: Junior students can browse and connect with senior students for mentorship and guidance.
- **Personal Chat**: Direct messaging system for one-on-one communication between students.
- **Group Chat**: Community forums where students can discuss topics, ask questions, and share knowledge.
- **Experiences**: Platform for seniors to share their experiences, internship stories, and career advice.
- **Events**: Information about upcoming campus events, workshops, and activities.
- **Profile Management**: Customize your profile with academic information, interests, and profile pictures.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing in any environment.

### For Administrators

- **Student Management**: Add, edit, and manage student accounts.
- **Event Management**: Create and manage campus events.
- **Dashboard**: Overview of platform activities and user statistics.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB (v4.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect
   ```

2. Install dependencies for both client and server:
   ```bash
   # Install client dependencies
   npm install

   # Navigate to server directory
   cd server

   # Install server dependencies
   npm install
   ```


### Running the Application

1. Start the server:
   ```bash
   # In the server directory
   npm start
   ```

2. Start the client:
   ```bash
   # In the root directory
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## User Guide

### Student Registration and Login

1. **Registration**:
   - Navigate to the registration page by clicking "Register" in the navigation bar.
   - Fill in your details including registration number, name, email, branch, year, and section.
   - Submit the form to create your account.
   - Your initial password will be your registration number.

2. **Login**:
   - Navigate to the login page by clicking "Login" in the navigation bar.
   - Enter your registration number and password.
   - Click "Login" to access your account.

### Admin Login

1. Navigate to the admin login page by clicking "Admin" in the navigation bar.
2. Enter your admin credentials.
3. Click "Login" to access the admin dashboard.

### Connect with Seniors

1. Navigate to the "Connect with Seniors" page from the menu.
2. Browse the list of senior students.
3. Click on a senior's profile to view more details.
4. Click "Connect" to initiate a conversation.

### Group Chat

1. Navigate to the "Group Chat" page from the menu.
2. View ongoing discussions and participate by sending messages.
3. Share knowledge, ask questions, and engage with the community.

### Experiences

1. Navigate to the "Experiences" page from the menu.
2. Browse through experiences shared by senior students.
3. Click on an experience to read the full story.
4. If you're a senior, you can share your own experiences by clicking "Share Experience".

### Events

1. Navigate to the "Events" page from the menu.
2. View upcoming and past campus events.
3. Filter events by category, status, or search for specific events.
4. Click on an event to view detailed information.

### Profile Management

1. Click on your profile icon in the top-right corner.
2. Select "Your Profile" from the dropdown menu.
3. Edit your profile information, change your password, or update your profile picture.

## Admin Guide

### Student Management

1. Navigate to the "Admin Dashboard" from the admin menu.
2. View the list of all students.
3. Add new students by clicking "Add New Student".
4. Edit or delete existing student accounts as needed.

### Event Management

1. Navigate to "Manage Events" from the admin menu.
2. View all campus events.
3. Add new events by clicking "Add New Event".
4. Edit or delete existing events as needed.

## Technical Features

- **React + Vite**: Modern frontend framework for fast development and optimal performance.
- **Node.js + Express**: Robust backend API for handling requests and business logic.
- **MongoDB**: NoSQL database for flexible data storage.
- **JWT Authentication**: Secure user authentication and authorization.
- **Responsive Design**: Mobile-friendly interface that works on all devices.
- **Dark Mode**: Toggle between light and dark themes.
- **Real-time Chat**: Instant messaging capabilities for personal and group chats.
- **File Uploads**: Support for profile pictures and event images.

## Contributing

We welcome contributions to Campus Connect! Please follow these steps to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
