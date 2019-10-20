import express from "express"
import { SessionController } from "../controller/SessionController";

export const authApp = express.Router()
const sessionController = new SessionController

authApp.use(function (req, res, next) {
    const token = req.headers['x-access-token']

    if (token) {
        const validToken = sessionController.validateToken(token.toString())

        if (validToken != -1) {
            return next('router')
        } else {
            res.status(401).send("Invalid Token")
            next()
        }
    } else {
        res.status(401).send("Pass some Token in header")
        next()
    }
})