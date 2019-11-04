# Eventure

Eventure is an easy to use party planner web app. Users can create, update and delete events. They can also see events in their area. When an event is created the user it sends out emails with a dynamicly created url for the guests to click and be grought to the website to RSVP. 

## Built With

    material-ui
    react-google-maps api
    axios
    bcrypt
    bootstrap
    cookie-session
    dotenv
    express
    nodemailer
    passport
    passport-local
    pg
    prop-types
    react
    react-dom
    react-geocode
    react-redux
    react-router-dom
    react-scripts
    redux
    redux-logger
    redux-saga
    semantic-ui-react

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

set up a database called `party-planner` 

`
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR (80) NOT NULL,
    "email" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "admin_level" INT default 3
);

CREATE TABLE "event" (
	"id" SERIAL PRIMARY KEY,
	"event_name" VARCHAR (80) NOT NULL,
	"host_id" INT REFERENCES "user",
	"description" VARCHAR (1000) NOT NULL,
	"street" VARCHAR (100) NOT NULL,
	"apt" VARCHAR (20) NOT NULL,
	"city" VARCHAR (50) NOT NULL,
	"state" VARCHAR (20) NOT NULL,
	"zip_code" INT NOT NULL,
	"public" BOOLEAN default false
);

CREATE TABLE "attending_list" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INT REFERENCES "event",
	"name" VARCHAR (80) NOT NULL,
	"item" VARCHAR (50) NOT NULL
);

CREATE TABLE "invited_list" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INT REFERENCES "event",
	"name" VARCHAR (80) NOT NULL,
	"email" VARCHAR (80) NOT NULL
);

CREATE TABLE "invited_event" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INT REFERENCES "event",
	"user_id" INT REFERENCES "user"
);
`

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Postgress](https://www.postgresql.org) running on port 5432
- You will need a google maps API key


### Installing

Steps to get the development environment running.

1. Download this project.
2. `npm install`
3. `npm run server`
4. `npm run client`

## Screen Shot


## Documentation

Read the scope document [here](https://docs.google.com/document/d/15DgTekWKe7uzSQrWay-rUyRsrxV-yQMfynm3iKEfi_Q)

### Completed Features

- [x] Set up user registration
- [x] Created routes and links to other pages
- [x] Made the public views of the site avalible to all who visit
- [x] Made private view of events that are hosted by a logged in user
- [x] Made form page to allow users to add events and send emails to invited guests
- [x] Made edit pages for the editing of public and private events.
- [x] Set up admin level views of the site to moniter and delete public events
- [x] Set up NodeMailer to send emails with dynamic urls for the users guests
- [x] Set up google maps to show the location of each event

### Next Steps

- [] Set up the ability to send texts with Twillio
- [] Add search bar to look for events
- [] Add chats for each events

## Authors

* Johnathan Moes


## Acknowledgments

* Prime Digital Academy
