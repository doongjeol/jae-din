import { weddingConfig, type Person } from "@/config/wedding";

export function stripHyphens(phone: string) {
  return phone.replace(/-/g, "");
}

export interface AccountEntry {
  role: string;
  /** 예금주 */
  name: string;
  bank: string;
  number: string;
}

/** 신랑측/신부측 계좌 목록 — 본인 + 혼주 중 account가 정의된 사람만 수집. */
export function collectAccounts(side: "groom" | "bride"): AccountEntry[] {
  const c = weddingConfig.couple[side];
  const label = side === "groom" ? "신랑" : "신부";
  const persons: Array<{ role: string; account?: Person["account"] }> = [
    { role: label, account: c.account },
    { role: `${label} 아버지`, account: c.father.account },
    { role: `${label} 어머니`, account: c.mother.account },
  ];
  return persons.flatMap((p) =>
    p.account ? [{ role: p.role, name: p.account.holder, bank: p.account.bank, number: p.account.number }] : [],
  );
}

export interface ContactEntry {
  role: string;
  name: string;
  phone: string;
}

/** 신랑/신부 + 전화번호가 있는 양가 혼주를 연락하기 섹션용으로 모아 반환. */
export function collectContacts(): ContactEntry[] {
  const { groom, bride } = weddingConfig.couple;
  const list: ContactEntry[] = [];
  if (groom.phone) list.push({ role: "신랑", name: groom.name, phone: groom.phone });
  if (bride.phone) list.push({ role: "신부", name: bride.name, phone: bride.phone });
  const parents: Array<[string, Person]> = [
    ["신랑 아버지", groom.father],
    ["신랑 어머니", groom.mother],
    ["신부 아버지", bride.father],
    ["신부 어머니", bride.mother],
  ];
  for (const [role, p] of parents) {
    if (p.phone) list.push({ role, name: p.name, phone: p.phone });
  }
  return list;
}

export function kakaoMapUrl(query: string) {
  return `https://map.kakao.com/?q=${encodeURIComponent(query)}`;
}

export function naverMapUrl(query: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

export function tmapAppUrl(query: string) {
  return `tmap://search?name=${encodeURIComponent(query)}`;
}
