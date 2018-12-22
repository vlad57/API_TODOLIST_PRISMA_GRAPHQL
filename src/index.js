const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    posts: (_, args, context, info) => {
      return context.prisma.query.posts(
        {
          where: {
            OR: [
              { title_contains: args.searchString },
              { content_contains: args.searchString },
            ],
          },
        },
        info,
      )
    },
    getPost: (_, args, context, info) => {
      return context.prisma.query.post(
        {
          where: {
            id: args.id,
          },
        },
        info,
      )
    },
  },
  Mutation: {
    createDraft: (_, args, context, info) => {
      return context.prisma.mutation.createPost(
        {
          data: {
            title: args.title,
            content: args.content,
            date: args.date,
            color: args.color,
            favoris: args.favoris,
            position: args.position,
          },
        },
        info,
      )
    },
    deletePost: (_, args, context, info) => {
      return context.prisma.mutation.deletePost(
        {
          where: {
            id: args.id,
          },
        },
        info,
      )
    },
    updatePost: (_, args, context, info) => {
      return context.prisma.mutation.updatePost(
        {
          data: {
            title: args.title,
            content: args.content,
            date: args.date,
            color: args.color,
            favoris: args.favoris,
            position: args.position,
          },
          where: {
            id: args.id,
          }
        }
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/vladislavvorobyev12-6d2bf5/android_DIT_api/dev',
    }),
  }),
})
server.start(() => console.log(`GraphQL server is running on http://localhost:4000`))
