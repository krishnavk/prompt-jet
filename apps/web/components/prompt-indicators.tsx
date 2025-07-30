"use client";

import { useState, useEffect } from "react";
import { Zap, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PromptIndicatorsProps {
  prompt: string;
  results?: Array<{
    provider: string;
    model: string;
    tokensUsed: number;
    executionTimeMs: number;
    cost?: number;
  }>;
}

export function PromptIndicators({ prompt, results = [] }: PromptIndicatorsProps) {
  const [effectiveness, setEffectiveness] = useState({
    score: 0,
    quality: 'Poor',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  });

  const [efficiency, setEfficiency] = useState({
    avgResponseTime: 0,
    avgTokensPerSecond: 0,
    avgCost: 0,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  });

  // Calculate prompt effectiveness based on prompt characteristics
  useEffect(() => {
    if (!prompt.trim()) {
      setEffectiveness({
        score: 0,
        quality: 'No prompt',
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      });
      return;
    }

    let score = 0;
    
    // Length-based scoring (optimal: 10-200 words)
    const wordCount = prompt.trim().split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 200) {
      score += 30;
    } else if (wordCount > 200) {
      score += Math.max(0, 30 - (wordCount - 200) * 0.1);
    } else {
      score += Math.min(30, wordCount * 3);
    }

    // Clarity indicators
    const hasQuestion = /\?/.test(prompt);
    const hasContext = prompt.length > 50;
    const hasSpecificity = /\b(specific|detailed|exact|precise|clear)\b/i.test(prompt);
    
    if (hasQuestion) score += 20;
    if (hasContext) score += 25;
    if (hasSpecificity) score += 15;

    // Structure indicators
    const hasLists = /\n\s*[-*•]/.test(prompt) || /\d+\./.test(prompt);
    const hasFormatting = /\n/.test(prompt) || /\*\*.*?\*\*/.test(prompt);
    
    if (hasLists) score += 15;
    if (hasFormatting) score += 10;

    // Complexity balance
    const complexWords = (prompt.match(/\b\w{8,}\b/g) || []).length;
    const complexityRatio = complexWords / wordCount;
    if (complexityRatio > 0.1 && complexityRatio < 0.3) score += 10;

    score = Math.min(100, Math.round(score));

    let quality: string;
    let color: string;
    let bgColor: string;
    let borderColor: string;

    if (score >= 80) {
      quality = 'Excellent';
      color = 'text-green-600';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
    } else if (score >= 60) {
      quality = 'Good';
      color = 'text-blue-600';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-200';
    } else if (score >= 40) {
      quality = 'Fair';
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-200';
    } else {
      quality = 'Poor';
      color = 'text-red-600';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
    }

    setEffectiveness({ score, quality, color, bgColor, borderColor });
  }, [prompt]);

  // Calculate efficiency based on historical results
  useEffect(() => {
    if (results.length === 0) {
      // Check localStorage for historical data
      try {
        const historicalData = localStorage.getItem('promptJetHistoricalData');
        if (historicalData) {
          const data = JSON.parse(historicalData);
          if (data.efficiency) {
            setEfficiency(data.efficiency);
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to load historical efficiency data', e);
      }
      
      setEfficiency({
        avgResponseTime: 0,
        avgTokensPerSecond: 0,
        avgCost: 0,
        color: 'text-gray-500',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      });
      return;
    }

    const avgResponseTime = results.reduce((sum, r) => sum + r.executionTimeMs, 0) / results.length;
    const totalTokens = results.reduce((sum, r) => sum + r.tokensUsed, 0);
    const avgTokensPerSecond = totalTokens / (results.reduce((sum, r) => sum + r.executionTimeMs, 0) / 1000);
    const avgCost = results.reduce((sum, r) => sum + (r.cost || 0), 0) / results.length;

    let color: string;
    let bgColor: string;
    let borderColor: string;

    // Efficiency rating based on response time and tokens/sec
    const isEfficient = avgResponseTime < 3000 && avgTokensPerSecond > 50;
    
    if (isEfficient) {
      color = 'text-green-600';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-200';
    } else if (avgResponseTime < 5000 && avgTokensPerSecond > 25) {
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-200';
    } else {
      color = 'text-red-600';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-200';
    }

    const newEfficiency = {
      avgResponseTime: Math.round(avgResponseTime),
      avgTokensPerSecond: Math.round(avgTokensPerSecond),
      avgCost: Math.round(avgCost * 1000) / 1000, // Round to 3 decimal places
      color,
      bgColor,
      borderColor
    };

    setEfficiency(newEfficiency);

    // Save to localStorage for historical tracking
    try {
      const historicalData = JSON.parse(localStorage.getItem('promptJetHistoricalData') || '{}');
      historicalData.efficiency = newEfficiency;
      localStorage.setItem('promptJetHistoricalData', JSON.stringify(historicalData));
    } catch (e) {
      console.warn('Failed to save efficiency data to localStorage', e);
    }
  }, [results]);

  if (!prompt.trim() && results.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {/* Effectiveness Indicator */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${effectiveness.bgColor} ${effectiveness.borderColor} transition-all duration-200`}>
              <TrendingUp className={`h-3.5 w-3.5 ${effectiveness.color}`} />
              <span className={`text-xs font-medium ${effectiveness.color}`}>
                {effectiveness.quality}
              </span>
              {effectiveness.score > 0 && (
                <span className={`text-xs ${effectiveness.color} opacity-75`}>
                  {effectiveness.score}%
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">Prompt Effectiveness</p>
              <p className="text-sm text-muted-foreground">
                Based on clarity, specificity, structure, and optimal length
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Efficiency Indicator */}
      {results.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border ${efficiency.bgColor} ${efficiency.borderColor} transition-all duration-200`}>
                <Zap className={`h-3.5 w-3.5 ${efficiency.color}`} />
                <span className={`text-xs font-medium ${efficiency.color}`}>
                  {efficiency.avgResponseTime}ms
                </span>
                <span className={`text-xs ${efficiency.color} opacity-75`}>
                  {efficiency.avgTokensPerSecond} t/s
                </span>
                {efficiency.avgCost > 0 && (
                  <span className={`text-xs ${efficiency.color} opacity-75`}>
                    ${efficiency.avgCost}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium">Execution Efficiency</p>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  <p>• Avg response time: {efficiency.avgResponseTime}ms</p>
                  <p>• Avg tokens/sec: {efficiency.avgTokensPerSecond}</p>
                  {efficiency.avgCost > 0 && <p>• Avg cost: ${efficiency.avgCost}</p>}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Real-time indicators when typing */}
      {prompt.trim() && results.length === 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-blue-200 bg-blue-50">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-600">
                  {prompt.trim().split(/\s+/).length} words
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-medium">Prompt Stats</p>
                <p className="text-sm text-muted-foreground">
                  Word count: {prompt.trim().split(/\s+/).length} | Characters: {prompt.length}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
