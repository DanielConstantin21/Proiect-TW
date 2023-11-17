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

Lista de favorite poate fi parcursa si deasemenea se pot sterge lucrari din aceasta.

## Specificatii:

#### Entitati

Artist (parinte)
Lucrare (copil)

#### Backend

NodeJS,
ExpressJS - framework,
Sequelize - ORM
MySQL - DB

#### Frontend

ReactJS
Axios
