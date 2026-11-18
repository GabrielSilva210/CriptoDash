import SearchBar from "./SearchBar";

export default function Header({ onSearch, disabled }) {
  return (
    <header className="flex h-16 flex-shrink-0 items-center bg-[#0b1623] px-8">
      <div className="w-full max-w-xl">
        <SearchBar onSearch={onSearch} disabled={disabled} />
      </div>
    </header>
  );
}