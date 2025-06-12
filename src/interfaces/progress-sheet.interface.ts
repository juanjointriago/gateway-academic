type EventInfo = {
  label: string;
  value: string;
}
export interface progressClassesInterface {
    eventInfo:EventInfo
    a:string
    book:string
    lesson:string
    na: string
    observation: string
    part: string
    progress: string
    rw: string
    test: string
    createdAt?: number
    updatedAt?: number
}

export interface progressSheetInterface {
    id?: string
    inscriptionDate: string
    expirationDate: string
    myPreferredName: string
    otherContacts: string
    progressClasses: progressClassesInterface[];
    studentId: string;
    createdAt?: number
    updatedAt?: number
}




// types/progress-sheet.ts
export interface ProgressEntry {
  id?: string;
  name: string;
  date: string;
  hour: string;
  book: string;
  progress: string;
  part: string;
  test: string;
  teacher: string;
  observation: string;
  eventInfo?: {
    label: string;
    value: string;
  };
  createdAt?: number;
}
  export interface IProgressSheet {
  id: string;
  studentId: string;
  progressClasses: Array<ProgressEntry>;
}
  export interface StudentInfo {
    headline?: string;
    preferredName: string;
    fullName: string;
    idNumber: string;
    regNumber: string;
    inscriptionDate: string;
    expirationDate: string;
    occupation: string;
    age: string;
    birthday: string;
    phone: string;
    otherContacts: string;
    observation: string;
    gender: 'male' | 'female' | 'undefined';
    progressEntries: ProgressEntry[];
  }