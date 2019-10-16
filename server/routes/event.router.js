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
    const qureyText = `SELECT * FROM "event" WHERE "event".host_id = $1;`;
    pool.query(qureyText,[req.params.id])
    .then((result)=>{
        res.send(result.rows)
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(500);
    })

})

router.get('/single/:id', (req,res)=>{
    const qureyText = `SELECT * FROM "event" WHERE "event".id = $1`
    pool.query(qureyText,[req.params.id])
    .then((result)=>{
        res.send(result.rows)
    }).catch((err)=>{
        console.log.og(err)
        res.sendStatus(500)
    })
})

router.put('/update', (req,res)=>{
    const qureyText = `UPDATE "event" SET "event_name" = $1, "description" = $2,"street" = $3, "apt" = $4,"city" = $5,"state" = $6, "zip_code" = $7 WHERE "id" = $8;`
    const event = req.body.event
    pool.query(qureyText,[event.eventName, event.description, event.street, event.apt, event.city, event.state, event.zip, event.id])
    .then((result)=>{
        res.sendStatus(200)
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(500);
    })
})


router.delete('/:id', (req,res)=>{
    console.log('delete');
    const qureyText = 'DELETE FROM "event" WHERE "id" = $1;'
    pool.query(qureyText,[req.params.id])
    .then((result)=>{
        res.sendStatus(200)
    }).catch((err)=>{
        console.log(err)
        res.sendStatus(500);
    })
})

module.exports = router