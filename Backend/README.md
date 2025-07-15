# Lunoa - Backend Service

This directory contains the backend service for the Lunoa platform, built with Node.js, Express, and TypeScript. It handles all API logic, database interactions, and blockchain integration with the Aptos network.

## Core Features

-   **User Management:** Endpoints for user profile creation, updates, and social actions (follow/unfollow).
-   **Quest Management:** API service for creating, verifying, and managing quests.
-   **Blockchain Integration:** Service layer for interacting with the Aptos blockchain, including reward distribution and smart contract calls.
-   **Authentication:** Secure authentication using JWT.
-   **Logging:** Robust logging with Winston.

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   PostgreSQL database

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Tomeku-Development/Lunoa.git
    cd Lunoa/Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in this directory by copying the `.env.example` file. Fill in the required values for the database connection, JWT secret, and Aptos private key.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default: 3000) and will automatically restart on file changes.

### Running Tests

To run the Jest test suite, use the following command:

```bash
npm test
```
