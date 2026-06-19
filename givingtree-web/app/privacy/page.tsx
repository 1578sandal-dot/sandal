import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 더기빙트리",
  description: "더기빙트리 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <section className="pt-32 pb-24 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="font-[family-name:var(--font-maruburi)] text-4xl text-ink font-semibold mb-2">
          개인정보처리방침
        </h1>
        <p className="text-sm text-bark/50 mb-12">시행일: 2026년 1월 1일</p>

        <div className="flex flex-col gap-10 text-sm text-bark/70 leading-relaxed">

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">1. 수집하는 개인정보 항목</h2>
            <p className="break-keep">
              (주)더기빙트리(이하 "회사")는 견적 문의 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
            </p>
            <ul className="mt-3 ml-4 flex flex-col gap-1 list-disc">
              <li>필수 항목: 회사명, 담당자명, 연락처, 문의 서비스 유형</li>
              <li>선택 항목: 이메일 주소, 예상 인원, 문의 내용</li>
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">2. 개인정보 수집 및 이용 목적</h2>
            <ul className="ml-4 flex flex-col gap-1 list-disc">
              <li>견적 문의 접수 및 응대</li>
              <li>서비스 안내 및 계약 체결</li>
              <li>고객 문의에 대한 회신</li>
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <p className="break-keep">
              수집된 개인정보는 문의 처리 완료 후 1년간 보관하며, 이후 지체 없이 파기합니다.
              단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">4. 개인정보의 제3자 제공</h2>
            <p className="break-keep">
              회사는 수집한 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              다만, 법령의 규정에 의거하거나 수사기관의 요구가 있는 경우에는 예외로 합니다.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">5. 개인정보 처리 위탁</h2>
            <p className="break-keep">
              회사는 문의 이메일 전송을 위해 Web3Forms(web3forms.com) 서비스를 이용합니다.
              해당 업체는 서비스 제공 목적 외 개인정보를 사용하지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">6. 정보주체의 권리</h2>
            <p className="break-keep">
              이용자는 언제든지 수집된 개인정보의 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.
              요청은 아래 개인정보 보호 담당자에게 연락해 주시기 바랍니다.
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">7. 개인정보 보호 담당자</h2>
            <ul className="ml-4 flex flex-col gap-1 list-disc">
              <li>담당자: 이창훈</li>
              <li>이메일: admin@thegivingtree.co.kr</li>
              <li>전화: +82 10 2202 1309</li>
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-maruburi)] text-lg text-ink font-semibold mb-3">8. 개인정보처리방침 변경</h2>
            <p className="break-keep">
              본 방침은 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 시 홈페이지를 통해 공지합니다.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
