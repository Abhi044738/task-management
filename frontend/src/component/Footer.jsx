export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-sm flex flex-col md:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        <div className="mt-2 md:mt-0">
          <a className="mr-4 hover:text-white" href="#">
            Privacy
          </a>
          <a className="mr-4 hover:text-white" href="#">
            Terms
          </a>
          <a className="hover:text-white" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
