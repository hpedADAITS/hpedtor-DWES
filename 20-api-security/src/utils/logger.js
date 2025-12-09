const info = (msg) => console.log(`[I] ${new Date().toISOString()} - ${msg}`);
const err = (msg) => console.error(`[E] ${new Date().toISOString()} - ${msg}`);

module.exports = { log: { info, err } };
