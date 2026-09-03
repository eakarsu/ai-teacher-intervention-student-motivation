export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-teacher-intervention-student-motivation",
  title: "Teacher Intervention & Motivation",
  tagline: "Early disengagement detection with teacher escalation",
  accent: "orange",
};

export const pages: PageConfig[] = [
  {
    label: "Students",
    href: "/students",
    description: "Students, engagement, learning gaps.",
    entities: ["Student", "EngagementSignal", "LearningGap"],
    workflows: ["gap-triage"],
  },
  {
    label: "Interventions",
    href: "/interventions",
    description: "Interventions, exercises, motivation.",
    entities: ["Intervention", "ExerciseRecommendation", "MotivationalCampaign", "ResourceLibraryItem"],
    workflows: ["intervention-plan"],
  },
  {
    label: "Escalations",
    href: "/escalations",
    description: "Teacher alerts, guardian contacts, outcomes.",
    entities: ["TeacherAlert", "GuardianContact", "OutcomeMeasure"],
    workflows: ["guardian-letter"],
  },
  {
    label: "Classrooms",
    href: "/classrooms",
    description: "Classrooms and class-level heatmaps.",
    entities: ["Classroom", "ClassHeatmap"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Classroom: {
    name: "Classroom",
    label: "Classroom",
    fields: [{ name: "name", kind: "string" }, { name: "teacher", kind: "string" }, { name: "subject", kind: "string" }, { name: "gradeLevel", kind: "string" }, { name: "enrollment", kind: "number" }, { name: "status", kind: "string" }],
  },
  Student: {
    name: "Student",
    label: "Student",
    fields: [{ name: "name", kind: "string" }, { name: "studentId", kind: "string" }, { name: "grade", kind: "string" }, { name: "engagementScore", kind: "number" }, { name: "status", kind: "string" }, { name: "enrolledAt", kind: "date" }],
  },
  EngagementSignal: {
    name: "EngagementSignal",
    label: "Engagement Signal",
    fields: [{ name: "studentRef", kind: "string" }, { name: "signalType", kind: "string" }, { name: "strength", kind: "string" }, { name: "source", kind: "string" }, { name: "status", kind: "string" }, { name: "observedAt", kind: "date" }],
  },
  LearningGap: {
    name: "LearningGap",
    label: "Learning Gap",
    fields: [{ name: "studentRef", kind: "string" }, { name: "concept", kind: "string" }, { name: "evidence", kind: "string" }, { name: "severity", kind: "string" }, { name: "status", kind: "string" }, { name: "identifiedAt", kind: "date" }],
  },
  ExerciseRecommendation: {
    name: "ExerciseRecommendation",
    label: "Exercise",
    fields: [{ name: "studentRef", kind: "string" }, { name: "concept", kind: "string" }, { name: "exercise", kind: "string" }, { name: "difficulty", kind: "string" }, { name: "status", kind: "string" }, { name: "source", kind: "string" }],
  },
  Intervention: {
    name: "Intervention",
    label: "Intervention",
    fields: [{ name: "studentRef", kind: "string" }, { name: "kind", kind: "string" }, { name: "plan", kind: "string" }, { name: "status", kind: "string" }, { name: "startedAt", kind: "date" }, { name: "owner", kind: "string" }],
  },
  MotivationalCampaign: {
    name: "MotivationalCampaign",
    label: "Motivation Campaign",
    fields: [{ name: "name", kind: "string" }, { name: "strategy", kind: "string" }, { name: "audience", kind: "string" }, { name: "status", kind: "string" }, { name: "launchedAt", kind: "date" }, { name: "outcome", kind: "string" }],
  },
  TeacherAlert: {
    name: "TeacherAlert",
    label: "Teacher Alert",
    fields: [{ name: "studentRef", kind: "string" }, { name: "concern", kind: "string" }, { name: "priority", kind: "string" }, { name: "status", kind: "string" }, { name: "raisedAt", kind: "date" }, { name: "action", kind: "string" }],
  },
  GuardianContact: {
    name: "GuardianContact",
    label: "Guardian Contact",
    fields: [{ name: "studentRef", kind: "string" }, { name: "guardian", kind: "string" }, { name: "channel", kind: "string" }, { name: "purpose", kind: "string" }, { name: "status", kind: "string" }, { name: "sentAt", kind: "date" }],
  },
  OutcomeMeasure: {
    name: "OutcomeMeasure",
    label: "Outcome Measure",
    fields: [{ name: "studentRef", kind: "string" }, { name: "metric", kind: "string" }, { name: "before", kind: "number" }, { name: "after", kind: "number" }, { name: "window", kind: "string" }, { name: "status", kind: "string" }],
  },
  ClassHeatmap: {
    name: "ClassHeatmap",
    label: "Class Heatmap",
    fields: [{ name: "period", kind: "string" }, { name: "metric", kind: "string" }, { name: "gridRef", kind: "string" }, { name: "avgValue", kind: "number" }, { name: "status", kind: "string" }, { name: "computedAt", kind: "date" }],
  },
  ResourceLibraryItem: {
    name: "ResourceLibraryItem",
    label: "Resource",
    fields: [{ name: "title", kind: "string" }, { name: "kind", kind: "string" }, { name: "conceptTag", kind: "string" }, { name: "url", kind: "string" }, { name: "status", kind: "string" }, { name: "difficulty", kind: "string" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "gap-triage",
    title: "Gap Triage",
    description: "Prioritize learning gaps by risk.",
    prompt: "You are an intervention coordinator. Prioritize the student's learning gaps by risk and dependency order for instruction.",
    fields: ["student", "gaps", "recentScores", "attendance"],
  },
  {
    slug: "intervention-plan",
    title: "Intervention Planner",
    description: "Design an intervention with motivational elements.",
    prompt: "You are an instructional coach. Design an intervention plan: exercises, motivational hooks, cadence, and success checkpoints.",
    fields: ["studentProfile", "gap", "motivators", "timeAvailable"],
  },
  {
    slug: "guardian-letter",
    title: "Guardian Letter Drafter",
    description: "Draft a supportive guardian communication.",
    prompt: "You are a teacher. Draft a supportive guardian letter about the student's situation: concrete observations, joint plan, positive framing.",
    fields: ["student", "observations", "plan", "tone"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
