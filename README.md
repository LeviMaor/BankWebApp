# Web Banking Application

This project is a web-based banking application built with Node.js, Express, MongoDB, and React. It provides core banking functionalities like user sign-up, login, money transactions between users, deposits, withdrawals, and viewing user profiles. The application uses JWT-based authentication and stores tokens securely in HTTP-only cookies.

## Features

- **User Registration & Login**
   - New users can sign up with their email, password, and phone number.
   - Existing users can log in using their credentials.
   - Authenticated sessions are managed via JWT tokens stored in HTTP-only cookies.
- **Money Transactions**
   - Users can send money to other registered users.
   - Users can deposit and withdraw money from their accounts.
- **Profile Management**
   - Users can view their account profile and balance.
   - Passwords can be updated.
- **JWT Authentication**
   - Secure authentication using JWT tokens with 7-day expiration.
   - Tokens are stored in HTTP-only cookies for enhanced security.

## Technologies Used

- **Backend:**
   - Node.js
   - Express.js
   - MongoDB + Mongoose
   - JWT for authentication
   - bcrypt for password hashing
- **Frontend:**
   - React.js
   - Axios/Fetch for API calls

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v16+)
- MongoDB (running locally or via a cloud service like MongoDB Atlas)

## Installation

1. Clone the Repository

```bash
git clone https://github.com/your-username/web-banking-app.git
```
