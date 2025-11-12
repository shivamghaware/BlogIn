import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  );
}
