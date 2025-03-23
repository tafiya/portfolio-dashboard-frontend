import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, LogOut, Logs, UsersRound, X } from "lucide-react";
import { useAppDispatch } from "./redux/hook";
import { logout } from "./redux/features/auth/authSlice";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <>
        {/* Overlay for small screens */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        <div
          className={`fixed inset-y-0 left-0 w-64 bg-black text-white transform transition-transform duration-300 ease-in-out z-50
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
        >
          {/* Sidebar Header */}
          <div className="py-8 text-lg font-bold border-b border-gray-700 flex md:justify-center justify-between items-center px-6">
            <div className=" flex items-center gap-2">
              <LayoutDashboard />
              <h2 className=" text-2xl font-bold">Dashboard</h2>
            </div>

            {/* Close button on small screens */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="mt-10">
            <ul className="">
              {/* <Link to="/home/about">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <BookOpenText />
                  About
                </li>
              </Link>
              <Link to="/home/education">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <UserRoundPen />
                  Education
                </li>
              </Link> */}
              <Link to="/home/skills">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <Logs />
                  Skill
                </li>
              </Link>
              <Link to="/home/blogs">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <Logs />
                  Blogs
                </li>
              </Link>
              <Link to="/home/createBlogs">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <Logs />
                  Create Blogs
                </li>
              </Link>
              <Link to="/home/projects">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <Logs />
                  Projects
                </li>
              </Link>
              <Link to="/home/createProject">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <Logs />
                  Create Projects
                </li>
              </Link>

              <Link to="/home/service">
                <li className="p-4 m-4 flex items-center justify-center gap-2 hover:bg-gray-700 border-y border-gray-600 transition-colors">
                  <UsersRound />
                  Services
                </li>
              </Link>

              <hr className=" my-6" />

              <li
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
                className="p-4 flex items-center justify-center gap-2 hover:bg-gray-700  border-gray-600 transition-colors"
              >
                <LogOut />
                Logout
              </li>
            </ul>
          </nav>
        </div>

        {/* Toggle Button (Only visible on small screens) */}
        {!isOpen && (
          <button
            className="fixed top-5 left-5 p-2 bg-black text-white rounded-md md:hidden z-50"
            onClick={() => setIsOpen(true)}
          >
            ☰
          </button>
        )}
      </>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Navbar */}
        <header className="bg-white shadow-md py-4 px-10 flex items-center justify-between">
          <div className=" w-1/2 flex justify-end">
            <Link to={"/"} className="text-4xl font-mono ">
              <h2>Portfolio</h2>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet></Outlet>
        </main>
      </div>
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </div>
  );
}

export default App;
