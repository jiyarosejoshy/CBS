import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-red-900 to-indigo-900 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/user/dashboard">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-blue-300 transition-all duration-300">
            BankERP
          </h1>
        </Link>
        
        <div className="flex gap-6 items-center">
          <NavLink href="/admin/dashboard">Dashboard</NavLink>
          <NavLink href="/admin/user-transaction">User Transactions</NavLink>
          <NavLink href="/admin/approve-reject">Approvals</NavLink>
          <NavLink href="/admin/loan-application">Loan Applications</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }) => {
  return (
    <Link href={href} passHref>
      <span className="relative text-white/90 hover:text-white font-medium transition-colors duration-200 cursor-pointer group">
        {children}
        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  );
};

export default NavBar;