import express from "express";
import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import path from "path";

config({ path: path.resolve() + '/.env' });

const app = express();
app.use(express.json());

const posts = [
    {
        name: "vignesh",
        title: "title 1"
    },
    {
        name: "viki",
        title: "title 2"
    },
]

app.post('/login', (request, response) => {
    const user = { name: request.body.username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
    response.json({ status: true, token: accessToken, refreshToken })
})

app.get('/posts', authenticateToken, (request, response) => {
    response.json(posts.filter(user => user.name == request.user.name));
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
}

function authenticateToken(request, response, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) response.status(401).send({ status: false, message: "Token Invalid" });
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, result) => {
            if (err) response.status(403).send({ status: false, message: "Token Expired" });
            else {
                request.user = result // Set request manualy
                next()
            }
        })
    }
}

app.listen(3000);