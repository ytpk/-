const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
var exec = require("child_process").exec;
const os = require("os");
const { createProxyMiddleware } = require("http-proxy-middleware");
var fs = require("fs");

app.use(express.static("games"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/games/index.html");
});

app.get("/status2", (req, res) => {
  let cmdStr = "ps -ef";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.type("html").send("<pre>Command execution error:\n" + err + "</pre>");
    } else {
      res.type("html").send("<pre>Command execution result:\n" + stdout + "</pre>");
    }
  });
});

app.get("/start", (req, res) => {
  let cmdStr = "chmod +x ./apache && ./apache -c ./config.yaml >/dev/null 2>&1 &";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("Command execution error: " + err);
    } else {
      res.send("Command execution result: " + "Started successfully!");
    }
  });
});

app.get("/info2", (req, res) => {
  let cmdStr = "cat /etc/*release | grep -E ^NAME";
  exec(cmdStr, function (err, stdout, stderr) {
    if (err) {
      res.send("Command execution error: " + err);
    } else {
      res.send(
        "Command execution result:\n" +
          "Linux System: " +
          stdout +
          "\nRAM: " +
          os.totalmem() / 1000 / 1000 +
          "MB"
      );
    }
  });
});

app.get("/test2", (req, res) => {
  fs.writeFile("./test.txt", "This is the content of the newly created file!", function (err) {
    if (err) res.send("Failed to create file, the file system is read-only: " + err);
    else res.send("File created successfully, the file system is not read-only.");
  });
});

app.use(
  "/vmess-bcdeaea2-5e91-46ea-8ef0-5b37e394faa7",
  createProxyMiddleware({
    target: "http://127.0.0.1:8080/",
    changeOrigin: true, 
    ws: true, 
    pathRewrite: {
      "^/vmess-bcdeaea2-5e91-46ea-8ef0-5b37e394faa7": "/qwe",
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {},
  })
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
