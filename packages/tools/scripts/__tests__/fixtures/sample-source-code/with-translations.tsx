import { useTranslation } from "i18nexus";

export default function HomePage() {
  const { t } = useTranslation("common");

  return (
    <div>
      <h1>{t("welcome.title")}</h1>
      <p>{t("welcome.description")}</p>
      <button>{t("button.save")}</button>
    </div>
  );
}
