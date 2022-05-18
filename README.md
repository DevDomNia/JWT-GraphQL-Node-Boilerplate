# jwt-graphql-node-boilerplate

GraphQL server for authentication using JWT (JSON Web Tokens)

- Express - Basic web server.
- ts-node - TypeScript execution for Node.js.
- TypeORM - ORM in Node.js.
- PostgreSQL - Open source object-relational database.
- apollo-server-express - Open-source GraphQL express server.
- type-graphql - TypeScript GraphQL schema and resolvers, using classes and decorators.

## Setup instructions

1. Input the credentials and server port in the **.env** file.

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_DATABASE=root
SERVER_PORT=4000
ACCESS_TOKEN_SECRET=<somesecret>
REFRESH_TOKEN_SECRET=<somedifferentsecret>
```

2. Run the following command to start a local development server on **http://localhost:4000**

```
npm start
```

## GraphQL

Navigate to **http://localhost:4000/graphql** to open the GraphQL playground.

## Executing queries

### Get specific user: Query

```graphql
query {
  getUserInfo {
    id
    username
    email
  }
}
```

### Get specific user: Response

```graphql

{
  "errors": [
    {
      "message": "Not authenticated!",
      ...
    }
  ],
  "data": null
}

```

### Register: Query

```graphql
mutation {
  register(username: "test", email: "test@test.com", password: "password") {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

### Register: Response

```graphql
{
  "data": {
    "register": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCB1c2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTg3NjMxOTcwLCJleHAiOjE1ODc2MzI4NzB9.TjUma8jFUw8WZ22uGuH_YoFJToIwEBZ3Wfpv8ST9H6k",
      "user": {
        "id": 1,
        "name": "test",
        "email": "test@test.com"
      }
    }
  }
}
```

### Login: Query

```graphql
mutation {
  login(username: "test", password: "password") {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

### Login: Response

```graphql
{
  "data": {
    "login": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCB1c2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTg3NjMxOTcwLCJleHAiOjE1ODc2MzI4NzB9.TjUma8jFUw8WZ22uGuH_YoFJToIwEBZ3Wfpv8ST9H6k",
      "user": {
        "id": 1,
        "name": "test",
        "email": "test@test.com"
      }
    }
  }
}
```

**HTTP HEADERS**

```
{
  "authorization": "bearer <your access token>"
}
```

Now try executing the getUserInfo query again. A valid response is received from the server:

```
{
  "data": {
    "getUserInfo": {
      "id": 1,
      "name": "test user",
      "email": "test@test.com"
    }
  }
}
```

Open the developer tools and keep the Network tab open while you execute a register or login mutation. If you observe the response headers from the network request, a refresh token is sent to the client with the key 'jref'. This can be saved on the client side for persisting the auth state and generating a new access token when it expires.

```
Set-Cookie: jref=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCB1c2VyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNTg3NjMxOTcwLCJleHAiOjE1ODc3MTgzNzB9.rk26u5z8FxGfW0FfdlrsaQLqydEUXwW8dVWxIXkTMIM; Path=/refresh_token; HttpOnly
```

<br>

**For generating a new access token, a valid refresh token (which was sent after a register or login mutation as a cookie) must be sent to the** `/refresh_token` **route.**<br>
