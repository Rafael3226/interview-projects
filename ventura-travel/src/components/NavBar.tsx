import logo from "../assets/logo.svg";

export default function NavBar() {
  return (
    <nav className="bg-transparent border-b-2 border-gray-custom">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-60 p-4">
        <a
          href="https://www.venturatravel.org/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src={logo} className="h-8" alt="Ventura travel logo." />
        </a>
      </div>
    </nav>
  );
}
