import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-black p-4 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg">Bank ERP</h1>
        <div className="flex gap-4">
          <Link href="/account" className="hover:text-gray-400">Account</Link>
          <Link href="/transaction" className="hover:text-gray-400">Transactions</Link>  {/* Fix path */}
          <Link href="/dashboard" className="hover:text-gray-400">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
