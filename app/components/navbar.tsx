"use client";

import style from "./navbar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <nav className={style.nav}>
      <div className={style.nav__wrapper}>
        <div className={style.nav__left}>
          <Link href="/" className={`${style.logo} ${style.nav__link}`}>
            SKINSTRIC
          </Link>

          <span className={`${style.intro} ${style.nav__link}`}>
            <span className={style.bracket}>[  </span>
            INTRO
            <span className={style.bracket}>  ]</span>
          </span>
        </div>

        <div className={style.nav__right}>
          {isHome && (
            <button className={style.enter__code} type="button">
              <span className={style.enter__code__text}>ENTER CODE</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}