/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, storage, logging, PersistentVector } from 'near-sdk-as';
import { AttendanceData, Lesson, attendance, lesson} from './model';

const DATA_LIMIT = 10;

const AttendanceArray = new PersistentVector<string>("attArray");

// export function getLesson(accountId: string): string | null {
//   return storage.get<string>(accountId, DEFAULT_MESSAGE)
// }


export function addAttendance(studentid: string, studentname: string, schoolname: string, loggedminutes: string, lessonid: string, subject: string, attended: bool): void {
  // const accountId = Context.sender

  const message = new AttendanceData(studentid, studentname, schoolname, loggedminutes, lessonid, subject, attended);
  
  // Adding the message to end of the persistent collection
  attendance.push(message);
}

export function getAttendance(): AttendanceData[] {
  const attData = min(DATA_LIMIT, attendance.length);
  const startIndex = attendance.length - attData;
  const result = new Array<AttendanceData>(attData);
  for (let i = 0; i < attData; i++) {
    result[i] = attendance[i + startIndex];
  }
  return result;
}

export function addLesson(lessonid: string, lessonname: string, lessontime: string, school: string): void {
  const accountId = Context.sender

  const message = new Lesson(lessonid, lessonname, lessontime, school);
  
  logging.log(`Save lesson "${lessonname}" for account "${accountId}"`)
  lesson.push(message)
}

export function getLessons(): Lesson[] {
  const attData = min(DATA_LIMIT, lesson.length);
  const startIndex = lesson.length - attData;
  const result = new Array<Lesson>(attData);
  for (let i = 0; i < attData; i++) {
    result[i] = lesson[i + startIndex];
  }
  return result;
}

const DEFAULT_MESSAGE = 'Hello'

export function getGreeting(accountId: string): string | null {
  return storage.get<string>(accountId, DEFAULT_MESSAGE)
}

export function setGreeting(message: string): void {
  const accountId = Context.sender
  // Use logging.log to record logs permanently to the blockchain!
  logging.log(`Saving greeting "${message}" for account "${accountId}"`)
  storage.set(accountId, message)
}