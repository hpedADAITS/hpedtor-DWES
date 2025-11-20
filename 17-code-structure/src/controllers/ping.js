const controller = {
  ping: (req, res) => {
    res.json({ message: "pong" });
  },
};

module.exports = controller;
