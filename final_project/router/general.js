const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let doesExist = require("./auth_users.js").doesExist;

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered!" });
        } else {
            return res.status(404).json({ message: "User already exists!" });

        }
    }
    return res.status(404).json({ message: "Unable to register user." });

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        return res.status(200).json(response.data);
    } catch (error) {

        return res.status(500).json(
            { message: "Error in retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json(
            { message: "Error in retrieving book with this ISBN" });
    }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) { try { const author = req.params.author; const response = await axios.get(`http://localhost:5000/books/author/${encodeURIComponent(author)}`); return res.status(200).json(response.data); } catch (error) { return res.status(500).json({ message: "Error in retrieving books by author" }); } });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) { try { const title = req.params.title; const response = await axios.get(`http://localhost:5000/books/title/${encodeURIComponent(title)}`); return res.status(200).json(response.data); } catch (error) { return res.status(500).json({ message: "Error in retrieving books by title" }); } });
//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
