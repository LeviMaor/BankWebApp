# Secure Web Banking Application with Role-Based Access Control (RBAC)

This project is a secure and user-friendly web-based banking application built with modern technologies, featuring robust role-based access control (RBAC).

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT (authentication), bcrypt (password hashing)
- **Frontend**: React.js, Axios/Fetch (API calls)

## Features

The application offers essential banking functionalities for a smooth user experience:

**1. User Registration & Login:**

 - New users can create accounts with email, password, and phone number.
 - Existing users can seamlessly log in using their credentials.
 - Secure authentication is ensured through JWT tokens stored in HTTP-only cookies.
    
**2. Money Transactions:**

 - Users can conveniently send money to other registered users.
 - Deposits and withdrawals from your account are a breeze.
    
**3. Profile Management:**

 - View your updated account profile information and current balance.
 -  Update your password for added security.
    
**4. JWT Authentication:**
   
- Securely authenticate users with JWT tokens that expire after 7 days.
- Enhanced security is achieved by storing tokens in HTTP-only cookies.

## Admin Features
**User Management:**

- View all user information, access specific user transactions, and delete users by ID.

## Technologies Used

This project leverages a robust tech stack to deliver a reliable and scalable application:

### Backend

- Node.js 
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Token)
- bcrypt: A library for secure password hashing.

### Frontend

- React.js
- Axios/Fetch


## Installation

**1. Clone the Repository:**

      git clone https://github.com/yourusername/bankproject.git   


**2. Install Dependencies:**

      npm install

**3. Set Up Environment Variables:**

 Create a file named .env in the root directory of the project. This file will store sensitive information (don't commit it to version control!):

 - **PORT**=serverPort

 - **DATABASE_URI**=yourMongoDBConnectionString

 - **ACCESS_TOKEN_SECRET**=yourSecretKey

 - **ADMIN_TOKEN_SECRET**=adminCreationSecretPassword


 **Explanation:**

  - PORT: The port on which your application will run (default: 3500).
  - DATABASE_URI: The connection string for your MongoDB instance (where user data and transactions are stored).
  - ACCESS_TOKEN_SECRET: A long, random string used to sign and verify JWT tokens. Never share this secret!
  - ADMIN_TOKEN_SECRET= The admin secret password for creating a new admin.

 Generate a Secure Secret Key:

 node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

 Copy the generated string and paste it as the value for ACCESS_TOKEN_SECRET in your .env file.

**4. Run the Server:**

    npm start

 The server will start on the port defined in the .env file (default: 3500).

## API Routes

The application provides well-defined API endpoints for various functionalities:

### Authentication Routes

 - **POST /auth/signup:** Creates a new user account.
 - **POST /auth/signup-admin:** Creates a new admin account.
 - **POST /auth/login:** Logs in a user and returns a JWT token.
 - **POST /auth/logout:** Logs the user out and clears the JWT cookie.

### User Routes

 - **GET /users/profile:** Retrieves the profile information of the currently authenticated user.
 - **PATCH /users/update:** Updates the user's password.

### Transaction Routes

 - **GET /transactions:** Fetches all transactions related to the authenticated user.
 - **POST /transactions/deposit:** Deposits money into the user's account.
 - **POST /transactions/withdraw:** Withdraws money from the user's account.
 - **POST /transactions/new:** Creates a new transaction between two users.
    
### Admin Routes

 - **GET /users/all:** Retrieves information for all registered users.
 - GET **/users/:id:** Accesses specific user's profile by ID.
 - GET **/transactions/:id:** Accesses specific user's transaction history by ID.
 - **DELETE /users/:id:** Deletes a user by ID.
    
### Error Handling

All endpoints include robust error handling and will return appropriate HTTP status codes (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).
