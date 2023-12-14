"use server"
import { HomeLoggedIn, HomeLoggedOut } from './home/Home'
import { authOptions } from './api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'

export interface User {
  email: string | null | undefined;
  image: string | null | undefined;
  name: string | null | undefined;
}

export default async function App() {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <HomeLoggedIn userEmail={session.user?.email} userImage={session.user?.image} userName={session.user?.name}/>
    )
  }
  else {
    return (
      <HomeLoggedOut />
    )
  }
}
