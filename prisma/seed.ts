// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
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
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
