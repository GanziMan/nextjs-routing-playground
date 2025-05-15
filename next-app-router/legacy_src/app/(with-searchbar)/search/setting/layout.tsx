export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>setting Header</h1>
      {children}
    </div>
  );
}
