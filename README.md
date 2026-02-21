#  Resumind – AI Resume Review & ATS Score Checker
  
This is my AI-based Resume Review website where users can upload their resume along with a job description and get instant feedback and an ATS score using AI.

The goal of this project is to help students and job seekers improve their resumes according to specific job roles and increase their chances of getting shortlisted.

🔗 Live link: https://ai-resumereview-llhp.vercel.app

##  What This Project Does

- Upload your resume
- Enter job title and job description
- AI analyzes your resume
- Get:
  -  Overall Resume Score (0–100)
  -  ATS Score
  -  Missing Keywords
  -  Suggested Keywords
  -  Section-wise Feedback (Tone, Content, Structure, Skills)

Basically, it compares your resume with the job description and tells you what to improve.

---

##  How It Works (Simple Flow)

1. User uploads resume
2. User enters job title and description
3. Resume + JD is sent to AI
4. AI analyzes:
   - Keyword match
   - Structure
   - Content clarity
   - ATS compatibility
5. Detailed feedback is generated
6. User sees improvement suggestions

---

## Tech Stack Used

### Frontend
- React.js
- React Router
- Tailwind CSS
- Vercel Analytics

### AI Integration
- Google Gemini API

### Deployment
- Vercel

---

##  Features

- Clean modern UI
- Resume score animation
- ATS compatibility check
- Missing & suggested keywords
- Section-wise accordion feedback
- Login & Signup system
- Session storage for user data
- Deployed on Vercel

---

##  Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── utils/
 ├── App.jsx
 └── index.js
```

---

##  How to Run Locally

Clone this repo:

```bash
git clone https://github.com/Kanhaiyadav01/WT_Collage_project.git
cd your-repo-name
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in root folder:

```
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

Then start the project:

```bash
npm start
```

---

##  Build for Production

```bash
npm run build
```

---

##  Why I Built This

As a student, I noticed many resumes get rejected because:
- They are not ATS friendly
- Keywords are missing
- Structure is not proper

So I built this tool to:
- Automatically analyze resumes
- Provide instant improvement suggestions
- Help job seekers optimize their resumes

---

##  Future Improvements

- Resume PDF parser improvement
- Downloadable feedback report
- AI resume rewriting feature
- User dashboard with history
- Custom domain branding 

---

## 📌 Note

This project is built for learning and portfolio purposes.  
Feel free to fork and improve it 😊
