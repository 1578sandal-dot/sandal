import { useState, useEffect, useCallback } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

// 수정 가능 여부: 해당 날짜 이틀 전 오후 6시까지
export const isEditable = (dateStr) => {
  const target = new Date(dateStr + "T00:00:00");
  const deadline = new Date(target);
  deadline.setDate(deadline.getDate() - 2);
  deadline.setHours(18, 0, 0, 0);
  return new Date() < deadline;
};

// 제출 마감 여부: 해당 월이 완전히 지난 경우에만 true
export const isPastSubmitDeadline = (yearMonth) => {
  const [year, month] = yearMonth.split("-").map(Number);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return year < currentYear || (year === currentYear && month < currentMonth);
};

export function useDietPlan(yearMonth) {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null); // { dates: { "2026-05-14": { items: [], note: "", submitted: false } } }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const docRef = user
    ? doc(db, "dietPlans", user.uid, "months", yearMonth)
    : null;

  useEffect(() => {
    if (!docRef) return;
    setLoading(true);
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists()) {
          setPlan(snap.data());
        } else {
          setPlan({ dates: {}, submittedAt: null });
        }
      })
      .catch(() => setPlan({ dates: {}, submittedAt: null }))
      .finally(() => setLoading(false));
  }, [yearMonth, user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // 특정 날짜 저장 (extraDates 전달 시 한 번에 일괄 저장)
  const saveDate = useCallback(
    async (dateStr, items, note, extraDates = []) => {
      if (!docRef) return;
      setSaving(true);
      const updatedAt = new Date().toISOString();
      const allDates = [dateStr, ...extraDates];
      const newDates = { ...plan?.dates };
      for (const d of allDates) {
        newDates[d] = { items, note, updatedAt };
      }
      const newPlan = { ...plan, dates: newDates };
      await setDoc(docRef, newPlan, { merge: true });
      setPlan(newPlan);
      setSaving(false);
    },
    [docRef, plan]
  );

  // 전체 제출 (최초 or 수정)
  const submitPlan = useCallback(async (changedDates = null) => {
    if (!docRef) return;
    setSaving(true);
    const isResubmit = !!plan?.submittedAt;
    const newPlan = {
      ...plan,
      submittedAt: serverTimestamp(),
      submittedBy: user.uid,
      // 수정 제출 시: 변경된 날짜 목록 + 이전 제출 내용 스냅샷 저장
      ...(isResubmit && changedDates
        ? {
            lastResubmittedAt: serverTimestamp(),
            changedDates,
            snapshotAtLastSubmit: { ...plan.dates },
          }
        : {
            snapshotAtLastSubmit: { ...plan.dates },
          }),
    };
    await setDoc(docRef, newPlan, { merge: true });
    setPlan(newPlan);
    setSaving(false);
  }, [docRef, plan, user]);

  return { plan, loading, saving, saveDate, submitPlan };
}
