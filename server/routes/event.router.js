const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.post('/addevent', (req,res)=>{
    const qureyText = `INSERT INTO "event" ("event_name", "host_id", "description","street","apt","city","state","zip_code") VALUES($1,$2,$3,$4,$5,$6,$7,$8);`;
    const event = req.body.event
    pool.query(qureyText,[event.eventName, event.hostID, event.description,event.street,event.apt,event.city,event.state,event.zip])
    .then((result)=>{
        res.sendStatus(201)
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })
})

router.get('/private/:id', (req,res)=>{
    const qureyText = `SELECT * FROM "events" WHERE  `
})


module.exports = router