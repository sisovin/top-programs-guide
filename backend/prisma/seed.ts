import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const careerPathsData = [
  // Python Career Paths
  {
    languageId: 1, // Python
    title: 'Data Scientist',
    description: 'Analyze complex datasets to extract insights and build predictive models using Python\'s rich data science ecosystem.',
    salaryRange: {
      min: 95000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },
  {
    languageId: 1, // Python
    title: 'Machine Learning Engineer',
    description: 'Design and implement ML algorithms and systems using TensorFlow, PyTorch, and scikit-learn.',
    salaryRange: {
      min: 110000,
      max: 180000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-7 years'
  },
  {
    languageId: 1, // Python
    title: 'Backend Developer',
    description: 'Build scalable web applications and APIs using Django, Flask, or FastAPI frameworks.',
    salaryRange: {
      min: 85000,
      max: 140000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },

  // JavaScript Career Paths
  {
    languageId: 2, // JavaScript
    title: 'Frontend Developer',
    description: 'Create interactive user interfaces using React, Vue, or Angular frameworks with modern JavaScript.',
    salaryRange: {
      min: 75000,
      max: 130000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },
  {
    languageId: 2, // JavaScript
    title: 'Full-Stack Developer',
    description: 'Develop complete web applications using MERN/MEAN stack or similar full-stack technologies.',
    salaryRange: {
      min: 90000,
      max: 150000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },
  {
    languageId: 2, // JavaScript
    title: 'Node.js Backend Developer',
    description: 'Build scalable server-side applications and APIs using Node.js, Express, and related technologies.',
    salaryRange: {
      min: 85000,
      max: 145000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },

  // Java Career Paths
  {
    languageId: 3, // Java
    title: 'Enterprise Java Developer',
    description: 'Develop large-scale enterprise applications using Spring Framework, Hibernate, and microservices architecture.',
    salaryRange: {
      min: 95000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-7 years'
  },
  {
    languageId: 3, // Java
    title: 'Android Developer',
    description: 'Create native Android applications using Java and Android SDK with modern development practices.',
    salaryRange: {
      min: 85000,
      max: 145000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },

  // TypeScript Career Paths
  {
    languageId: 4, // TypeScript
    title: 'Senior Frontend Developer',
    description: 'Build complex, type-safe frontend applications using TypeScript with React, Angular, or Vue.',
    salaryRange: {
      min: 100000,
      max: 170000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-6 years'
  },
  {
    languageId: 4, // TypeScript
    title: 'Full-Stack TypeScript Developer',
    description: 'Develop end-to-end applications using TypeScript for both frontend and backend with Node.js.',
    salaryRange: {
      min: 105000,
      max: 175000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-7 years'
  },

  // C++ Career Paths
  {
    languageId: 5, // C++
    title: 'Game Developer',
    description: 'Create high-performance game engines and applications using C++ with graphics APIs like OpenGL or Vulkan.',
    salaryRange: {
      min: 90000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },
  {
    languageId: 5, // C++
    title: 'Systems Engineer',
    description: 'Develop low-level system software, operating systems, and high-performance computing applications.',
    salaryRange: {
      min: 110000,
      max: 180000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '5-8 years'
  },

  // Go Career Paths
  {
    languageId: 6, // Go
    title: 'Cloud Engineer',
    description: 'Build scalable cloud services and microservices using Go with Docker and Kubernetes.',
    salaryRange: {
      min: 105000,
      max: 175000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-6 years'
  },
  {
    languageId: 6, // Go
    title: 'DevOps Engineer',
    description: 'Develop infrastructure automation tools and CI/CD pipelines using Go\'s concurrency features.',
    salaryRange: {
      min: 100000,
      max: 165000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },

  // Rust Career Paths
  {
    languageId: 7, // Rust
    title: 'Systems Programmer',
    description: 'Develop safe, concurrent systems software and performance-critical applications with memory safety guarantees.',
    salaryRange: {
      min: 115000,
      max: 185000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '4-7 years'
  },
  {
    languageId: 7, // Rust
    title: 'Blockchain Developer',
    description: 'Build secure blockchain applications and smart contracts using Rust\'s safety features.',
    salaryRange: {
      min: 120000,
      max: 190000,
      currency: 'USD',
      experienceLevel: 'senior'
    },
    experienceRequired: '3-6 years'
  },

  // Swift Career Paths
  {
    languageId: 8, // Swift
    title: 'iOS Developer',
    description: 'Create native iOS applications using SwiftUI and UIKit with Apple\'s latest development frameworks.',
    salaryRange: {
      min: 95000,
      max: 165000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },
  {
    languageId: 8, // Swift
    title: 'macOS Developer',
    description: 'Develop desktop applications for macOS using Swift and Apple\'s AppKit framework.',
    salaryRange: {
      min: 100000,
      max: 170000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },

  // Kotlin Career Paths
  {
    languageId: 9, // Kotlin
    title: 'Android Developer',
    description: 'Build modern Android applications using Kotlin with Jetpack Compose and Android Architecture Components.',
    salaryRange: {
      min: 90000,
      max: 155000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },
  {
    languageId: 9, // Kotlin
    title: 'Backend Developer',
    description: 'Develop server-side applications using Kotlin with Spring Boot and Ktor frameworks.',
    salaryRange: {
      min: 95000,
      max: 160000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  },

  // C# Career Paths
  {
    languageId: 10, // C#
    title: 'Unity Game Developer',
    description: 'Create interactive games and applications using Unity engine with C# scripting.',
    salaryRange: {
      min: 80000,
      max: 145000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '2-4 years'
  },
  {
    languageId: 10, // C#
    title: '.NET Developer',
    description: 'Build enterprise applications using ASP.NET Core, Entity Framework, and the .NET ecosystem.',
    salaryRange: {
      min: 85000,
      max: 150000,
      currency: 'USD',
      experienceLevel: 'mid'
    },
    experienceRequired: '3-5 years'
  }
];

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

  // Seed career paths
  console.log('Seeding career paths...');
  for (const careerPath of careerPathsData) {
    await prisma.careerPath.create({
      data: careerPath
    });
    console.log(`Seeded career path: ${careerPath.title}`);
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
