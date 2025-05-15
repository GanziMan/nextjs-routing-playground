import SearchBar from "../../components/searchbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SearchBar />
      {children}
    </div>
  );
}
