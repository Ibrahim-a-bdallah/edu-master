import { redirect } from "next/navigation";

export default function Home() {
  // const router = useRouter();
  const status = null;
  if (!status) {
    return redirect("/login");
  }
}
