# Web Banking Application

This project is a secure and user-friendly web-based banking application built with modern technologies:

    Backend: Node.js, Express.js, MongoDB (Mongoose), JWT (authentication), bcrypt (password hashing)
    Frontend: React.js, Axios/Fetch (API calls)

## Features

The application offers essential banking functionalities for a smooth user experience:

    User Registration & Login:
        New users can create accounts with email, password, and phone number.
        Existing users can seamlessly log in using their credentials.
        Secure authentication is ensured through JWT tokens stored in HTTP-only cookies.
    Money Transactions:
        Users can conveniently send money to other registered users.
        Deposits and withdrawals from your account are a breeze.
    Profile Management:
        View your updated account profile information and current balance.
        Update your password for added security.
    JWT Authentication:
        Securely authenticate users with JWT tokens that expire after 7 days.
        Enhanced security is achieved by storing tokens in HTTP-only cookies.

## Technologies Used

This project leverages a robust tech stack to deliver a reliable and scalable application:

### Backend

    Node.js 
    Express.js
    MongoDB + Mongoose
    JWT (JSON Web Token)
    bcrypt: A library for secure password hashing.

### Frontend

    React.js
    Axios/Fetch


## Installation

    Clone the Repository:

    git clone https://github.com/yourusername/bankproject.git   


Install Dependencies:

    npm install

Set Up Environment Variables:

    Create a file named .env in the root directory of the project. This file will store sensitive information (don't commit it to version control!):

    PORT=serverPort
    MONGO_URI=yourMongoDBConnectionString
    ACCESS_TOKEN_SECRET=yourSecretKey

    Explanation:

        PORT: The port on which your application will run (default: 3500).
        MONGO_URI: The connection string for your MongoDB instance (where user data and transactions are stored).
        ACCESS_TOKEN_SECRET: A long, random string used to sign and verify JWT tokens. Never share this secret!

    Generate a Secure Secret Key:

    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

    Copy the generated string and paste it as the value for ACCESS_TOKEN_SECRET in your .env file.

Run the Server:

    npm start

    The server will start on the port defined in the .env file (default: 3500).

## API Routes

The application provides well-defined API endpoints for various functionalities:

### Authentication Routes

    POST /auth/signup: Creates a new user account.
    POST /auth/login: Logs in a user and returns a JWT token.
    POST /auth/logout: Logs the user out and clears the JWT cookie.

### User Routes

    GET /users/profile: Retrieves the profile information of the currently authenticated user.
    PATCH /users/update: Updates the user's password.

### Transaction Routes

    GET /transactions: Fetches all transactions related to the authenticated user.
    POST /transactions/deposit: Deposits money into the user's account.
    POST /transactions/withdraw: Withdraws money from the user's account.
    POST /transactions/new: Creates a new transaction between two users.

### Error Handling

All endpoints include robust error handling and will return appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).