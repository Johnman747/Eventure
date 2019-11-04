
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
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