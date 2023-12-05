import express from "express";
import jwt from "jsonwebtoken";
import { config } from 'dotenv';
import path from "path";

config({ path: path.resolve() + '/.env' });

const app = express();
app.use(express.json());

const posts = [
    {
        username: "vignesh",
        title: "post 1",
    },
    {
        username: "viki",
        title: "post 2",
    },
]

app.get('/posts', authenticateToken, (request, response) => {
    response.json(posts.filter(user => user.username == request.user.name))
})

app.post('/login', (request, response) => {
    const user = { name: request.body.username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
    response.json({ status: true, token: accessToken })
})

function authenticateToken(request, response, next) {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) response.status(401);
    else {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, result) => {
            if (err) response.status(403);
            else {
                request.user = result // Set request manualy
                next()
            }
        })
    }
}

app.listen(4000);