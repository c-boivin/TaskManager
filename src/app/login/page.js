import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <LoginForm />
    </div>
  );
}
