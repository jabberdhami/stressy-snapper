
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { calculateStressLevel, getRecommendations, questions } from "@/lib/stress-utils";

// Types
type QuestionAnswer = {
  questionId: number;
  answer: number | null;
};

type StressCategory = 'low' | 'moderate' | 'high' | 'severe';

const StressCalculator = () => {
  const [step, setStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>(
    questions.map(q => ({ questionId: q.id, answer: null }))
  );
  const [stressScore, setStressScore] = useState<number | null>(null);
  const [stressCategory, setStressCategory] = useState<StressCategory | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const { toast } = useToast();

  // Progress calculation
  const progress = 
    step === 'intro' ? 0 : 
    step === 'results' ? 100 : 
    Math.floor(((currentQuestionIndex + 1) / questions.length) * 100);

  // Get current question
  const currentQuestion = questions[currentQuestionIndex];

  // Handle starting the assessment
  const handleStart = () => {
    setPageTransition(true);
    setTimeout(() => {
      setStep('questions');
      setPageTransition(false);
    }, 400);
  };

  // Handle answer selection
  const handleAnswer = (value: number) => {
    // Update the answer for the current question
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      answer: value
    };
    setAnswers(updatedAnswers);

    // Slight delay for animation
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        handleComplete(updatedAnswers);
      }
    }, 300);
  };

  // Handle completion of assessment
  const handleComplete = (finalAnswers: QuestionAnswer[]) => {
    setIsLoading(true);
    
    // Simulate calculation time
    setTimeout(() => {
      const calculatedScore = calculateStressLevel(finalAnswers);
      setStressScore(calculatedScore);
      
      // Determine stress category based on score
      let category: StressCategory;
      if (calculatedScore < 14) category = 'low';
      else if (calculatedScore < 27) category = 'moderate';
      else if (calculatedScore < 41) category = 'high';
      else category = 'severe';
      
      setStressCategory(category);
      setRecommendations(getRecommendations(category));
      
      setPageTransition(true);
      setTimeout(() => {
        setStep('results');
        setIsLoading(false);
        setPageTransition(false);
      }, 400);
    }, 1000);
  };

  // Handle restart of assessment
  const handleRestart = () => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentQuestionIndex(0);
      setAnswers(questions.map(q => ({ questionId: q.id, answer: null })));
      setStressScore(null);
      setStressCategory(null);
      setRecommendations([]);
      setStep('intro');
      setPageTransition(false);
    }, 400);
  };

  const getStressCategoryColor = (category: StressCategory | null) => {
    switch (category) {
      case 'low': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'severe': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center justify-start min-h-[80vh]">
      {/* Progress bar */}
      <div className="w-full mb-8">
        <Progress value={progress} className="h-2 bg-itsss-lightBlue" indicatorClassName="bg-itsss-blue" />
      </div>

      {/* Card with transition effect */}
      <Card className={cn(
        "w-full glass-card animation-slide-in border-itsss-lightBlue",
        pageTransition ? "animate-fade-out" : "animate-scale-in"
      )}>
        {step === 'intro' && (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="w-20 h-20 rounded-full bg-itsss-blue/10 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <svg className="w-10 h-10 text-itsss-blue" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <CardTitle className="text-3xl font-light tracking-tight text-itsss-blue">ITSSS Stress Calculator</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                This assessment will help you understand your current stress levels and provide personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-6 sm:px-8 pb-8">
              <div className="space-y-4">
                <div className="bg-itsss-blue/5 p-4 rounded-lg">
                  <h3 className="font-medium text-itsss-blue mb-2">How it works</h3>
                  <p className="text-sm text-gray-600">
                    Answer 10 simple questions about your experiences in the last month. Your responses are completely private and not stored anywhere.
                  </p>
                </div>
                <Button 
                  onClick={handleStart} 
                  className="mt-6 bg-itsss-blue hover:bg-itsss-blue/90 text-white py-6 px-8 rounded-full"
                >
                  Begin Assessment
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 'questions' && (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-medium text-itsss-blue">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
              <CardDescription className="text-base">
                In the last month, how often have you:
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-itsss-lightBlue/30 animate-fade-in">
                  <h3 className="text-xl font-medium text-gray-800 mb-4 text-center text-balance">
                    {currentQuestion.text}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3 animate-slide-up">
                  {[0, 1, 2, 3, 4].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      className={cn(
                        "py-4 border border-itsss-lightBlue/50 hover:bg-itsss-blue/10 focus-ring transition-all",
                        answers[currentQuestionIndex]?.answer === value && "bg-itsss-blue/10 border-itsss-blue"
                      )}
                      onClick={() => handleAnswer(value)}
                    >
                      {currentQuestion.options[value]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 'results' && stressScore !== null && stressCategory && (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="w-20 h-20 rounded-full bg-itsss-blue/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-itsss-blue" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M9 9h.01"></path>
                  <path d="M15 9h.01"></path>
                  <path d="M8 13h8"></path>
                </svg>
              </div>
              <CardTitle className="text-3xl font-light tracking-tight text-itsss-blue">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-6">
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-4 bg-itsss-blue/5 rounded-full mb-2">
                    <span className="text-5xl font-semibold text-itsss-blue">{stressScore}</span>
                    <span className="text-sm text-gray-500 ml-2 mt-2">/56</span>
                  </div>
                  <h3 className={cn("text-2xl font-medium mb-1", getStressCategoryColor(stressCategory))}>
                    {stressCategory === 'low' && 'Low Stress'}
                    {stressCategory === 'moderate' && 'Moderate Stress'}
                    {stressCategory === 'high' && 'High Stress'}
                    {stressCategory === 'severe' && 'Severe Stress'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {stressCategory === 'low' && 'Your stress levels appear to be well managed.'}
                    {stressCategory === 'moderate' && 'You are experiencing a moderate level of stress.'}
                    {stressCategory === 'high' && 'Your stress levels are concerning and require attention.'}
                    {stressCategory === 'severe' && 'Your stress levels are very high and need immediate attention.'}
                  </p>
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-4 animate-slide-up">
                  <h3 className="font-medium text-lg text-itsss-blue">Recommendations</h3>
                  <ul className="space-y-3">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-itsss-blue mt-1">•</span>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-6">
              <Button 
                onClick={handleRestart} 
                className="bg-itsss-blue hover:bg-itsss-blue/90 text-white"
              >
                Take Assessment Again
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center animate-scale-in">
            <div className="w-12 h-12 border-4 border-itsss-lightBlue border-t-itsss-blue rounded-full animate-spin mb-4"></div>
            <p className="text-itsss-blue">Analyzing your responses...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressCalculator;
