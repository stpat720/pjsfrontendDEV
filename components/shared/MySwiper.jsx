import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Video from "next-video";
import MediaThemeInstaplay from "player.style/instaplay/react";
// Import your Video component and any other dependencies as needed

export default function MySwiper({ item }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full group">
      <Swiper
        style={{ "--swiper-navigation-color": "#fff" }}
        modules={[Navigation]}
        spaceBetween={2}
        slidesPerView={1}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        lazyPreloadPrevNext={0}
        className="w-full overflow-visible"
        onSwiper={(swiper) => {
          // Delay execution to ensure refs are set
          setTimeout(() => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          });
        }}
      >
        {item.media.map((mediaSrc, idx) => {
          // Determine if the source is a video (assumed to be a Mux ID) or an image URL
          const isVideo =
            !mediaSrc.startsWith("http") &&
            !mediaSrc.endsWith(".jpg") &&
            !mediaSrc.endsWith(".png") &&
            !mediaSrc.endsWith(".jpeg");

          return (
            <SwiperSlide key={idx}>
              {isVideo ? (
                // Render Video
                <div
                  className="w-full"
                  style={{
                    aspectRatio: item.aspectRatio,
                    "--media-secondary-color": "#4a4a4a",
                  }}
                >
                  <Video
                    src={`https://stream.mux.com/${mediaSrc}.m3u8`}
                    theme={MediaThemeInstaplay}
                    loop={idx === 0}
                    muted={idx === 0}
                    playsInline
                    onLoadedMetadata={(e) => {
                      if (idx === 0) {
                        e.target.play().catch((error) =>
                          console.log("Autoplay blocked:", error)
                        );
                      }
                    }}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                // Render Image
                <div
                  className="flex justify-center items-center w-full"
                  style={{ aspectRatio: item.aspectRatio }}
                >
                  <img
                    src={mediaSrc}
                    alt={item.title}
                    className="max-h-full object-contain"
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div ref={nextRef} className="absolute right-[-28px] top-1/2 -translate-y-1/2 flex items-center cursor-pointer">
        <span className="text-gray-400 text-sm">{"❯"}</span> {/* Small right arrow */}
      </div>

      <div ref={prevRef} className="absolute left-[-28px] top-1/2 -translate-y-1/2 flex items-center cursor-pointer">
        <span className="text-gray-400 text-sm">{"❮"}</span>  {/* Small left arrow */}
      </div>
    </div>
  );
}
