import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import type {
  Student,
  Bus,
  Route,
  Guardian,
  ScanLog,
  GeoPoint,
  RouteStop,
} from '@/src/types';

const DISTRICT_ID = 'demo-district';

export const studentsCollection = (districtId: string = DISTRICT_ID) =>
  collection(db, 'districts', districtId, 'students');

export const busesCollection = (districtId: string = DISTRICT_ID) =>
  collection(db, 'districts', districtId, 'buses');

export const routesCollection = (districtId: string = DISTRICT_ID) =>
  collection(db, 'districts', districtId, 'routes');

export const guardiansCollection = (districtId: string = DISTRICT_ID) =>
  collection(db, 'districts', districtId, 'guardians');

export const scanLogsCollection = (districtId: string = DISTRICT_ID) =>
  collection(db, 'districts', districtId, 'scanLogs');

export const getStudentByBarcode = async (barcode: string): Promise<Student | null> => {
  const q = query(studentsCollection(), where('barcode', '==', barcode));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Student;
  }
  return null;
};

export const getStudentById = async (studentId: string, districtId: string = DISTRICT_ID): Promise<Student | null> => {
  const studentDoc = await getDoc(doc(studentsCollection(districtId), studentId));
  if (studentDoc.exists()) {
    return { id: studentDoc.id, ...studentDoc.data() } as Student;
  }
  return null;
};

export const getStudentsByRoute = async (routeId: string, districtId: string = DISTRICT_ID): Promise<Student[]> => {
  const q = query(studentsCollection(districtId), where('routeIds', 'array-contains', routeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
};

export const getBusById = async (busId: string, districtId: string = DISTRICT_ID): Promise<Bus | null> => {
  const busDoc = await getDoc(doc(busesCollection(districtId), busId));
  if (busDoc.exists()) {
    return { id: busDoc.id, ...busDoc.data() } as Bus;
  }
  return null;
};

export const getRouteById = async (routeId: string, districtId: string = DISTRICT_ID): Promise<Route | null> => {
  const routeDoc = await getDoc(doc(routesCollection(districtId), routeId));
  if (routeDoc.exists()) {
    return { id: routeDoc.id, ...routeDoc.data() } as Route;
  }
  return null;
};

export const createStudent = async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>, districtId: string = DISTRICT_ID): Promise<string> => {
  const docRef = await addDoc(studentsCollection(districtId), {
    ...student,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateStudent = async (
  studentId: string,
  data: Partial<Student>,
  districtId: string = DISTRICT_ID
): Promise<void> => {
  await updateDoc(doc(studentsCollection(districtId), studentId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const createScanLog = async (
  scanData: Omit<ScanLog, 'id' | 'synced'>,
  districtId: string = DISTRICT_ID
): Promise<string> => {
  const docRef = await addDoc(scanLogsCollection(districtId), {
    ...scanData,
    synced: true,
    timestamp: Timestamp.fromDate(new Date()),
  });
  return docRef.id;
};

export const getScanLogsByStudent = async (
  studentId: string,
  districtId: string = DISTRICT_ID,
  limit: number = 50
): Promise<ScanLog[]> => {
  const q = query(
    scanLogsCollection(districtId),
    where('studentId', '==', studentId),
    orderBy('timestamp', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, limit).map((doc) => ({ id: doc.id, ...doc.data() } as ScanLog));
};

export const getLastScanForStudent = async (
  studentId: string,
  districtId: string = DISTRICT_ID
): Promise<ScanLog | null> => {
  const q = query(
    scanLogsCollection(districtId),
    where('studentId', '==', studentId),
    orderBy('timestamp', 'desc'),
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ScanLog;
  }
  return null;
};

export const updateBusLocation = async (
  busId: string,
  location: GeoPoint,
  districtId: string = DISTRICT_ID
): Promise<void> => {
  await updateDoc(doc(busesCollection(districtId), busId), {
    currentLocation: location,
    lastLocationUpdate: serverTimestamp(),
  });
};

export const subscribeToBus = (
  busId: string,
  callback: (bus: Bus | null) => void,
  districtId: string = DISTRICT_ID
) => {
  return onSnapshot(doc(busesCollection(districtId), busId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Bus);
    } else {
      callback(null);
    }
  });
};

export const subscribeToStudentScans = (
  studentId: string,
  callback: (scans: ScanLog[]) => void,
  districtId: string = DISTRICT_ID
) => {
  const q = query(
    scanLogsCollection(districtId),
    where('studentId', '==', studentId),
    orderBy('timestamp', 'desc'),
  );
  return onSnapshot(q, (snapshot) => {
    const scans = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ScanLog));
    callback(scans);
  });
};

export const getStudentsByGuardian = async (
  guardianId: string,
  districtId: string = DISTRICT_ID
): Promise<Student[]> => {
  const guardianDoc = await getDoc(doc(guardiansCollection(districtId), guardianId));
  if (!guardianDoc.exists()) return [];
  
  const guardianData = guardianDoc.data();
  const studentIds = guardianData.studentIds || [];
  
  const students: Student[] = [];
  for (const studentId of studentIds) {
    const student = await getStudentById(studentId, districtId);
    if (student) students.push(student);
  }
  
  return students;
};

export const uploadStudentPhoto = async (
  studentId: string,
  photoUri: string,
  districtId: string = DISTRICT_ID
): Promise<string> => {
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `students/${districtId}/${studentId}/photo.jpg`);
  
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

export const uploadBusPhoto = async (
  busId: string,
  photoUri: string,
  districtId: string = DISTRICT_ID
): Promise<string> => {
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `buses/${districtId}/${busId}/photo.jpg`);
  
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
};

export const generateStudentBarcodes = async (
  districtId: string = DISTRICT_ID
): Promise<{ studentId: string; barcode: string }[]> => {
  const students: { studentId: string; barcode: string }[] = [];
  const snapshot = await getDocs(studentsCollection(districtId));
  
  snapshot.forEach((doc) => {
    const student = doc.data() as Student;
    const barcode = `BUS-${student.studentId}-${student.id.slice(0, 8).toUpperCase()}`;
    students.push({ studentId: doc.id, barcode });
    updateStudent(doc.id, { barcode }, districtId);
  });
  
  return students;
};
