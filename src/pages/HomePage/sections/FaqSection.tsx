import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MOCK_FAQS } from '@/data/bytedance';

/**
 * FAQ 区域 · 概念 19
 * 手风琴交互 · 概念 33：同一时刻只展开一项，用 framer-motion 做高度过渡
 */
export default function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(MOCK_FAQS[0]?.id ?? null);

  return (
    <section id="faq" className="relative w-full bg-muted/20 py-20 md:py-28">
      <div data-concept-id="19" className="mx-auto max-w-3xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center md:mb-14"
        >
          <div className="mb-3 text-sm font-medium text-primary">FAQ</div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">常见问题</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            关于这本视觉词典的定位、内容与使用方式
          </p>
        </motion.div>

        <div data-concept-id="33" className="divide-y divide-border/60 border-y border-border/60">
          {MOCK_FAQS.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:text-primary"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-base font-medium">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      isOpen
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pl-9 pr-11 text-sm leading-relaxed text-muted-foreground">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          手风琴同一时刻只展开一项，避免页面高度剧烈跳动
        </p>
      </div>
    </section>
  );
}
