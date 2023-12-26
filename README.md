# Proiect-TW 2023-2024

Constantin Daniel gr. 1115 ID

---

TEMA: 11, Manager de artisti favoriţi integrat cu ~~DeviantArt~~ Art Institute of Chicago.

Aplicatie back-end RESTful care accesează date stocate într-o bază de date relațională
pe baza unui API de persistenţă și date expuse de un serviciu
extern și frontend SPA realizat cu un framework bazat pe componente.

## Descriere:

Aplicatia foloseste datele si imaginile obtinute cu ajutorul API-ul public al [Institutului de Arta din Chicago](https://api.artic.edu/docs/)

Este posibila filtrarea dupa artist sau departament, precum si cautarea unor termeni.

Utilizatorul poate vedea detalii despre o lucrare si o poate adauga in lista sa de favorite.

Lista de favorite poate fi parcursa si deasemenea se pot sterge artisti sau lucrari din aceasta.

## Specificatii:

#### Entitati

Artist (parinte)
Work (copil)

#### Backend

NodeJS,
ExpressJS - framework,
Sequelize - ORM
SQLite- DB

#### Frontend

ReactJS,
Axios

## Serviciu RESTful

#### Introducere

Serviciul nu necesita autentificare si pune la dispozitie date in format JSON.
Adresa la care se gaseste serviciul: http://localhost:8080/api/v1

#### Endpoint-uri

/artists - pune la dispozitie date despre artisti
Exemplu:
http://localhost:8080/api/v1/artists

```
va returna lista tuturor artistilor:
{
"totalItems": 20,
"artists": [
{
"id": 24597,
"title": "Elizabeth Sparhawk-Jones",
"birth_date": 1885,
"createdAt": "2023-12-23T22:16:15.455Z",
"updatedAt": "2023-12-23T22:16:15.455Z"
},
{
"id": 31232,
"title": "Claude Mozambic",
"birth_date": 1690,
...
```
