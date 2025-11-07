import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT_NUMBER = 3001;
const FILES_DIR = join(__dirname, "src");
app.use(express.json());
app.use(
	"/view",
	express.static(FILES_DIR, {
		index: ["./meme.jpg"],
		dotfiles: "deny",
		setHeaders: (res, path) => {
			res.setHeader("Content-Disposition", "inline");
		}
	})
);
app.get("/", (req, res) => {
	res.send("Hello World\n");
	console.log("Request received!");
});
app.post("/", (req, res) => {
	res.send("Got a POST request");
	console.log("POST received!");
});
app.listen(PORT_NUMBER, () => {
	console.log(`Listening at port ${PORT_NUMBER}`);
});
