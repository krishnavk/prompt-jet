"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Copy, Minimize2, Maximize2, Clock, Zap, DollarSign } from "lucide-react";

interface ExecutionResult {
  id: string;
  provider: string;
  model: string;
  response: string;
  tokensUsed: number;
  executionTimeMs: number;
  cost?: number;
}

interface ResultsDisplayProps {
  results: ExecutionResult[];
  onCopyToClipboard: (text: string) => void;
}

export function ResultsDisplay({
  results,
  onCopyToClipboard,
}: ResultsDisplayProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  if (results.length === 0) {
    return null;
  }

  const hasExpandedCards = results.some((result) => expandedCards.has(result.id));

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <>
      {hasExpandedCards && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => toggleCardExpansion("")}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => {
          const isExpanded = expandedCards.has(result.id);
          return (
            <div
              key={result.id}
              className={isExpanded ? "md:col-span-2 lg:col-span-3" : ""}
            >
              <Card
                className={`transition-all duration-300 ease-in-out ${
                  isExpanded
                    ? "fixed inset-4 z-50 flex flex-col bg-background"
                    : "cursor-pointer hover:shadow-lg"
                }`}
                onClick={() => !isExpanded && toggleCardExpansion(result.id)}
              >
                <CardContent
                  className={`p-4 ${
                    isExpanded ? "flex-1 flex flex-col" : ""
                  }`}
                >
                  <div className="space-y-3 flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{String(result.model || 'Unknown Model')}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {String(result.provider || 'Unknown Provider')}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyToClipboard(result.response);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy content"
                        >
                          <Copy className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardExpansion(result.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title={isExpanded ? "Minimize" : "Expand"}
                        >
                          {isExpanded ? (
                            <Minimize2 className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Maximize2 className="h-4 w-4 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div
                      className={`text-sm bg-muted p-3 rounded overflow-y-auto transition-all duration-300 ${
                        isExpanded
                          ? "flex-1 min-h-0 max-h-[calc(100vh-12rem)]"
                          : "max-h-40"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <pre className="whitespace-pre-wrap font-sans">
                        {typeof result.response === 'string'
                          ? result.response
                          : String(result.response || '')}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Number(result.executionTimeMs || 0)}ms
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {Number(result.tokensUsed || 0)} tokens
                      </div>
                      {result.cost !== undefined && result.cost !== null && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />$
                          {Number(result.cost).toFixed(4)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}