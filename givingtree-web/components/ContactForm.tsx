"use client";

import { useState } from "react";

type FormState = {
  company: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  headcount: string;
  message: string;
};

const serviceOptions = [
  "기업 정기조식 구독",
  "단체 도시락 · 샌드위치 박스",
  "김밥 · 유부초밥 한식 라인",
  "행사 간식 패키지",
  "대규모 케이터링 (100인 이상)",
  "기타 / 복합 문의",
];

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    company: "",
    name: "",
    phone: "",
    email: "",
    service: "",
    headcount: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "1d3ef70a-dae5-42a4-85fe-6d98267b5bda",
          subject: `[더기빙트리 홈페이지] 견적 문의: ${form.company}`,
          from_name: form.name,
          company: form.company,
          name: form.name,
          phone: form.phone,
          email: form.email,
          service: form.service,
          headcount: form.headcount || "미입력",
          message: form.message || "내용 없음",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        alert("전송에 실패했습니다. 잠시 후 다시 시도하거나 직접 연락해 주세요.");
      }
    } catch {
      alert("전송에 실패했습니다. 잠시 후 다시 시도하거나 직접 연락해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-forest rounded-2xl p-12 text-center">
        <div className="font-[family-name:var(--font-maruburi)] text-5xl text-gold mb-4">✓</div>
        <h2 className="font-[family-name:var(--font-maruburi)] text-3xl text-cream font-semibold mb-4">문의가 접수되었습니다.</h2>
        <p className="text-cream/60 break-keep">
          영업일 기준 24시간 내에 담당자가 연락드립니다.<br />
          감사합니다.
        </p>
      </div>
    );
  }

  const inputClass = "w-full bg-paper border border-pale-sage rounded-xl px-4 py-3 text-sm text-bark placeholder:text-bark/30 focus:outline-none focus:border-forest transition-colors";
  const labelClass = "block text-xs text-bark/50 mb-1.5 tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>회사명 *</label>
          <input required name="company" value={form.company} onChange={handleChange} placeholder="(주)더기빙트리" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>담당자명 *</label>
          <input required name="name" value={form.name} onChange={handleChange} placeholder="홍길동" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>연락처 *</label>
          <input required name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>이메일</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@company.co.kr" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>문의 서비스 *</label>
        <select required name="service" value={form.service} onChange={handleChange} className={inputClass}>
          <option value="">서비스를 선택해주세요</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>예상 인원</label>
        <input name="headcount" value={form.headcount} onChange={handleChange} placeholder="예: 50명, 100~200명" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>문의 내용</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="서비스 주기, 예산, 행사 날짜 등 자세한 내용을 적어주시면 더 정확한 제안을 드릴 수 있습니다."
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-forest text-cream rounded-xl font-medium hover:bg-ink transition-colors disabled:opacity-60 text-sm tracking-wide"
      >
        {loading ? "전송 중..." : "견적 문의 보내기"}
      </button>

      <p className="text-xs text-bark/40 text-center break-keep">
        제출하신 정보는 견적 및 서비스 안내 목적으로만 사용됩니다.
      </p>
    </form>
  );
}
