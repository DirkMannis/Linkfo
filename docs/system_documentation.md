# Linkfo System Documentation

## System Overview

Linkfo is a platform that combines a Linktree alternative with an AI agent persona system. It allows users to create an automated agent based on their online identity and provides a clean interface for displaying their links alongside a chat interface.

The system consists of three main components:
1. **Data Collection Module**: Gathers content from social media platforms and websites
2. **Persona Learning Module**: Analyzes collected data to understand the user's persona
3. **Frontend Interface**: Displays user links and provides chat functionality

## Architecture

### Backend Architecture

The backend is built with Node.js and Express, with Python modules for data collection and persona learning. It follows a modular architecture with the following components:

- **API Server**: Express.js server that handles HTTP requests
- **Authentication**: JWT-based authentication system
- **Data Collection**: Python modules for collecting data from social media and websites
- **Persona Learning**: Python modules for analyzing data and creating persona models
- **Database**: MongoDB for storing user data, links, and persona models

### Frontend Architecture

The frontend is built with React and Next.js, using Chakra UI for styling. It follows a component-based architecture with the following main sections:

- **Public Pages**: Home page, features, pricing
- **User Dashboard**: Link management, content source management, persona settings
- **Chat Interface**: Interactive chat widget for engaging with the AI agent

## Data Flow

1. **User Registration/Login**: Users create an account or log in
2. **Content Source Connection**: Users connect their social media accounts and websites
3. **Data Collection**: System collects content from connected sources
4. **Persona Learning**: System analyzes collected data to create a persona model
5. **Link Management**: Users add and manage their links
6. **Public Profile**: System displays user links and chat interface to visitors
7. **Chat Interaction**: Visitors interact with the AI agent based on the persona model

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user

### Users

- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `GET /api/users/stats`: Get user statistics

### Links

- `GET /api/links`: Get all links for a user
- `POST /api/links`: Add a new link
- `PUT /api/links/:id`: Update an existing link
- `DELETE /api/links/:id`: Delete a link

### Persona

- `GET /api/persona`: Get persona model
- `POST /api/persona/update`: Update persona model
- `GET /api/persona/sources`: Get content sources
- `POST /api/persona/sources`: Add content source

### Chat

- `GET /api/chat/history`: Get chat history
- `POST /api/chat/message`: Send message to AI agent

## Database Schema

### Users Collection

```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "bio": "string",
  "profileImage": "string (URL)",
  "created_at": "date",
  "updated_at": "date"
}
