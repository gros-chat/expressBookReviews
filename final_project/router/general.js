const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  
  if(req.body.user && req.body.password){
    const pwd = req.body.password;
    const user = req.body.user;
    users.push({"user":user,"pwd":pwd});
    console.log(users);
  }

  return res.status(300).json({message: "new user registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  const titles = Object.values(books).map(book => book.title);
  // res.json(titles);
  // res.json(JSON.stringify(books))
  res.json(books);
});


public_users.get('/axios/', async function(req, res) {
  try {
    response = await axios.get('http://localhost:3000/')
    res.json(response.data);
  }catch(error){
    res.send(error)
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 

  
  const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Isbn not found');
  }

  
 });


 public_users.get('/axios/isbn/:isbn', async function (req, res) {
 
  let myPromise = new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/')
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
});

const isbn = req.params.isbn;

myPromise.then((data) => {
  const filteredBooks = Object.values(data).filter(data => data.isbn === isbn);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Isbn not found');
  }

    console.log("From Callback", data);
}).catch((error) => {
    console.error("Error occurred:", error);
});
});
  

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const author = req.params.author;

  
  const filteredBooks = Object.values(books).filter(book => book.author === author);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Author not found');
  }
});
 
public_users.get('/axios/author/:author', async function (req, res) {
 
  let myPromise = new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/')
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
});

const author = req.params.author;

myPromise.then((data) => {
  const filteredBooks = Object.values(data).filter(data => data.author === author);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Author not found');
  }

    console.log("From Callback", data);
}).catch((error) => {
    console.error("Error occurred:", error);
});
});
  


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; 

  
  const filteredBooks = Object.values(books).filter(book => book.title === title);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Title not found');
  }

});


public_users.get('/axios/title/:title', async function (req, res) {
 
  let myPromise = new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/')
        .then(response => {
            resolve(response.data);
        })
        .catch(error => {
            reject(error);
        });
});

const title = req.params.title;

myPromise.then((data) => {
  const filteredBooks = Object.values(data).filter(data => data.title === title);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks); 
  } else {
    res.status(404).send('Title not found');
  }

    console.log("From Callback", data);
}).catch((error) => {
    console.error("Error occurred:", error);
});
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; 

  
  const filteredBooks = Object.values(books).filter(book => book.isbn === isbn);

  if (filteredBooks.length > 0) {
    res.json(filteredBooks[0].reviews); 
  } else {
    res.status(404).send('The book has not been reviewed yet');
  }

});

module.exports.general = public_users;
