# User API

This API provides endpoints for user and dealer registration, login, and user information retrieval.

## Endpoints

### 1. Signup for Users

- **URL:** `/user`
- **Method:** `POST`
- **Description:** Allows users to sign up.
- **Request Body:**
  - `profile` (File): User profile picture (multipart/form-data)
  - `email` (String): User email
  - `location` (String): User location
  - `info` (String): Additional information about the user
  - `password` (String): User password (minimum 6 characters)
- **Validation:**
  - `email`: Must be a valid email address
  - `location`: Must be present
  - `info`: Must be present
  - `password`: Must be at least 6 characters long
- **Response:** 
  - Returns user data if successful, otherwise error message.

### 2. Signup for Dealers

- **URL:** `/dealer`
- **Method:** `POST`
- **Description:** Allows dealers to sign up.
- **Request Body:**
  - `profile` (File): Dealer profile picture (multipart/form-data)
  - `email` (String): Dealer email
  - `location` (String): Dealer location
  - `info` (String): Additional information about the dealer
  - `password` (String): Dealer password (minimum 6 characters)
  - `name` (String): Dealer name (minimum 3 characters)
- **Validation:**
  - `email`: Must be a valid email address
  - `location`: Must be present
  - `info`: Must be present
  - `password`: Must be at least 6 characters long
  - `name`: Must be at least 3 characters long
- **Response:** 
  - Returns dealer data if successful, otherwise error message.

### 3. Login

- **URL:** `/login`
- **Method:** `GET`
- **Description:** Allows users to log in.
- **Query Parameters:**
  - `email` (String): User email
  - `password` (String): User password (minimum 6 characters)
- **Validation:**
  - `email`: Must be a valid email address
  - `password`: Must be at least 6 characters long
- **Response:** 
  - Returns user data if login successful, otherwise error message.

### 4. Get User Information (Requires Authentication)

- **URL:** `/user_dealer`
- **Method:** `GET`
- **Description:** Retrieves user or dealer information.
- **Authorization:** Bearer token required in the request header.
- **Response:** 
  - Returns user or dealer data if authentication successful, otherwise error message.

# Vehicle API

This API provides endpoints for managing vehicles, including adding, viewing, editing, and buying cars, as well as dealing with dealerships and vehicle deals.

## Endpoints

### 1. Add Car (Dealer)

- **URL:** `/dealership/car`
- **Method:** `POST`
- **Description:** Allows dealers to add a new car to their dealership.
- **Request Body:**
  - `car` (File): Image of the car (multipart/form-data)
  - `name` (String): Car name
  - `type` (String): Car type
  - `model` (String): Car model
  - `info` (Object): Additional information about the car (JSON format)
- **Validation:**
  - `name`: Must be present
  - `type`: Must be present
  - `model`: Must be present
  - `info`: Must be an object
- **Response:** 
  - Returns the added car data if successful, otherwise error message.

### 2. View Cars (User and Dealer)

- **URL:** `/cars`
- **Method:** `GET`
- **Description:** Allows users and dealers to view available cars.
- **Response:** 
  - Returns a list of cars.

### 3. View Cars of Specific Dealer

- **URL:** `/cars/dealership`
- **Method:** `GET`
- **Description:** Allows users to view cars of a specific dealer.
- **Response:** 
  - Returns a list of cars belonging to the dealer.

### 4. View Specific Car Details

- **URL:** `/car/:id`
- **Method:** `GET`
- **Description:** Allows users to view details of a specific car.
- **Response:** 
  - Returns details of the specified car.

### 5. Edit Car Detail (Dealer)

- **URL:** `/dealership/car/:id`
- **Method:** `PATCH`
- **Description:** Allows dealers to edit details of a car.
- **Request Body:**
  - `profile` (File): Image of the car (multipart/form-data)
  - `name` (String): Car name
  - `type` (String): Car type
  - `model` (String): Car model
  - `info` (Object): Additional information about the car (JSON format)
  - `pricing` (Number): Pricing of the car (positive integer)
  - `warranty` (Number): Warranty of the car (positive integer)
- **Validation:**
  - Same as adding car validation rules
  - `pricing`: Must be a positive integer
  - `warranty`: Must be a positive integer
- **Response:** 
  - Returns the edited car data if successful, otherwise error message.

### 6. List All Dealers

- **URL:** `/Dealers`
- **Method:** `GET`
- **Description:** Allows users to view a list of all dealers.
- **Response:** 
  - Returns a list of all dealers.

### 7. Buy Car

- **URL:** `/buy/:CarId/:DealerId/:DealId`
- **Method:** `GET`
- **Description:** Allows users to buy a car.
- **Response:** 
  - Returns success message if the purchase is successful, otherwise error message.

### 8. Get Deals of a Dealership

- **URL:** `/deals/dealership`
- **Method:** `GET`
- **Description:** Allows users to view deals offered by a dealership.
- **Response:** 
  - Returns a list of deals offered by the dealership.

### 9. Add Deal

- **URL:** `/deal/:CarId`
- **Method:** `POST`
- **Description:** Allows dealers to add a deal for a car.
- **Request Body:**
  - `pricing` (Number): Pricing of the deal (positive integer)
  - `warranty` (Number): Warranty of the deal (positive integer)
- **Validation:**
  - `pricing`: Must be a positive integer
  - `warranty`: Must be a positive integer
- **Response:** 
  - Returns the added deal data if successful, otherwise error message.

### 10. Get Your Vehicles

- **URL:** `/yourVehicles`
- **Method:** `GET`
- **Description:** Allows users to view their owned vehicles.
- **Response:** 
  - Returns a list of owned vehicles by the user.

### 11. Get Sold Vehicles

- **URL:** `/soldVehicles`
- **Method:** `GET`
- **Description:** Allows users to view sold vehicles.
- **Response:** 
  - Returns a list of sold vehicles.

