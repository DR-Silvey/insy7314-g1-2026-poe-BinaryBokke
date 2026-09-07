**System Overview:**
HusstleHub+ is a web based service that allows users to discover, interact, and manage services and opportunities in one place.
The application follows a client-server architecture where the frontend is responsible for all user interactions and the backend does the logic, auth, API, and data management. 
Node.js and Express.js is used to develop the backend and MongoDB/Mongoos will be used for out application and user data (Express.js, 2026).
The frontend of HusstleHub+ will use APIs to communicate with out backend.
HusstleHub uses a modular design, so its easier to add additional functionality rather than changing existing architecture. 

**Intended Users:**

•General Users:
These are the main users of the platform, they can do the following:
Create an account, log into the system, manage their personal information, and interact with the opportunities and services provided by HustleHub+.

•Administrators:
Administrators have additional permissions that normal users should not have access to, they can do the following:
Managing user accounts and roles, accessing administrator-only functionality, and maintenance of the application.

**System Architecture:**
HusstleHub+ makes use of a layered client-server architecture. 
Frontend Web Application --http/https--> Backend node.js / express.js ---> auth and security + business logic ---> Database (MongoDB/Mongoose)

Frontend:
The frontend is where the user interacts with HussleHub+ and is responsible for:
Displaying system information, collecting user input, providing navigation, sending requests to the backend API, and displaying responses 
returned by the backend(The Independent Institute of Education (IIE), 2026).

Backend:
The main application layer between the frontend and the database, used for the following:
Processing API requests, validating user input, authenticating users, authorising protected operations, managing user information,
applying business rules, communicating with the database, and returning appropriate responses to the frontend.

Database:
MongoDB is used in combination with Mongoose that provides the object modeling layer(The Independent Institute of Education (IIE), 2026).
This allows application data to be represented through structured schemas while still taking advantage of 
MongoDB's document-based database model.

**API Authentication Flow:**
HussleHub+ uses a token based authentication, the logic is as follows:
User --> Frontend Login Form --> POST Login --> Input Validation --> User Authentication --> JWT Generated -->
Frontend recieves token --> API Request --> JWT Verification --> Role Authentication --> Controllers --> Respone.

After successful authentication, the users JWT is used when accessing protected functionality.
Protected requests use the standard Bearer token format: Authorisation: Bearer <Token>

**Security Decisions:**
Security controls have been included at multiple levels of the backend rather than relying only on the login process.

•Password Hashing:
User passwords are protected using bcrypt hashing, a computational cost is used when generating password hashes to make 
password cracking more difficult while still allowing normal authentication operations (OWASP, 2026).

•Password Requirements:
When users create their password it should meet these rules:
Minimum length, at least one uppercase character, at least one lowercase character, at least one number,
and at least one special character.
This reduces the likelihood of users selecting easily guessable passwords.

•JWT Authentication:
JSON Web Tokens are used to authenticate users after successful login.
These token contain information required to identify the authenticated user and their role.
Tokens have an expiration period so that an authentication token doesn't remain valid indefinitely.

•Role-based Access Controls:
Users are assigned roles, with normal registered users receiving the "general" role by default.
Administrative functionality requires the appropriate administrator role.
The backend checks the authenticated users role before allowing access to protected administrative operations.

This ensures that authentication and authorisation are treated as separate security requirements:
Authentication: Who is the user? (OWASP Foundation,2025)
Authorisation: Is the user allowed to perform this operation?

•Input Validation:
User input is validated before being processed by our application.
Validation is applied to information such as:
Usernames, Email addresses, passwords, names, and age.
This helps prevent invalid data from entering the system and provides an additional layer of protection against malicious or unexpected input.

•Security Headers:
Our backend uses Helmet to apply HTTP security headers.
These headers help protect the application against common web based attacks and reduce unnecessary information exposure (Ciampa, 2018).

•CORS Protection: 
Cross-Origin Resource Sharing is configured to allow requests from the authorised frontend application.
The frontend origin is configured through environment variables rather than being permanently hard-coded into the application.
This prevents unrestricted websites from making requests to the API.

•HTTPS:
The backend supports HTTPS using SSL certificates.
HTTPS encrypts communication between the frontend and backend, helping protect information such as authentication tokens 
and user data while it is being transmitted.
HTTPS is particularly important for production deployment.

•Environmental Variables:
Sensitive configuration is stored using environment variables.
This includes information such as:
JWT secrets, database connection information, server configuration, HTTPS settings, and Certificate paths.

•Request Sizing Limit:
The API limits the size of JSON request bodies.
Husstlehub+ currently have a 10 KB limit, this helps prevent unnecessarily large requests from consuming excessive server resources.

•Error Handeling:
A centralised error-handling middleware is used to process application errors.
The API also provides appropriate responses for unknown routes and unexpected server errors.
The intention is to avoid exposing unnecessary internal implementation details to users while still providing useful responses to the frontend.

**Backend Structure:**

•Controllers:
Registration - handles creation of new accounts.
LogIn - handles user auth.
UpdateUserInfo - handles changes to user information.
UpdateUserRoles - handles authorised user-role management.

•Routes:
POST/register ->Register a new user
POST/login -> Authenticate an existing user
PATCH/register/:username -> Update user information
PATCH/register/:username/role -> Update a user's role
GET/ -> API root
GET/health -> Check API availability
POST/message -> API test endpoint

Protected routes require authentication and, where needed, the correct user role(The Independent Institute of Education (IIE), 2026).

•Middleware:
Middleware is used to perform checks before requests reach the controllers.
The backend includes middleware for:
Registration and Login validation, JWT authentication, Role-based authorisation, and centralised error handling.
This provides a separation between request validation, security checks and business logic.

•Models:
The Users.js model defines the structure of user information stored by the application.
User information includes:
Username, Password, Full name, Email, Age, and Role.
New accounts use the general role by default.

•Utilities:
Utility classes contain reusable functionality used throughout the backend(The Independent Institute of Education (IIE), 2026).
These include:
Password hashing and comparison, password-strength validation, JWT creation, common input validation.
This reduces duplicated logic and makes security functionality easier to maintain.


References:
Express.js (2026) Express - Node.js web application framework. Available at: https://expressjs.com/ (Accessed: 7 September 2026).
OWASP Foundation (2025) Authorization Cheat Sheet. OWASP Cheat Sheet Series. OWASP Foundation
OWASP (2026) OWASP Top 10: The Ten Most Critical Web Application Security Risks. Available at: [OWASP Top 10](https://owasp.org/www-project-top-ten/?utm_source=chatgpt.com) (Accessed: 7 September 2026).
The Indipendent Institute of Education (IIE), 2026. Information Systems 3D (INSY7314) Application Development Security (APDS7311) : Module Manual 2026. 1st ed. [online].
Ciampa, M. 2018. CompTIA: SECURITY+ GUIDE TO NETWORK SECURITY FUNDAMENTALS. 5th ed. Massachusetts: Cengage.


