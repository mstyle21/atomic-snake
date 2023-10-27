const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost",
		methods: ["GET", "POST"]
	}
});

io.on("connection", (socket) => {
	// ...
	console.log(socket.data);
});

const uuid = require("uuid");

io.engine.generateId = (req) => {
	return uuid.v4(); // must be unique across all Socket.IO servers
}

httpServer.listen(3000);