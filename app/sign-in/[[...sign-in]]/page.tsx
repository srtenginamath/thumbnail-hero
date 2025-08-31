import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#1e1e2e] to-[#111118] px-6 py-24">
      <SignIn />
    </div>
  );
}
