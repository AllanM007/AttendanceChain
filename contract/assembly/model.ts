import { context, u128, PersistentVector } from "near-sdk-as";

@nearBindgen
export class AttendanceData {
    premium: boolean
    sender: string

    constructor(public studentid: string, public studentname: string, public schoolname: string, public loggedminutes: string, public lessonid: string, public subject: string, public attended: bool) {
        this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
        this.sender = context.sender;
    }
}

export const attendance = new PersistentVector<AttendanceData>("m")

@nearBindgen
export class Lesson {
    premium: boolean
    sender: string

    constructor(public lessonid: string, public lessonname: string, public lessontime: string, public school: string) {
        this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
        this.sender = context.sender;
    }
}

export const lesson = new PersistentVector<Lesson>("l")