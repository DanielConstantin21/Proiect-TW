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

#### /artists - pune la dispozitie date despre artisti

Exemplu:
http://localhost:8080/api/v1/artists

GET va returna lista tuturor artistilor:

```
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
        ...

     ],
    "totalPages": 2,
    "currentPage": 1
}
```

POST va adauga un artist nou, mai jos un exemplu, intro functie async:

```
    const newArtist = await fetch(
          "http://localhost:8080/api/v1/artists",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
                "id": 40769,
                "title": "Rembrandt van Rijn",
                "birth_date": 1606
            }),
          }
        );
```

in cazul in care artistul cu id-ul specificat exista deja, va fi returnat

```
    "message": "Artist already exists"
```

sau dupa caz, alte mesaje de eroare.

PUT /:id - modifica artistul cu id-ul specificat, daca acesta exista in baza de date, daca id-ul nu exista va returna un mesaj.
Campurile ce se doresc a fi modificate se vor specifica in body.
Exemplu body pt un apel de tip PUT http://localhost:8080/api/v1/artists/33571

```
{
    "birth_date": 1886
}
```

Ca si in cazul crearii unui artist nou, se considera ca un artist trebuie sa aiba mai mult de 5 ani.

GET /:id - va returna artistul cu id-ul specificat si lucrarile asociate ("works"), un exemplu http://localhost:8080/api/v1/artists/33571 ar putea returna:

```
{
    "artist": {
    "id": 33571,
    "title": "Max Beckmann",
    "birth_date": 1884,
    "createdAt": "2023-12-23T19:28:51.370Z",
    "updatedAt": "2023-12-23T19:28:51.370Z"
    },
    "works": [
        {
            "id": 7122,
            "title": "Seated Boy",
            "imageId": "f2a2c17c-8eee-a1b8-cfe4-71bb59f3798e",
            "createdAt": "2023-12-26T16:57:47.519Z",
            "updatedAt": "2023-12-26T16:57:47.519Z",
            "artistId": 33571
        }
    ]
}
```
