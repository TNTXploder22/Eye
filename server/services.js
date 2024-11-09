const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const DBNAME = 'eye';
const dbURL = 'mongodb://127.0.0.1';
const client = new MongoClient(dbURL, { maxPoolSize: 10 });
const sr = 8;

let dbConnection;

async function connectDB() {
    if (dbConnection) return dbConnection;
    await client.connect();
    const db = client.db(DBNAME);
    dbConnection = db;
    const coll = db.collection('player');
    await coll.createIndex({ username: 1 }, { unique: true });
    return dbConnection;
}

var services = function(app) {
    app.use(express.json());

    app.post('/write-data', async function(req, res) {
        const { username, password, email, rankOrbs = 0, megaOrbs = 0, orbs = 0, lives = 3 } = req.body;

        if (!username || !password || !email) {
            return res.status(400).send({ success: false, message: "Missing required fields" });
        }

        const data = {
            username,
            password: await bcrypt.hash(password, sr),
            email,
            gameItems: { rankOrbs, megaOrbs, orbs, lives }
        };

        try {
            const db = await connectDB();
            const coll = db.collection('player');
            await coll.insertOne(data);
            return res.status(200).send({ success: true, message: "User created successfully" });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(400).send({ success: false, message: "Error: Username already exists." });
            }
            return res.status(500).send({ success: false, message: "Error: " + err.message });
        }
    });

    app.get('/get-user-data', async (req, res) => {
        const { username } = req.query;

        if (!username) {
            return res.status(400).send({ success: false, message: "Missing username" });
        }

        try {
            const db = await connectDB();
            const coll = db.collection('player');
            const user = await coll.findOne({ username }, { projection: { username: 1, email: 1, 'gameItems': 1 } });

            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).send({ success: false, message: "Error: " + err.message });
        }
    });

    app.post('/update-game-data', async (req, res) => {
        const { username, orbs, score, rankOrbs, lives } = req.body;

        if (!username || orbs === undefined || score === undefined || rankOrbs === undefined) {
            return res.status(400).send({ success: false, message: "Missing required fields" });
        }

        try {
            const db = await connectDB();
            const coll = db.collection('player');
            const user = await coll.findOne({ username });

            if (!user) {
                return res.status(400).send({ success: false, message: "User not found" });
            }

            let newOrbs = user.gameItems.orbs + orbs;
            let newLives = user.gameItems.lives;

            while (newOrbs >= 100) {
                newOrbs -= 100;
                newLives += 1;
            }

            let newRankOrbs = user.gameItems.rankOrbs;
            if (rankOrbs > newRankOrbs) {
                newRankOrbs = rankOrbs;
            }

            const playerData = {
                'gameItems.orbs': newOrbs,
                'gameItems.rankOrbs': newRankOrbs,
                'gameItems.lives': newLives,
            };

            const result = await coll.updateOne(
                { username },
                { $set: playerData }
            );

            if (result.modifiedCount === 0) {
                return res.status(400).send({ success: false, message: "No changes were made" });
            }

            return res.status(200).send({ success: true, message: "Game data updated successfully!" });
        } catch (err) {
            return res.status(500).send({ success: false, message: "Error: " + err.message });
        }
    });

    app.post('/signin', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send({ success: false, message: "Missing username or password" });
        }

        try {
            const db = await connectDB();
            const coll = db.collection('player');
            const user = await coll.findOne({ username });

            if (!user) {
                return res.status(404).send({ success: false, message: "User not found" });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).send({ success: false, message: "Invalid credentials" });
            }

            return res.status(200).send({ success: true, message: "Login successful!", user: { username: user.username, email: user.email } });
        } catch (err) {
            return res.status(500).send({ success: false, message: "Error: " + err.message });
        }
    });
};

module.exports = services;