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
// Dependencies
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Config
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT;
// Middleware
app.use(cors_1.default());
app.use(express_1.default.json());
// Main Routes
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create General Report
    app.post('/reports', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { genReport } = req.body;
            const newReport = yield db_1.default.query(`INSERT INTO general_reports (report, created_at) VALUES ($1, $2) RETURNING *`, [genReport, Date()]);
            console.log(newReport);
            res.json(newReport.rows[0]);
        }
        catch (err) {
            console.error(err.message);
        }
    }));
    // Read All Posts
    app.get('/reports', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allReports = yield db_1.default.query("SELECT * FROM general_reports");
            res.json(allReports.rows);
        }
        catch (err) {
            console.error(err.message);
        }
    }));
    // Update A Post
    app.put('/reports/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { editReport } = req.body;
            const updatePost = db_1.default.query("UPDATE general_reports SET report = $1 WHERE post_id = $2", [editReport, id]);
            res.json("---Post was Updated---");
        }
        catch (err) {
            console.error(err.message);
        }
    }));
    // Delete Post
    app.delete('/reports/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const deletePost = yield db_1.default.query("DELETE FROM general_reports WHERE post_id = $1", [id]);
            res.json("---Report was Deleted---");
        }
        catch (err) {
            console.error(err.message);
        }
    }));
    app.listen(PORT, () => {
        console.log("listening on port", PORT);
    });
});
main();
