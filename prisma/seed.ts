// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-teacher-intervention-student-motivation.local", "Demo Admin", "ADMIN"],
    ["manager@ai-teacher-intervention-student-motivation.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-teacher-intervention-student-motivation.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Classroom = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.classroom.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.classroom.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      teacher: `Teacher ${String(i + 1).padStart(3, "0")}`,
      subject: `Subject ${String(i + 1).padStart(3, "0")}`,
      gradeLevel: `GradeLevel ${String(i + 1).padStart(3, "0")}`,
      enrollment: 5 + ((i * 13) % 95),
      status: pick(STATUSES_Classroom, i)
      },
    });
  }

  const classroomRefs = await prisma.classroom.findMany({ select: { id: true } });

  const STATUSES_Student = ["ON_TRACK", "WATCH", "AT_RISK", "INTENSIVE"];
  await prisma.student.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.student.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      studentId: `StudentId ${String(i + 1).padStart(3, "0")}`,
      grade: `Grade ${String(i + 1).padStart(3, "0")}`,
      engagementScore: amount(i, 250),
      status: pick(STATUSES_Student, i),
      enrolledAt: daysAgo(i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_EngagementSignal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.engagementSignal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.engagementSignal.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      signalType: `SignalType ${String(i + 1).padStart(3, "0")}`,
      strength: `Strength ${String(i + 1).padStart(3, "0")}`,
      source: `Source ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_EngagementSignal, i),
      observedAt: daysAgo(i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_LearningGap = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.learningGap.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.learningGap.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      concept: `Concept ${String(i + 1).padStart(3, "0")}`,
      evidence: `Evidence ${String(i + 1).padStart(3, "0")}`,
      severity: `Severity ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_LearningGap, i),
      identifiedAt: daysAgo(i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_ExerciseRecommendation = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.exerciseRecommendation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.exerciseRecommendation.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      concept: `Concept ${String(i + 1).padStart(3, "0")}`,
      exercise: `Exercise ${String(i + 1).padStart(3, "0")}`,
      difficulty: `Difficulty ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ExerciseRecommendation, i),
      source: `Source ${String(i + 1).padStart(3, "0")}`,
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_Intervention = ["PROPOSED", "ACTIVE", "MONITORING", "CLOSED"];
  await prisma.intervention.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.intervention.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      plan: `Plan ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Intervention, i),
      startedAt: daysAgo(i),
      owner: `Owner ${String(i + 1).padStart(3, "0")}`,
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_MotivationalCampaign = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.motivationalCampaign.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.motivationalCampaign.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      strategy: `Strategy ${String(i + 1).padStart(3, "0")}`,
      audience: `Audience ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_MotivationalCampaign, i),
      launchedAt: daysAgo(i),
      outcome: `Outcome ${String(i + 1).padStart(3, "0")}`,
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_TeacherAlert = ["OPEN", "ACKNOWLEDGED", "ACTED", "CLOSED"];
  await prisma.teacherAlert.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.teacherAlert.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      concern: `Concern ${String(i + 1).padStart(3, "0")}`,
      priority: `Priority ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_TeacherAlert, i),
      raisedAt: daysAgo(i),
      action: `Action ${String(i + 1).padStart(3, "0")}`,
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_GuardianContact = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.guardianContact.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.guardianContact.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      guardian: `Guardian ${String(i + 1).padStart(3, "0")}`,
      channel: `Channel ${String(i + 1).padStart(3, "0")}`,
      purpose: `Purpose ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_GuardianContact, i),
      sentAt: daysAgo(i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_OutcomeMeasure = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.outcomeMeasure.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.outcomeMeasure.create({
      data: {
      studentRef: `StudentRef ${String(i + 1).padStart(3, "0")}`,
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      before: amount(i, 250),
      after: amount(i, 250),
      window: `Window ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_OutcomeMeasure, i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_ClassHeatmap = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.classHeatmap.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.classHeatmap.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      gridRef: `GridRef ${String(i + 1).padStart(3, "0")}`,
      avgValue: amount(i, 250),
      status: pick(STATUSES_ClassHeatmap, i),
      computedAt: daysAgo(i),
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  const STATUSES_ResourceLibraryItem = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.resourceLibraryItem.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.resourceLibraryItem.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      conceptTag: `ConceptTag ${String(i + 1).padStart(3, "0")}`,
      url: `Url ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ResourceLibraryItem, i),
      difficulty: `Difficulty ${String(i + 1).padStart(3, "0")}`,
      classroom: { connect: { id: classroomRefs[i % classroomRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
