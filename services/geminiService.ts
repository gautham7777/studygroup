
import { GoogleGenAI } from "@google/genai";
import { Profile, Subject, User } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBio = async (profile: Partial<Profile>, subjects: Subject[]): Promise<string> => {
  try {
    const subjectsCanHelpNames = profile.subjectsCanHelp?.map(id => subjects.find(s => s.id === id)?.name).filter(Boolean).join(', ');
    const subjectsNeedHelpNames = profile.subjectsNeedHelp?.map(id => subjects.find(s => s.id === id)?.name).filter(Boolean).join(', ');

    const prompt = `
      Create a short, friendly, and encouraging bio for a student study profile. 
      The bio should be about 2-3 sentences long.
      Here are the student's details:
      - Learning Style: ${profile.learningStyle}
      - Preferred Study Methods: ${profile.preferredMethods?.join(', ')}
      - Subjects they can help with: ${subjectsCanHelpNames || 'None specified'}
      - Subjects they need help with: ${subjectsNeedHelpNames || 'None specified'}
      - Availability: ${profile.availability || 'Not specified'}

      Example: "I'm a visual learner who enjoys collaborative problem-solving sessions. I'm strong in Physics and looking for some help with History. Let's connect and learn together!"
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Failed to generate bio. Please try again.";
  }
};

export const suggestStudyPlan = async (subject: Subject, members: User[]): Promise<string> => {
    try {
        const memberNames = members.map(m => m.username).join(', ');
        const prompt = `
        Create a simple, 3-step study plan for a new study group.
        The plan should be actionable and focused on a single study session.
        - Subject: ${subject.name}
        - Group Members: ${memberNames}

        The plan should be formatted as a list.
        Example for Math:
        1.  **Concept Review (15 mins):** Start by quickly reviewing the key formulas and concepts for this week's topic. Each member can share one thing they found challenging.
        2.  **Problem Solving (30 mins):** Work through 5 practice problems together on a shared scratchpad. Take turns explaining your approach.
        3.  **Q&A and Wrap-up (15 mins):** Discuss any lingering questions and set a goal for the next session.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error suggesting study plan:", error);
        return "Failed to generate a study plan. Please try again.";
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    if (!text.trim()) return "Nothing to summarize.";
    try {
        const prompt = `
        Summarize the following study notes into a few key bullet points.
        Focus on the main ideas and takeaways.

        Notes:
        ---
        ${text}
        ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing text:", error);
        return "Failed to summarize the notes. Please try again.";
    }
};
