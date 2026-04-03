import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { auth, db } from './config';
import type { UserRole, User as AppUser, GuardianInvite } from '@/src/types';
import { requiresMFA } from '@/src/utils/rbac';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  districtId: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface GuardianInviteData {
  studentId: string;
  guardianEmail: string;
  districtId: string;
  createdBy: string;
}

export const signUp = async (data: SignUpData): Promise<User> => {
  const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
  
  await updateProfile(user, {
    displayName: `${data.firstName} ${data.lastName}`,
  });

  const userDoc: Partial<AppUser> = {
    id: user.uid,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    districtId: data.districtId,
    mfaEnabled: requiresMFA(data.role),
    mfaVerified: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, 'districts', data.districtId, 'users', user.uid), userDoc);
  await sendEmailVerification(user);

  return user;
};

export const signIn = async (data: SignInData): Promise<User> => {
  const { user } = await signInWithEmailAndPassword(auth, data.email, data.password);
  return user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (districtId: string, userId: string): Promise<AppUser | null> => {
  const userDoc = await getDoc(doc(db, 'districts', districtId, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() } as AppUser;
  }
  return null;
};

export const updateUserProfile = async (
  districtId: string,
  userId: string,
  data: Partial<AppUser>
): Promise<void> => {
  await updateDoc(doc(db, 'districts', districtId, 'users', userId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const sendMFACode = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<string> => {
  const phoneAuthProvider = new PhoneAuthProvider(auth);
  const verificationId = await phoneAuthProvider.verifyPhoneNumber(
    phoneNumber,
    recaptchaVerifier
  );
  return verificationId;
};

export const verifyMFACode = async (
  verificationId: string,
  code: string
): Promise<void> => {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  await signInWithCredential(auth, credential);
};

export const setupMFA = async (
  districtId: string,
  userId: string,
  phoneNumber: string
): Promise<void> => {
  await updateDoc(doc(db, 'districts', districtId, 'users', userId), {
    mfaEnabled: true,
    mfaPhoneNumber: phoneNumber,
    updatedAt: serverTimestamp(),
  });
};

export const verifyMFA = async (
  districtId: string,
  userId: string
): Promise<void> => {
  await updateDoc(doc(db, 'districts', districtId, 'users', userId), {
    mfaVerified: true,
    updatedAt: serverTimestamp(),
  });
};

export const createGuardianInvite = async (
  data: GuardianInviteData
): Promise<string> => {
  const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invite: Omit<GuardianInvite, 'id'> = {
    districtId: data.districtId,
    studentId: data.studentId,
    guardianEmail: data.guardianEmail,
    token,
    status: 'pending',
    expiresAt,
    createdBy: data.createdBy,
    createdAt: new Date(),
  };

  const docRef = await addDoc(
    collection(db, 'districts', data.districtId, 'guardianInvites'),
    invite
  );

  return docRef.id;
};

export const getGuardianInviteByToken = async (
  districtId: string,
  token: string
): Promise<GuardianInvite | null> => {
  const q = query(
    collection(db, 'districts', districtId, 'guardianInvites'),
    where('token', '==', token)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as GuardianInvite;
  }
  return null;
};

export const acceptGuardianInvite = async (
  districtId: string,
  inviteId: string,
  userId: string,
  studentId: string
): Promise<void> => {
  await updateDoc(
    doc(db, 'districts', districtId, 'guardianInvites', inviteId),
    {
      status: 'accepted',
      updatedAt: serverTimestamp(),
    }
  );

  const guardianDoc = doc(db, 'districts', districtId, 'guardians', userId);
  const guardianSnap = await getDoc(guardianDoc);

  if (guardianSnap.exists()) {
    await updateDoc(guardianDoc, {
      studentIds: [...(guardianSnap.data().studentIds || []), studentId],
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(guardianDoc, {
      id: userId,
      districtId,
      userId,
      studentIds: [studentId],
      inviteStatus: 'accepted',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  const studentDoc = doc(db, 'districts', districtId, 'students', studentId);
  const studentSnap = await getDoc(studentDoc);
  if (studentSnap.exists()) {
    await updateDoc(studentDoc, {
      guardianIds: [...(studentSnap.data().guardianIds || []), userId],
      updatedAt: serverTimestamp(),
    });
  }
};
