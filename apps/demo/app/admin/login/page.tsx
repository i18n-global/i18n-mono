import { LoginForm } from "@/app/_features/auth-login";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </main>
  );
}
