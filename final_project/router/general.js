const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and/or password not provided" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`/`);
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get the user list available in the shop
public_users.get('/users', async function (req, res) {
    try {
        const response = await axios.get('/users');
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`/isbn/${isbn}`);
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`/author/${author}`); // Replace with the actual API URL
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get(`/title/${title}`); // Replace with the actual API URL
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books).find(book => book.isbn === isbn);
    const review = book.reviews;
    if (book) {
        res.send(JSON.stringify(review, null, 4));
    } else {
        res.send(`Book with ISBN ${isbn} not found.`);
    }
});

module.exports.general = public_users;
