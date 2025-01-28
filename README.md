# ChatMessenger Application

ChatMessenger is a real-time chat application that allows users to register, log in, and communicate with each other in real-time. The application uses Node.js, Express.js, MongoDB, and Socket.io for the backend, and HTML, CSS, and JavaScript for the frontend.

## Features

- Real-time messaging
- User authentication (signup and login)
- Responsive design
- HTTPS support
- MongoDB integration

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.io
- **Security:** bcrypt for password hashing

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/node-chat.git
    cd node-chat
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables:
    Create a [.env](http://_vscodecontentref_/0) file in the root directory and add the following:
    ```env
    PORT=80
    HTTPS_PORT=443
    MONGODB_URI=your_mongodb_connection_string
    ```

4. Place your SSL certificate and key files in the [license](http://_vscodecontentref_/2) directory:

    ```
    /license
    ├── cert.pem
    └── key.pem
    ```

5. Start the server:
    ```sh
    npm start
    ```

5. Open your browser and navigate to `http://localhost:80`.

## Usage

1. **Registration:**
    - Click on the "Sign Up" button.
    - Fill in the registration form with a username and password.
    - Click "Sign Up" to create a new account.

2. **Login:**
    - Click on the "Log In" button.
    - Fill in the login form with your username and password.
    - Click "Log In" to access the chat.

3. **Chat:**
    - Enter your message in the input field at the bottom of the chat window.
    - Click "Send" to send your message.
    - Your message will appear in the chat window along with messages from other users.

## Code Overview

### Backend

- **server.js:** Sets up the Express server, connects to MongoDB, and handles Socket.io events.
- **/backend/mongo.js:** Contains the MongoDB connection logic.

### Frontend

- **index.html:** The main HTML file for the chat interface.
- **login.html:** The HTML file for the login and registration forms.
- **/public/css/style.css:** The main CSS file for styling the application.
- **/public/js/script.js:** The main JavaScript file for handling frontend logic and Socket.io events.
