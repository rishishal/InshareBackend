"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    // Database connection 🥳
    mongoose_1.default.connect(process.env.MONGO_URI);
    const connection = mongoose_1.default.connection;
    connection.once("open", () => {
        console.log("Database connected 🥳🥳🥳🥳");
    });
    connection.on("error", (error) => {
        console.log("Connection failed ☹️☹️☹️☹️");
        console.error(error);
    });
}
exports.default = connectDB;
