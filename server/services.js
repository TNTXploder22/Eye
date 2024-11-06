const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const DBNAME = 'eye';
const dbURL = 'mongodb://127.0.0.1';
const client = new MongoClient(dbURL);
const saltRounds = 10;

var services = function(app) {
    app.use(express.json());

    const connectDB = async () => {
        await client.connect();
        const db = client.db(DBNAME);
        const coll = db.collection('player');
        await coll.createIndex({ username: 1 }, { unique: true });
    };

    app.post('/write-data', async function(req, res) {
        const data = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
        };

        try {
            data.password = await bcrypt.hash(data.password, saltRounds);

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

    app.post('/signin', async (req, res) => {
        const { username, password } = req.body;

        try {
            const conn = await client.connect();
            const db = conn.db(DBNAME);
            const coll = db.collection('player');

            const user = await coll.findOne({ username });

            if (!user) {
                return res.status(400).send(JSON.stringify({ msg: "Error: Username not found." }));
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).send(JSON.stringify({ msg: "Error: Incorrect password." }));
            }

            await conn.close();

            return res.status(200).send(JSON.stringify({ msg: "Sign-in successful!" }));
        } catch (err) {
            await client.close();
            return res.status(500).send(JSON.stringify({ msg: "Error: " + err.message }));
        }
    });

    connectDB().catch(err => console.error("Database connection failed: ", err));
};

module.exports = services;