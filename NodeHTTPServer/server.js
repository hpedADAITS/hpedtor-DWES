import chalk, { Chalk } from "chalk";
import { createServer } from "http";

const PORT_NUMBER = 4000;

createServer((req, res) => {
  res.setDefaultEncoding("UTF-8");
  res.setHeader("Content-Type", "application/json");
  res.statusMessage(200);
  
  if()
    {res.end()};
}).listen(PORT_NUMBER);

if (createServer) {
  console.log(chalk.green("Listening on: " + PORT_NUMBER));
}
