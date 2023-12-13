"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const file_1 = __importDefault(require("../models/file"));
const axios_1 = __importDefault(require("axios"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const EmailTemplate_1 = __importDefault(require("../utils/EmailTemplate"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({}); // Use memory storage for multer
const upload = (0, multer_1.default)({
    storage,
});
router.post("/upload", upload.single("myFile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Hey bro! We need a file" });
        }
        console.log(req.file);
        let uploadedFile;
        try {
            uploadedFile = yield cloudinary_1.v2.uploader.upload(req.file.path, {
                folder: "shareMe",
                resource_type: "auto",
            });
            // this code is use to upload sepeatedly in cloudinary
            // console.log(uploadedFile);
            // res
            //   .status(200)
            //   .json({ message: "File uploaded successfully", data: uploadedFile });
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ message: "Cloudinary upload failed" });
        }
        const { originalname } = req.file;
        const { secure_url, bytes, format } = uploadedFile;
        const file = yield file_1.default.create({
            filename: originalname,
            sizeInBytes: bytes,
            secure_url,
            format,
        });
        res.status(200).json({
            id: file._id,
            downloadPageLink: `${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id}`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error :(" });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield file_1.default.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File does not exist" });
        }
        const { filename, format, sizeInBytes } = file;
        return res.status(200).json({
            name: filename,
            sizeInBytes,
            format,
            id,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error :(" });
    }
}));
router.get("/:id/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const file = yield file_1.default.findById(id);
        if (!file) {
            return res.status(404).json({ message: "File does not exist" });
        }
        // https.get(file?.secure_url, (fileStream) => fileStream.pipe(res));
        const fileUrl = file === null || file === void 0 ? void 0 : file.secure_url;
        if (fileUrl) {
            axios_1.default
                .get(fileUrl, { responseType: "stream" })
                .then((response) => {
                response.data.pipe(res);
            })
                .catch((error) => {
                console.error("Error fetching file:", error);
                res.status(500).send("Internal Server Error");
            });
        }
        else {
            res.status(404).send("File not found");
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Server Error :(" });
    }
}));
router.post("/email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, emailFrom, emailTo } = req.body;
    const file = yield file_1.default.findById(id);
    if (!file) {
        return res.status(404).json({ message: "File Does not Exist" });
    }
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });
    // process the e-mail data
    const { filename, sizeInBytes } = file;
    const fileSize = `${(Number(sizeInBytes) / (1024 * 1024)).toFixed(2)}MB`;
    const downloadPageLink = `${process.env.API_BASE_ENDPOINT_CLIENT}download/${id}`;
    const mailOptions = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: "File Sharing", // Subject line
        text: `${emailFrom} shared a File with you`, // plain text body
        html: (0, EmailTemplate_1.default)(emailFrom, downloadPageLink, filename, fileSize), // html body
    };
    transporter.sendMail(mailOptions, (error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.log(error);
            return res.status(500).json({
                message: "Server Error :(",
            });
        }
        if (file) {
            file.sender = emailFrom;
            file.receiver = emailTo;
            yield file.save();
        }
        return res.status(200).json({
            message: "Email Sent",
        });
    }));
}));
exports.default = router;
