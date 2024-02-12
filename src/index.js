import { Server, createServer } from "node:http";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(__dirname, ".env") });

const PORT = process.env.PORT;
const createUser = async (req) => {
    let body = "";
    req.on("data", (chunk) => {
        if(chunk){
            body += chunk.toString();
        }
    });
    req.on("end", () => {
        const { username, age, hobbies } = JSON.parse(body);
        console.log(body);
        console.log(username, age, hobbies);
        const id = randomUUID();
        const newUser = {
            id: id,
            username: username,
            age: age,
            hobbies: hobbies,
        };
        return newUser;
    });
};
const findUser = (requestedId) => {
    return new Promise((resolve) => {
        const user = users.find((user) => user.id === requestedId);
        resolve(user);
    });
};

const test1 = {
    id: "10",
    username: "test",
    age: 20,
    hobbies: ["testHobby"],
};
const test2 = {
    id: "1023",
    username: "test",
    age: 20,
    hobbies: ["testHobby"],
};
const users = [];
users.push(test1);
users.push(test2);

const server = createServer(async function (req, res) {
    const { url, method } = req;
    if (method === "GET") {
        if (url === "/api/users") {
            res.writeHead(200);
            res.write(JSON.stringify(users));
            res.end();
        } else if (req.url.startsWith("/api/users") && req.url.length > 10) {
            const requestedId = req.url.split("/")[3];
            console.log(requestedId);
            const requestedUser = await findUser(requestedId);
            if (!requestedUser) {
                res.writeHead(404);
                res.write("No user with requested id");
                res.end();
            } else if (requestedUser) {
                res.writeHead(200);
                res.write(JSON.stringify(requestedUser));
                res.end();
            }
        } else {
            res.writeHead(404);
            res.end();
        }
    }
    if (method === "POST" && url === "/api/users") {
        const newUser = await createUser(req);
        res.writeHead(200);
        res.end();

    }
});
server.listen(4000, () => {
    console.log(`Server running on port ${PORT}`);
});
