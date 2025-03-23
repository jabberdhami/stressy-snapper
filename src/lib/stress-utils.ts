
import { toast } from "@/components/ui/use-toast";

// Define question type
export type Question = {
  id: number;
  text: string;
  options: string[];
};

// Definition of all questions for the stress assessment
// Based on the Perceived Stress Scale (PSS-10) with modifications
export const questions: Question[] = [
  {
    id: 1,
    text: "Been upset because of something that happened unexpectedly?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 2,
    text: "Felt that you were unable to control the important things in your life?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 3,
    text: "Felt nervous and stressed?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 4,
    text: "Felt confident about your ability to handle personal problems?",
    options: [
      "Very Often",
      "Fairly Often",
      "Sometimes",
      "Almost Never",
      "Never",
    ],
  },
  {
    id: 5,
    text: "Felt that things were going your way?",
    options: [
      "Very Often",
      "Fairly Often",
      "Sometimes",
      "Almost Never",
      "Never",
    ],
  },
  {
    id: 6,
    text: "Found that you could not cope with all the things you had to do?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 7,
    text: "Been able to control irritations in your life?",
    options: [
      "Very Often",
      "Fairly Often",
      "Sometimes",
      "Almost Never",
      "Never",
    ],
  },
  {
    id: 8,
    text: "Felt that you were on top of things?",
    options: [
      "Very Often",
      "Fairly Often",
      "Sometimes",
      "Almost Never",
      "Never",
    ],
  },
  {
    id: 9,
    text: "Been angered because of things that happened that were outside of your control?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 10,
    text: "Felt difficulties were piling up so high that you could not overcome them?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 11,
    text: "Had trouble sleeping because of worries?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 12,
    text: "Experienced physical symptoms like headaches, muscle tension, or digestive issues?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 13,
    text: "Found it difficult to concentrate on tasks?",
    options: [
      "Never",
      "Almost Never",
      "Sometimes",
      "Fairly Often",
      "Very Often",
    ],
  },
  {
    id: 14,
    text: "Had time for relaxation and self-care?",
    options: [
      "Very Often",
      "Fairly Often",
      "Sometimes",
      "Almost Never",
      "Never",
    ],
  },
];

// Function to calculate stress level
export const calculateStressLevel = (answers: { questionId: number; answer: number | null }[]): number => {
  try {
    // Check if all questions are answered
    const unansweredQuestion = answers.find(a => a.answer === null);
    if (unansweredQuestion) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions to get accurate results.",
        variant: "destructive",
      });
      return 0;
    }

    // Sum all answer values
    const totalScore = answers.reduce((sum, answer) => {
      return sum + (answer.answer ?? 0);
    }, 0);

    return totalScore;
  } catch (error) {
    console.error("Error calculating stress level:", error);
    toast({
      title: "Calculation Error",
      description: "There was a problem calculating your stress level. Please try again.",
      variant: "destructive",
    });
    return 0;
  }
};

// Function to get recommendations based on stress category
export const getRecommendations = (category: 'low' | 'moderate' | 'high' | 'severe'): string[] => {
  const commonRecommendations = [
    "Practice deep breathing for 5 minutes daily to activate your parasympathetic nervous system.",
    "Stay hydrated and maintain a balanced diet rich in fruits, vegetables, and whole grains.",
    "Limit caffeine and alcohol consumption which can exacerbate stress.",
  ];

  switch (category) {
    case 'low':
      return [
        "Continue your current stress management practices.",
        "Consider starting a gratitude journal to maintain positive outlook.",
        "Schedule regular physical activity to maintain your well-being.",
        ...commonRecommendations,
      ];
    
    case 'moderate':
      return [
        "Incorporate 15-20 minutes of meditation or mindfulness practice daily.",
        "Establish clear boundaries between work and personal life.",
        "Engage in regular physical activity like walking, yoga, or swimming.",
        "Consider time management techniques to better organize your tasks.",
        ...commonRecommendations,
      ];
    
    case 'high':
      return [
        "Prioritize sleep by establishing a consistent sleep schedule and bedtime routine.",
        "Incorporate stress-reduction techniques like progressive muscle relaxation.",
        "Consider talking to a trusted friend, family member, or counselor about your stress.",
        "Break large tasks into smaller, manageable steps to reduce feeling overwhelmed.",
        "Schedule regular breaks throughout your day to reset and recharge.",
        ...commonRecommendations,
      ];
    
    case 'severe':
      return [
        "Consider speaking with a healthcare professional or therapist for personalized guidance.",
        "Identify and reduce major stressors in your life where possible.",
        "Practice self-compassion and avoid self-criticism during this challenging time.",
        "Establish a daily routine that includes dedicated relaxation time.",
        "Implement grounding techniques for moments of acute stress or anxiety.",
        "Temporarily reduce commitments to create space for recovery.",
        ...commonRecommendations,
      ];
  }
};
