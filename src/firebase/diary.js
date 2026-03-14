import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'diaries';

// 일기 저장 (신규 or 수정)
export const saveDiary = async (userId, movieId, data) => {
  const id = `${userId}_${movieId}`;
  const ref = doc(db, COLLECTION, id);
  await setDoc(ref, {
    ...data,
    userId,
    movieId: Number(movieId),
    updatedAt: serverTimestamp(),
    createdAt: data.createdAt ?? serverTimestamp(),
  });
  return id;
};

// 특정 영화의 내 일기 가져오기
export const getDiary = async (userId, movieId) => {
  const id = `${userId}_${movieId}`;
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// 내 모든 일기 가져오기 (최신순)
export const getMyDiaries = async (userId) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// 일기 삭제
export const deleteDiary = async (userId, movieId) => {
  const id = `${userId}_${movieId}`;
  await deleteDoc(doc(db, COLLECTION, id));
};

// 내가 일기 쓴 movieId 목록
export const getMyMovieIds = async (userId) => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );
  const snap = await getDocs(q);
  return new Set(snap.docs.map((d) => d.data().movieId));
};
