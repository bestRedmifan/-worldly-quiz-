const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const players = {};

app.get("/", (req, res) => {
    res.send("Worldy Quiz Server is running!");
});

app.post("/create-id", (req, res) => {
    const { id } = req.body;

    if (!/^\d{9,12}$/.test(id)) {
        return res.json({
            success: false,
            message: "ID must contain 9-12 digits."
        });
    }

    if (players[id]) {
        return res.json({
            success: false,
            message: "This ID is already used."
        });
    }

    players[id] = {
        coins: 0,
        level: 1
    };

    res.json({
        success: true,
        id: id,
        player: players[id]
    });
});

app.get("/player/:id", (req, res) => {
    const player = players[req.params.id];

    if (!player) {
        return res.json({
            success: false,
            message: "ID not found."
        });
    }

    res.json({
        success: true,
        player: player
    });
});

app.post("/coins", (req, res) => {
    const { id, amount } = req.body;

    if (!players[id]) {
        return res.json({
            success: false,
            message: "ID not found."
        });
    }

    players[id].coins += Number(amount) || 0;

    res.json({
        success: true,
        coins: players[id].coins
    });
});

app.listen(PORT, () => {
    console.log("Worldy Quiz server running on port " + PORT);
});
