CREATE TYPE gender AS ENUM ('m', 'f');

CREATE TABLE IF NOT EXISTS besitzer (
  bid           bigserial primary key,
  name          varchar(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS rassen (
  rid         bigserial primary key,
  name        varchar(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS rennen (
  vid           bigserial primary key,
  zeitpunkt     timestamp NOT NULL,
  ort           varchar(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS hunde (
  hid             bigserial primary key,
  name            varchar(20) NOT NULL,
  geburtstag      timestamp default NULL,
  vater           integer default NULL REFERENCES hunde,
  mutter          integer default NULL REFERENCES hunde,
  geburtsland     varchar(20) default NULL,
  aufenthaltsland varchar(20) default NULL,
  geschlecht      gender,
  besitzer        integer default NULL REFERENCES besitzer
);

CREATE TABLE IF NOT EXISTS zwinger (
  zid           bigserial primary key,
  name          varchar(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS laeufe (
  lid           bigserial primary key,
  distanz       integer NOT NULL,
  veranstaltung integer NOT NULL REFERENCES rennen
);

CREATE TABLE IF NOT EXISTS hunde_lauf (
  hlid          bigserial primary key,
  hund          integer NOT NULL REFERENCES hunde,
  lauf          integer NOT NULL REFERENCES laeufe
);

CREATE TABLE IF NOT EXISTS ergebnisse (
  eid           bigserial primary key,
  platzierung   integer NOT NULL,
  zeitpunkt     timestamp NOT NULL,
  lauf          integer NOT NULL REFERENCES laeufe
);
