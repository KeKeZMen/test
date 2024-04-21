import { useCallback, useState } from "react";
import * as classes from "./app.module.scss";
import { Link, Outlet } from "react-router-dom";

export const App = () => {
  const [count, setCount] = useState<number>(0);
  const handleCount = useCallback(() => setCount((prev) => prev + 1), []);

  console.log(classes);

  return (
    <div>
      <Link to={"/about"}>About</Link>
      <Link to={"/shop"}>shop</Link>
      <span className={classes.value}>{count}</span>
      <button onClick={handleCount} className={classes.button__red}>
        increment
      </button>
      <Outlet />
    </div>
  );
};
