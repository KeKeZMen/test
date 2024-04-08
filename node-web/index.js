import http from "http";
import fs from "fs/promises";
import qs from "querystring";
import crypto from "crypto";

const PORT = 3000;
const HOST = "localhost";

const sessions = [];

const users = [
  {
    name: "kekez",
    password: "123qwe",
  },
];

async function reqHandler(req, res) {
  if (req.url == "/") {
    if (req.method == "GET") {
      fs.readFile("./index.html")
        .then((document) => {
          return res
            .writeHead(200, "OPA", { "Content-Type": "text/html" })
            .end(document);
        })
        .catch(() => {
          return res.writeHead(500).end("Error");
        });
    }

    if (req.method == "POST") {
      var body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        req.post = qs.parse(body);
        const data = req.post;

        let user = users.find((u) => u.name == data.name);
        if (!user) {
          return res.writeHead(403).end("Not authorized!");
        }

        if (user.password !== data.password) {
          return res.writeHead(403).end("wrong password!");
        }

        fs.readFile("./index.html")
          .then((document) => {
            const uuid = crypto.randomUUID();
            sessions.push({ name: user.name, token: uuid });

            return res
              .writeHead(200, "OPA", {
                "Content-Type": "text/html",
                "set-cookie": `auth=${uuid}`,
              })
              .end(document);
          })
          .catch(() => {
            res.writeHead(500);
            return res.end("Error");
          });
      });
    }
  }

  if (req.url == "/private") {
    const token = req.headers?.cookie?.auth;
    console.log(req.headers?.cookie.split(";"));

    if (!token) {
      return res.writeHead(403).end("Not authorized");
    }

    const user = sessions.find((u) => u.token == token);

    if (!user) {
      return res.writeHead(403).end("Not authorized");
    }

    return res.writeHead(200, "OPA", {
      "Content-Type": "text/html",
    }).end(`
        <html lang="en">
          <head>
            <title>Private</title>
          </head>
          <body>
            <h1>Private</h1>
            <p>Hello ${user.name}</p>
          </body>
        </html>
      `);
  }
}

const server = http.createServer(reqHandler);
server.listen(PORT, HOST, () => {
  console.log(`server started on http://${HOST}:${PORT}`);
});
