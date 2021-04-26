// Dependencies
import express, { Application, ErrorRequestHandler, Request, Response } from "express"
import pool from './db'
import cors from 'cors'
import dotenv from 'dotenv'

// Config
dotenv.config()
const app: Application = express()
const PORT = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())

// Main Routes
const main = async () => {

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

    // Read All Posts
    app.get('/reports', async (req: Request, res: Response) => {
        try {
            const allReports = await pool.query("SELECT * FROM general_reports")
            res.json(allReports.rows)
        } catch (err) {
            console.error(err.message)
        }
    })

    // Update A Post
    app.put('/reports/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const { editReport } = req.body
            const updatePost = pool.query("UPDATE general_reports SET report = $1, updated_at = $2 WHERE id = $3", [editReport, Date(), id])
            res.json("---Post was Updated---")
        } catch (err) {
            console.error(err.message)
        }
    })
    
    // Delete Post
    app.delete('/reports/:id', async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const deletePost = await pool.query("DELETE FROM general_reports WHERE id = $1", [id])
            res.json("---Report was Deleted---")
        } catch (err) {
            console.error(err.message)
        }
    })

    app.listen(PORT, () => {
        console.log("listening on port", PORT)
    })

}

main() 