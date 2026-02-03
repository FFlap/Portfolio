import type { StaticImageData } from 'next/image';

import stackdxLogo from '../../public/assets/stackdx-logo.png';
import uofaLogo from '../../public/assets/uofa-logo.png';

import blockbuddyDashboard from '../../public/assets/blockbuddy/dashboard.png';
import blockbuddyMap from '../../public/assets/blockbuddy/map.png';
import blockbuddyFeed from '../../public/assets/blockbuddy/feed.png';
import blockbuddyChat from '../../public/assets/blockbuddy/chat.png';

import raytracerScene1 from '../../public/assets/raytracer/scene_1.png';
import raytracerScene2 from '../../public/assets/raytracer/scene_2.png';

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  logo?: string | StaticImageData;
  link?: string;
}

export interface Project {
  name: string;
  tech: string;
  date: string;
  description: string[];
  images: Array<string | StaticImageData>;
  video?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const portfolioData = {
  name: 'Nathan Yan',

  contact: {
    email: 'nathancyan8@gmail.com',
    phone: '587-999-3525',
    github: 'https://github.com/fflap',
    linkedin: 'https://www.linkedin.com/in/nathan-yan-cs/',
    location: 'Calgary, Alberta'
  },

  education: {
    school: 'University of Alberta',
    degree: 'Bachelor of Science in Computer Science',
    location: 'Edmonton, Alberta',
    period: 'Sep. 2023 – May 2027',
    coursework: 'Data Structures and Algorithms, Linear Algebra, Digital Image Processing, Artificial Intelligence, Discrete Math, Statistics, Calculus'
  },

  experience: [
    {
      role: 'Business Analyst',
      company: 'StackDX',
      location: 'Calgary, Alberta',
      period: 'May 2025 – August 2025',
      logo: stackdxLogo,
      link: 'https://www.stackdx.com/',
      description: [
        'Developed a user interface using C#, ASP.NET Razor, HTML, JavaScript, and CSS to display and interact with CSV-like files, allowing users to easily view, sort, and filter data in tables, charts, and reports. Handling over 900k previously unsupported files.',
        'Designed and implemented C# scripts to test and evaluate the performance of fine-tuned AI models, ensuring optimal classification accuracy and reliability for document processing tasks.',
        'Achieved over 95% classification accuracy by developing and training multiple machine learning models to categorize document content, improving automated data processing and reliability'
      ]
    },
    {
      role: 'Artificial Intelligence Research Assistant',
      company: 'University of Alberta',
      location: 'Edmonton, Alberta',
      period: 'May 2024 – August 2024',
      logo: uofaLogo,
      link: 'https://www.ualberta.ca/',
      description: [
        'Used AI to analyze toxicity of various comments in bug-tracking forums such as GitHub, StackOverflow, and Bugzilla',
        'Developed automated data processing and filtering pipelines in Python to enhance sentiment classification accuracy, eliminating noise, cleaning text, and organizing datasets to optimize AI-driven toxicity detection.',
        'Analyzed and handled over 5 million comments to statistically identify trends in online toxicity',
        'Under review publication of research paper to the ESEM 2025'
      ]
    }
  ] as Experience[],

  projects: [
    {
      name: 'BlockBuddy (HackTheChange)',
      tech: 'TypeScript, MongoDB, Express, React, Node.js',
      date: 'November 2025',
      description: [
        'Built an AI-assisted reporting experience capable of transforming camera uploads and descriptions into structured bylaw issues, automatically incorporating location and weather context to prioritize impact.',
        'Developed multi-channel community chat to facilitate neighbourhood, city, and private conversations with threaded discussions and inboxes, empowering residents to coordinate and escalate issues.',
        'Created geospatial map visualizations and a dynamic complaint feed.'
      ],
      video: 'https://www.youtube.com/embed/uO3lSjInB1c',
      images: [
        blockbuddyDashboard,
        blockbuddyMap,
        blockbuddyFeed,
        blockbuddyChat
      ]
    },
    {
      name: 'NASA Space Apps Challenge',
      tech: 'Next.js, TypeScript, TailwindCSS, PostgreSQL',
      date: 'October 2025',
      description: [
        'Built a dynamic full-stack Next.js application capable of scraping and processing hundreds of research articles to automatically extract and rank impactful keywords, enabling quick discovery of meaningful connections across topics.',
        'Developed interactive mind maps and histograms to visualize frequency-based keyword relationships, empowering users to intuitively explore, compare, and interpret scientific themes within complex datasets.',
        'Integrated Google Gemini AI API to deliver real-time summarization and conversational insights, allowing users to interactively query and analyze large sets of research abstracts through a chat-like interface.'
      ],
      images: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDBmZmZmIj5NaW5kIE1hcDwvdGV4dD48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDBmZmZmIj5EYXRhIFZpczwvdGV4dD48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDBmZmZmIj5BSSBDaGF0PC90ZXh0Pjwvc3ZnPg=='
      ]
    },
    {
      name: 'University Course Availability Notifier',
      tech: 'Python, Selenium, BeautifulSoup, Discord API',
      date: 'January 2025',
      description: [
        'Developed a web scraping tool using Selenium and BeautifulSoup to monitor university course availability in real time.',
        'Optimized script efficiency with headless browsing, dynamic HTML parsing, and randomized polling intervals to avoid detection.',
        'Integrated Discord notifications via webhooks to alert users when desired courses open up.'
      ],
      images: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZjAwIj5Db3Vyc2UgTm90aWZpZXI8L3RleHQ+PC9zdmc+',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmZjAwIj5EaXNjb3JkIEFsZXJ0PC90ZXh0Pjwvc3ZnPg=='
      ]
    },
    {
      name: 'Ray Tracing and 3D Rendering',
      tech: 'C',
      date: 'December 2024',
      description: [
        'Developed a custom 3D ray tracer with sphere intersection, lighting, and shading',
        'Implemented core vector operations and color processing',
        'Optimized performance with dynamic memory allocation, Makefile automation, and efficient rendering techniques'
      ],
      images: [
        raytracerScene1,
        raytracerScene2
      ]
    },
    {
      name: 'Slime World',
      tech: 'Java, Processing',
      date: 'Dec 2022 - April 2023',
      description: [
        'Developed a 2D platformer game, implementing object-oriented programming with structured classes for players, enemies, platforms, and power-ups.',
        'Manually implemented physics-based mechanics, including gravity, jumping, and collision handling, without relying on external physics engines.',
        'Implemented collision detection and AI mechanics, enabling dynamic enemy behavior, player interactions, and projectile physics.'
      ],
      images: [
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDBmZjAwIj5TbGltZSBXb3JsZCBHYW1lcGxheTwvdGV4dD48L3N2Zz4=',
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMDBmZjAwIj5MZXZlbCBEZXNpZ248L3RleHQ+PC9zdmc+'
      ]
    }
  ] as Project[],

  skills: [
    {
      name: 'Languages',
      skills: ['Java', 'Python', 'C', 'C++', 'C#', 'SQL', 'TypeScript', 'JavaScript', 'HTML/CSS']
    },
    {
      name: 'Frameworks',
      skills: ['ASP.NET', 'Razor', 'React', 'Node.js', 'Django']
    },
    {
      name: 'Developer Tools',
      skills: ['Git', 'GitHub', 'VS Code', 'Visual Studio', 'PyCharm', 'IntelliJ', 'Eclipse', 'Microsoft Azure']
    },
    {
      name: 'Libraries',
      skills: ['pandas', 'NumPy', 'Matplotlib', 'Scikit-Learn', 'PyTorch', 'ML.NET']
    }
  ] as SkillCategory[]
};
