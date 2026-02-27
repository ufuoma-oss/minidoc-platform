"use client";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Sparkles, Shield, Zap, Users } from "lucide-react";

const INITIAL_CHIPS = [
  {
    id: 1,
    title: "Document Understanding",
    description: "AI reads & analyzes",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Smart Search",
    description: "Find any content",
    icon: Shield,
  },
  {
    id: 3,
    title: "Auto Summarize",
    description: "Key insights extracted",
    icon: Zap,
  },
  {
    id: 4,
    title: "Chat with Files",
    description: "Ask questions directly",
    icon: Users,
  },
];

const Bucket = () => {
  const [items, setItems] = useState(INITIAL_CHIPS);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) => {
        const [first, ...rest] = prev;
        return [...rest, first];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-fit relative w-full overflow-hidden">
      <div
        className="relative isolate w-full max-w-[655px] overflow-hidden"
        style={{ aspectRatio: "655/352" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 z-0"
        >
          <foreignObject
            x="443.561"
            y="-10.5141"
            width="211.24"
            height="166.977"
          >
            <div
              style={{
                backdropFilter: "blur(11.03px)",
                clipPath: "url(#bgblur_0_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <g
            filter="url(#filter1_dddi_51_65)"
            data-figma-bg-blur-radius="22.0545"
          >
            <path
              d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z"
              fill="white"
              fillOpacity="0.42"
              shapeRendering="crispEdges"
            />
          </g>
          <foreignObject
            x="-3.43323e-05"
            y="-10.9516"
            width="215.96"
            height="167.786"
          >
            <div
              style={{
                backdropFilter: "blur(11.03px)",
                clipPath: "url(#bgblur_1_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <g
            filter="url(#filter2_dddi_51_65)"
            data-figma-bg-blur-radius="22.0545"
          >
            <path
              d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z"
              fill="white"
              fillOpacity="0.42"
              shapeRendering="crispEdges"
            />
          </g>
          <foreignObject
            x="78.7048"
            y="20.823"
            width="501.297"
            height="136.012"
          >
            <div
              style={{
                backdropFilter: "blur(11.03px)",
                clipPath: "url(#bgblur_2_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <g
            filter="url(#filter3_dddi_51_65)"
            data-figma-bg-blur-radius="22.0545"
          >
            <path
              d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z"
              fill="url(#paint0_linear_51_65)"
              fillOpacity="0.72"
              shapeRendering="crispEdges"
            />
          </g>
          <foreignObject
            x="78.7048"
            y="20.823"
            width="137.255"
            height="136.012"
          >
            <div
              style={{
                backdropFilter: "blur(11.03px)",
                clipPath: "url(#bgblur_3_51_65_clip_path)",
                height: "100%",
                width: "100%",
              }}
            ></div>
          </foreignObject>
          <g
            filter="url(#filter4_dddi_51_65)"
            data-figma-bg-blur-radius="22.0545"
          >
            <path
              d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z"
              fill="white"
              fillOpacity="0.32"
              shapeRendering="crispEdges"
            />
          </g>

          <g
            filter="url(#filter5_dddi_51_65)"
            data-figma-bg-blur-radius="22.0545"
          >
            <path
              d="M487.973 78.9088V42.8774L536.404 79.1144L487.973 78.9088Z"
              fill="white"
              fillOpacity="0.32"
              shapeRendering="crispEdges"
            />
          </g>

          <defs>
            <filter
              id="filter0_i_51_65"
              x="123.766"
              y="79.1595"
              width="413"
              height="275.676"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_51_65"
              />
            </filter>
            <filter
              id="filter1_dddi_51_65"
              x="443.561"
              y="-10.5141"
              width="211.24"
              height="166.977"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <clipPath
              id="bgblur_0_51_65_clip_path"
              transform="translate(-443.561 10.5141)"
            >
              <path d="M535.59 78.7427L487.973 42.8776L558.738 13.9516C562.902 12.2494 564.984 11.3984 567.143 11.5597C569.301 11.7211 571.233 12.8723 575.098 15.1747L590.22 24.1832C603.923 32.347 610.775 36.4289 610.372 42.0779C609.97 47.7269 602.609 50.7964 587.887 56.9354L535.59 78.7427Z" />
            </clipPath>
            <filter
              id="filter2_dddi_51_65"
              x="-3.43323e-05"
              y="-10.9516"
              width="215.96"
              height="167.786"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <clipPath
              id="bgblur_1_51_65_clip_path"
              transform="translate(3.43323e-05 10.9516)"
            >
              <path d="M123.116 79.1145L171.548 42.8776L97.2715 12.5164C94.8305 11.5186 93.61 11.0197 92.3446 11.1143C91.0793 11.2089 89.9465 11.8837 87.681 13.2334L56.155 32.0149C48.1832 36.7641 44.1973 39.1386 44.4205 42.4378C44.6438 45.737 48.9132 47.553 57.4522 51.1849L123.116 79.1145Z" />
            </clipPath>
            <filter
              id="filter3_dddi_51_65"
              x="78.7048"
              y="20.823"
              width="501.297"
              height="136.012"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <clipPath
              id="bgblur_2_51_65_clip_path"
              transform="translate(-78.7048 -20.823)"
            >
              <path d="M487.973 42.8774L171.548 42.8775L123.116 79.1144L535.59 78.7424L487.973 42.8774Z" />
            </clipPath>
            <filter
              id="filter4_dddi_51_65"
              x="78.7048"
              y="20.823"
              width="137.255"
              height="136.012"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <clipPath
              id="bgblur_3_51_65_clip_path"
              transform="translate(-78.7048 -20.823)"
            >
              <path d="M171.548 78.9088V42.8774L123.116 79.1144L171.548 78.9088Z" />
            </clipPath>
            <filter
              id="filter5_dddi_51_65"
              x="443.561"
              y="20.823"
              width="137.255"
              height="136.012"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <filter
              id="filter6_dddi_51_65"
              x="21.477"
              y="56.6875"
              width="612.444"
              height="212.562"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="33.3087" />
              <feGaussianBlur stdDeviation="22.2058" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1.27808" />
              <feGaussianBlur stdDeviation="1.27808" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.14 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_51_65"
                result="effect2_dropShadow_51_65"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="8.94656" />
              <feGaussianBlur stdDeviation="4.47328" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0431373 0 0 0 0 0.12549 0 0 0 0 0.403922 0 0 0 0.05 0"
              />
              <feBlend
                mode="normal"
                in2="effect2_dropShadow_51_65"
                result="effect3_dropShadow_51_65"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect3_dropShadow_51_65"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="5.51362" />
              <feGaussianBlur stdDeviation="1.83787" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.36 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect4_innerShadow_51_65"
              />
            </filter>
            <clipPath id="bgblur_5_51_65_clip_path">
              <path d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z" />
            </clipPath>
            <clipPath id="center_box_clip">
              <rect x="123.766" y="0" width="413" height="352" />
            </clipPath>
            <linearGradient
              id="paint0_linear_51_65"
              x1="329.353"
              y1="42.8774"
              x2="329.353"
              y2="79.1144"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0.4" />
              <stop offset="1" stopColor="white" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated Chip - drops inside the box */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
          <div
            className="relative w-full h-full flex justify-center items-center"
            style={{ paddingBottom: "65%" }}
          >
            <AnimatePresence mode="popLayout">
              {items.map((chip, index) => {
                if (index !== 0) return null;

                return (
                  <motion.div
                    key={chip.id}
                    initial={{
                      y: isMobile ? -80 : -120,
                      opacity: 0,
                      scale: 0.9,
                    }}
                    animate={{ 
                      y: isMobile ? 60 : 80, 
                      opacity: 1, 
                      scale: isMobile ? 0.85 : 1 
                    }}
                    exit={{
                      y: isMobile ? 140 : 180,
                      opacity: 0,
                      scale: 0.85,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="bg-card border border-border rounded-full p-2 shadow-lg absolute pointer-events-auto flex items-center gap-2"
                    style={{ 
                      width: isMobile ? "160px" : "200px",
                      zIndex: 5
                    }}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {React.createElement(chip.icon, { className: "size-4" })}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs sm:text-sm font-medium text-foreground leading-none">
                        {chip.title}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        {chip.description}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Top Layer SVG - 3D Box with depth */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 655 352"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            transform: "translate3d(0, 0, 0)",
            zIndex: 10
          }}
        >
          <defs>
            {/* Gradient for front face - subtle depth, not too white */}
            <linearGradient id="boxFrontGradient" x1="330" y1="80" x2="330" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0.3" />
            </linearGradient>
            {/* Gradient for left side - subtle depth */}
            <linearGradient id="boxLeftGradient" x1="124" y1="80" x2="100" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            {/* Gradient for right side - subtle depth */}
            <linearGradient id="boxRightGradient" x1="536" y1="80" x2="560" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0.1" />
            </linearGradient>
            {/* Gradient for bottom - creates depth illusion */}
            <linearGradient id="boxBottomGradient" x1="330" y1="280" x2="330" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="white" stopOpacity="0.25" />
              <stop offset="100%" stopColor="white" stopOpacity="0.15" />
            </linearGradient>
            {/* Shadow filter for depth */}
            <filter id="boxShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="black" floodOpacity="0.15" />
            </filter>
            {/* Inner shadow for depth */}
            <filter id="innerDepth" x="-10%" y="-10%" width="120%" height="120%">
              <feOffset dx="0" dy="4" />
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left side wall - subtle liquid glass */}
          <path
            d="M124 80 L100 100 L100 310 L124 350 L124 80"
            fill="white"
            fillOpacity="0.12"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />

          {/* Right side wall - subtle liquid glass */}
          <path
            d="M536 80 L560 100 L560 310 L536 350 L536 80"
            fill="white"
            fillOpacity="0.12"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />

          {/* Box body - front face with 3D gradient */}
          <g filter="url(#filter0_i_51_65)">
            <path
              d="M512.766 79.1595L147.766 79.1624C136.453 79.1625 130.796 79.1626 127.281 82.6773C123.766 86.192 123.766 91.8488 123.766 103.162V327.159C123.766 338.473 123.766 344.13 127.281 347.645C130.796 351.159 136.453 351.159 147.766 351.159H512.766C524.08 351.159 529.737 351.159 533.252 347.645C536.766 344.13 536.766 338.473 536.766 327.159V103.159C536.766 91.8457 536.766 86.1888 533.252 82.6741C529.737 79.1594 524.08 79.1594 512.766 79.1595Z"
              fill="url(#boxFrontGradient)"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
          </g>

          {/* Inner bottom of box - depth illusion */}
          <path
            d="M140 320 L140 280 Q140 270 150 270 L510 270 Q520 270 520 280 L520 320 Q520 340 500 340 L160 340 Q140 340 140 320"
            fill="url(#boxBottomGradient)"
            opacity="0.6"
          />

          {/* Subtle inner rim highlight */}
          <path
            d="M135 90 L525 90"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Open top edges - subtle rim, not too prominent */}
          <g opacity="0.6">
            <path
              d="M74.6011 164.033L123.116 79.1138L535.59 78.7419L581.532 164.469C588.006 176.55 591.243 182.59 588.568 187.06C585.892 191.529 579.039 191.529 565.333 191.529H90.5591C76.4759 191.529 69.4343 191.529 66.7781 186.953C64.1219 182.376 67.615 176.262 74.6011 164.033Z"
              fill="white"
              fillOpacity="0.5"
              shapeRendering="crispEdges"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Bucket;
