const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Lidhja me databazën tënde në XAMPP
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'devops_db'
});

db.connect((err) => {
    if (err) {
        console.error('Gabim gjatë lidhjes me MySQL: ' + err.message);
        return;
    }
    console.log('U lidh me sukses me MySQL (devops_db)!');
});

// 1. Merr gjendjen nga DB
app.get('/api/settings', (req, res) => {
    db.query('SELECT * FROM deployment_settings WHERE id = 1', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result[0]);
    });
});

// 2. Ndrysho gjendjen sipas butonave
app.post('/api/action', (req, res) => {
    const { action } = req.body;
    let query = "";

    if (action === 'canary_deploy') {
        query = "UPDATE deployment_settings SET active_environment='blue', blue_traffic_percent=80, green_traffic_percent=20 WHERE id=1";
    } else if (action === 'switch_to_green') {
        query = "UPDATE deployment_settings SET active_environment='green', blue_traffic_percent=0, green_traffic_percent=100 WHERE id=1";
    } else if (action === 'simulo_gabim') {
        query = "UPDATE deployment_settings SET green_version_errors = green_version_errors + 15 WHERE id=1";
    } else if (action === 'rollback') {
        query = "UPDATE deployment_settings SET active_environment='blue', blue_traffic_percent=100, green_traffic_percent=0, green_version_errors=0 WHERE id=1";
    }

    db.query(query, (err, result) => {
        if (err) return res.status(500).json(err);
        db.query('SELECT * FROM deployment_settings WHERE id = 1', (err2, res2) => {
            if (err2) return res.status(500).json(err2);
            res.json(res2[0]);
        });
    });
});

app.listen(5000, () => {
    console.log("Serveri i Node.js po punon në portën 5000...");
});