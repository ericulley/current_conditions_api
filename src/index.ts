// Dependencies
import express, { Application, ErrorRequestHandler, Request, Response } from "express"
import pool from './db'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'

// Config
dotenv.config()
const app: Application = express()
const PORT = process.env.PORT
const DOMAIN = process.env.DOMAIN
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const AUDIENCE = process.env.AUDIENCE

// Middleware
app.use(cors())
app.use(express.json())

// JWT Config
const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true, 
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${DOMAIN}/.well-known/jwks.json`
    }), 
    audience: `${AUDIENCE}`,
    issuer: `https://${DOMAIN}/`,
    algorithms: ['RS256']
})

// Main Routes
//////////////

// Auth0 MGMT API

app.get('/userdata/:id', jwtCheck, async (req: Request, res: Response) => {
     // Config request options
    let options = {
        method: `POST`,
        url: `https://${DOMAIN}/oauth/token`,
        headers: {'content-type': 'application/json'},
        data: {
            grant_type: 'client_credentials',
            client_id: `${CLIENT_ID}`,
            client_secret: `${CLIENT_SECRET}`,
            audience: `https://${DOMAIN}/api/v2/`
        }
    }

    //Fetch and format access token
    const ACCESS_TOKEN = await axios.request(options).then((res) => {
        return `Bearer ${res.data.access_token}`
    }).catch((err) => {
        console.error(err.message)
    })

    // Fetch apps/clients
    const user = await axios.get(`https://${DOMAIN}/api/v2/users/${req.params.id}`, {
        headers: { authorization: ACCESS_TOKEN }
    }).then((res) => {
            return res.data
    }).catch((err) => {
        console.error(err.message)
    })

    res.json(user)

})

// GENERAL REPORTS
// Create General Report
app.post('/reports', async (req: Request, res: Response) => {
    try {
        const { genReport } = req.body
        const newReport = await pool.query(`INSERT INTO general_reports (report, created_at) VALUES ($1, $2) RETURNING *`, [genReport, Date()])
        res.json(newReport.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// Read All Reports
app.get('/reports', async (req: Request, res: Response) => {
    try {
        const allReports = await pool.query("SELECT * FROM general_reports")
        res.json(allReports.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// Update A Report
app.put('/reports/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { editReport } = req.body
        const updateReport = pool.query("UPDATE general_reports SET report = $1, updated_at = $2 WHERE id = $3", [editReport, Date(), id])
        res.json("---Post was Updated---")
    } catch (err) {
        console.error(err.message)
    }
})

// Delete A Report
app.delete('/reports/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const deleteReport = await pool.query("DELETE FROM general_reports WHERE id = $1", [id])
        res.json("---Report was Deleted---")
    } catch (err) {
        console.error(err.message)
    }
})


// RIVERS
// Create New River
app.post('/rivers', jwtCheck, async (req: Request, res: Response) => {
    try {
        const newRiver = await pool.query(`INSERT INTO rivers (river_name, station_id, hatches, flies, river_report, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [req.body.riverName, req.body.stationId, req.body.hatches, req.body.flies, req.body.riverReport, Date()])
        // res.json(newReport.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// Read All Rivers
app.get('/rivers', async (req: Request, res: Response) => {
    try {
        const allRivers= await pool.query("SELECT * FROM rivers")
        res.json(allRivers.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// Update A River
app.put('/rivers/:id', jwtCheck, async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { river_name, river_report, flies } = req.body
        console.log(req.body)
        const updateRiver = pool.query("UPDATE rivers SET river_name = $1, river_report = $2, flies = $3, updated_at = $4 WHERE id = $5", [river_name, river_report, flies, Date(), id])
        res.json("---River was Updated---")
    } catch (err) {
        console.error(err.message)
    }
})

// Delete A River
app.delete('/rivers/:id', jwtCheck, async (req: Request, res: Response) => {
    try {
        console.log(req.params)
        const { id } = req.params
        const deleteRiver = await pool.query("DELETE FROM rivers WHERE id = $1", [id])
        res.json("---Report was Deleted---")
    } catch (err) {
        console.error(err.message)
    }
})

//Listener
app.listen(PORT, () => {
    console.log("listening on port", PORT)
})
