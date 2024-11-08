const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const DBNAME = 'eye';
const dbURL = 'mongodb://127.0.0.1';
const client = new MongoClient(dbURL);
const sr = 10;

var services = function(app) {
    app.use(express.json());

    // Connect to the database
    const connectDB = async () => {
        await client.connect();
        const db = client.db(DBNAME);
        const coll = db.collection('player');
        await coll.createIndex({ username: 1 }, { unique: true });
    };

    // POST route to create a new user
    app.post('/write-data', async function(req, res) {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            gameItems: {
                rankOrbs: req.body.rankOrbs || 0,
                megaOrbs: req.body.megaOrbs || 0,
                orbs: req.body.orbs || 0,
                lives: req.body.lives || 3
            }
        };

        try {
            data.password = await bcrypt.hash(data.password, sr);

            const conn = await client.connect();
            const db = conn.db(DBNAME);
            const coll = db.collection('player');

            await coll.insertOne(data);
            await conn.close();

            return res.status(200).send(JSON.stringify({ msg: "YIPPIE!" }));
        } catch (err) {
            await client.close();

            if (err.code === 11000) {
                return res.status(400).send(JSON.stringify({ msg: "Error: Username already exists." }));
            }
            return res.status(500).send(JSON.stringify({ msg: "Error: " + err.message }));
        }
    });

    // GET route to fetch user data (used for fetching user data to update the orbs)
    app.get('/get-user-data', async (req, res) => {
        const { username } = req.query;  // Retrieve username from query params

        if (!username) {
            return res.status(400).send({ msg: "Missing username" });
        }

        try {
            const conn = await client.connect();
            const db = conn.db(DBNAME);
            const coll = db.collection('player');

            // Fetch user data based on username
            const user = await coll.findOne({ username });

            if (!user) {
                await conn.close();
                return res.status(404).send({ msg: "User not found" });
            }

            await conn.close();
            return res.status(200).json(user);  // Send back user data
        } catch (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).send({ msg: "Error: " + err.message });
        }
    });

    // POST route to update game data (updates orbs and rankOrbs)
    app.post('/update-game-data', async (req, res) => {
        const { username, orbs, score, rankOrbs, lives } = req.body;

        // Ensure the required fields are present
        if (!username || orbs === undefined || score === undefined || rankOrbs === undefined) {
            return res.status(400).send({ msg: "Missing required fields" });
        }

        const conn = await client.connect();
        const db = conn.db(DBNAME);
        const coll = db.collection('player');

        // Fetch user data from the database
        const user = await coll.findOne({ username });

        if (!user) {
            await conn.close();
            return res.status(400).send({ msg: "User not found" });
        }

        // Add the current orbs to the existing orbs without overwriting
        const newOrbs = user.gameItems.orbs + orbs;

        // Update rankOrbs only if the new value is higher than the current stored value
        let newRankOrbs = user.gameItems.rankOrbs;
        if (rankOrbs > newRankOrbs) {
            newRankOrbs = rankOrbs;
        }

        // Prepare the updated player data
        const playerData = {
            'gameItems.orbs': newOrbs,       // Add orbs
            'gameItems.rankOrbs': newRankOrbs, // Update rankOrbs
            'gameItems.lives': lives || user.gameItems.lives // Update lives if provided, else retain the original
        };

        try {
            // Perform the database update
            const result = await coll.updateOne(
                { username: username },
                { $set: playerData }
            );

            // If no changes were made
            if (result.modifiedCount === 0) {
                await conn.close();
                return res.status(400).send({ msg: "No changes were made" });
            }

            // Successfully updated data
            await conn.close();
            return res.status(200).send({ msg: "Game data updated successfully!" });
        } catch (err) {
            await conn.close();
            console.error("Error updating game data:", err);
            return res.status(500).send({ msg: "Error: " + err.message });
        }
    });

    // Connect to the database
    connectDB().catch(err => console.error("Database connection failed: ", err));
};

module.exports = services;