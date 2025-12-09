const svc = require("../services/fibonacciService");

module.exports = {
  calc: (req, res) => {
    const n = parseInt(req.params.n);
    if (isNaN(n) || n < 0) {
      return res.status(400).json({ error: "invalid input" });
    }
    res.json({ result: svc.fib(n) });
  },
};
