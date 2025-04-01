import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-black p-4 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg">Bank ERP</h1>
        <div className="flex gap-4">
        <Link href="/admin/dashboard" className="hover:text-gray-400">Dashboard</Link>
        <Link href="/admin/approve-reject" className="hover:text-gray-400">Approvals</Link>
        <Link href="/admin/loan-application" className="hover:text-gray-400">Loan Application</Link>
         
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
