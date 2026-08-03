"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { Faq } from "@/content/pseo/faqs";

export default function PseoFaq({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="mb-16">
      <h2 className="mb-8 font-display text-[28px] font-extrabold tracking-tight text-[#111110]">
        Frequently asked questions
      </h2>
      <Accordion.Root
        type="single"
        collapsible
        className="flex flex-col gap-3"
      >
        {faqs.map((faq, i) => (
          <Accordion.Item
            key={i}
            value={`faq-${i}`}
            className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white"
          >
            <Accordion.Header>
              <Accordion.Trigger
                className={`
                  group flex w-full items-center justify-between gap-4
                  px-6 py-5 text-left
                  font-display text-[15px] font-bold text-[#111110]
                  transition-colors hover:text-[#E63946]
                  data-[state=open]:text-[#E63946]
                `}
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  className="flex-shrink-0 text-[#888780] transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-[#E63946]"
                  aria-hidden
                />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content
              className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
            >
              <div className="px-6 pb-5 font-body text-[14px] leading-[1.75] text-[#6B6B66]">
                {faq.a}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}
