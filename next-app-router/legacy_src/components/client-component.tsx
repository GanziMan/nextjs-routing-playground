"use client";

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Client component rendered");
  return <>{children}</>;
}
