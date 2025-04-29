const http = require("http");
const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const LOGGER = require("./lib/LOGGER.lib.js");

const server = http.createServer(app);

server.listen(PORT, (req,res)=>{
	LOGGER.log('info',`server listening on http://localhost:${PORT}`);
});