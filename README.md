# OAuth Custom Secured Form
A secured OAuth form which handles authentication and validation by making use of tokens and many other tools.

![OAuth](/assets/oauth.PNG)

## Application Code
### Front-End
Development: React.js and React Router  
Compatibility: Desktop, Phones and Tablets  
Tools used: RegEx (Validation for input fields), Axios (Make API calls to back end), Google OAuth (Authentication through Google)  
The front end makes use of React to organise the web app into reusable components and also manage the states of certain elements or objects.

### Back-End
Server: Express.js  
Database: MongoDB with Mongoose  
Runtime Environment: Node.js  
Tools used: Bcrypt (Hash passwords and store it in the database), json web tokens (Creation of access and refresh tokens for authentication), NodeMailer (Send email to users to reset password)  
The back end consists of Express to send or receive HTTP requests from the front end and MongoDB for the manipulation and storage of data.

## Sign Up
Users can sign up for an account either through the Google OAuth or creating their own account. If signing up is done through creating their own account, they would have to fill up fields such as their email, username and password which would be validated through regular expressions. Their passwords would then be hashed by applying a salt level from Bcrypt and stored in our database so hackers cant get access to it. The application would only be successful if all validations have been met and if the user does not already exist in the database.

![SignUp](/assets/signup.gif)

## Log In
On a new session, users can log in to their existing account by passing in their account details in the fields and passing the validation checks or through the Google OAuth. The password that they entered will be hashed and compared to the other hashed password in the database for validation.

![LogIn](/assets/login.gif)

## Forgot Password
If users forget their password, they can enter a valid email that is found in our database and an email with a link would be sent to them through nodemailer for them to reset their password. The link has their user id and a jwt token which would expire within a certain period of time. If the parameters are tampered in the link or upon expiry of the token, the link would be invalid and users wont have access to change their password. Upon passing the validation checks, they can access the site with their new password.

![Forgot](/assets/forgot.gif)

## Home
The home page displays details regarding their user info and makes use of access and refresh tokens everytime users log in. The access tokens expires after a certain amount of time and refresh tokens are needed to create another access token upon expiry. This is to ensure hackers cant breach into the user's account without a valid token. Users can only go back to the log in page by logging out of their account as details are already cached upon logging in or signing up.

![Home](/assets/home.gif)
