import "reflect-metadata"
import express from "express"
import { asyncConnection } from "../connection";
import bodyParser from "body-parser";
import { Route } from "../config/route";
import { authApp } from "./AuthAPI";
import { Skill } from "../entity/Skill";
import { SkillController } from "../controller/SkillController";

export const skillApp = express();
skillApp.use(bodyParser.urlencoded({ extended: true }));
skillApp.use(bodyParser.json());

const skillControler = new SkillController
const route = new Route

//region requests to SKILLS

skillApp.post(route.getSkillRoute() + '/insert', authApp, async (req, res, next) => {

    asyncConnection().then(async () => {

        const skill = new Skill
        skill.newSkill(
            req.body.description,
        )

        const result = await skillControler.addSkill(skill)
        res.send({
            id: result.identifiers[0],
            result: "Skill successfully created"
        })
    })
    
})

skillApp.post(route.getSkillRoute() + '/all', authApp, async (req, res, next) => {

    asyncConnection().then(async () => {

        res.send(await skillControler.getSkills())

    })

});