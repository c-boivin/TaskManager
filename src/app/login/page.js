import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Connexion",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <LoginForm />
    </div>
  );
}
