'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is KlossySkin?",
    answer: "KlossySkin is a premium skincare brand dedicated to providing thoughtfully curated, clean beauty products that deliver visible results. Our products are formulated with skin-loving ingredients and backed by scientific research."
  },
  {
    question: "Are your products cruelty-free?",
    answer: "Yes! All KlossySkin products are 100% cruelty-free and vegan. We never test on animals and partner with suppliers who share our commitment to ethical beauty."
  },
  {
    question: "How long does shipping take?",
    answer: "We offer free standard shipping on orders over 50, which typically takes 5-7 business days. Express shipping options are also available at checkout for faster delivery."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a hassle-free 30-day return policy. If you're not satisfied with your purchase, you can return it for a full refund or exchange. Items must be in original, unused condition."
  },
  {
    question: "Are your products suitable for sensitive skin?",
    answer: "Most of our products are formulated to be gentle enough for sensitive skin. However, we recommend reviewing the ingredient list or contacting our customer service team to find the best products for your specific skin type."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary depending on your location. International orders may be subject to customs duties or taxes."
  },
  {
    question: "Can I use multiple products together?",
    answer: "Absolutely! Our products are designed to work together. We recommend starting with a cleanser, toner, serum, and moisturizer. You can gradually introduce additional products like masks or treatments based on your skin's needs."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and digital payment options. All transactions are secure and encrypted."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive an email with a tracking number. You can use this number to track your package in real-time through our carrier's website."
  },
  {
    question: "Do you offer subscription services?",
    answer: "Yes! Sign up for our subscription service to receive your favorite products at regular intervals with exclusive discounts. You can customize your subscription and cancel anytime."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#e2f3ef] rounded-xl overflow-hidden hover:border-[#008d6e] transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 sm:py-6 flex items-center justify-between bg-white hover:bg-[#f8fffe] transition-colors"
      >
        <h3 className="text-base sm:text-lg font-semibold text-[#0b3b32] text-left">
          {question}
        </h3>
        <div className="shrink-0 ml-4">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[#008d6e]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#2f5f56]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 py-5 sm:py-6 bg-[#f8fffe] border-t border-[#e2f3ef]">
          <p className="text-[#2f5f56] text-base leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <main className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0b3b32] mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-[#2f5f56]">Find answers to common questions about our products and services</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-12 sm:mt-16 bg-linear-to-r from-[#e7f7f3] to-[#f8fffe] rounded-2xl p-8 text-center border border-[#e2f3ef]">
        <h2 className="text-2xl font-bold text-[#0b3b32] mb-3">Didn't find your answer?</h2>
        <p className="text-[#2f5f56] mb-6">Our customer service team is here to help!</p>
        <a
          href="mailto:support@klossyskin.com"
          className="inline-block bg-linear-to-r from-[#1e7864] to-[#008d6e] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}
