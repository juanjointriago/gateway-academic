import { PROGRESS_SHEET_COLLECTION } from "@/src/constants/ContantsFirebase";
import { getAllDocuments, getQueryDocuments } from "@/src/helpers/firestoreHelper";
import { progressSheetInterface } from "@/src/interfaces/progress-sheet.interface";
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export class ProgressSheetService {
  static getProgressSheet = async () => await getAllDocuments<progressSheetInterface>(PROGRESS_SHEET_COLLECTION);


  static getProgressSheetByStudentId = async (studentId: string) => {
      const queryConstraints = [
        { field: "studentId", operator: "==" as FirebaseFirestoreTypes.WhereFilterOp, value: studentId }
      ];
      
      const progressSheets = await getQueryDocuments<progressSheetInterface>({
        collection: PROGRESS_SHEET_COLLECTION,
        condition: queryConstraints
      });
      
      return progressSheets[0] || null;
    } 
  };