const express = require('express');
const pool = require('../modules/pool');
const nodemailer = require('nodemailer');

let transport = {
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.REACT_APP_EMAIL_USER,
        pass: process.env.REACT_APP_EMAIL_PASS
    }
}

let transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages');
    }
});

const router = express.Router();

router.post('/addevent', (req, res) => {
    const qureyText = `INSERT INTO "event" ("event_name", "host_id", "description","street","apt","city","state","zip_code", "public") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING "event".id;`;
    const event = req.body.event
    pool.query(qureyText, [event.eventName, event.hostID, event.description, event.street, event.apt, event.city, event.state, event.zip, event.public])
        .then((result) => {
            let [id] = result.rows;
            const qureyText2 = `INSERT INTO "invited_list" ("event_id", "name", "email") VALUES ($1, $2, $3);`;
            for (let i = 0; i < req.body.sendEmail.list.length; i++) {
                console.log(i);
                let person = req.body.sendEmail.list[i]
                pool.query(qureyText2, [id.id, person.name, person.email])
                    .then((result) => {
                    }).catch((err) => {
                        console.log(err);
                        res.sendStatus(500);
                    })
            }
            for (let index = 0; index < req.body.sendEmail.list.length; index++) {
                const person = req.body.sendEmail.list[index];
                let name = person.name
                let email = person.email
                let host = req.body.sendEmail.host
                let event = req.body.event
                console.log(name, email, host, id.id);
                let mail = {
                    from: 'Eventure',
                    to: email,  //Change to email address that you want to receive messages on
                    subject: `Hello ${name}, You have been invited to an event from ${host}`,
                    text: `Go and see the details for ${event.eventName} here : http://localhost:3000/#/event/${id.id}`
                }
                transporter.sendMail(mail, (err, data) => {
                    if (err) {
                        res.json({
                            msg: 'fail'
                        })
                    } else {
                        res.json({
                            msg: 'success'
                        })
                    }
                })
            }

        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        })
    });

    router.get('/private/:id', (req, res) => {
        const qureyText = `SELECT * FROM "event" WHERE "event".host_id = $1 ORDER BY "id" ASC;`;
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.send(result.rows)
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })

    })

    router.get('/single/:id', (req, res) => {
        const qureyText = `SELECT * FROM "event" WHERE "event".id = $1`
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.send(result.rows)
            }).catch((err) => {
                console.log.og(err)
                res.sendStatus(500)
            })
    })

    router.put('/update', (req, res) => {
        const qureyText = `UPDATE "event" SET "event_name" = $1, "description" = $2,"street" = $3, "apt" = $4,"city" = $5,"state" = $6, "zip_code" = $7 WHERE "id" = $8;`
        const event = req.body.event
        pool.query(qureyText, [event.eventName, event.description, event.street, event.apt, event.city, event.state, event.zip, event.id])
            .then((result) => {
                res.sendStatus(200)
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            })
    })


    router.delete('/:id', (req, res) => {
        console.log('delete');
        const qureyText = 'DELETE FROM "invited_list" WHERE "event_id" = $1;';
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                const qureyText2 = `DELETE FROM "attending_list" WHERE "event_id" = $1;`;
                pool.query(qureyText2, [req.params.id])
                    .then((result) => {
                        const qureyText3 = `DELETE FROM "event" WHERE "id" = $1;`;
                        pool.query(qureyText3, [req.params.id])
                            .then((result) => {
                                res.sendStatus(200)
                            }).catch((err) => {
                                console.log(err);
                                res.sendStatus(500);
                            })
                    }).catch((err) => {
                        console.log(err)
                        res.sendStatus(500);
                    })

            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            })
    })

    router.get('/public', (req, res) => {
        const qureyText = `SELECT * FROM "event" WHERE "public" = 'TRUE' ORDER BY "id" ASC`;
        pool.query(qureyText)
            .then((result) => {
                res.send(result.rows)
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            })
    })


    router.get('/list/:id', (req, res) => {
        const qureyText = `SELECT * FROM "invited_list" WHERE "event_id" = $1;`;
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.send(result.rows)
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
    })

    router.delete('/deleteInvited/:id', (req, res) => {
        const qureyText = `DELETE FROM "invited_list" WHERE "id" = $1;`;
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.sendStatus(200)
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
    })

    router.post('/addGuest', (req, res) => {
        const qureyText = `INSERT INTO "invited_list" ("event_id", "name", "email") VALUES ($1, $2, $3);`;
        pool.query(qureyText, [req.body.id, req.body.name, req.body.email])
            .then((result) => {
                res.sendStatus(200);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
    })

    router.post('/addAttending', (req, res) => {
        console.log(req.body)
        const qureyText = `INSERT INTO "attending_list" ("event_id", "name", "item") VALUES ($1,$2,$3);`;
        pool.query(qureyText, [req.body.id, req.body.person.name, req.body.person.bringing])
            .then((result) => {
                res.sendStatus(200);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
    })

    router.get('/getAttending/:id', (req, res) => {
        const qureyText = `SELECT * FROM "attending_list" WHERE "event_id" = $1;`;
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.send(result.rows)
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            })
    })

    router.delete('/deleteAttending/:id', (req, res) => {
        const qureyText = `DELETE FROM "attending_list" WHERE "id" = $1;`
        pool.query(qureyText, [req.params.id])
            .then((result) => {
                res.sendStatus(200)
            }).catch((err) => {
                console.log(err)
                res.sendStatus(500);
            })
    })


    module.exports = router