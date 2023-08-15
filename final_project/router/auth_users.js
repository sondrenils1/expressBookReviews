const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{   
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 *60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (!isbn || !review || !username) {
      return res.status(400).json({ message: "Missing required parameters." });
    }
  
    // Check if the user has already posted a review for the same ISBN
    const existingReviewIndex = -1
    //books[isbn].reviews.findIndex(r => r.username === username);
    
    if (existingReviewIndex !== -1) {
      // If the user has an existing review, modify it
      books[isbn].reviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review modified successfully." });
    } else {
      // If the user hasn't reviewed this book before, add a new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully." });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!isbn) {
      return res.status(400).json({ message: "Missing required parameters." });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!books[isbn].reviews) {
      return res.status(200).json({ message: "No reviews to delete." });
    }
  
    const userReview = books[isbn].reviews[username];
  
    if (!userReview) {
      return res.status(404).json({ message: "Review not found" });
    }
  
    // Delete the user's review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully." });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
