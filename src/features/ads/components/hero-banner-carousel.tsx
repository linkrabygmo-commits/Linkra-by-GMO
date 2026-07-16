"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroBanner } from "@/features/ads/types";
import { cn } from "@/lib/utils";

const AUTO_PLAY_INTERVAL_MS = 5000;

// 将来的にEmbla CarouselやSwiperへ置き換える場合も、外側から見えるAPI
// (banners配列を渡すだけ)は変わらないようにしてある。
export function HeroBannerCarousel({ banners }: { banners: HeroBanner[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % banners.length) + banners.length) % banners.length);
    },
    [banners.length],
  );

  // 自動再生。indexが変わるたびにタイマーを張り直すので、手動操作をしても
  // そこから改めて5秒後に次へ進む(手動操作と自動再生が競合しない)。
  useEffect(() => {
    if (isPaused || banners.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % banners.length);
    }, AUTO_PLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [index, isPaused, banners.length]);

  if (banners.length === 0) return null;

  return (
    <div
      className="w-[min(92vw,24rem)] sm:w-[26rem] lg:w-[29rem]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="広告"
      aria-roledescription="carousel"
    >
      {/* px分の余白を矢印ボタン用に確保し、ボタンが画像/カードに重ならないようにする */}
      <div className="relative px-8 sm:px-9">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 shadow-xl shadow-black/40">
          {banners.map((banner, i) => (
            <a
              key={`${banner.href}-${i}`}
              href={banner.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              className="absolute inset-0 transition-[opacity,transform] duration-500 ease-in-out"
              style={{
                opacity: i === index ? 1 : 0,
                transform:
                  i === index
                    ? "translateX(0)"
                    : `translateX(${i < index ? "-" : ""}12px)`,
                pointerEvents: i === index ? "auto" : "none",
              }}
            >
              <BannerSlide banner={banner} />
            </a>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="前の広告"
              className="absolute top-1/2 left-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="次の広告"
              className="absolute top-1/2 right-0 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.href + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`広告 ${i + 1} へ移動`}
              aria-current={i === index}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === index ? "bg-blue-500" : "bg-white/25 hover:bg-white/40",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BannerSlide({ banner }: { banner: HeroBanner }) {
  if (banner.image) {
    // 広告画像自体に訴求文言が焼き込まれている前提の、自己完結型バナーとして
    // 扱う。タイトルの文字を重ねて表示すると画像内の文字と衝突するため、
    // 画像がある場合はタイトル/説明文をオーバーレイ表示しない。
    return (
      <div className="relative size-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- 外部/未確定ドメインの広告画像のため next/image の最適化対象外 */}
        <img
          src={banner.image}
          alt={banner.title ?? "広告"}
          className="size-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex size-full flex-col justify-center gap-2 bg-gradient-to-br from-slate-50 to-blue-50 p-7">
      {banner.title && (
        <p className="text-base font-semibold text-blue-700">{banner.title}</p>
      )}
      {banner.description && (
        <p className="text-sm leading-relaxed text-slate-600">
          {banner.description}
        </p>
      )}
    </div>
  );
}
