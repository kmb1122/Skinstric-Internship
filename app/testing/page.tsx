"use client";

import style from "./page.module.css";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Testing() {
  const router = useRouter();

  // GSAP refs
  const innerRef = useRef(null);
  const middleRef = useRef(null);
  const outerRef = useRef(null);
  const proceedRef = useRef(null);

  // Interaction state
  const [step, setStep] = useState(1); // 1 = name, 2 = location
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("idle"); 
  // idle | processing | success

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(innerRef.current, {
        rotate: 360,
        duration: 72,
        repeat: -1,
        ease: "none",
      });

      gsap.to(middleRef.current, {
        rotate: 360,
        duration: 48,
        repeat: -1,
        ease: "none",
      });

      gsap.to(outerRef.current, {
        rotate: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (status === "success" && proceedRef.current) {
      gsap.fromTo(
        proceedRef.current,
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, [status]);

  // Handle input submission
  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (step === 1 && name.trim().length > 0) {
      setStep(2);
      return;
    }

    if (step === 2 && location.trim().length > 0) {
      setStatus("processing");

      try {
        const res = await fetch(
          "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, location }),
          }
        );

        if (!res.ok) throw new Error("Request failed");

        setStatus("success");
      } catch (err) {
        setStatus("idle");
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className={style.testing}>
              {/* Rhombus */}
        <div className={`${style["rhombus"]} ${style["rhombus__left"]}`}>
          <svg ref={innerRef} className={style.rhombus__inner} width="604" height="604" viewBox="0 0 604 604" fill="none">
            <path d="M302 1L603 302L302 603L1 302L302 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg ref={middleRef} className={style.rhombus__middle} width="684" height="684" viewBox="0 0 684 684" fill="none">
            <path opacity="0.6" d="M342 1L683 342L342 683L1 342L342 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg ref={outerRef} className={style.rhombus__outer} width="764" height="764" viewBox="0 0 764 764" fill="none">
            <path opacity="0.3" d="M382 1L763 382L382 763L1 382L382 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>
        </div>

      <p className={style.step}>TO START ANALYSIS</p>

      <div className={style.page__middle}>
        {/* Instructions */}
        {status === "idle" && (
          <p className={style.instructions}>CLICK TO TYPE</p>
        )}

        {/* Input */}
        {status === "idle" && (
          <input
            className={style.input}
            type="text"
            placeholder={step === 1 ? "Introduce Yourself" : "Where are you from?"}
            value={step === 1 ? name : location}
            onChange={(e) =>
              step === 1 ? setName(e.target.value) : setLocation(e.target.value)
            }
            onKeyDown={handleSubmit}
          />
        )}

        {/* Processing */}
        {status === "processing" && (
          <div className={style.processing}>
            <p>Processing</p>
            <div className={style.dots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <p className={style.success}>Thank you! Proceed to the next step</p>
        )}
      </div>
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

        {/* Proceed button — only visible on success */}
        {status === "success" && (
        <button
          ref={proceedRef}
          className={`${style.side__btn} ${style.side__btn__right}`}
          onClick={() => router.push("/result")}
        >
          <div className={`${style["square"]} ${style["square__right"]}`}>
            <div className={style.square__inner}></div>
            <div className={style.square__outer}></div>
            <div className={`${style["triangle"]} ${style["triangle__right"]}`} />
          </div>
          <p className={`${style["side__btn__text"]} ${style["side__btn__text__right"]}`}>
            PROCEED
          </p>
        </button>
      )}
      </footer>
    </section>
  );
}