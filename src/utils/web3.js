import { ethers } from 'ethers';
import EducationAppJSON from './contracts/EducationApp.json';
import TeacherResolverJSON from './contracts/TeacherResolver.json';
import StudentResolverJSON from './contracts/StudentResolver.json';

const WALLET_ADDRESS = "0x3AA5403aba71452608a6C10C905ED3Fce7394bd8";

// Contract addresses
const EDUCATION_APP_ADDRESS = EducationAppJSON.address;
const TEACHER_RESOLVER_ADDRESS = TeacherResolverJSON.address;
const STUDENT_RESOLVER_ADDRESS = StudentResolverJSON.address;

// Contract ABIs
const EDUCATION_APP_ABI = EducationAppJSON.abi;
const TEACHER_RESOLVER_ABI = TeacherResolverJSON.abi;
const STUDENT_RESOLVER_ABI = StudentResolverJSON.abi;

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
};

// Connect to MetaMask
export const connectToMetaMask = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0];
  } catch (error) {
    throw new Error(`Failed to connect to MetaMask: ${error.message}`);
  }
};

// Get provider and signer
export const getProviderAndSigner = async () => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return { provider, signer };
};

// Get contract instances
export const getContracts = async () => {
  const { provider, signer } = await getProviderAndSigner();

  const educationApp = new ethers.Contract(
    EDUCATION_APP_ADDRESS,
    EDUCATION_APP_ABI,
    signer
  );

  const teacherResolver = new ethers.Contract(
    TEACHER_RESOLVER_ADDRESS,
    TEACHER_RESOLVER_ABI,
    signer
  );

  const studentResolver = new ethers.Contract(
    STUDENT_RESOLVER_ADDRESS,
    STUDENT_RESOLVER_ABI,
    signer
  );

  return { educationApp, teacherResolver, studentResolver };
};

// Register as a teacher
export const registerTeacher = async (subject, fees) => {
  const { educationApp } = await getContracts();
  
  try {
    const tx = await educationApp.registerTeacher(
      WALLET_ADDRESS,
      subject,
      ethers.parseEther(fees.toString())
    );
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error registering as teacher:", error);
    throw error;
  }
};

// Enroll as a student
export const enrollStudent = async (teacher, subject, validityPeriod, fees) => {
  const { educationApp } = await getContracts();
  
  try {
    const tx = await educationApp.enrollStudent(
      teacher,
      subject,
      validityPeriod,
      { value: ethers.parseEther(fees.toString()) }
    );
    
    await tx.wait();
    return true;
  } catch (error) {
    console.error("Error enrolling as student:", error);
    throw error;
  }
};

// Check enrollment validity
export const checkEnrollmentValidity = async (student, teacher, subject) => {
  const { educationApp } = await getContracts();
  
  try {
    const isValid = await educationApp.isEnrollmentValid(student, teacher, subject);
    const remainingValidity = await educationApp.getRemainingValidity(student, teacher, subject);
    
    return {
      isValid,
      remainingValidity: Number(remainingValidity)
    };
  } catch (error) {
    console.error("Error checking enrollment validity:", error);
    throw error;
  }
};

// Listen to account changes in MetaMask
export const listenToAccountChanges = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', accounts => {
      callback(accounts[0] || null);
    });
  }
};

export default {
  connectToMetaMask,
  getContracts,
  registerTeacher,
  enrollStudent,
  checkEnrollmentValidity,
  listenToAccountChanges,
  WALLET_ADDRESS
}; 