import {useState, useEffect} from "react";

const GA_ID = "G-ZR7MQQBC2G";
const CONSENT_KEY = "obiadwgorach-cookie-consent";

function initGA4() {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === "accepted") {
      initGA4();
    } else if (!consent) {
      setVisible(true);
    }
  }, []);

  function hide() {
    setHiding(true);
    setTimeout(() => setVisible(false), 300);
  }

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    initGA4();
    hide();
  }

  function reject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    hide();
  }

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 flex justify-center p-4 transition-opacity duration-300 ${hiding ? "opacity-0" : "animate-slideUp"}`}
    >
      <div className='w-full max-w-2xl bg-paper-50 border border-paper-300 rounded-lg shadow-lg p-4 sm:p-5'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
          <p className='text-ink-600 text-sm flex-1'>
            Używamy plików cookie do analizy ruchu na stronie.{" "}
            <a
              href='/polityka-prywatnosci'
              className='underline hover:text-ink-800'
            >
              Polityka prywatności
            </a>
          </p>
          <div className='flex gap-2 shrink-0'>
            <button
              onClick={reject}
              className='px-4 py-2 text-sm text-ink-500 hover:text-ink-700 border border-paper-300 rounded-md transition-colors'
            >
              Odrzuć
            </button>
            <button
              onClick={accept}
              className='px-4 py-2 text-sm text-paper-50 bg-terra-500 hover:bg-terra-600 rounded-md transition-colors font-medium'
            >
              Akceptuję
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
