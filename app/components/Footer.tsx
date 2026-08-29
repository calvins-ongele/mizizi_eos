export function Footer() {
  return (
    <footer className="border-t mt-8 fixedbottom"  >
      <div className="max-w-5xl mx-auto px-4 py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} MyApp — All rights reserved
      </div>
    </footer>
  );
}
