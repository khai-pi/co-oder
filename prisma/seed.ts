// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data first
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash the passwords for the users
  const hashedPassword1 = await hash("password123", 12);
  const hashedPassword2 = await hash("password456", 12);

  // Create users
  const user1 = await prisma.user.create({
    data: {
      username: "John Doe",
      email: "john@example.com",
      password: hashedPassword1,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword2,
    },
  });

  // Create projects for John
  await prisma.project.createMany({
    data: [
      {
        title: "E-commerce Platform",
        description:
          "A modern e-commerce platform built with Next.js and Stripe",
        category: "Web Development",
        skills: ["React", "Node.js", "TypeScript"],
        status: "Active",
        ownerId: user1.id,
        likes: 45,
        comments: 12,
        collaborators: 3,
      },
      {
        title: "AI Image Generator",
        description: "Generate unique images using machine learning algorithms",
        category: "AI/ML",
        skills: ["Python", "TensorFlow", "AWS"],
        status: "Active",
        ownerId: user1.id,
        likes: 89,
        comments: 34,
        collaborators: 5,
      },
      {
        title: "Task Management App",
        description: "A collaborative task management application",
        category: "Web Development",
        skills: ["Vue.js", "Express", "MongoDB"],
        status: "Planning",
        ownerId: user1.id,
        likes: 23,
        comments: 8,
        collaborators: 2,
      },
      {
        title: "Mobile Fitness Tracker",
        description: "Cross-platform mobile app for fitness tracking",
        category: "Mobile Development",
        skills: ["React Native", "Firebase", "Redux"],
        status: "Completed",
        ownerId: user1.id,
        likes: 67,
        comments: 15,
        collaborators: 4,
      },
    ],
  });

  // Create projects for Jane
  await prisma.project.createMany({
    data: [
      {
        title: "Cloud Infrastructure Monitor",
        description: "Real-time monitoring system for cloud infrastructure",
        category: "DevOps",
        skills: ["AWS", "Docker", "Kubernetes"],
        status: "Active",
        ownerId: user2.id,
        likes: 56,
        comments: 18,
        collaborators: 4,
      },
      {
        title: "Social Media Analytics",
        description: "Analytics platform for social media engagement",
        category: "Data Analytics",
        skills: ["Python", "React", "PostgreSQL"],
        status: "Planning",
        ownerId: user2.id,
        likes: 34,
        comments: 9,
        collaborators: 2,
      },
    ],
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("Error creating seed data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
