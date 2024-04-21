import { createRoot } from "react-dom/client";
import { App } from "@/app/components/App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { About } from "@/app/pages/about";
import { Shop } from "@/app/pages/shop";
import { Suspense } from "react";

const root = document.getElementById("root");
if (!root) throw new Error("Not root");

const container = createRoot(root);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/about",
        element: (
          <Suspense fallback="Loading...">
            <About />
          </Suspense>
        ),
      },
      {
        path: "/shop",
        element: (
          <Suspense fallback="Loading...">
            <Shop />
          </Suspense>
        ),
      },
    ],
  },
]);

container.render(<RouterProvider router={router} />);
