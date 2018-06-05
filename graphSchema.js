const fetch = require('node-fetch')
const env = require('./env')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull
} = require('graphql')

const GeoInput = new GraphQLInputObjectType({
  name: "GeoInput",
  fields: () => ({
    lat: {type: GraphQLString},
    lng: {type: GraphQLString}
  })
})

const AddressInput = new GraphQLInputObjectType({
  name: "AddressInput",
  fields: () => ({
    street: {type: GraphQLString},
    suite: {type: GraphQLString},
    city: {type: GraphQLString},
    zipcode: {type: GraphQLString},
    geo: {type: GeoInput}
  })
})

const CompanyInput = new GraphQLInputObjectType({
  name: "CompanyInput",
  fields: () => ({
    name: {type: GraphQLString},
    catchPhrase: {type: GraphQLString},
    bs: {type: GraphQLString}
  })
})

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
    id: {type: GraphQLInt},
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
        return fetch(`${env.dbURL}/users/${parent.id}/posts`)
          .then(res => res.json())
      }
    },
    todos: {
      type: new GraphQLList(Todo),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${parent.id}/todos`)
          .then(res => res.json())
      }
    },
    albums: {
      type: new GraphQLList(Album),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${parent.id}/albums`)
          .then(res => res.json())
      }
    }
  })
})

const Post = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: {type: GraphQLInt},
    title: {type: GraphQLString},
    body: {type: GraphQLString},
    userId: {type: GraphQLInt},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${parent.userId}`)
          .then(res => res.json())
      }
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts/${parent.id}/comments`)
          .then(res => res.json())
      }
    }
  })
})

const Comment = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: {type: GraphQLInt},
    email: {type: GraphQLString},
    body: {type: GraphQLString},
    postId: {type: GraphQLInt},
    post : {
      type: Post,
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts/${parent.postId}`)
          .then(res => res.json())
      }
    }
  })
})

const Album = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: {type: GraphQLInt},
    title: {type: GraphQLString},
    userId: {type: GraphQLInt},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${parent.userId}`)
          .then(res => res.json())
      }
    },
    photos: {
      type: new GraphQLList(Photo),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums/${parent.id}/photos`)
          .then(res => res.json())
      }
    }
  })
})

const Photo = new GraphQLObjectType({
  name: "Photo",
  fields: () => ({
    id: {type: GraphQLInt},
    title: {type: GraphQLString},
    url: {type: GraphQLString},
    thumbnailUrl: {type: GraphQLString},
    albumId: {type: GraphQLInt},
    album : {
      type: Album,
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums/${parent.albumId}`)
          .then(res => res.json())
      }
    }
  })
})

const Todo = new GraphQLObjectType({
  name: "Todo",
  fields: () => ({
    id: {type: GraphQLInt},
    title: {type: GraphQLString},
    completed: {type: GraphQLBoolean},
    userId: {type: GraphQLInt},
    user : {
      type: User,
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${parent.userId}`)
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
        return fetch(`${env.dbURL}/users`)
          .then(res => res.json())
      }
    },
    user: {
      type: User,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${args.id}`)
          .then(res => res.json())
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts`)
          .then(res => res.json())
      }
    },
    post: {
      type: Post,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts/${args.id}`)
          .then(res => res.json())
      }
    },
    comments: {
      type: new GraphQLList(Comment),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/comments`)
          .then(res => res.json())
      }
    },
    comment: {
      type: Comment,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/comments/${args.id}`)
          .then(res => res.json())
      }
    },
    todos: {
      type: new GraphQLList(Todo),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/todos`)
          .then(res => res.json())
      }
    },
    todo: {
      type: Todo,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/todos/${args.id}`)
          .then(res => res.json())
      }
    },
    albums: {
      type: new GraphQLList(Album),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums`)
          .then(res => res.json())
      }
    },
    album: {
      type: Album,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums/${args.id}`)
          .then(res => res.json())
      }
    },
    photos: {
      type: new GraphQLList(Photo),
      resolve(parent, args) {
        return fetch(`${env.dbURL}/photos`)
          .then(res => res.json())
      }
    },
    photo: {
      type: Photo,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return fetch(`${env.dbURL}/photos/${args.id}`)
          .then(res => res.json())
      }
    },
  }
})

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    addTodo: {
      type: Todo,
      args: {
        userId: {type: GraphQLInt},
        title: {type: GraphQLString},
        completed: {type: GraphQLBoolean}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/todos`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updateTodo: {
      type: Todo,
      args: {
        id: {type: GraphQLInt},
        userId: {type: GraphQLInt},
        title: {type: GraphQLString},
        completed: {type: GraphQLBoolean}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/todos/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deleteTodo: {
      type: Todo,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/todos/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    addPost: {
      type: Post,
      args: {
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        userId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updatePost: {
      type: Post,
      args: {
        id: {type: GraphQLInt},
        title: {type: GraphQLString},
        body: {type: GraphQLString},
        userId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deletePost: {
      type: Post,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/posts/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    addComment: {
      type: Comment,
      args: {
        email: {type: GraphQLString},
        body: {type: GraphQLString},
        postId: {type: GraphQLInt},
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/comments`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updateComment: {
      type: Post,
      args: {
        id: {type: GraphQLInt},
        email: {type: GraphQLString},
        body: {type: GraphQLString},
        postId: {type: GraphQLInt},
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/comments/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deleteComment: {
      type: Post,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/comments/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    addAlbum: {
      type: Album,
      args: {
        id: {type: GraphQLInt},
        title: {type: GraphQLString},
        userId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updateAlbum: {
      type: Album,
      args: {
        id: {type: GraphQLInt},
        title: {type: GraphQLString},
        userId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deleteAlbum: {
      type: Album,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/albums/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    addPhoto: {
      type: Photo,
      args: {
        title: {type: GraphQLString},
        url: {type: GraphQLString},
        thumbnailUrl: {type: GraphQLString},
        albumId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/photos`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updatePhoto: {
      type: Photo,
      args: {
        id: {type: GraphQLInt},
        title: {type: GraphQLString},
        url: {type: GraphQLString},
        thumbnailUrl: {type: GraphQLString},
        albumId: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/photos/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deletePhoto: {
      type: Photo,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/photos/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    addUser: {
      type: User,
      args: {
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        website: {type: GraphQLString},
        address: {type: AddressInput},
        company: {type: CompanyInput},
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users`, {
                  method: "POST",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    updateUser: {
      type: User,
      args: {
        id: {type: GraphQLInt},
        name: {type: GraphQLString},
        username: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
        website: {type: GraphQLString},
        address: {type: AddressInput},
        company: {type: CompanyInput},
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${args.id}`, {
                  method: "PATCH",
                  body: JSON.stringify({...args}),
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    },
    deleteUser: {
      type: User,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args) {
        return fetch(`${env.dbURL}/users/${args.id}`, {
                  method: "DELETE",
                  headers:{'Content-Type': 'application/json'}
                }).then(res => res.json())
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query,
  mutation
})