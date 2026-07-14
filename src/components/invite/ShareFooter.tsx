import { motion } from "framer-motion";
import { Link2, Share } from "lucide-react";
import { toast } from "sonner";
import { weddingConfig } from "@/config/wedding";
import { loadKakaoShareScript } from "@/lib/kakao";
import { useClipboard } from "@/hooks/useClipboard";

async function shareToKakao() {
  const ok = await loadKakaoShareScript();
  if (!ok) {
    toast("카카오톡 공유가 아직 설정되지 않았어요. 링크 복사를 이용해주세요.");
    return;
  }
  try {
    const { meta, share } = weddingConfig;
    const absoluteImage = new URL(meta.ogImage, meta.url).toString();
    (window as any).Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: share.kakaoTitle,
        description: share.kakaoDescription,
        imageUrl: absoluteImage,
        link: { mobileWebUrl: meta.url, webUrl: meta.url },
      },
      buttons: [
        {
          title: share.kakaoButtonText,
          link: { mobileWebUrl: meta.url, webUrl: meta.url },
        },
      ],
    });
  } catch {
    toast("카카오톡 공유에 실패했어요. 링크 복사를 이용해주세요.");
  }
}

export function ShareFooter() {
  const { copy } = useClipboard();

  return (
    <div className="mx-auto max-w-sm space-y-2.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={shareToKakao}
        className="flex w-full items-center justify-between rounded-xl bg-[#FEE500] px-5 py-3.5 text-sm font-medium text-[#3C1E1E] transition hover:opacity-90"
      >
        카카오톡으로 청첩장 전하기
        <Share className="h-4 w-4" aria-hidden />
      </motion.button>
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => copy(weddingConfig.meta.url, "청첩장 링크가 복사되었습니다")}
        className="flex w-full items-center justify-between rounded-xl bg-blush-deep/80 px-5 py-3.5 text-sm text-primary-foreground transition hover:opacity-90"
      >
        청첩장 주소 복사하기
        <Link2 className="h-4 w-4" aria-hidden />
      </motion.button>
    </div>
  );
}

// NOTE: 카카오톡 공유 썸네일을 바꾼 뒤에는 카카오 OG 캐시를 초기화해야 반영됩니다.
// https://developers.kakao.com/tool/debugger/sharing
