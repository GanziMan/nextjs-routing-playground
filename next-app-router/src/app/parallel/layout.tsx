import Link from "next/link";

export default function Layout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div>
      <Link href="/parallel">parallel</Link>
      <Link href="/parallel/setting">Settings</Link>

      <br />
      {sidebar}

      {children}
    </div>
  );
}
