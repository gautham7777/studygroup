import { User, Profile, Subject, StudyGroup, Message, SharedContent, LearningStyle, StudyMethod } from '../types';

export const users: User[] = [
  { id: 1, username: 'Alice', email: 'alice@example.com' },
  { id: 2, username: 'Bob', email: 'bob@example.com' },
  { id: 3, username: 'Charlie', email: 'charlie@example.com' },
  { id: 4, username: 'Diana', email: 'diana@example.com' },
];

export const subjects: Subject[] = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Physics' },
  { id: 3, name: 'History' },
  { id: 4, name: 'Computer Science' },
  { id: 5, name: 'Literature' },
  { id: 6, name: 'Chemistry' },
];

export const profiles: Profile[] = [
  {
    id: 1,
    userId: 1,
    bio: "Visual learner who enjoys breaking down complex problems. Strong in Math, but could use a hand with History essays.",
    learningStyle: LearningStyle.VISUAL,
    preferredMethods: [StudyMethod.PROBLEM_SOLVING, StudyMethod.QUIET_REVIEW],
    availability: "Weeknights",
    subjectsCanHelp: [1, 2],
    subjectsNeedHelp: [3],
  },
  {
    id: 2,
    userId: 2,
    bio: "Auditory learner, I find discussing topics helps me understand them best. Happy to help with History and Literature.",
    learningStyle: LearningStyle.AUDITORY,
    preferredMethods: [StudyMethod.DISCUSSION],
    availability: "Weekends",
    subjectsCanHelp: [3, 5],
    subjectsNeedHelp: [4],
  },
  {
    id: 3,
    userId: 3,
    bio: "I'm a hands-on, kinesthetic learner. I excel at coding challenges and can help with Computer Science concepts. Looking for a partner for Physics.",
    learningStyle: LearningStyle.KINESTHETIC,
    preferredMethods: [StudyMethod.PROBLEM_SOLVING],
    availability: "Afternoons",
    subjectsCanHelp: [4],
    subjectsNeedHelp: [2],
  },
  {
    id: 4,
    userId: 4,
    bio: "I love diving deep into Literature and Chemistry. I prefer quiet review sessions but am open to discussion. Need some help with advanced Math.",
    learningStyle: LearningStyle.VISUAL,
    preferredMethods: [StudyMethod.QUIET_REVIEW, StudyMethod.FLASHCARDS],
    availability: "Mornings",
    subjectsCanHelp: [5, 6],
    subjectsNeedHelp: [1],
  },
];

export const studyGroups: StudyGroup[] = [
    { id: 1, name: 'Physics Problem Solvers', subjectId: 2, members: [1, 3] },
    { id: 2, name: 'CS Algorithms Crew', subjectId: 4, members: [2, 3] },
];

export const sharedContents: SharedContent[] = [
    {id: 1, groupId: 1, content: "Force = mass * acceleration\nKey concepts for Chapter 5:\n- Newton's Laws\n- Friction\n- Gravity on inclined planes"},
    {id: 2, groupId: 2, content: "Big O Notation:\nO(1) - Constant\nO(log n) - Logarithmic\nO(n) - Linear\nO(n log n) - Log-linear\nO(n^2) - Quadratic"},
];
