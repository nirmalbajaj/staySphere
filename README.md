StaySphere is a full-stack web application inspired by Airbnb, built from scratch without relying on Airbnb APIs. It provides a platform for users to browse, book, and manage unique accommodations with a seamless and secure user experience. The app is powered by MongoDB, Node.js, Express.js, and EJS, featuring custom REST APIs, secure authentication and authorization, and efficient file handling for property listings.
Live Demo
Explore the deployed application at: https://staysphere-88p3.onrender.com 
Note: The app is hosted on Render’s free tier, which may take some time to load due to spin-down after periods of inactivity.
Features

Property Listings: Create, view, and manage accommodation listings with details like description, price, location, and amenities.
Booking System: User-friendly interface for reserving stays with availability checks.
Authentication & Authorization: Secure user login and role-based access control using JWT or session-based authentication.
File Handling: Upload and manage property images using Multer or similar libraries.
Custom REST APIs: Robust APIs for efficient front-end and back-end communication.
Dynamic UI: EJS-based templates for a responsive and intuitive user experience.

Tech Stack

Frontend: EJS for dynamic templating
Backend: Node.js, Express.js
Database: MongoDB
APIs: Custom-built REST APIs
Authentication: JWT or session-based authentication
File Handling: Multer for image uploads
Deployment: Hosted on Render

Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance, e.g., MongoDB Atlas)
npm (v8 or higher)
Render account (for deployment)

Installation

Clone the Repository:
git clone https://github.com/nirmalbajaj/staysphere.git
cd staysphere


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the root directory and add the following:
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=3000


Run the Application Locally:
npm start

The app will be accessible at http://localhost:3000.


Usage

Register/Login: Sign up or log in to access full functionality.
Browse Listings: Explore available accommodations with filters for price, location, or amenities.
Create Listings: Add new properties with details and images (authenticated users only).
Book Stays: Reserve accommodations seamlessly with availability checks.
Manage Listings: Edit or delete your property listings (authorized users only).

API Endpoints
Example REST API endpoints (update with your actual endpoints):

GET /api/listings: Fetch all property listings
POST /api/listings: Create a new listing (authenticated)
GET /api/listings/:id: Fetch a specific listing
POST /api/auth/register: Register a new user
POST /api/auth/login: Log in a user

Deployment on Render
The app is deployed on Render at https://staysphere-88p3.onrender.com. To deploy your own instance:

Set Up MongoDB: Use a cloud MongoDB instance (e.g., MongoDB Atlas) and update the MONGODB_URI in your Render environment variables.
Create a Render Web Service:
Sign in to Render.
Create a new web service and connect your GitHub repository (nirmalbajaj/staysphere).
Set the runtime to Node.
Add the build command: npm install
Add the start command: npm start


Configure Environment Variables:
In Render’s dashboard, add the .env variables (MONGODB_URI, SESSION_SECRET, PORT).


Deploy: Trigger a deployment from the Render dashboard.
Optimize: Enable auto-deploy for future commits and monitor logs for any issues.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature-branch).
Make your changes and commit (git commit -m 'Add feature').
Push to the branch (git push origin feature-branch).
Open a pull request.

Contact
For questions or feedback, reach out via GitHub Issues or contact nirmalbajaj99@gmail.com
