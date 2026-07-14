/** Kakao Maps / Share SDK loader — injects each script at most once. */

declare global {
  interface Window {
    kakao?: any;
  }
}

const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined;

let mapScriptPromise: Promise<boolean> | null = null;
let shareInitDone = false;

export function hasKakaoKey() {
  return Boolean(KAKAO_JS_KEY);
}

/** Loads the Maps SDK (with `services`) and resolves once kakao.maps is ready. Resolves false if no key. */
export function loadKakaoMapScript(): Promise<boolean> {
  if (!KAKAO_JS_KEY) return Promise.resolve(false);
  if (window.kakao?.maps) return Promise.resolve(true);
  if (mapScriptPromise) return mapScriptPromise;

  mapScriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false&libraries=services`;
    script.onload = () => window.kakao.maps.load(() => resolve(true));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return mapScriptPromise;
}

/** Loads the Kakao JS SDK (for Share) and calls Kakao.init once. Resolves false if no key. */
export function loadKakaoShareScript(): Promise<boolean> {
  if (!KAKAO_JS_KEY) return Promise.resolve(false);
  if (shareInitDone && window.kakao?.isInitialized?.()) return Promise.resolve(true);

  return new Promise((resolve) => {
    if (window.kakao && !window.kakao.maps) {
      // kakao.min.js already present (e.g. from a previous share attempt)
      if (!window.kakao.isInitialized?.()) window.kakao.init(KAKAO_JS_KEY);
      shareInitDone = true;
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    script.integrity = "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";
    script.crossOrigin = "anonymous";
    script.onload = () => {
      window.kakao.init(KAKAO_JS_KEY);
      shareInitDone = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}
