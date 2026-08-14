"use client";

import style from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Select() {
  const router = useRouter();

  return (
    <section className={style.select}>

      {/* Page Top */}
      <div className={style.page__top}>
        <p className={style.step}>A.I. ANALYSIS</p>
        <p className={style.step__description}>
          A.I. HAS ESTIMATED THE FOLLOWING.<br/>
          FIX ESTIMATED INFORMATION IF NEEDED.<br/>
        </p>
      </div>

      {/* Page Middle */}
      <div className={style.page__middle}>

        <div className={style.btns__wrapper}>
          <button 
          className={`${style["btn"]} ${style["btn__1"]}`}
          onClick={() => router.push("/summary")}
          >
            <span>DEMOGRAPHICS</span>
          </button>

          <button className={`${style["btn"]} ${style["btn__2"]}`}>
            <span>COSMETIC CONCERNS</span>
          </button>

          <button className={`${style["btn"]} ${style["btn__3"]}`}>
            <span>WEATHER</span>
          </button>

          <button className={`${style["btn"]} ${style["btn__4"]}`}>
            <span>SKIN TYPE DETAILS</span>
          </button>

          {/* Rhombuses */}
          <svg className={style.rhombus__inner} width="604" height="604" viewBox="0 0 604 604" fill="none">
            <path d="M302 1L603 302L302 603L1 302L302 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg className={style.rhombus__middle} width="684" height="684" viewBox="0 0 684 684" fill="none">
            <path opacity="0.6" d="M342 1L683 342L342 683L1 342L342 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg className={style.rhombus__outer} width="764" height="764" viewBox="0 0 764 764" fill="none">
            <path opacity="0.3" d="M382 1L763 382L382 763L1 382L382 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>
        </div>
      </div>

      {/* Footer */}
      <footer className={style.footer}>
        {/* Back button */}
        <button
          className={`${style.side__btn} ${style.side__btn__left}`}
          onClick={() => router.back()}
        >
          <div className={`${style["square"]} ${style["square__left"]}`}>
            <div className={style.square__inner}></div>
            <div className={style.square__outer}></div>
            <div className={`${style["triangle"]} ${style["triangle__left"]}`} />
          </div>
          <p className={`${style["side__btn__text"]} ${style["side__btn__text__left"]}`}>
            BACK
          </p>
        </button>

        <button
          className={`${style.side__btn} ${style.side__btn__right}`}
          onClick={() => router.push("/summary")}
        >
          <div className={`${style["square"]} ${style["square__right"]}`}>
            <div className={style.square__inner}></div>
            <div className={style.square__outer}></div>
            <div className={`${style["triangle"]} ${style["triangle__right"]}`} />
          </div>
          <p className={`${style["side__btn__text"]} ${style["side__btn__text__right"]}`}>
            GET SUMMARY
          </p>
        </button>
      </footer>
    </section>
  )
}