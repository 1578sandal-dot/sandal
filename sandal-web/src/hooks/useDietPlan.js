import { useState, useEffect, useCallback } from "react";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

// 수정 가능 여부: 해당 날짜 전날 오전 10시까지
export const isEditable = (dateStr) => {
  const target = new Date(dateStr + "T00:00:00");
  const deadline = new Date(target);
  deadline.setDate(deadline.getDate() - 1);
  deadline.setHours(10, 0, 0, 0);
  return new Date() < deadline;
};

// 전월 말 제출 마감 여부
export const isPastSubmitDeadline = (yearMonth) => {
  const [year, month] = yearMonth.split("-").map(Number);
  const deadline = new Date(year, month - 1, 0, 23, 59, 59); // 전월 말일
  return new Date() > deadline;
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
  }, [yearMonth, user?.uid]);

  // 특정 날짜 저장
  const saveDate = useCallback(
    async (dateStr, items, note) => {
      if (!docRef) return;
      setSaving(true);
      const newPlan = {
        ...plan,
        dates: {
          ...plan?.dates,
          [dateStr]: { items, note, updatedAt: new Date().toISOString() },
        },
      };
      await setDoc(docRef, newPlan, { merge: true });
      setPlan(newPlan);
      setSaving(false);
    },
    [docRef, plan]
  );

  // 전체 제출
  const submitPlan = useCallback(async () => {
    if (!docRef) return;
    setSaving(true);
    const newPlan = {
      ...plan,
      submittedAt: serverTimestamp(),
      submittedBy: user.uid,
    };
    await setDoc(docRef, newPlan, { merge: true });
    setPlan(newPlan);
    setSaving(false);
  }, [docRef, plan, user]);

  return { plan, loading, saving, saveDate, submitPlan };
}
