import { useCallback, useState } from "react";
import * as classes from "./app.module.scss";
import { Link, Outlet } from "react-router-dom";
import avatar from "../../../public/random.png";
import random from "../../../public/opa.jpg";
import Icon from "../../../public/icon.svg";

export const App = () => {
  const [count, setCount] = useState<number>(0);
  const handleCount = useCallback(() => setCount((prev) => prev + 1), []);

  console.log(classes);

  // if (__PLATFORM__ === "desktop") {
  //   return <div>Desktop</div>;
  // }

  // if (__PLATFORM__ === "mobile") {
  //   return <div>Mobile</div>;
  // }

  return (
    <div>
      <h1>platform={__PLATFORM__}</h1>
      <Link to={"/about"}>About</Link>
      <Link to={"/shop"}>shop</Link>
      <span className={classes.value}>{count}</span>
      <button onClick={handleCount} className={classes.button__red}>
        sasd
      </button>
      <img src={avatar} alt="" />
      <img src={random} alt="" />
      <Icon color="green" width={300} height={300} />
      <Outlet />
    </div>
  );
};
