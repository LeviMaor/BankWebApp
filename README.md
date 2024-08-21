Web Banking Application

This project is a web-based banking application built with Node.js, Express, MongoDB, and React. It provides core banking functionalities like user sign-up, login, money transactions between users, deposits, withdrawals, and viewing user profiles. The application uses JWT-based authentication and stores tokens securely in HTTP-only cookies.
Features

    User Registration & Login
        New users can sign up with their email, password, and phone number.
        Existing users can log in using their credentials.
        Authenticated sessions are managed via JWT tokens stored in HTTP-only cookies.

    Money Transactions
        Users can send money to other registered users.
        Users can deposit and withdraw money from their accounts.

    Profile Management
        Users can view their account profile and balance.
        Passwords can be updated.

    JWT Authentication
        Secure authentication using JWT tokens with 7-day expiration.
        Tokens are stored in HTTP-only cookies for enhanced security.

Technologies Used

    Backend:
        Node.js
        Express.js
        MongoDB + Mongoose
        JWT for authentication
        bcrypt for password hashing

    Frontend:
        React.js
        Axios/Fetch for API calls

Prerequisites

Before running this project, ensure you have the following installed:

    Node.js (v16+)
    MongoDB (running locally or via a cloud service like MongoDB Atlas)

Installation
1. Clone the Repository

bash

git clone https://github.com/yourusername/bankproject.git
cd bankproject

2. Install Dependencies

bash

npm install

3. Set Up Environment Variables

Create a .env file in the root of the project with the following environment variables:

env

PORT=3500
MONGO_URI=yourMongoDBConnectionString
ACCESS_TOKEN_SECRET=yourSecretKey

    PORT: The port on which your application will run. The default is set to 3500.
    MONGO_URI: The connection string for your MongoDB instance. This is where your application will store user data, transactions, etc.
    ACCESS_TOKEN_SECRET: A secret key used to sign and verify JWT tokens. This should be a long, random string for security.

How to Generate ACCESS_TOKEN_SECRET

To generate a secure secret key, run the following command in your terminal:

bash

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Copy the generated string and set it as the value for ACCESS_TOKEN_SECRET in your .env file.
4. Run the Server

bash

npm start

The server will start on the port defined in the .env file (default: 3500).
API Routes
Authentication Routes

    POST /auth/signup: Create a new user.
    POST /auth/login: Login and get a JWT.
    POST /auth/logout: Logout and clear the JWT cookie.

User Routes

    GET /users/profile: Get the profile information of the authenticated user.
    PATCH /users/update: Update user password.

Transaction Routes

    GET /transactions: Get all transactions related to the authenticated user.
    POST /transactions/deposit: Deposit money into the user's account.
    POST /transactions/withdraw: Withdraw money from the user's account.
    POST /transactions/new: Create a new transaction between two users.

Error Handling

All endpoints include robust error handling and will return appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).
Contributing

Feel free to fork this project, submit issues, and contribute by making pull requests.
