"use client";

import style from "./page.module.css";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Result() {
  const router = useRouter();

  const [status, setStatus] = useState("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // GSAP refs
  const innerRef1 = useRef(null);
  const middleRef1 = useRef(null);
  const outerRef1 = useRef(null);

  const innerRef2 = useRef(null);
  const middleRef2 = useRef(null);
  const outerRef2 = useRef(null);

  const innerRef3 = useRef(null);
  const middleRef3 = useRef(null);
  const outerRef3 = useRef(null);

  const proceedRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // First rhombus set
      gsap.to(innerRef1.current, {
        rotate: 360,
        duration: 108,
        repeat: -1,
        ease: "none",
      });
      gsap.to(middleRef1.current, {
        rotate: 360,
        duration: 72,
        repeat: -1,
        ease: "none",
      });
      gsap.to(outerRef1.current, {
        rotate: 360,
        duration: 48,
        repeat: -1,
        ease: "none",
      });

      // Second rhombus set
      gsap.to(innerRef2.current, {
        rotate: 360,
        duration: 108,
        repeat: -1,
        ease: "none",
      });
      gsap.to(middleRef2.current, {
        rotate: 360,
        duration: 72,
        repeat: -1,
        ease: "none",
      });
      gsap.to(outerRef2.current, {
        rotate: 360,
        duration: 48,
        repeat: -1,
        ease: "none",
      });

      // Third rhombus set
      gsap.to(innerRef3.current, {
        rotate: 360,
        duration: 72,
        repeat: -1,
        ease: "none",
      });

      gsap.to(middleRef3.current, {
        rotate: 360,
        duration: 48,
        repeat: -1,
        ease: "none",
      });

      gsap.to(outerRef3.current, {
        rotate: 360,
        duration: 32,
        repeat: -1,
        ease: "none",
      });  
    });

    return () => ctx.revert();
  }, []);
  
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      const result = reader.result;

      if (typeof result !== "string") {
        console.error("Base64 conversion failed");
        return;
      }

      const base64 = result;

      // Show preview
      setPreviewImage(base64);

      // Switch UI to preparing
      setStatus("preparing");

      try {
        const response = await fetch(
          "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64 }),
          }
        );

        const data = await response.json();
        console.log("API response:", data);

        // Switch UI to success
        setStatus("success");
      } catch (error) {
        console.error("API error:", error);
        setStatus("idle");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className={`${style.result} ${style[status]}`}>
      <p className={style.step}>TO START ANALYSIS</p>

      <div className={style.preview__wrapper}>
        <p className={style.preview__title}>Preview</p>
        <figure className={style.preview__container}>
          {previewImage && (
            <img src={previewImage} alt="Preview" className={style.preview__img} />
          )}
        </figure>
      </div>

      <div className={style.page__middle}>

        <div className={`${style.preparing} ${status !== "preparing" ? style.hidden : ""}`}>
          <svg ref={innerRef3} className={style.rhombus__inner3} width="604" height="604" viewBox="0 0 604 604" fill="none">
            <path d="M302 1L603 302L302 603L1 302L302 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg ref={middleRef3} className={style.rhombus__middle3} width="684" height="684" viewBox="0 0 684 684" fill="none">
            <path opacity="0.6" d="M342 1L683 342L342 683L1 342L342 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>

          <svg ref={outerRef3} className={style.rhombus__outer3} width="764" height="764" viewBox="0 0 764 764" fill="none">
            <path opacity="0.3" d="M382 1L763 382L382 763L1 382L382 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
          </svg>
        </div>

        <div className={`${style.preparing} ${status !== "preparing" ? style.hidden : ""}`}>
          <p>PREPARING YOUR ANALYSIS</p>
          <div className={style.dots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>

        <p className={`${style.success} ${status !== "success" ? style.hidden : ""}`}>
          Thank you! Proceed to the next step
        </p>

        <div className={`${style["scan"]} ${style["camera"]}`}>
          <div className={`${style["rhombus"]} ${style["rhombus__camera"]}`}>
            <svg ref={innerRef1} className={style.rhombus__inner} width="408" height="408" viewBox="0 0 408 408" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M203.591 1L406.181 203.591L203.591 406.181L1 203.591L203.591 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>

            <svg ref={middleRef1} className={style.rhombus__middle} width="447" height="447" viewBox="0 0 447 447" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" d="M223.172 1L445.344 223.172L223.172 445.344L1 223.172L223.172 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>

            <svg ref={outerRef1} className={style.rhombus__outer} width="484" height="484" viewBox="0 0 484 484" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M242 1L483 242L242 483L1 242L242 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>
          </div>

          <div className={`${style["scan__title"]} ${style["scan__title__camera"]}`}>
            <svg className={` ${style["pointer"]} ${style["pointer__camera"]}`} width="67" height="60" viewBox="0 0 67 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.332031 59L62.332 4" stroke="#1A1B1C"/>
              <circle cx="63.832" cy="2.5" r="2" stroke="#1A1B1C"/>
            </svg>

            <h2 className={`${style["title__text"]} ${style["title__text__camera"]}`}>
              ALLOW A.I. <br/>TO SCAN YOUR FACE
            </h2>
          </div>

          <button className={`${style["scan__btn"]} ${style["scan__btn__camera"]}`}>
            <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="67.9996" cy="67.9997" r="57.7857" stroke="#1A1B1C"/>
              <circle cx="68" cy="68" r="51" fill="#1A1B1C"/>
              <path d="M100.668 35.412C92.3149 27.0382 80.7627 21.8569 68.0003 21.8569C65.0469 21.8569 62.1583 22.1344 59.3592 22.6647C64.1338 30.5633 81.5795 58.2549 84.9406 63.1803C85.5932 64.1371 86.753 62.2365 93.7783 48.6929L100.668 35.412Z" fill="#FCFCFC"/>
              <path d="M25.0882 51.004C30.5815 37.1459 42.5936 26.5816 57.3413 23.0942C59.0872 25.713 62.4221 30.8872 66.0668 36.6493L75.3267 51.2908H48.8858C36.1263 51.2908 28.6691 51.2077 25.0882 51.004Z" fill="#FCFCFC"/>
              <path d="M31.8694 96.7032C25.602 88.8246 21.8574 78.8495 21.8574 67.9998C21.8574 62.801 22.7172 57.803 24.3023 53.1402H39.1666C56.552 53.1402 56.9478 53.1674 56.3267 54.3294C55.0953 56.6338 36.8239 88.2621 31.8694 96.7032Z" fill="#FCFCFC"/>
              <path d="M76.9643 113.273C74.0646 113.843 71.0674 114.143 68.0003 114.143C54.1917 114.143 41.7998 108.077 33.3436 98.465C35.1707 94.4055 39.9295 85.9319 48.1717 72.0115C48.9468 70.7014 49.7323 69.781 49.917 69.966C50.1016 70.1503 56.6037 80.5196 64.3671 93.0077L76.9643 113.273Z" fill="#FCFCFC"/>
              <path d="M111.529 83.348C106.372 97.9733 94.0533 109.22 78.7841 112.876C74.5785 106.389 60.6125 83.9565 60.6125 83.6094C60.6125 83.4658 72.6814 83.348 87.4326 83.348H111.529Z" fill="#FCFCFC"/>
              <path d="M101.902 36.6966C109.5 44.922 114.143 55.9187 114.143 67.9998C114.143 72.923 113.372 77.6662 111.944 82.115H96.5965C86.6243 82.115 78.4651 81.9646 78.4651 81.7803C78.4651 81.3997 98.4368 43.0157 101.902 36.6966Z" fill="#FCFCFC"/>
            </svg>
          </button>
        </div>
      
        <div className={`${style["scan"]} ${style["gallery"]}`}>
          <div className={`${style["rhombus"]} ${style["rhombus__gallery"]}`}>
            <svg ref={innerRef2} className={style.rhombus__inner} width="408" height="408" viewBox="0 0 408 408" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M203.591 1L406.181 203.591L203.591 406.181L1 203.591L203.591 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>

            <svg ref={middleRef2} className={style.rhombus__middle} width="447" height="447" viewBox="0 0 447 447" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.6" d="M223.172 1L445.344 223.172L223.172 445.344L1 223.172L223.172 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>

            <svg ref={outerRef2} className={style.rhombus__outer} width="484" height="484" viewBox="0 0 484 484" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M242 1L483 242L242 483L1 242L242 1Z" stroke="#A0A4AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="0.1 8"/>
            </svg>
          </div>
          
          <div className={`${style["scan__title"]} ${style["scan__title__gallery"]}`}>
            <svg className={` ${style["pointer"]} ${style["pointer__gallery"]}`} width="67" height="60" viewBox="0 0 67 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.00023 56.874C1.00023 56.0456 1.6718 55.374 2.50023 55.374C3.32865 55.374 4.00023 56.0456 4.00023 56.874C4.00023 57.7025 3.32865 58.374 2.50023 58.374C1.6718 58.374 1.00023 57.7025 1.00023 56.874ZM0.000228882 56.874C0.000228882 55.4933 1.11951 54.374 2.50023 54.374C3.0167 54.374 3.4966 54.5306 3.89502 54.799L65.6684 -1.52588e-05L66.332 0.748062L4.5974 55.5127C4.8522 55.9044 5.00023 56.3719 5.00023 56.874C5.00023 58.2547 3.88094 59.374 2.50023 59.374C1.11951 59.374 0.000228882 58.2547 0.000228882 56.874Z" fill="#1A1B1C"/>
            </svg>

            <h2 className={`${style["title__text"]} ${style["title__text__gallery"]}`}>
              ALLOW A.I. <br/>ACCESS GALLERY
            </h2>
          </div>

          <button
            className={`${style["scan__btn"]} ${style["scan__btn__gallery"]}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="67.9996" cy="67.9997" r="57.7857" stroke="#1A1B1C"/>
              <circle cx="68" cy="68" r="50" fill="#FCFCFC" stroke="#1A1B1C" strokeWidth="2"/>
              <path d="M78.3214 68C85.3631 68 91.0714 62.2916 91.0714 55.25C91.0714 48.2084 85.3631 42.5 78.3214 42.5C71.2798 42.5 65.5714 48.2084 65.5714 55.25C65.5714 62.2916 71.2798 68 78.3214 68Z" fill="#1A1B1C"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M17 68C17 71.9604 17.4514 75.8154 18.3056 79.5163C23.5265 102.136 43.7939 119 68 119C94.8673 119 116.882 98.2244 118.856 71.862C118.951 70.5872 119 69.2993 119 68C119 39.8335 96.1665 17 68 17C39.8335 17 17 39.8335 17 68ZM35.3365 67.7257L19.3825 78.7708C18.6175 75.3024 18.2143 71.6983 18.2143 68C18.2143 40.5041 40.5041 18.2143 68 18.2143C95.4959 18.2143 117.786 40.5041 117.786 68C117.786 69.5412 117.716 71.0661 117.579 72.5716L82.9447 91.8127C80.4324 93.2084 77.3343 92.9968 75.0351 91.2724L43.855 67.8874C41.3462 66.0058 37.9149 65.9406 35.3365 67.7257Z" fill="#1A1B1C"/>
            </svg>
          </button>
        </div>
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

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </section>
  )
}