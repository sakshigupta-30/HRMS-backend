# Advance Payment Module

This module provides functionality for managing advance payments assigned to workers. It allows administrators to create, retrieve, and validate advance payments, ensuring that payments can only be applied for months where the salary has not yet been built.

## Project Structure

```
advance-payment-module
├── controllers
│   └── advancePaymentController.js  # Handles advance payment requests
├── models
│   └── AdvancePayment.js              # Defines the Mongoose schema for advance payments
├── routes
│   └── advancePayments.js              # Sets up routes for advance payment operations
├── middleware
│   └── auth.js                        # Middleware for authentication and authorization
├── package.json                       # Configuration file for npm
└── README.md                          # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd advance-payment-module
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Ensure you have the necessary environment variables set up for database connection and any other configurations required by your application.

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage Guidelines

- **Creating an Advance Payment:**
  - Endpoint: `POST /advance-payments`
  - Body: 
    ```json
    {
      "year": 2023,
      "month": "August",
      "amount": 1000,
      "comments": "Advance for project expenses",
      "workerId": "employee_id_here"
    }
    ```

- **Retrieving Advance Payments:**
  - Endpoint: `GET /advance-payments`
  - Query Parameters: Optional filters can be applied to retrieve specific advance payments.

## Important Notes

- Ensure that advance payments are only created for months where the salary has not yet been built.
- The system checks for uniqueness of advance payments per worker per month.

## License

This project is licensed under the MIT License. See the LICENSE file for details.