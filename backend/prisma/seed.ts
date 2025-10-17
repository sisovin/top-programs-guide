import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const languageData = [
  {
    name: 'Python',
    description: 'A high-level, interpreted programming language known for its simplicity and readability. Python excels in data science, machine learning, web development, and automation.',
    useCases: ['Web Development', 'Data Science', 'Machine Learning', 'Automation', 'Scientific Computing'],
    advantages: ['Easy to learn', 'Extensive libraries', 'Large community', 'Versatile applications', 'Great for beginners'],
    salaryRange: {
      min: 75000,
      max: 150000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 95,
    releaseYear: 1991,
    logoUrl: '/logos/python.svg'
  },
  {
    name: 'JavaScript',
    description: 'The programming language of the web, enabling interactive and dynamic content on websites. Essential for both frontend and backend development with Node.js.',
    useCases: ['Web Development', 'Frontend Development', 'Backend Development', 'Mobile Apps', 'Game Development'],
    advantages: ['Ubiquitous in web', 'Full-stack capability', 'Huge ecosystem', 'Active community', 'Async programming'],
    salaryRange: {
      min: 70000,
      max: 140000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 98,
    releaseYear: 1995,
    logoUrl: '/logos/javascript.svg'
  },
  {
    name: 'Java',
    description: 'A robust, object-oriented programming language designed for portability across platforms. Widely used in enterprise applications, Android development, and large-scale systems.',
    useCases: ['Enterprise Applications', 'Android Development', 'Web Applications', 'Big Data', 'Cloud Computing'],
    advantages: ['Platform independence', 'Strong typing', 'Enterprise ready', 'Mature ecosystem', 'High performance'],
    salaryRange: {
      min: 80000,
      max: 155000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 90,
    releaseYear: 1995,
    logoUrl: '/logos/java.svg'
  },
  {
    name: 'TypeScript',
    description: 'A superset of JavaScript that adds static typing, enabling better tooling and error detection. Perfect for large-scale applications requiring maintainability.',
    useCases: ['Web Development', 'Frontend Frameworks', 'Backend with Node.js', 'Enterprise Applications'],
    advantages: ['Type safety', 'Better IDE support', 'Improved maintainability', 'JavaScript compatibility', 'Growing adoption'],
    salaryRange: {
      min: 85000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 88,
    releaseYear: 2012,
    logoUrl: '/logos/typescript.svg'
  },
  {
    name: 'C++',
    description: 'A powerful, high-performance language used in system programming, game development, and applications requiring fine-grained control over hardware.',
    useCases: ['System Programming', 'Game Development', 'Embedded Systems', 'High-Performance Applications', 'Graphics'],
    advantages: ['High performance', 'Low-level control', 'Object-oriented', 'Efficient memory management', 'Wide industry use'],
    salaryRange: {
      min: 90000,
      max: 165000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 85,
    releaseYear: 1985,
    logoUrl: '/logos/cpp.svg'
  },
  {
    name: 'Go',
    description: 'A modern programming language developed by Google, designed for simplicity, efficiency, and excellent concurrency support. Ideal for cloud services and microservices.',
    useCases: ['Cloud Services', 'Microservices', 'DevOps Tools', 'Network Programming', 'Distributed Systems'],
    advantages: ['Fast compilation', 'Built-in concurrency', 'Simple syntax', 'Strong standard library', 'Excellent for DevOps'],
    salaryRange: {
      min: 95000,
      max: 170000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 82,
    releaseYear: 2009,
    logoUrl: '/logos/go.svg'
  },
  {
    name: 'Rust',
    description: 'A systems programming language focused on safety, speed, and concurrency without a garbage collector. Prevents common programming errors at compile time.',
    useCases: ['System Programming', 'WebAssembly', 'Blockchain', 'Embedded Systems', 'Command-line Tools'],
    advantages: ['Memory safety', 'Zero-cost abstractions', 'Fearless concurrency', 'No garbage collector', 'Modern tooling'],
    salaryRange: {
      min: 100000,
      max: 180000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 78,
    releaseYear: 2010,
    logoUrl: '/logos/rust.svg'
  },
  {
    name: 'Swift',
    description: 'Apple\'s modern programming language for iOS, macOS, and other Apple platforms. Combines performance with safety and expressive syntax.',
    useCases: ['iOS Development', 'macOS Development', 'watchOS', 'tvOS', 'Server-side Swift'],
    advantages: ['Safe by design', 'Fast performance', 'Modern syntax', 'Strong Apple ecosystem', 'Open source'],
    salaryRange: {
      min: 95000,
      max: 175000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 80,
    releaseYear: 2014,
    logoUrl: '/logos/swift.svg'
  },
  {
    name: 'Kotlin',
    description: 'A modern, statically-typed language fully interoperable with Java. Official language for Android development with concise syntax and null safety.',
    useCases: ['Android Development', 'Backend Development', 'Multiplatform Mobile', 'Web Development'],
    advantages: ['Null safety', 'Concise syntax', 'Java interoperability', 'Multiplatform support', 'Growing ecosystem'],
    salaryRange: {
      min: 85000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 79,
    releaseYear: 2011,
    logoUrl: '/logos/kotlin.svg'
  },
  {
    name: 'C#',
    description: 'Microsoft\'s modern, object-oriented language for building Windows applications, games with Unity, and cross-platform applications with .NET.',
    useCases: ['Windows Applications', 'Game Development', 'Web Development', 'Enterprise Software', 'Cloud Services'],
    advantages: ['Strong typing', 'Rich framework', 'Unity support', 'Cross-platform with .NET', 'Microsoft ecosystem'],
    salaryRange: {
      min: 80000,
      max: 155000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    popularityIndex: 86,
    releaseYear: 2000,
    logoUrl: '/logos/csharp.svg'
  }
];

async function main() {
  console.log('Starting seed...');

  for (const language of languageData) {
    await prisma.programmingLanguage.upsert({
      where: { name: language.name },
      update: {},
      create: language
    });
    console.log(`Seeded: ${language.name}`);
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
