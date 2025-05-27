# Safety Tracker Backend

This is the backend server for the Safety Tracker application, built with Node.js, Express, MongoDB, and Socket.io.

## Features

- User authentication and management
- Device registration and status tracking
- Real-time location tracking
- Emergency contact management
- Alert system for emergencies and device status
- User settings management
- Real-time communication via Socket.io

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update user password

### Devices
- `GET /api/devices` - Get all user devices
- `POST /api/devices` - Create a new device
- `GET /api/devices/:id` - Get a specific device
- `PUT /api/devices/:id` - Update a device
- `DELETE /api/devices/:id` - Delete a device
- `PATCH /api/devices/:id/status` - Update device status
- `PATCH /api/devices/:id/tracking` - Toggle device tracking
- `PATCH /api/devices/:id/audio` - Toggle device audio monitoring

### Locations
- `GET /api/locations/:deviceId` - Get location history for a device
- `GET /api/locations/:deviceId/latest` - Get latest location for a device
- `POST /api/locations/:deviceId` - Add a new location for a device
- `DELETE /api/locations/:deviceId` - Delete location history for a device

### Contacts
- `GET /api/contacts` - Get all user contacts
- `GET /api/contacts/emergency` - Get emergency contacts
- `POST /api/contacts` - Create a new contact
- `GET /api/contacts/:id` - Get a specific contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact
- `PATCH /api/contacts/:id/toggle-emergency` - Toggle emergency status

### Alerts
- `GET /api/alerts` - Get all user alerts
- `GET /api/alerts/device/:deviceId` - Get alerts for a specific device
- `POST /api/alerts` - Create a new alert
- `PUT /api/alerts/:id` - Update an alert (mark as resolved)
- `DELETE /api/alerts/:id` - Delete an alert

### Settings
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
- `PATCH /api/settings/:setting` - Toggle a specific setting
- `POST /api/settings/reset` - Reset settings to default

## Socket.io Events

### Client to Server
- `device:status` - Update device status
- `location:update` - Update device location
- `alert:emergency` - Trigger emergency alert
- `audio:level` - Update audio level

### Server to Client
- `device:status:updated` - Device status updated
- `location:updated` - Location updated
- `alert:new` - New alert created
- `audio:level:updated` - Audio level updated

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables (see `.env.example`)
4. Start the server: `npm start` or `npm run dev` for development

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development, production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `JWT_EXPIRE` - JWT token expiration time
- `SOCKET_CORS_ORIGIN` - CORS origin for Socket.io