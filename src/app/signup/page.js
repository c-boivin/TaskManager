import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Inscription",
};

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <SignupForm />
    </div>
  );
}
