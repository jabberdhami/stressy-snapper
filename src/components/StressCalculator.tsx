
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { calculateStressLevel, getRecommendations, questions } from "@/lib/stress-utils";
import { ArrowLeft, ArrowRight, Sparkles, BrainCircuit, TimerReset } from "lucide-react";

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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
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
    setSelectedOption(value);

    // Slight delay for animation
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedOption(null);
      } else {
        handleComplete(updatedAnswers);
      }
    }, 300);
  };

  // Handle going back to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setSelectedOption(null);
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
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
        <Progress value={progress} className="h-2 bg-itsss-lightBlue" />
      </div>

      {/* Card with transition effect */}
      <Card className={cn(
        "w-full glass-card border-itsss-lightBlue shadow-lg",
        pageTransition ? "animate-fade-out" : "animate-scale-in"
      )}>
        {step === 'intro' && (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-itsss-blue/80 to-itsss-lightBlue/60 flex items-center justify-center mx-auto mb-4 animate-pulse-slow shadow-md">
                <BrainCircuit className="w-12 h-12 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-itsss-blue to-blue-500 bg-clip-text text-transparent">ITSSS Stress Calculator</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                This assessment will help you understand your current stress levels and provide personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center px-6 sm:px-8 pb-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-itsss-blue/5 to-itsss-lightBlue/10 p-6 rounded-lg border border-itsss-lightBlue/20 animate-fade-in">
                  <h3 className="font-medium text-itsss-blue mb-2">How it works</h3>
                  <p className="text-gray-600">
                    Answer {questions.length} simple questions about your experiences in the last month. Your responses are completely private and not stored anywhere.
                  </p>
                </div>
                <Button 
                  onClick={handleStart} 
                  className="mt-8 bg-gradient-to-r from-itsss-blue to-blue-600 hover:from-itsss-blue/90 hover:to-blue-700 text-white py-7 px-10 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" /> Begin Assessment
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
                        "py-5 border border-itsss-lightBlue/50 hover:bg-gradient-to-r hover:from-itsss-blue/10 hover:to-itsss-lightBlue/20 focus-ring transition-all transform hover:scale-[1.01] hover:shadow-md text-gray-700",
                        answers[currentQuestionIndex]?.answer === value ? 
                          "bg-gradient-to-r from-itsss-blue/20 to-itsss-lightBlue/30 border-itsss-blue shadow-sm" : 
                          "bg-white"
                      )}
                      onClick={() => handleAnswer(value)}
                    >
                      {currentQuestion.options[value]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pb-6 px-8">
              <Button 
                onClick={handleBack} 
                variant="outline"
                disabled={currentQuestionIndex === 0}
                className={cn(
                  "border border-itsss-lightBlue/50 text-itsss-blue transition-all",
                  currentQuestionIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-itsss-blue/5"
                )}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              {answers[currentQuestionIndex]?.answer !== null && (
                <Button 
                  onClick={() => {
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                      setSelectedOption(null);
                    } else {
                      handleComplete(answers);
                    }
                  }}
                  className="bg-itsss-blue hover:bg-itsss-blue/90 text-white transition-all shadow-sm hover:shadow-md"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
                  ) : (
                    <>Complete Assessment <Sparkles className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              )}
            </CardFooter>
          </>
        )}

        {step === 'results' && stressScore !== null && stressCategory && (
          <>
            <CardHeader className="space-y-2 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-itsss-blue/80 to-itsss-lightBlue/60 flex items-center justify-center mx-auto mb-4 shadow-md">
                {stressCategory === 'low' && <Sparkles className="w-12 h-12 text-white" />}
                {stressCategory === 'moderate' && <ArrowRight className="w-12 h-12 text-white" />}
                {stressCategory === 'high' && <ArrowLeft className="w-12 h-12 text-white" />}
                {stressCategory === 'severe' && <TimerReset className="w-12 h-12 text-white" />}
              </div>
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-itsss-blue to-blue-500 bg-clip-text text-transparent">Your Results</CardTitle>
            </CardHeader>
            <CardContent className="px-6 sm:px-8 pb-6">
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-itsss-blue/10 to-itsss-lightBlue/20 rounded-2xl mb-4 border border-itsss-lightBlue/20 shadow-sm">
                    <span className="text-6xl font-bold bg-gradient-to-r from-itsss-blue to-blue-500 bg-clip-text text-transparent">{stressScore}</span>
                    <span className="text-sm text-gray-500 ml-2 mt-2">/56</span>
                  </div>
                  <h3 className={cn("text-2xl font-semibold mb-2", getStressCategoryColor(stressCategory))}>
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
                  <ul className="space-y-4">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex gap-3 items-start p-3 bg-gradient-to-r from-itsss-blue/5 to-transparent rounded-lg hover:from-itsss-blue/10 transition-all">
                        <span className="text-itsss-blue text-lg mt-0.5">•</span>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center pb-8 pt-2">
              <Button 
                onClick={handleRestart} 
                className="bg-gradient-to-r from-itsss-blue to-blue-600 hover:from-itsss-blue/90 hover:to-blue-700 text-white py-6 px-8 rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                <TimerReset className="mr-2 h-5 w-5" /> Take Assessment Again
              </Button>
            </CardFooter>
          </>
        )}
      </Card>

      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center animate-scale-in">
            <div className="w-16 h-16 border-4 border-itsss-lightBlue border-t-itsss-blue rounded-full animate-spin mb-6"></div>
            <p className="text-itsss-blue font-medium">Analyzing your responses...</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 mb-4 text-center text-gray-500 text-sm">
        <p>Made by <a href="http://www.itsss.co.in" target="_blank" rel="noopener noreferrer" className="text-itsss-blue hover:underline">ITSSS</a></p>
      </div>
    </div>
  );
};

export default StressCalculator;
