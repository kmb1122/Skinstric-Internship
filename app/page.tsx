import Image from "next/image";
import style from "./page.module.css";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";

export default function Home() {
  return (
    <div className={style.page}>
      <main className={style.main}>
        <div className={`${style["rhombus"]} ${style["rhombus__left"]}`}>
          <div className={`${style["rhombus__inner"]} ${style["rhombus__inner__left"]}`}></div>
          <div className={`${style["rhombus__middle"]} ${style["rhombus__middle__left"]}`}></div>
          <div className={`${style["rhombus__outer"]} ${style["rhombus__outer__left"]}`}></div>
          <button className={`${style["side__btn"]} ${style["side__btn__left"]}`}>
            <div className={`${style["square"]} ${style["square__left"]}`}>
              <div className={`${style["square__inner"]} ${style["square__inner__left"]}`}></div>
              <div className={`${style["square__outer"]} ${style["square__outer__left"]}`}></div>
              <AiOutlineCaretLeft className={style.triangle}/>
            </div>
            <p className={`${style["side__btn__text"]} ${style["side__btn__text__left"]}`}>
              DICOVER A.I.
            </p>
          </button>
        </div>

        <h1 className={`${style["title"]} ${style["title__top"]}`}>Sophisticated</h1>
        <h1 className={`${style["title"]} ${style["title__bottom"]}`}>skincare</h1>

        <div className={`${style["rhombus"]} ${style["rhombus__right"]}`}>
          <div className={`${style["rhombus__inner"]} ${style["rhombus__inner__right"]}`}></div>
          <div className={`${style["rhombus__middle"]} ${style["rhombus__middle__right"]}`}></div>
          <div className={`${style["rhombus__outer"]} ${style["rhombus__outer__right"]}`}></div>
          <button className={`${style["side__btn"]} ${style["side__btn__right"]}`}>
            <div className={`${style["square"]} ${style["square__right"]}`}>
              <div className={`${style["square__inner"]} ${style["square__inner__right"]}`}></div>
              <div className={`${style["square__outer"]} ${style["square__outer__right"]}`}></div>
              <AiOutlineCaretRight className={style.triangle}/>
            </div>
            <p className={`${style["side__btn__text"]} ${style["side__btn__text__right"]}`}>
              TAKE TEST
            </p>
          </button>
        </div>
      </main>
      <p className={style.description}>SKINSTRIC DEVELOPED AND A.I. THAT CREATES A HIGHLY-PERSONALISED ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.</p>
    </div>
  );
}
