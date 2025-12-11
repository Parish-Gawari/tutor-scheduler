// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-gray-50">
      <div className="max-w-5xl px-4 flex flex-col sm:flex-row justify-between items-center text-gray-700 text-sm">
        <p>© {new Date().getFullYear()} Parish Gawari</p>

        <div className="flex gap-4  sm:mt-0">
          <a
            href="https://github.com/Parish-Gawari"
            target="_blank"
            className="hover:text-blue-600"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/parish-gawari"
            target="_blank"
            className="hover:text-blue-600"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
