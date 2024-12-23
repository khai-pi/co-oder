// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash the password for the user
  const hashedPassword = await hash("password123", 12);

  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword, // Add hashed password
    },
  });

  // Create some projects
  await prisma.project.createMany({
    data: [
      {
        title: "E-commerce Platform",
        description:
          "A modern e-commerce platform built with Next.js and Stripe",
        category: "Web Development",
        skills: ["React", "Node.js", "TypeScript"],
        status: "Active",
        ownerId: user.id,
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
        ownerId: user.id,
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
        ownerId: user.id,
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
        ownerId: user.id,
        likes: 67,
        comments: 15,
        collaborators: 4,
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
