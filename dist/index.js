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
const axios_1 = __importDefault(require("axios"));
const express_jwt_1 = __importDefault(require("express-jwt"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
// Config
dotenv_1.default.config();
const app = express_1.default();
const PORT = process.env.PORT;
const DOMAIN = process.env.DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const AUDIENCE = process.env.AUDIENCE;
// Middleware
app.use(cors_1.default());
app.use(express_1.default.json());
// JWT Config
const jwtCheck = express_jwt_1.default({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${DOMAIN}/.well-known/jwks.json`
    }),
    audience: `${AUDIENCE}`,
    issuer: `https://${DOMAIN}/`,
    algorithms: ['RS256']
});
// Main Routes
//////////////
// Auth0 MGMT API
app.get('/userdata/:id', jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Config request options
    let options = {
        method: `POST`,
        url: `https://${DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
            grant_type: 'client_credentials',
            client_id: `${CLIENT_ID}`,
            client_secret: `${CLIENT_SECRET}`,
            audience: `https://${DOMAIN}/api/v2/`
        }
    };
    //Fetch and format access token
    const ACCESS_TOKEN = yield axios_1.default.request(options).then((res) => {
        return `Bearer ${res.data.access_token}`;
    }).catch((err) => {
        console.error(err.message);
    });
    // Fetch apps/clients
    const user = yield axios_1.default.get(`https://${DOMAIN}/api/v2/users/${req.params.id}`, {
        headers: { authorization: ACCESS_TOKEN }
    }).then((res) => {
        return res.data;
    }).catch((err) => {
        console.error(err.message);
    });
    res.json(user);
}));
// GENERAL REPORTS
// Create General Report
app.post('/reports', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { genReport } = req.body;
        const newReport = yield db_1.default.query(`INSERT INTO general_reports (report, created_at) VALUES ($1, $2) RETURNING *`, [genReport, Date()]);
        res.json(newReport.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Read All Reports
app.get('/reports', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allReports = yield db_1.default.query("SELECT * FROM general_reports");
        res.json(allReports.rows);
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Update A Report
app.put('/reports/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { editReport } = req.body;
        const updateReport = db_1.default.query("UPDATE general_reports SET report = $1, updated_at = $2 WHERE id = $3", [editReport, Date(), id]);
        res.json("---Post was Updated---");
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Delete A Report
app.delete('/reports/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteReport = yield db_1.default.query("DELETE FROM general_reports WHERE id = $1", [id]);
        res.json("---Report was Deleted---");
    }
    catch (err) {
        console.error(err.message);
    }
}));
// RIVERS
// Create New River
app.post('/rivers', jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRiver = yield db_1.default.query(`INSERT INTO rivers (river_name, station_id, hatches, flies, river_report, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [req.body.riverName, req.body.stationId, req.body.hatches, req.body.flies, req.body.riverReport, Date()]);
        // res.json(newReport.rows[0])
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Read All Rivers
app.get('/rivers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRivers = yield db_1.default.query("SELECT * FROM rivers");
        res.json(allRivers.rows);
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Update A River
app.put('/rivers/:id', jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { river_name, river_report, flies } = req.body;
        console.log(req.body);
        const updateRiver = db_1.default.query("UPDATE rivers SET river_name = $1, river_report = $2, flies = $3, updated_at = $4 WHERE id = $5", [river_name, river_report, flies, Date(), id]);
        res.json("---River was Updated---");
    }
    catch (err) {
        console.error(err.message);
    }
}));
// Delete A River
app.delete('/rivers/:id', jwtCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params);
        const { id } = req.params;
        const deleteRiver = yield db_1.default.query("DELETE FROM rivers WHERE id = $1", [id]);
        res.json("---Report was Deleted---");
    }
    catch (err) {
        console.error(err.message);
    }
}));
//Listener
app.listen(PORT, () => {
    console.log("listening on port", PORT);
});
