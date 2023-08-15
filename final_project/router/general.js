const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// with promise
const axios = require('axios');

public_users.get('/', function (req, res) {
  axios.get('https://sondrbjorgen-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books')
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Error fetching books." });
    });
});




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
 });



// wity promise
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`https://sondrbjorgen-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books/${isbn}`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching book by ISBN." });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
  
    // Handle URL-encoded space (%20) in author's name
    const decodedAuthor = author.replace(/%20/g, ' ');
  
    const authorBooks = Object.values(books).filter(book => book.author === decodedAuthor);
  
    if (authorBooks.length === 0) {
      return res.status(404).send('No books found for the author.');
    }
  
    const response = authorBooks.map(book => `${book.title} by ${book.author}`).join('\n');
    res.send(response);
});

// with Async-Await

public_users.get("/author/:author", async function (req, res){
    try {
        const author = req.params.author;
        const decodedAuthor = author.replace(/%20/g, ' ');

        const response = await axios.get(`https://sondrbjorgen-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/books`);
        const booksData = response.data;

        const authorBooks = Object.values(booksData).filter(book => book.author === decodedAuthor);

        if (authorBooks.length === 0) {
            return res.status(404).send("No books found for the author")
        }

     
        const responseString = authorBooks.map(book => `${book.title} by ${book.author}`).join('\n');
        res.send(responseString);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching books." });
    }
});

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Handle URL-encoded space (%20) in author's name
    const decodedTitle = title.replace(/%20/g, ' ');
  
    const titleBooks = Object.values(books).filter(book => book.title === decodedTitle);
  
    if (titleBooks.length === 0) {
      return res.status(404).send('No books found for the author.');
    }
  
    const response = titleBooks.map(book => `${book.title}`).join('\n');
    res.send(response);
});

//promise

public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
  
    // Handle URL-encoded space (%20) in author's name
    const decodedTitle = title.replace(/%20/g, ' ');
  
    const titleBooks = Object.values(books).filter(book => book.title === decodedTitle);
  
    if (titleBooks.length === 0) {
      return res.status(404).send('No books found for the author.');
    }
  
    const response = titleBooks.map(book => `${book.title}`).join('\n');
    res.send(response);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = req.params.isbn;
    res.send(books[review].reviews)
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
//git config --global user.email "you@example.com"
 // git config --global user.name "Your Name"