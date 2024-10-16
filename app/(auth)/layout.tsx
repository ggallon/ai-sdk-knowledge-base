export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-900">
      {children}
    </div>
  );
}
