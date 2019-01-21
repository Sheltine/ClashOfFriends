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
query(first: 2, offset: 10) {
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
    followers(first: 1, offset: 1) {
      username,
    },
    following(first: 1, offset: 1) {
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

### Unfollow a user from its username

```graphql
mutation {
  unfollow(username: "amadeous") {
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

### Challenge a user

```graphql
mutation {
  challenge(username: "sheltine", categoryId: "5c2fe5379591d0aa36b42ceb") {
    id,
    username,
    pendingChallenges {
      challenger {
        username
      },
      challenged {
        username
      },
      format {
        name
      },
      theme {
        name
      },
      category {
        name
      },
      uploadTime,
      createdAt,
      updatedAt
    }
  }
}
```


### Accept a challenge

```graphql
mutation {
  acceptChallenge(challengeId: "5c40919762133708dae4bba5") {
    id
  }
}
```

### Reject a challenge

```graphql
mutation {
  rejectChallenge(challengeId: "5c40919762133708dae4bba5") {
    id
  }
}
```

### Get the list of challenges

```graphql
query {
  challenges(first: 10, offset: 5) {
    id,
    category {
      name
    },
    format {
      name
    },
    theme {
			name
    },
    comments(first: 2, offset: 1) {
      message,
      owner {
        username
      }
      createdAt,
      updatedAt
    }
    challenger {
      user {
        username
      }
      uploadDateStart,
      uploadDateEnd,
			input {
        content,
        uploadedAt,
        updatedAt
      },
      numberVotes,
    }
    challenged {
      user {
        username
      }
      uploadDateStart,
      uploadDateEnd,
			input {
        content,
        uploadedAt,
        updatedAt
      }
      numberVotes,
    },
    forWhomDidIVote {
      username
    },
    uploadTime,
    voteDateStart,
    voteDateEnd,
    createdAt,
    updatedAt
  }
}
```

### Comment a challenge

```
mutation {
  comment(challengeId: "5c4352dc4027c65dbc90dd81", message: "A new comment !") {
    comments {
      message,
      owner {
        username
      },
      createdAt
    }
  }
}
```

### Vote

```
mutation {
  vote (challengeId: "5c4352dc4027c65dbc90dd81", supporterId: "5c255339d881ff4ea5a81a25") {
    id,
    challenger {
      user {
        username
      }
    }
    challenged {
      user {
        username
      }
    },
    forWhomDidIVote {
      username
    }
  }
}
```