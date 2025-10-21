import { useTranslation } from "@/5_Shared/lib/i18nexus/useTranslation";

// SVG 아이콘 컴포넌트 (w-4 h-4 클래스 추가)
const Retry = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12a8 8 0 0 1 8-8V2.5L14 4.5 12 6.5V5a7 7 0 1 0 7 7h1.5a8.5 8.5 0 1 1-8.5-8.5z"
      fill="currentColor"
    />
  </svg>
);

const Refresh = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4V2l3 3-3 3V6c-3.31 0-6 2.69-6 6 0 1.01.25 1.97.7 2.8l-1.46 1.46A7.93 7.93 0 0 1 4 12c0-4.42 3.58-8 8-8zm0 14c3.31 0 6-2.69 6-6 0-1.01-.25-1.97-.7-2.8l1.46-1.46A7.93 7.93 0 0 1 20 12c0 4.42-3.58 8-8 8v2l-3-3 3-3v2z"
      fill="currentColor"
    />
  </svg>
);

export const PageErrorFallback = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[400px] w-full items-center justify-center px-5 py-10 font-['Pretendard',_sans-serif]">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-4 rounded-2xl border-[1.5px] border-[#EAECF1] bg-white p-6 py-8 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        {/* 아이콘을 추가하고 싶다면 이 곳에 추가하세요. */}
        {/* 예: <div className="mb-2">...</div> */}

        <div className="flex w-full flex-col items-center gap-1">
          <p className="m-0 text-2xl font-bold text-[#212A4A]">{t("페이지 로딩 오류")}</p>
          <p className="m-0 text-[15px] font-semibold text-[#1F2539]">
            {t("페이지를 불러오는 중 오류가 발생했습니다.")}
          </p>
          <p className="m-0 text-center text-[13px] leading-snug font-medium text-[#73758A]">
            {error.message ||
              t("알 수 없는 오류가 발생했습니다. 다시 시도하거나 새로고침 해주세요.")}
          </p>
        </div>

        <div className="mt-3 flex w-full justify-center gap-2">
          {/* 다시 시도 버튼 */}
          <button
            onClick={reset}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded border-2 border-[#EAECF1] bg-[#EAECF1] px-4 py-3 whitespace-nowrap text-[#1F2539] transition-all duration-200 ease-in-out hover:border-[#DCDFE7] hover:bg-[#DCDFE7]"
          >
            <span className="text-[15px] font-semibold">{t("다시 시도")}</span>
            <Retry />
          </button>

          {/* 새로고침 버튼 */}
          <button
            onClick={() => window.location.reload()}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded border-2 border-[#EAECF1] bg-white px-4 py-3 whitespace-nowrap text-[#73758A] transition-all duration-200 ease-in-out hover:border-[#DCDFE7] hover:bg-[#F8F9FA]"
          >
            <span className="text-[15px] font-semibold">{t("새로고침")}</span>
            <Refresh />
          </button>
        </div>
      </div>
    </div>
  );
};
