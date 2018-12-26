# Example of GraphQL commands

## Auth Commands
Thoses commands deliver a token that must be kept and use for other requests (see after).

### Register a new user

```graphql
mutation{
  register(user: {
    username: "sheltine",
    password: "coucou1234",
    email: "sheltine@email.com",
    birthdate: "25/11/11",
    firstname: "Jo",
    lastname: "Me"
  }) {
    token,
    user {
      username,
      createdAt
    }
  }
}
```

### Authenticate for the application

```graphql
query {
  auth(username:"amadeous", password: "coucou1234") {
    token,
    user {
      username,
      createdAt,
    }
  }
}
```

## Commands requiring a valid token
Tokens are provided with the register or auth commands.

### Get list of users

```graphql
query {
  users {
    username,
    birthdate,
    createdAt,
    followers {
      username,
    },
    following {
      username,
    },
  }
}
```

### Get a specific user

```graphql
query {
  user(username: "amadeous") {
    username,
    createdAt,
    followers {
      username,
    },
    following {
      username,
    },
  }
}
```


### Follow a user from its username

```graphql
mutation {
  follow(username: "amadeous") {
    username,
    followers {
      username,
    },
    following {
      username,
    },
  }
}
```