export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="mb-2 md:mb-0">
          © {new Date().getFullYear()} Task Manager. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-400 transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Terms
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
