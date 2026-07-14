import { toast } from "sonner";

/** Copies text via the Clipboard API, falling back to execCommand for in-app browsers. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

/** copy() + toast feedback in one call. */
export function useClipboard() {
  const copy = async (text: string, successMessage: string) => {
    const ok = await copyToClipboard(text);
    toast(ok ? successMessage : "복사에 실패했습니다. 직접 선택해 복사해주세요.");
    return ok;
  };
  return { copy };
}
