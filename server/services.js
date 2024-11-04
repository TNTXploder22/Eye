const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const DBNAME = 'eye';
const dbURL = 'mongodb://127.0.0.1';
const client = new MongoClient(dbURL);
const saltRounds = 10; // Number of salt rounds for bcrypt

var services = function(app) {
    // Middleware to parse JSON requests
    app.use(express.json());

    // Connect to MongoDB and ensure the collection exists
    const connectDB = async () => {
        await client.connect();
        const db = client.db(DBNAME);
        const coll = db.collection('player');
        // Create a unique index on the username field
        await coll.createIndex({ username: 1 }, { unique: true });
    };

    // Sign up endpoint
    app.post('/write-data', async function(req, res) {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        };

        try {
            // Hash the password before saving it
            data.password = await bcrypt.hash(data.password, saltRounds);

            // Create a connection to the database server
            const conn = await client.connect();
            const db = conn.db(DBNAME);
            const coll = db.collection('player');

            // Insert the record
            await coll.insertOne(data);

            await conn.close();

            // Return success message
            return res.status(200).send(JSON.stringify({ msg: "YIPPIE!" }));
        } catch (err) {
            // Close connection if there's an error
            await client.close();

            if (err.code === 11000) { // Duplicate key error
                return res.status(400).send(JSON.stringify({ msg: "Error: Username already exists." }));
            }
            return res.status(500).send(JSON.stringify({ msg: "Error: " + err.message }));
        }
    });

    // Sign in endpoint
    app.post('/signin', async (req, res) => {
        const { username, password } = req.body;

        try {
            // Create a connection to the database server
            const conn = await client.connect();
            const db = conn.db(DBNAME);
            const coll = db.collection('player');

            // Find the user by username
            const user = await coll.findOne({ username });

            if (!user) {
                return res.status(400).send(JSON.stringify({ msg: "Error: Username not found." }));
            }

            // Compare provided password with the hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).send(JSON.stringify({ msg: "Error: Incorrect password." }));
            }

            await conn.close();

            // Return success message
            return res.status(200).send(JSON.stringify({ msg: "Sign-in successful!" }));
        } catch (err) {
            await client.close();
            return res.status(500).send(JSON.stringify({ msg: "Error: " + err.message }));
        }
    });

    // Start the connection to the database
    connectDB().catch(err => console.error("Database connection failed: ", err));
};

module.exports = services;