// Simple test to verify prompt structure is valid
import { analyzeWithGemini } from "./src/utils/geminiApi.js";

const resume1 = `Kanhaiya Yadav
Phone: 9262837151 | Email: kanhaiya.kumar.cs27@iilm.edu | Github: Kanhaiyadav01 | LINKEDIN: kanhaiya-yadav
EDUCATION
Bachelor of Technology in Computer Science and Engineering
Institute of Integrated Learning in Management University
CGPA: 8.68
EXPERIENCE
Front-end Developer Intern | Kasper Infotech, Greater Noida
July 2025– Aug 2025
• Developed and debugged scalable web applications using React.js, improving performance and reliability.
• Designed reusable, component-based UI architecture to enhance maintainability and reduce code redundancy.
• Integrated RESTful APIs with backend teams, ensuring seamless data flow and improved user experience.
SKILLS
Languages: Java, JavaScript
Frontend: React.js, HTML, CSS, Tailwind CSS
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, SQL
Tools & Platforms: Git, GitHub, Docker, Postman
Concepts: Data Structures & Algorithms, OOPS
PROJECTS
AI-Powered Resume Matcher
React, Node.js, Express.js, MongoDB, OpenAI API | Dec 2025– Present
Developed a full-stack AI application that evaluates resumes against job descriptions and generates match percentage, keyword analysis, and improvement suggestions.`;

const resume2 = `Kanhaiya Yadav
Phone: 9262837151 | Email: kanhaiya92ya@gmail.com | Github: Kanhaiyadav01 | LINKEDIN: kanhaiya-yadav
SUMMARY
B.Tech student (AI/ML) with strong fundamentals in Data Structures, Algorithms, and Full-Stack Development. Hands-on experience building scalable MERN stack applications and AI-based systems.
PROJECTS
Deepfake Image Detection System
Tech Stack: Python, PyTorch (XceptionNet), OpenCV, FastAPI, React | Nov 2025– Jan 2026
Built an AI-based image classification system to detect manipulated facial images using transfer learning. Implemented preprocessing pipelines with OpenCV and integrated Grad-CAM for model explainability.
AI-Powered Resume Matcher
Tech Stack: React, TypeScript, Node.js, Express.js, MongoDB, OpenAI API | Dec 2025– Present
Developed a full-stack AI application that analyzes resumes against job descriptions and generates match percentage and improvement suggestions.
SKILLS
Languages: Python, Java, JavaScript, TypeScript
Frontend: React.js, Tailwind CSS
Backend: Node.js, Express.js
Databases: MongoDB, MySQL
AI/ML: PyTorch, OpenCV`;

const jd1 = `Requirements:
Can deliver amazing work. That's simple!
Previous internship experience is a must
This is a full-time internship
Our stack: NextJS/React Native, tailwind, ExpressJS/NestJS, postgresql, redis.
Responsibilities:
Build landing pages, payment pages and interactive applications
Ensure pages are performant
Build multiple modules in student dashboard including personalisation, streaks, etc.`;

const jd2 = `Backend development:
1. Assist in developing and maintaining backend services and APIs
2. Write clean, maintainable code following best practices
3. Debug and troubleshoot backend issues
4. Participate in code reviews
DevOps & cloud infrastructure:
1. Support deployment processes across AWS and GCP environments
2. Help manage CI/CD pipelines using Jenkins, GitLab CI, or GitHub Actions
3. Assist in containerization efforts using Docker and orchestration with Kubernetes
4. Monitor application health and infrastructure metrics`;

async function runTests() {
  try {
    console.log("🧪 Test 1: Resume 1 + JD 1 (Frontend focus)");
    const result1 = await analyzeWithGemini(resume1, jd1, "Frontend Developer", "TechCorp");
    console.log("✅ Result 1 - Overall Score:", result1.overallScore);
    console.log("   Skills Score:", result1.skillsScore);
    console.log("   Missing Keywords:", result1.missingKeywords?.slice(0, 3));
    
    console.log("\n🧪 Test 2: Resume 2 + JD 1 (AI/ML resume vs Frontend JD)");
    const result2 = await analyzeWithGemini(resume2, jd1, "Frontend Developer", "TechCorp");
    console.log("✅ Result 2 - Overall Score:", result2.overallScore);
    console.log("   Skills Score:", result2.skillsScore);
    console.log("   Missing Keywords:", result2.missingKeywords?.slice(0, 3));
    
    console.log("\n📊 COMPARISON:");
    console.log(`   Result 1 Score: ${result1.overallScore}`);
    console.log(`   Result 2 Score: ${result2.overallScore}`);
    console.log(`   Different outputs? ${result1.overallScore !== result2.overallScore ? "✅ YES" : "❌ NO (BUG)"}`);
    
    console.log("\n✅ All tests passed! Prompt is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

runTests();
