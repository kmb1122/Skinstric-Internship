"use client";

import style from "./page.module.css";
import { gsap } from "gsap";
import { useRef,  useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TiCameraOutline } from "react-icons/ti";

export default function Camera() {
  const router = useRouter();

  const [status, setStatus] = useState("initial");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const innerRef1 = useRef(null);
  const middleRef1 = useRef(null);
  const outerRef1 = useRef(null);
  const proceedRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(innerRef1.current, {
        xPercent: -50,
        yPercent: -50,
      });

      gsap.set(middleRef1.current, {
        xPercent: -50,
        yPercent: -50,
      });

      gsap.set(outerRef1.current, {
        xPercent: -50,
        yPercent: -50,
      });

      gsap.to(innerRef1.current, {
        rotation: 360,
        duration: 72,
        repeat: -1,
        ease: "none",
      });

      gsap.to(middleRef1.current, {
        rotation: 360,
        duration: 48,
        repeat: -1,
        ease: "none",
      });

      gsap.to(outerRef1.current, {
        rotation: 360,
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
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, [status]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;

        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => resolve();
        });

        try {
          await video.play();
        } catch (err) {
          // Ignore play interruption caused by the video being unloaded
          if ((err as DOMException)?.name !== "AbortError") {
            throw err;
          }
        }

        setStatus("camera");
      } catch (err) {
        console.error("Unable to access camera:", err);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Video is not ready yet");
      return;
    }

    try {
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      // Capture the current frame
      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      // Convert it to an image
      const base64 = canvas.toDataURL("image/jpeg", 0.9);

      // Save the captured image
      setCapturedImage(base64);
      
      // Now show the processing UI
      setStatus("preparing");

      const res = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log(data);

      // Persist analysis to session storage so other pages can read it
      try {
        sessionStorage.setItem("skinstric-analysis", JSON.stringify(data));
      } catch (e) {
        console.warn("Unable to write analysis to sessionStorage:", e);
      }

      // The capturedImage stays unchanged. Update UI state to success.
      setStatus("success");

    } catch (err) {
      console.error("Capture failed:", err);
      setStatus("camera");
    }
  };

  return (
    <section className={`${style.camera} ${status === "camera" ? style.camera__active : ""}`}>
      <div className={style.camera__bg}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={style.camera__video}
          style={{
            opacity: capturedImage ? 0 : 1,
          }}
        />

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured photo"
            className={style.camera__captured}
          />
        )}

        {capturedImage && (
          <div className={style.camera__overlay} />
        )}
      </div>

      <div
        className={style.page__middle}
        style={{ display: status === "camera" ? "none" : "flex" }}
      >
        {/* Rhombus */}
        <div className={style.rhombus}>
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

        {status === "initial" && (
          <>
            <svg className={style.middle__img} width="136" height="136" viewBox="0 0 136 136" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="67.9996" cy="67.9997" r="57.7857" stroke="#1A1B1C"/>
              <circle cx="68" cy="68" r="51" fill="#1A1B1C"/>
              <path d="M100.668 35.412C92.3149 27.0382 80.7627 21.8569 68.0003 21.8569C65.0469 21.8569 62.1583 22.1344 59.3592 22.6647C64.1338 30.5633 81.5795 58.2549 84.9406 63.1803C85.5932 64.1371 86.753 62.2365 93.7783 48.6929L100.668 35.412Z" fill="#FCFCFC"/>
              <path d="M25.0882 51.004C30.5815 37.1459 42.5936 26.5816 57.3413 23.0942C59.0872 25.713 62.4221 30.8872 66.0668 36.6493L75.3267 51.2908H48.8858C36.1263 51.2908 28.6691 51.2077 25.0882 51.004Z" fill="#FCFCFC"/>
              <path d="M31.8694 96.7032C25.602 88.8246 21.8574 78.8495 21.8574 67.9998C21.8574 62.801 22.7172 57.803 24.3023 53.1402H39.1666C56.552 53.1402 56.9478 53.1674 56.3267 54.3294C55.0953 56.6338 36.8239 88.2621 31.8694 96.7032Z" fill="#FCFCFC"/>
              <path d="M76.9643 113.273C74.0646 113.843 71.0674 114.143 68.0003 114.143C54.1917 114.143 41.7998 108.077 33.3436 98.465C35.1707 94.4055 39.9295 85.9319 48.1717 72.0115C48.9468 70.7014 49.7323 69.781 49.917 69.966C50.1016 70.1503 56.6037 80.5196 64.3671 93.0077L76.9643 113.273Z" fill="#FCFCFC"/>
              <path d="M111.529 83.348C106.372 97.9733 94.0533 109.22 78.7841 112.876C74.5785 106.389 60.6125 83.9565 60.6125 83.6094C60.6125 83.4658 72.6814 83.348 87.4326 83.348H111.529Z" fill="#FCFCFC"/>
              <path d="M101.902 36.6966C109.5 44.922 114.143 55.9187 114.143 67.9998C114.143 72.923 113.372 77.6662 111.944 82.115H96.5965C86.6243 82.115 78.4651 81.9646 78.4651 81.7803C78.4651 81.3997 98.4368 43.0157 101.902 36.6966Z" fill="#FCFCFC"/>
            </svg>

            <p>SETTING UP CAMERA ...</p>
          </>
        )}

        {status === "preparing" && (
          <div className={style.preparing}>
            <p>PREPARING YOUR ANALYSIS</p>

            <div className={style.dots}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {status === "success" && (
          <p className={style.success}>
            Thank you!<br/>Proceed to the next step.
          </p>
        )}
      </div>

      {/* Suggestions */}
      {status !== "preparing" && status !== "success" && (
        <div className={style.suggestions}>
          <p className={style.suggestions__title}>
            TO GET BETTER RESULTS MAKE SURE TO HAVE
          </p>

          <ul className={style.suggestions__list}>
            <li className={style.suggestion__item}>
              <span className={style.diamond}></span>
              <p className={style.suggestion__text}>
                NEUTRAL EXPRESSION
              </p>
            </li>

            <li className={style.suggestion__item}>
              <span className={style.diamond}></span>
              <p className={style.suggestion__text}>
                FRONTAL POSE
              </p>
            </li>

            <li className={style.suggestion__item}>
              <span className={style.diamond}></span>
              <p className={style.suggestion__text}>
                ADEQUATE LIGHTING
              </p>
            </li>
          </ul>
        </div>
      )}

      {/* Camera Button */}
      {status === "camera" && (
        <button className={style.camera__btn} onClick={handleCapture}>
          <p className={style.camera__btn__text}>
            TAKE PICTURE
          </p>
          <div className={style.camera__btn__circle}>
            <TiCameraOutline className={style.camera__icon}/>
          </div>
        </button>
      )}

      <footer
        className={style.footer}
        style={{ display: status === "initial" ? "none" : "flex" }}
      >
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
          onClick={() => router.push("/select")}
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
  )
}