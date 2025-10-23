import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
};

export const getRequiredUser = async () => {
  const user = await getUser();

  if (!user) {
    //or call unauthorized()
    redirect("/login");
  }

  return user;
};
