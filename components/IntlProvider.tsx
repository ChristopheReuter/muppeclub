"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

export default function IntlProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<any>(null);
  useEffect(() => {
    const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || "en";
    (async () => {
      const m = await import(`../messages/${locale}.json`).then((mod) => mod.default);
      setMessages(m);
    })();
  }, []);
  if (!messages) return null;
  const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1] || "en";
  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
}


