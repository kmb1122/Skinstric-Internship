"use client";

import style from "./page.module.css";
import { gsap } from "gsap";
import { useRef, useEffect } from "react";

export default function Home() {
  const leftWrapperRef = useRef<HTMLDivElement | null>(null);
  const rightWrapperRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const titleWidth = titleRef.current?.offsetWidth ?? 0;

  useEffect(() => {
    if (!titleRef.current) return;

    gsap.from(titleRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out"
    });
  }, []);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <div className={style.page}>
      <main className={style.main}>

        <div ref={leftWrapperRef} className={style.button__wrapper__left}>
          <button
            className={`${style.side__btn} ${style.side__btn__left}`}
            onMouseEnter={() => {
              const viewportWidth = window.innerWidth;
              const titleWidth = titleRef.current!.offsetWidth;
              const distance = (viewportWidth / 2) - (titleWidth / 2) - 32;

              gsap.to(rightWrapperRef.current, { opacity: 0, duration: 0.3 });

              gsap.to(titleRef.current, {
                x: distance,              
                duration: 0.8,
                ease: "power2.out",
                onStart: () => {
                  titleRef.current!.classList.add(style.titleRight);
                }
              });
            }}

            onMouseLeave={() => {
              gsap.to(rightWrapperRef.current, { opacity: 1, duration: 0.3 });

              gsap.to(titleRef.current, {
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                onStart: () => {
                  titleRef.current!.classList.remove(style.titleRight);
                }
              });
            }}
          >
            <div className={`${style["square"]} ${style["square__left"]}`}>
              <div className={style.square__inner}></div>
              <div className={style.square__outer}></div>
              <div className={`${style["triangle"]} ${style["triangle__left"]}`}/>
            </div>
            <p className={`${style["side__btn__text"]} ${style["side__btn__text__left"]}`}>
              DICOVER A.I.
            </p>
          </button>
          <div className={`${style["rhombus"]} ${style["rhombus__left"]}`}>
            <div className={style.rhombus__inner}></div>
            <div className={style.rhombus__middle}></div>
            <div className={style.rhombus__outer}></div>
          </div>
        </div>

        <h1 ref={titleRef} className={style.title}>Sophisticated skincare</h1>

        <div ref={rightWrapperRef} className={style.button__wrapper__right}>
          <button
            className={`${style.side__btn} ${style.side__btn__right}`}
            onMouseEnter={() => {
              const viewportWidth = window.innerWidth;
              const titleWidth = titleRef.current!.offsetWidth;
              const distance = (viewportWidth / 2) - (titleWidth / 2) - 32;

              gsap.to(leftWrapperRef.current, { opacity: 0, duration: 0.3 });

              gsap.to(titleRef.current, {
                x: -distance,     
                duration: 0.8,
                ease: "power2.out",
                onStart: () => {
                  titleRef.current!.classList.add(style.titleLeft);
                }
              });
            }}

            onMouseLeave={() => {
              gsap.to(leftWrapperRef.current, { opacity: 1, duration: 0.3 });

              gsap.to(titleRef.current, {
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                onStart: () => {
                  titleRef.current!.classList.remove(style.titleLeft);
                }
              });
            }}
          >
            <div className={`${style["square"]} ${style["square__right"]}`}>
              <div className={style.square__inner}></div>
              <div className={style.square__outer}></div>
              <div className={`${style["triangle"]} ${style["triangle__right"]}`}/>
            </div>
            <p className={`${style["side__btn__text"]} ${style["side__btn__text__right"]}`}>
              TAKE TEST
            </p>
          </button>
          <div className={`${style["rhombus"]} ${style["rhombus__right"]}`}>
            <div className={style.rhombus__inner}></div>
            <div className={style.rhombus__middle}></div>
            <div className={style.rhombus__outer}></div>
          </div>
        </div>

      </main>

      <p className={style.description}>SKINSTRIC DEVELOPED AND A.I. THAT CREATES A HIGHLY-PERSONALISED ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.</p>
    </div>
  );
}
