"use client";

import style from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

type BreakdownItem = {
  label: string;
  value: number;
};

type CategoryResult = {
  predicted: string;
  confidence: number;
  breakdown: BreakdownItem[];
};

type AnalysisData = {
  race: CategoryResult;
  age: CategoryResult;
  gender: CategoryResult;
};

type AnalysisApiData = {
  race: Record<string, number>;
  age: Record<string, number>;
  gender: Record<string, number>;
};

type Tab = "race" | "age" | "gender";

type SelectedLabels = {
  race: string;
  age: string;
  gender: string;
};

function getTopPrediction(breakdown: BreakdownItem[]): string {
  if (!breakdown.length) return "";

  return breakdown.reduce((max, item) =>
    item.value > max.value ? item : max
  ).label;
}

function transformApiResponse(api: AnalysisApiData): AnalysisData {
  const createBreakdown = (
    values: Record<string, number>
  ): BreakdownItem[] => {
    return Object.entries(values).map(([label, value]) => ({
      label,
      value: Math.round(value * 100),
    }));
  };

  const raceBreakdown = createBreakdown(api.race);
  const ageBreakdown = createBreakdown(api.age);
  const genderBreakdown = createBreakdown(api.gender);

  return {
    race: {
      predicted: getTopPrediction(raceBreakdown),
      confidence: Math.max(...raceBreakdown.map((item) => item.value), 0),
      breakdown: raceBreakdown,
    },

    age: {
      predicted: getTopPrediction(ageBreakdown),
      confidence: Math.max(...ageBreakdown.map((item) => item.value), 0),
      breakdown: ageBreakdown,
    },

    gender: {
      predicted: getTopPrediction(genderBreakdown),
      confidence: Math.max(...genderBreakdown.map((item) => item.value), 0),
      breakdown: genderBreakdown,
    },
  };
}

function parseAgeLabel(label: string): number {
  if (label.includes("+")) {
    return parseInt(label, 10);
  }

  const [min] = label.split("-").map(Number);
  return min;
}

function formatPrediction(tab: Tab, label: string): string {
  if (tab === "age") {
    return label.includes("") ? label : `${label}`;
  }

  return label;
}

export default function Summary() {
  const router = useRouter();

  const [data, setData] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("race");

  const [selectedLabel, setSelectedLabel] = useState<SelectedLabels>({
    race: "",
    age: "",
    gender: "",
  });

  const circleRef = useRef<SVGCircleElement | null>(null);

  /* Load analysis data */
  useEffect(() => {
    const storedAnalysis = sessionStorage.getItem("skinstric-analysis");

    if (!storedAnalysis) return;

    try {
      const raw: {
        data: AnalysisApiData;
      } = JSON.parse(storedAnalysis);

      const transformed = transformApiResponse(raw.data);

      setData(transformed);

      setSelectedLabel({
        race: transformed.race.predicted,
        age: transformed.age.predicted,
        gender: transformed.gender.predicted,
      });
    } catch (error) {
      console.error("Failed to load analysis:", error);
    }
  }, []);

  /* Get the currently active result */
  const activeResult = useMemo<CategoryResult | null>(() => {
    if (!data) return null;

    return data[activeTab];
  }, [data, activeTab]);

  /* Sort the confidence list */
  const sortedBreakdown = useMemo<BreakdownItem[]>(() => {
    if (!activeResult) return [];

    const breakdown = [...activeResult.breakdown];

    if (activeTab === "race") {
      return breakdown.sort((a, b) => b.value - a.value);
    }

    if (activeTab === "age") {
      return breakdown.sort(
        (a, b) => parseAgeLabel(a.label) - parseAgeLabel(b.label)
      );
    }

    return breakdown;
  }, [activeResult, activeTab]);

  /* Currently selected confidence */
  const selectedConfidence = useMemo(() => {
    if (!activeResult) return 0;

    const selected = activeResult.breakdown.find(
      (item) => item.label === selectedLabel[activeTab]
    );

    return selected?.value ?? 0;
  }, [activeResult, activeTab, selectedLabel]);

  /* Animate confidence circle with GSAP */
  useEffect(() => {
    if (!circleRef.current) return;

    const circle = circleRef.current;

    gsap.killTweensOf(circle);

    gsap.to(circle, {
      strokeDashoffset: 100 - selectedConfidence,
      duration: 0.9,
      ease: "power2.out",
    });

    return () => {
      gsap.killTweensOf(circle);
    };
  }, [selectedConfidence]);

  /* Change active category */
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  /* Change selected confidence item */
  const handleSelect = (label: string) => {
    setSelectedLabel((previous) => ({
      ...previous,
      [activeTab]: label,
    }));
  };

  /* Uppercase the First Letter */
  function titleCase(str: string) {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (!data) {
    return (
      <section className={style.page}>
        <div className={style.page__middle}>
          <div className={style.loading}>Loading analysis...</div>
        </div>
      </section>
    );
  }

  return (
    <section className={style.summary}>
      {/* PAGE HEADING */}
      <div className={style.page__top}>
        <p className={style.page__step}>A.I. ANALYSIS</p>
        <h1 className={style.step__title}>DEMOGRAPHICS</h1>
        <p className={style.step__description}>
          PREDICTED RACE & AGE
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className={style.page__middle}>
        {/* LEFT — CATEGORY SELECTOR */}
        <aside className={style.summary__left}>
          <button
            type="button"
            className={`${style.summary__tab} ${
              activeTab === "race" ? style.active : ""
            }`}
            onClick={() => handleTabChange("race")}
          >
            <span className={style.summary__tabLabel}>
              {titleCase(selectedLabel.race)}
            </span>
            <span className={style.summary__tabCategory}>RACE</span>
          </button>

          <button
            type="button"
            className={`${style.summary__tab} ${
              activeTab === "age" ? style.active : ""
            }`}
            onClick={() => handleTabChange("age")}
          >
            <span className={style.summary__tabLabel}>
              {formatPrediction("age", selectedLabel.age)}
            </span>
            <span className={style.summary__tabCategory}>AGE</span>
          </button>

          <button
            type="button"
            className={`${style.summary__tab} ${
              activeTab === "gender" ? style.active : ""
            }`}
            onClick={() => handleTabChange("gender")}
          >
            <span className={style.summary__tabLabel}>
              {titleCase(selectedLabel.gender)}
            </span>
            <span className={style.summary__tabCategory}>SEX</span>
          </button>
        </aside>

        {/* CENTER — MAIN PREDICTION */}
        <div className={style.summary__middle}>
          <div className={style.summary__prediction}>
            <h2 className={style.summary__title}>
              {titleCase(
                formatPrediction(activeTab, selectedLabel[activeTab])
              )}
            </h2>

            <div className={style.summary__circle}>
              <svg
                className={style.summary__circleSvg}
                viewBox="0 0 220 220"
                aria-label={`${selectedConfidence}% confidence`}
              >
                {/* Background ring */}
                <circle
                  className={style.summary__circleTrack}
                  cx="110"
                  cy="110"
                  r="86"
                  pathLength="100"
                />

                {/* Animated confidence ring */}
                <circle
                  ref={circleRef}
                  className={style.summary__circleProgress}
                  cx="110"
                  cy="110"
                  r="86"
                  pathLength="100"
                />
              </svg>

              <div className={style.summary__circleCenter}>
                <span>{selectedConfidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — CONFIDENCE BREAKDOWN */}
        <aside className={style.summary__right}>
          <div className={style.summary__rightHeader}>
            <span>{activeTab.toUpperCase()}</span>
            <span>A.I. CONFIDENCE</span>
          </div>

          <ul className={style.summary__list}>
            {sortedBreakdown.map((item) => {
              const isSelected =
                item.label === selectedLabel[activeTab];

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`${style.summary__listItem} ${
                      isSelected ? style.selected : ""
                    }`}
                    onClick={() => handleSelect(item.label)}
                  >
                    <span className={style.summary__listLabel}>
                      <span className={style.summary__diamond}>
                        <span className={style.summary__subDiamond}/>
                      </span>
                      {titleCase(formatPrediction(activeTab, item.label))}
                    </span>

                    <span className={style.summary__listValue}>
                      {item.value}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {/* FOOTER */}
      <footer className={style.footer}>
        <button
          type="button"
          className={`${style.side__btn} ${style.side__btn__left}`}
          onClick={() => router.back()}
        >
          <div
            className={`${style.square} ${style.square__left}`}
          >
            <div className={style.square__inner} />
            <div className={style.square__outer} />
            <div
              className={`${style.triangle} ${style.triangle__left}`}
            />
          </div>

          <p
            className={`${style.side__btn__text} ${style.side__btn__text__left}`}
          >
            BACK
          </p>
        </button>

        <p className={style.footer__text}>
          If A.I. estimate is wrong, select the correct one.
        </p>

        <button
          type="button"
          className={`${style.side__btn} ${style.side__btn__left}`}
          onClick={() => router.push("/")}
        >
          <div
            className={`${style.square} ${style.square__left}`}
          >
            <div className={style.square__inner} />
            <div className={style.square__outer} />
            <div
              className={`${style.triangle} ${style.triangle__left}`}
            />
          </div>

          <p
            className={`${style.side__btn__text} ${style.side__btn__text__left}`}
          >
            HOME
          </p>
        </button>
      </footer>
    </section>
  );
}