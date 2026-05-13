import { useState, useEffect, createContext, useContext } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, FIREBASE_READY } from "../lib/firebase";

const AuthContext = createContext(null);

// Firebase 미연결 시 데모 계정
const DEMO_CREDENTIALS = { email: "demo@sandal.kr", password: "sandal1234" };
const DEMO_USER = { uid: "demo", email: "demo@sandal.kr" };
const DEMO_COMPANY = { name: "샌달 데모 기업", contactName: "담당자" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FIREBASE_READY) {
      // Firebase 미설정: 로딩만 끝내고 로그인 화면 표시
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const companyDoc = await getDoc(doc(db, "companies", firebaseUser.uid));
          if (companyDoc.exists()) {
            setCompany(companyDoc.data());
          } else {
            setCompany({ name: "기업 담당자", contactName: "담당자" });
          }
        } catch {
          setCompany({ name: "기업 담당자", contactName: "담당자" });
        }
      } else {
        setUser(null);
        setCompany(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!FIREBASE_READY) {
      // 데모 모드: 고정 계정으로 로그인
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        setUser(DEMO_USER);
        setCompany(DEMO_COMPANY);
      } else {
        throw { code: "auth/invalid-credential" };
      }
      return;
    }
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!FIREBASE_READY) {
      setUser(null);
      setCompany(null);
      return;
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, company, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
