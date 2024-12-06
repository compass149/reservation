import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { welcome: "Welcome to Guesthouse Reservation" } },
  ko: { translation: { welcome: "게스트하우스 예약에 오신 것을 환영합니다" } },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
