import i18next, { InitOptions } from "i18next";
import I18NexFsBackend from "i18next-fs-backend";
import middleware from "i18next-http-middleware";
import config from "../config";

class I18nConfigMiddleware {
  public i18nInstance = i18next;

  constructor() {
    this.initializeI18n();
  }

  private initializeI18n(): void {
    const options: InitOptions = {
      backend: {
        loadPath: `./locales/{{lng}}/translation.json`, // Path to translations
      },
      fallbackLng: "en", // Default language
      preload: ["en"], // Languages to preload
      detection: {
        order: ["querystring", "header", "cookie"], // Language detection order
        caches: ["cookie"], // Cache detected language in cookies
      },
    };

    this.i18nInstance
      .use(I18NexFsBackend)
      .use(middleware.LanguageDetector)
      .init(options, (err) => {
        if (err) {
          config.DEBUG("i18n initialization error:", err); // Debug initialization errors
        } else {
          config.DEBUG("i18n initialized successfully");
        }
      });
  }
}

export default new I18nConfigMiddleware().i18nInstance;
