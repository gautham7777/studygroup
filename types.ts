export interface User {
  id: number;
  username: string;
  email: string;
}

export enum LearningStyle {
  VISUAL = 'Visual',
  AUDITORY = 'Auditory',
  KINESTHETIC = 'Kinesthetic',
}

export enum StudyMethod {
  DISCUSSION = 'Discussion',
  PROBLEM_SOLVING = 'Problem Solving',
  QUIET_REVIEW = 'Quiet Review',
  FLASHCARDS = 'Flashcards',
}

export interface Profile {
  id: number;
  userId: number;
  bio: string;
  learningStyle: LearningStyle;
  preferredMethods: StudyMethod[];
  availability: string; // Simplified for this example
  subjectsNeedHelp: number[];
  subjectsCanHelp: number[];
}

export interface Subject {
  id: number;
  name: string;
}

export interface StudyGroup {
  id: number;
  name: string;
  subjectId: number;
  members: number[];
}

export interface Message {
  id: string; // Firebase push key
  senderId: number;
  senderUsername: string;
  groupId: number;
  text: string;
  timestamp: string;
}

export interface SharedContent {
  id: number;
  groupId: number;
  content: string;
}

export interface WhiteboardPoint {
  x: number;
  y: number;
}

export interface WhiteboardLine {
  points: WhiteboardPoint[];
  color: string;
  brushSize: number;
}
