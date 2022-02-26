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


export function addAttendance(studentid: string, studentname: string, schoolname: string, loggedminutes: string, lessonid: string, subject: string, attended: bool): void {
  const accountId = Context.sender;

  // pass form parameters to assemblyscript smart contract object
  const message = new AttendanceData(studentid, studentname, schoolname, loggedminutes, lessonid, subject, attended);
  
  logging.log(`Save attendance of "${subject}" for account "${accountId}"`)
  // Adding the message to end of the persistent collection
  attendance.push(message);
}

// call method to get AttendanceData objects as an array
export function getAttendance(): AttendanceData[] {
  // get minimum value of passed arguments
  const attData = min(DATA_LIMIT, attendance.length);
  const startIndex = attendance.length - attData;
  const result = new Array<AttendanceData>(attData);

  // loop through model object and return an array
  for (let i = 0; i < attData; i++) {
    result[i] = attendance[i + startIndex];
  }
  return result;
}

export function addLesson(lessonid: string, lessonname: string, lessontime: string, school: string): void {
  const accountId = Context.sender

  const message = new Lesson(lessonid, lessonname, lessontime, school);
  
  // log information to transaction metadata
  logging.log(`Save lesson "${lessonname}" for account "${accountId}"`)
  lesson.push(message)
}

// call method to get AttendanceData objects as an array
export function getLessons(): Lesson[] {
  const attData = min(DATA_LIMIT, lesson.length);
  const startIndex = lesson.length - attData;
  const result = new Array<Lesson>(attData);
  for (let i = 0; i < attData; i++) {
    result[i] = lesson[i + startIndex];
  }
  return result;
}