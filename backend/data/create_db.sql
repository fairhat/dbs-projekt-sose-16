CREATE TYPE gender AS ENUM ('m', 'f');

CREATE TABLE IF NOT EXISTS zwinger (
  zid             bigserial primary key,
  name            varchar(30) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS hunde (
  hid             bigserial primary key,
  name            varchar(30) NOT NULL UNIQUE,
  geschlecht      gender,
  geburtsjahr     integer default NULL,
  geburtsland     varchar(20) default NULL,
  aufenthaltsland varchar(20) default NULL,
  vater           integer default NULL REFERENCES hunde,
  mutter          integer default NULL REFERENCES hunde,
  zwinger         integer default NULL REFERENCES zwinger
);

CREATE TABLE IF NOT EXISTS rennen (
  rid           bigserial primary key,
  jahr          integer default NULL,
  ort           varchar(30) default NULL
);

CREATE TABLE IF NOT EXISTS ergebnisse (
  eid           bigserial primary key,
  distanz       integer,
  rang          integer,
  hund          integer NOT NULL REFERENCES hunde,
  rennen        integer NOT NULL REFERENCES rennen,
  punkte        integer,
  laeufe        integer
);
