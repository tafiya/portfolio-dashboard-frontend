import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import About from "@/pages/About";
import Skill from "@/pages/Skill";
import Education from "@/pages/Education";
import Blogs from "@/pages/Blogs";
import Projects from "@/pages/Projects";
import Services from "@/pages/Services";
import Login from "@/pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "about",
        element: <About />,
      },
      {
        path: "skills",
        element: <Skill></Skill>,
      },
      {
        path: "education",
        element: <Education />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "service",
        element: <Services />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
]);
export default router;
