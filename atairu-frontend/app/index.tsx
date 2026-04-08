import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Redirect href={"/login" as any} />
  }

  return <Redirect href={"/home" as any} />
}