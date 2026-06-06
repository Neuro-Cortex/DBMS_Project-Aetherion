// src/config/routes.config.tsx
// AI DASHBOARD ROUTE CONFIGURATION
import React, { lazy } from 'react';
import {
  MessageCircle, BarChart3, TrendingUp, Workflow, Users,
  BookOpen, GraduationCap, Settings, Baby, Heart,
  Stethoscope, Sparkles
} from 'lucide-react';
import PlaceholderPage from '../components/common/PlaceholderPage';

// ============================================
// TYPES
// ============================================
export interface AIDashboardRoute {
  path: string;
  label: string;
  icon: React.ElementType;
  color?: string;
  description?: string;
  isSidebar?: boolean;
  isFeature?: boolean;
}

// ============================================
// SIDEBAR ROUTES (Main navigation)
// ============================================
export const sidebarRoutes: AIDashboardRoute[] = [
  { path: 'chat', label: 'AI Chat', icon: MessageCircle, color: 'purple', description: 'Chat with AI assistant', isSidebar: true },
  { path: 'analytics', label: 'Analytics', icon: BarChart3, color: 'cyan', description: 'View AI system analytics', isSidebar: true },
  { path: 'predictions', label: 'Predictions', icon: TrendingUp, color: 'amber', description: 'AI predictions & forecasts', isSidebar: true },
  { path: 'automation', label: 'Automation', icon: Workflow, color: 'emerald', description: 'Automation rules', isSidebar: true },
  { path: 'agents', label: 'Agents', icon: Users, color: 'blue', description: 'AI agent management', isSidebar: true },
  { path: 'knowledge', label: 'Knowledge Base', icon: BookOpen, color: 'indigo', description: 'AI knowledge base', isSidebar: true },
  { path: 'training', label: 'Training', icon: GraduationCap, color: 'pink', description: 'Model training', isSidebar: true },
  { path: 'settings', label: 'Settings', icon: Settings, color: 'slate', description: 'AI system settings', isSidebar: true },
];

// ============================================
// FEATURE ROUTES (Quick access cards)
// ============================================
export const featureRoutes: AIDashboardRoute[] = [
  { path: 'baby-care', label: 'Baby Care', icon: Baby, color: 'rose', description: 'AI baby care advice', isFeature: true },
  { path: 'pregnancy', label: 'Pregnancy Guide', icon: Heart, color: 'pink', description: 'AI pregnancy guidance', isFeature: true },
  { path: 'symptoms', label: 'Symptom Checker', icon: Stethoscope, color: 'emerald', description: 'AI symptom analysis', isFeature: true },
  { path: 'recommendations', label: 'Recommendations', icon: Sparkles, color: 'amber', description: 'Smart recommendations', isFeature: true },
];

// ============================================
// ALL DASHBOARD ROUTES (Combined)
// ============================================
export const allDashboardRoutes: AIDashboardRoute[] = [
  ...sidebarRoutes,
  ...featureRoutes,
];

// ============================================
// LAZY LOADED COMPONENT MAP
// ============================================
export interface RouteComponentMap {
  [key: string]: React.LazyExoticComponent<React.ComponentType<Record<string, never>>>;
}

/**
 * Helper to create a lazy component with error fallback
 */
const createLazyComponent = (importFn: () => Promise<unknown>, title: string) => {
  return lazy(() =>
    (importFn() as Promise<{ default: React.ComponentType<Record<string, never>> }>).catch(() => ({
      default: () => <PlaceholderPage title={title} />
    }))
  );
};

// Lazy-loaded route components
export const routeComponents: RouteComponentMap = {
  'chat': createLazyComponent(
    () => import('../components/ai-assistent/AIAssistantWidget'),
    'AI Chat'
  ),
  'analytics': createLazyComponent(
    () => import('../components/dashboard/Activitychart'),
    'Analytics'
  ),
  'predictions': createLazyComponent(
    () => import('../components/ai-assistent/AIResponseCard'),
    'Predictions'
  ),
  'automation': createLazyComponent(
    () => import('../components/ai-assistent/AISuggestionChips'),
    'Automation'
  ),
  'agents': createLazyComponent(
    () => import('../components/ai-assistent/AIVoiceButton'),
    'AI Agents'
  ),
  'knowledge': createLazyComponent(
    () => import('../components/ai-assistent/AIAssistant'),
    'Knowledge Base'
  ),
  'training': createLazyComponent(
    () => import('../components/ai-assistent/AIVoiceButton'),
    'Training'
  ),
  'settings': createLazyComponent(
    () => import('../components/ai-assistent/AIAssistant'),
    'Settings'
  ),
  'baby-care': createLazyComponent(
    () => import('../components/ai-assistent/BabyCareAdvice').then(m => ({ default: m.BabyCareAdvice })),
    'Baby Care'
  ),
  'pregnancy': createLazyComponent(
    () => import('../components/ai-assistent/PregnancyGuide').then(m => ({ default: m.PregnancyGuide })),
    'Pregnancy Guide'
  ),
  'symptoms': createLazyComponent(
    () => import('../components/ai-assistent/SymptomChecker').then(m => ({ default: m.SymptomChecker })),
    'Symptom Checker'
  ),
  'recommendations': createLazyComponent(
    () => import('../components/ai-assistent/SmartRecommendation'),
    'Recommendations'
  ),
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the default route (first sidebar route)
 */
export const getDefaultRoute = (): string => {
  return sidebarRoutes[0]?.path || 'chat';
};

/**
 * Get sidebar routes only
 */
export const getSidebarRoutes = (): AIDashboardRoute[] => sidebarRoutes;

/**
 * Get feature routes only
 */
export const getFeatureRoutes = (): AIDashboardRoute[] => featureRoutes;

/**
 * Get Tailwind color classes for a given color name
 */
export const getColorClasses = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-400',
    teal: 'bg-teal-500/10 text-teal-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
    green: 'bg-green-500/10 text-green-400',
    red: 'bg-red-500/10 text-red-400',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    indigo: 'bg-indigo-500/10 text-indigo-400',
    slate: 'bg-slate-500/10 text-slate-400',
    pink: 'bg-pink-500/10 text-pink-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };
  return colorMap[color] || 'bg-purple-500/10 text-purple-400';
};

/**
 * Get a route by its path
 */
export const getRouteByPath = (path: string): AIDashboardRoute | undefined => {
  return allDashboardRoutes.find(r => r.path === path);
};

/**
 * Get the component for a given route path
 */
export const getRouteComponent = (path: string): React.LazyExoticComponent<React.ComponentType<Record<string, never>>> | null => {
  return routeComponents[path] || null;
};