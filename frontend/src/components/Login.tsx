import { SignIn } from "@clerk/clerk-react";

function Login() {
  return (
    <div className="h-full w-full flex justify-center items-center py-6">
      <SignIn />
    </div>
  );
}
export default Login;
