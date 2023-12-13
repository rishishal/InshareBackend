"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const fileSchema = new Schema({
    filename: {
        type: [],
        required: true,
    },
    secure_url: {
        type: [],
        required: true,
    },
    format: {
        type: [],
        required: true,
    },
    sizeInBytes: {
        type: [],
        required: true,
    },
    sender: {
        type: [],
    },
    receiver: {
        type: [],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("File", fileSchema);
