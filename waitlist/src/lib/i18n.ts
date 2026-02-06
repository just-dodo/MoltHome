export type Locale = 'en' | 'ko';

export type Dictionary = {
  meta: {
    description: string;
  };
  hero: {
    headingBefore: string;
    headingPrice: string;
    headingAfter: string;
    headingLine2: string;
    subtitle1: string;
    subtitle2: string;
  };
  waitlist: {
    placeholder: string;
    submit: string;
    joined: string;
    hint: string;
    errorRequired: string;
    errorInvalid: string;
  };
  demo: {
    longForm: string;
    shortForm: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    meta: {
      description: "Don't Buy Mac mini for $599, $30/m is enough to give it a try.",
    },
    hero: {
      headingBefore: "Don't Buy ",
      headingPrice: "Mac mini for $599",
      headingAfter: "",
      headingLine2: "$30/m is enough to give it a try.",
      subtitle1: "Run OpenClaw on Google Cloud Platform keeping your privacy safe.",
      subtitle2: "",
    },
    waitlist: {
      placeholder: "Email",
      submit: "Join Waitlist",
      joined: "Joined!",
      hint: "we'll send you an email when we're ready to launch",
      errorRequired: "Email is required",
      errorInvalid: "Invalid email address",
    },
    demo: {
      longForm: "While long-form videos work well,",
      shortForm: "Short-form videos are blocked!",
    },
  },
  ko: {
    meta: {
      description: "Mac mini 89만원, 월 $30이면 충분합니다.",
    },
    hero: {
      headingBefore: "",
      headingPrice: "Mac mini 89만원?",
      headingAfter: "",
      headingLine2: "5만원이면 끝.",
      subtitle1: "Google Cloud Platform에서 개인정보 걱정 없이 실행되는 개인 비서 OpenClaw를 만나보세요.",
      subtitle2: "",
    },
    waitlist: {
      placeholder: "이메일",
      submit: "대기자 등록",
      joined: "등록 완료!",
      hint: "출시 이메일을 보내드립니다",
      errorRequired: "이메일을 입력해주세요",
      errorInvalid: "올바르지 않은 이메일 주소입니다",
    },
    demo: {
      longForm: "긴 영상은 괜찮지만,",
      shortForm: "숏폼 영상은 차단됩니다!",
    },
  },
};

export function getDefaultLocale(): Locale {
  if (typeof window === 'undefined') return 'ko';
  const lang = navigator.language;
  if (lang.startsWith('ko')) return 'ko';
  return 'en';
}
