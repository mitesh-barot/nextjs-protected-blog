import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  );
}
