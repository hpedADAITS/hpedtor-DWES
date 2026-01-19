const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Services Server Running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
