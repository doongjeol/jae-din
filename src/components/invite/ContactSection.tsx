import { MessageCircle, Phone } from "lucide-react";
import { collectContacts, stripHyphens } from "@/lib/wedding-format";

function ContactCard({ role, name, phone }: { role: string; name: string; phone: string }) {
  const digits = stripHyphens(phone);
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-blush/60 bg-white/60 px-4 py-3 backdrop-blur">
      <div className="min-w-0">
        <p className="text-[0.7rem] text-muted-foreground">{role}</p>
        <p className="truncate font-serif text-lg text-foreground">{name}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a
          href={`tel:${digits}`}
          aria-label={`${name}에게 전화하기`}
          className="grid h-9 w-9 place-items-center rounded-full border border-blush-deep/30 bg-white/70 text-blush-deep transition-colors hover:bg-blush/40"
        >
          <Phone className="h-4 w-4" />
        </a>
        <a
          href={`sms:${digits}`}
          aria-label={`${name}에게 문자 보내기`}
          className="grid h-9 w-9 place-items-center rounded-full border border-blush-deep/30 bg-white/70 text-blush-deep transition-colors hover:bg-blush/40"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

export function ContactSection() {
  const contacts = collectContacts();
  const principal = contacts.filter((c) => c.role === "신랑" || c.role === "신부");
  const parents = contacts.filter((c) => c.role !== "신랑" && c.role !== "신부");

  return (
    <div className="mx-auto max-w-sm space-y-2">
      {principal.map((c) => (
        <ContactCard key={c.role} {...c} />
      ))}
      {parents.length > 0 && (
        <>
          <p className="pt-4 text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">
            혼주에게 연락하기
          </p>
          {parents.map((c) => (
            <ContactCard key={c.role} {...c} />
          ))}
        </>
      )}
    </div>
  );
}
