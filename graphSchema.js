const fetch = require('node-fetch');
const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema
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
    }
  }
})

module.exports = new GraphQLSchema({
  query
})