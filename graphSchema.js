const fetch = require('node-fetch');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} = require('graphql');

const Geo = new GraphQLObjectType({
  name: "Geo",
  fields: () => ({
    lat: {type: GraphQLString},
    lng: {type: GraphQLString}
  })
})

const Address = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    street: {type: GraphQLString},
    suite: {type: GraphQLString},
    city: {type: GraphQLString},
    zipcode: {type: GraphQLString},
    geo: {type: Geo}
  })
})

const Company = new GraphQLObjectType({
  name: "Company",
  fields: () => ({
    name: {type: GraphQLString},
    catchPhrase: {type: GraphQLString},
    bs: {type: GraphQLString}
  })
})

const User = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {type: GraphQLString},
    name: {type: GraphQLString},
    username: {type: GraphQLString},
    email: {type: GraphQLString},
    phone: {type: GraphQLString},
    website: {type: GraphQLString},
    address: {type: Address},
    company: {type: Company},
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.id}/posts`)
          .then(res => res.json())
      }
    },
    todos: {
      type: new GraphQLList(Todo),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.id}/todos`)
          .then(res => res.json())
      }
    },
    albums: {
      type: new GraphQLList(Album),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.id}/albums`)
          .then(res => res.json())
      }
    }
  })
})

const Post = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: {type: GraphQLString},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    userId: {type: GraphQLString},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.userId}`)
          .then(res => res.json())
      }
    }
  })
})

const Todo = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: {type: GraphQLString},
    title: {type: GraphQLString},
    completed: {type: GraphQLBoolean},
    userId: {type: GraphQLString},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.userId}`)
          .then(res => res.json())
      }
    }
  })
})

const Album = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: {type: GraphQLString},
    title: {type: GraphQLString},
    userId: {type: GraphQLString},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${parent.userId}`)
          .then(res => res.json())
      }
    }
  })
})

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users`)
          .then(res => res.json())
      }
    },
    user: {
      type: User,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`http://localhost:3000/users/${args.id}`)
          .then(res => res.json())
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/posts`)
          .then(res => res.json())
      }
    },
    post: {
      type: Post,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`http://localhost:3000/posts/${args.id}`)
          .then(res => res.json())
      }
    },
    todos: {
      type: new GraphQLList(Todo),
      resolve(parent, args) {
        return fetch(`http://localhost:3000/todos`)
          .then(res => res.json())
      }
    },
    todo: {
      type: Todo,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`http://localhost:3000/todos/${args.id}`)
          .then(res => res.json())
      }
    },
    albums: {
      type: new GraphQLList(Album),
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`http://localhost:3000/albums`)
          .then(res => res.json())
      }
    },
    album: {
      type: Album,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`http://localhost:3000/albums/${args.id}`)
          .then(res => res.json())
      }
    },

  }
})

module.exports = new GraphQLSchema({
  query
})