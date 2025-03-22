// import NextAuth from 'next-auth'

// declare module "next-auth" {
//     interface Session {
//         user: {
//             _id: string,
//             name: string,
//             email: string,
//             role: string,
//             token: string
//         }
//     }
// }

import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      name: string
      email: string
      role: string
      id: string
    }
    accessToken: string
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    token: string // your backend access token
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    name: string
    email: string
    role: string
    accessToken: string
  }
}
