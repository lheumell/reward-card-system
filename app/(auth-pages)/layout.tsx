export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 justify-center items-center my-12 bg-[url(../assets/bg.png)] bg-cover bg-repeat-y bg-center  h-[calc(100vh-300px)]">
      {children}
    </div>
  );
}
