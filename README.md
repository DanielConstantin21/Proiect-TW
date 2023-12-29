# Proiect-TW 2023-2024

Constantin Daniel gr. 1115 ID

---

TEMA: 11, Manager de artisti favoriţi integrat cu ~~DeviantArt~~ Art Institute of Chicago.

Aplicatie back-end RESTful care accesează date stocate într-o bază de date relațională
pe baza unui API de persistenţă și date expuse de un serviciu
extern și frontend SPA realizat cu un framework bazat pe componente.

## Descriere:

Aplicatia foloseste datele si imaginile obtinute cu ajutorul API-ul public al [Institutului de Arta din Chicago](https://api.artic.edu/docs/)

Este posibila filtrarea dupa artist sau lucrare, precum si cautarea unor termeni.

Utilizatorul poate vedea detalii despre o lucrare si o poate adauga in colectia sa.

Colectia personala (My Collection) poate fi parcursa si se pot sterge artisti sau lucrari din aceasta.

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

POST va adauga un artist nou, mai jos un exemplu, intr-o functie async:

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

DELETE /:id - sterge din baza de date artistul cu id-ul specificat.
De exemplu, un request de tip DELETE la http://localhost:8080/api/v1/artists/40 va sterge din baza de date artistul cu id-ul 40, daca acesta exista, si toate lucrarile asociate acestuia.

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

GET va returna lista tuturor artistilor din baza de date:

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

GET /search - se pot face cautari dupa o parte a numelui artistului si diverse intervale ale anului nasterii.
Requestul este de forma http://localhost:8080/api/v1/artists/search? urmat de parametrii cautarii title, gt, lt, despartiti prin '&'. Exemplu: http://localhost:8080/api/v1/artists/search?title=cl&gt=1600&lt=1800 va returna toti artistii care contin 'cl' in nume si sunt nascuti intre 1600 si 1800 (inclusiv). Oricare dintre parametrii cautarii poate lipsi, in cazul in care nu se mentioneaza nici un parametru, toate inregistrarile din baza de date vor fi returnate.
Datele returnate sunt paginate.

#### /works - pune la dispozitie date despre lucrarile asociate artistilor

Exemplu:
http://localhost:8080/api/v1/works

POST va adauga o lucrare noua, mai jos un exemplu, intro functie async:

```
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
                "id": 3752,
                "title": "The Madonna of the Rosary",
                "imageId": "d0979087-dc1b-f259-a23f-169cdced27ee",
                "artistId": 37116
            }
          }
```

daca artistul cu id-ul specificat nu exista, va fi returnat un mesaj de eroare.
daca lucrarea cu id-ul specificat exista deja in baza de date, va fi returnat un mesaj de eroare, precum si daca unul dintre campuri lipseste sau este null.

PUT /:id - modifica lucrarea cu id-ul specificat, daca acesta exista in baza de date, daca id-ul nu exista va returna un mesaj de eroare.
Campurile ce se doresc a fi modificate se vor specifica in body.

DELETE /:id - sterge din baza de date lucrarea cu id-ul specificat.
De exemplu, un request de tip DELETE la http://localhost:8080/api/v1/works/27281 va sterge din baza de date lucrarea cu id-ul 27281, daca acesta exista.

GET /:id - va returna lucrarea cu id-ul specificat, un exemplu http://localhost:8080/api/v1/works/33571 ar returna, in cazul in care acest id se afla in baza de date, ceva de tipul:

```
{
    "id": 20199,
    "title": "Final Study for \"Bathers at Asnières\"",
    "imageId": "1db67905-d421-95bf-1e91-4b60dd776886",
    "createdAt": "2023-12-23T20:32:36.408Z",
    "updatedAt": "2023-12-23T20:32:36.408Z",
    "artistId": 40810
}
```

GET va returna lista tuturor lucrarilor din baza de date, cu paginatie.
Exemplu: http://localhost:8080/api/v1/works

```
{
    "totalItems": 10,
    "works": [
        {
            "id": 3752,
            "title": "The Madonna of the Rosary",
            "imageId": "d0979087-dc1b-f259-a23f-169cdced27ee",
            "createdAt": "2023-12-23T20:30:06.427Z",
            "updatedAt": "2023-12-23T20:30:06.427Z",
            "artistId": 37116
        },
        ....
    ],
    "totalPages": 1,
    "currentPage": 1
}
```

GET /artist/:id - va returna lista lucrarilor artistului cu id-ul specificat, cu paginatie.
Exemplu: http://localhost:8080/api/v1/works/artist/35801 va returna lista lucrarilor artistului cu id-ul 35801, intr-un array "works", raspuns de forma:

```
{
    "totalItems": 1,
    "works": [
        {
            "id": 27281,
            "title": "Madam Pompadour",
            "imageId": "fdc1a755-ff86-487d-f16b-f03c40a30bee",
            "createdAt": "2023-12-23T21:50:44.121Z",
            "updatedAt": "2023-12-23T21:50:44.121Z",
            "artistId": 35801
        }
    ],
    "totalPages": 1,
    "currentPage": 1
}
```

GET /search - se pot face cautari dupa o parte a numelui lucrarii.
Requestul este de forma http://localhost:8080/api/v1/works/search? urmat de parametrul cautarii, title.
Exemplu: http://localhost:8080/api/v1/works/search?title=Mad va returna lucrarile care contin 'mad' (case insensitive) in titlu. In cazul in care nu se mentioneaza nici un parametru, toate inregistrarile din baza de date vor fi returnate.
Datele returnate sunt paginate.

#### /external-api - pune la dispozitie datele din api-ul extern

GET /external-api returneaza lucrarile din api-ul extern, care au artist_id si picture_id diferit de null, si numele artistului.
Exemplu: http://localhost:8080/api/v1/external-api va returna informatiile din prima pagina a api-ului Cicago Art Institute, in forma:

```
{
    "data": [
        {
            "id": 3752,
            "title": "The Madonna of the Rosary",
            "birth_date": 1440,
            "idArtist": 37116,
            "titleArtist": "Israhel van Meckenem, the younger",
            "exists": true
        },
        {
            "id": 6010,
            "title": "Number 19",
            ....

    ],
    "pagination": {
        "total": 123673,
        "limit": 10,
        "offset": 0,
        "total_pages": 12368,
        "current_page": 1,
        "next_url": "https://api.artic.edu/api/v1/artworks?page=2&limit=10&fields=id%2Ctitle%2Cimage_id%2Cartist_id"
    }
```

Sunt returnate si informatii despre paginare, de asemenea "exists" returneaza true/false, dupa verificarea id-ului in baza de date.
pot fi folositi in query si parametrii de paginare (page, limit)

/artists/:id
GET - returneaza informatiile din api-ul extern, referitoare la artistul cu id-ul mentionat

#### Paginare

Listingurile si cautarile sunt paginate. Vor fi returnate 12 inregistrari per pagina, in mod inplicit. Paginarea poate fi controlata prin intermediul urmatorilor parametrii:
*page , pentru a specifica o pagina anume (porneste de la 1, valoare implicita 1);
*limit , pentru a specifica numarul de inregistrari per pagina (valoare implicita 12)

Exemplu, pentru un request GET http://localhost:8080/api/v1/works/search?title=Mad&page=1&limit=2 , raspunsul va fi de forma:

```
{
    "totalItems": 3,
    "works": [
        {
            "id": 3752,
            "title": "The Madonna of the Rosary",
            "imageId": "d0979087-dc1b-f259-a23f-169cdced27ee",
            "createdAt": "2023-12-23T20:30:06.427Z",
            "updatedAt": "2023-12-23T20:30:06.427Z",
            "artistId": 37116
        },
        {
            "id": 27281,
            "title": "Madam Pompadour",
            "imageId": "fdc1a755-ff86-487d-f16b-f03c40a30bee",
            "createdAt": "2023-12-23T21:50:44.121Z",
            "updatedAt": "2023-12-23T21:50:44.121Z",
            "artistId": 35801
        },
        ...
    ],
    "totalPages": 2,
    "currentPage": "1"
}
```

#### Mentiuni

Avand in vedere faptul ca api-ul se bazeaza pe datele Art Institute of Chicago API, id-urile nu sunt implementate cu incrementare.
Campul "imageId" reprezinta identificatorul pe baza caruia se vor accesa imaginile conform [IIIF Image API](https://api.artic.edu/docs/#images)
