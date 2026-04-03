export interface TextBlock {
    type: 'text';
    id: string;
    content: string;
    style: 'heading' | 'paragraph' | 'instruction';
}

export interface ImageBlock {
    type: 'image';
    id: string;
    imageUrl: string;
    caption?: string;
}

/** No audioUrl — usa expo-speech para leer la palabra en voz alta */
export interface VoiceWordBlock {
    type: 'voice-word';
    id: string;
    imageUrl: string;
    word: string;
    language: string;
}

export interface FillInBlankField {
    type: 'fill-blank';
    id: string;
    beforeText: string;
    afterText?: string;
    correctAnswer: string;
    caseSensitive: boolean;
    points: number;
    hint?: string;
}

export interface MultipleChoiceField {
    type: 'multiple-choice';
    id: string;
    question: string;
    options: { id: string; text: string; imageUrl?: string }[];
    correctOptionId: string;
    points: number;
}

export interface CompleteWordField {
    type: 'complete-word';
    id: string;
    instruction: string;
    imageUrl?: string;
    scrambledLetters: string[];
    correctAnswer: string;
    points: number;
}

export type WorksheetField =
    | TextBlock
    | ImageBlock
    | VoiceWordBlock
    | FillInBlankField
    | MultipleChoiceField
    | CompleteWordField;

export interface WorksheetSettings {
    maxAttempts: number | null;
    requiresGrading: boolean;
    totalScore: number;
    showResultsToStudent: boolean;
    showCorrectAnswers: boolean;
    teacherCanOverrideShowAnswers: boolean;
}

export interface IWorksheet {
    id?: string;
    title: string;
    description?: string;
    fields: WorksheetField[];
    settings: WorksheetSettings;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
}

export interface IWorksheetSubmission {
    id?: string;
    worksheetId: string;
    unitId: string;
    studentId: string;
    answers: Record<string, string | string[]>;
    score: number;
    maxScore: number;
    attemptNumber: number;
    startedAt: number;
    completedAt: number;
    isGraded: boolean;
    /** Si el docente habilitó mostrar respuestas para este alumno */
    showAnswersOverride?: boolean;
}
