import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MessageSquare, Mail, HelpCircle, ChevronDown, ExternalLink } from "lucide-react";

const ACCENT = "var(--spwn-accent)";
const BORDER = "var(--spwn-border)";
const CARD = "var(--spwn-card)";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I add a game to my wishlist?",
    answer: "Navigate to any game page and click the heart icon in the top right. The game will be added to your wishlist, which you can access from the profile menu.",
  },
  {
    question: "Can I edit or delete my reviews?",
    answer: "Yes! Go to your profile, find the review you want to edit in 'My Reviews', and click on it to make changes or delete it.",
  },
  {
    question: "What is the rating system?",
    answer: "Games are rated on a scale of 0-10 by our community. Our algorithm weights recent reviews more heavily to reflect current player sentiment.",
  },
  {
    question: "How do I report a bug or inappropriate content?",
    answer: "Click the report icon on any review or comment. You can select a reason and provide additional context to help our moderation team.",
  },
  {
    question: "Can I download my account data?",
    answer: "Yes! Go to Privacy & Security settings and click 'Download Your Data' to export all your account information in a portable format.",
  },
  {
    question: "How often is the game database updated?",
    answer: "We update our game database weekly with new releases and updates. Community reviews and ratings are updated in real-time.",
  },
  {
    question: "Is my personal information secure?",
    answer: "We use industry-standard encryption and security practices to protect your data. Two-factor authentication is available for additional security.",
  },
  {
    question: "Can I use SPWN on desktop?",
    answer: "Currently, SPWN is optimized for mobile devices. A desktop version is in development and will be available soon.",
  },
];

function FAQItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="border-b transition-all"
      style={{ borderColor: BORDER }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-start gap-3 text-left active:opacity-70 transition-all"
      >
        <HelpCircle size={16} style={{ color: ACCENT, marginTop: "2px", flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--spwn-text)" }}>
            {item.question}
          </p>
          {isOpen && (
            <p className="text-xs mt-2" style={{ color: "var(--spwn-faint)", lineHeight: 1.5 }}>
              {item.answer}
            </p>
          )}
        </div>
        <ChevronDown
          size={16}
          style={{
            color: "var(--spwn-faint)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
      </button>
    </div>
  );
}

export function HelpSupportPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "var(--spwn-bg)" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 h-16 border-b"
        style={{ borderColor: BORDER }}
      >
        <button onClick={() => navigate("/app/profile")} className="p-2 -ml-2">
          <ChevronLeft size={20} style={{ color: ACCENT }} />
        </button>
        <h1 className="text-lg" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>
          Help & Support
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Contact Section */}
        <div className="px-4 pt-6 pb-4">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
            Get In Touch
          </p>
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:opacity-70"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
              onClick={() => window.location.href = "mailto:support@spwn.game"}
            >
              <Mail size={16} style={{ color: ACCENT }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "var(--spwn-text)" }}>
                  Email Support
                </p>
                <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>
                  support@spwn.game
                </p>
              </div>
              <ExternalLink size={14} style={{ color: "var(--spwn-faint)" }} />
            </button>

            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all active:opacity-70"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
              onClick={() => alert("Discord community link would open here")}
            >
              <MessageSquare size={16} style={{ color: ACCENT }} />
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold" style={{ color: "var(--spwn-text)" }}>
                  Community Discord
                </p>
                <p className="text-xs" style={{ color: "var(--spwn-faint)" }}>
                  Join our community server
                </p>
              </div>
              <ExternalLink size={14} style={{ color: "var(--spwn-faint)" }} />
            </button>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-4">
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Frequently Asked Questions
            </p>
          </div>

          <div className="border-t" style={{ borderColor: BORDER }}>
            {faqs.map((faq, idx) => (
              <FAQItem
                key={idx}
                item={faq}
                isOpen={openFAQ === idx}
                onToggle={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-4 mt-6 mb-4">
          <div
            className="p-3 rounded-lg text-center"
            style={{ background: "var(--spwn-glass)", border: `1px solid ${BORDER}` }}
          >
            <p className="text-xs" style={{ color: "var(--spwn-faint)", lineHeight: 1.5 }}>
              <strong>Response time:</strong> We typically respond to support emails within 24 hours. For urgent issues, please reach out on Discord.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
