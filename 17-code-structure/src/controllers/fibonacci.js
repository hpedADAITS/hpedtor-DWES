const service = require("../services/fibonacciService");

const controller = {
  fibonacci: (req, res) => {
    const n = parseInt(req.params.n);
    if (isNaN(n) || n < 0) {
      return res.status(400).json({ error: "Invalid input" });
    }
    const result = service.fibonacci(n);
    res.json({ result: result });
  },
};

module.exports = controller;
