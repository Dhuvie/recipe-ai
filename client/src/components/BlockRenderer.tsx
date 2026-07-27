import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';

interface BlockRendererProps {
  block: any;
  index: number;
}

export function BlockRenderer({ block, index }: BlockRendererProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elRef.current) {
      anime({
        targets: elRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 600,
        delay: Math.min(index * 100, 500) // stagger effect for fast streams
      });
    }
  }, [index]);

  if (!block || !block.type) return null;

  return (
    <div ref={elRef} className="opacity-0 mb-4">
      {block.type === 'card' && <CardBlock block={block.content || block} />}
      {block.type === 'checklist' && <ChecklistBlock block={block} />}
      {block.type === 'chart' && <ChartBlock block={block} />}
    </div>
  );
}

function CardBlock({ block }: { block: any }) {
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{block.title || 'Recipe'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground">{block.description}</p>
        <div className="flex gap-4 text-sm font-medium pt-2">
          {block.prepTime && <span>Prep: {block.prepTime}</span>}
          {block.cookTime && <span>Cook: {block.cookTime}</span>}
          {block.servings && <span>Servings: {block.servings}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function ChecklistBlock({ block }: { block: any }) {
  const items = Array.isArray(block.items) ? block.items : [];
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{block.title || 'Checklist'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <Checkbox id={`check-${block.title}-${i}`} className="mt-1" />
              <label 
                htmlFor={`check-${block.title}-${i}`} 
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {item}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ChartBlock({ block }: { block: any }) {
  // A simple HTML/CSS bar chart representation since installing recharts might add bloat
  // Animejs could animate these bars!
  const data = Array.isArray(block.data) ? block.data : [];
  const maxVal = Math.max(...data.map((d: any) => d.value || 0), 100);

  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">{block.title || 'Nutritional Breakdown'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 pt-2">
          {data.map((item: any, i: number) => {
            const widthPct = Math.round(((item.value || 0) / maxVal) * 100);
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{item.name}</span>
                  <span>{item.value}g</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
