# SkillAlign - AI-Powered Resume Optimization Platform

SkillAlign is a comprehensive resume optimization tool that helps job seekers beat Applicant Tracking Systems (ATS), match job descriptions, and create powerful resumes that land interviews.

## 🚀 Features

### 1. **Resume Upload**

- Drag-and-drop interface for PDF, DOCX, and TXT files
- Automatic resume parsing and content extraction
- Sample resume for testing

### 2. **ATS Score Analysis**

- Overall ATS compatibility score (0-100)
- Detailed breakdown by category:
  - Formatting quality
  - Keyword optimization
  - Experience presentation
  - Education section
  - Skills section
- Keyword analysis (found vs. missing)
- Actionable recommendations

### 3. **Job Description Match**

- Paste any job description for analysis
- Match score percentage
- Matched vs. missing skills
- Requirements analysis
- Tailored optimization suggestions

### 4. **Bullet Point Improver**

- Transform weak bullets into powerful statements
- Before/after comparisons
- Impact level indicators (high/medium/low)
- Best practices and power words
- Apply improvements directly to resume
- Customizable bullet improvements

### 5. **Export & Download**

- Multiple format support:
  - PDF (for applications)
  - DOCX (for editing)
  - Plain text (universal compatibility)
- Copy to clipboard functionality
- Live resume preview
- Performance metrics dashboard

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Storage**: LocalStorage (for mock data)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
skillalign/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   └── dashboard/
│   │       ├── layout.tsx        # Dashboard layout with navigation
│   │       ├── upload/
│   │       │   └── page.tsx      # Resume upload page
│   │       ├── score/
│   │       │   └── page.tsx      # ATS score analysis
│   │       ├── jd-match/
│   │       │   └── page.tsx      # Job description match
│   │       ├── bullet-improver/
│   │       │   └── page.tsx      # Bullet point improver
│   │       └── export/
│   │           └── page.tsx      # Export & download
│   ├── context/
│   │   └── AppContext.tsx        # Global state management
│   ├── lib/
│   │   └── mockData.ts           # Mock data & analysis functions
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎯 Key Components

### AppContext

Manages global state including:

- Current resume data
- Job description data
- ATS score
- Match analysis
- LocalStorage persistence

### Mock Data Functions

- `calculateATSScore()` - Analyzes resume and generates ATS score
- `analyzeJobMatch()` - Compares resume with job description
- `improveBullet()` - Suggests improvements for bullet points

### Type System

Comprehensive TypeScript interfaces for:

- Resume structure (personal info, experience, education, skills)
- Job descriptions
- ATS scores and breakdowns
- Match analysis results
- Bullet improvements

## 🔄 Data Flow

1. **Upload**: User uploads resume → Parsed and stored in context → Saved to localStorage
2. **Analysis**: Resume data → Calculation functions → Scores displayed
3. **Matching**: Resume + Job Description → Comparison logic → Match results
4. **Improvement**: Bullet points → Enhancement suggestions → Apply to resume
5. **Export**: Finalized resume → Format conversion → Download

## 🚧 Current State (Local Data)

The application currently uses:

- **LocalStorage** for data persistence
- **Mock calculation functions** for analysis
- **Sample data** for demonstration

## 🔮 Future Enhancements (Backend Integration)

When you're ready to integrate Node.js APIs:

### API Endpoints Needed

```typescript
// Resume Operations
POST   /api/resume/upload        // Upload and parse resume
GET    /api/resume/:id           // Get resume data
PUT    /api/resume/:id           // Update resume
DELETE /api/resume/:id           // Delete resume

// Analysis
POST   /api/analyze/ats          // Calculate ATS score
POST   /api/analyze/match        // Match with job description
POST   /api/analyze/improve      // Improve bullet points

// Export
POST   /api/export/pdf           // Generate PDF
POST   /api/export/docx          // Generate DOCX
```

### Backend Integration Points

1. **Resume Upload**: Replace mock parsing with actual PDF/DOCX parser (pdf-parse, mammoth)
2. **ATS Analysis**: Implement AI-powered keyword extraction and scoring
3. **JD Matching**: Use NLP for semantic matching (OpenAI, Claude, or open-source models)
4. **Bullet Improvement**: Integrate LLM for context-aware improvements
5. **Export**: Use libraries like pdfkit, docx for document generation

### Recommended Libraries

```json
{
  "backend": {
    "parser": ["pdf-parse", "mammoth", "textract"],
    "ai": ["openai", "@anthropic-ai/sdk"],
    "export": ["pdfkit", "docx", "html-pdf"],
    "nlp": ["natural", "compromise"],
    "storage": ["mongodb", "postgresql"]
  }
}
```

## 🎨 Design System

### Colors

- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Neutral: Gray shades

### Typography

- Font: Geist Sans (default), Geist Mono (code)
- Headings: Bold, varying sizes
- Body: Regular weight, readable line height

## 💡 Usage Tips

1. **Start with Upload**: Begin by uploading your resume or using the sample
2. **Check ATS Score**: Review your score and recommendations
3. **Match Job Descriptions**: Paste job postings to see compatibility
4. **Improve Bullets**: Enhance your experience section
5. **Export**: Download in your preferred format

## 🐛 Known Limitations (Current Version)

- File parsing is simulated (actual content not extracted)
- Analysis algorithms are simplified mock versions
- PDF/DOCX generation uses browser APIs (limited formatting)
- No user authentication or data persistence across sessions
- No real AI/ML for improvements

## 📝 License

This project is for educational and portfolio purposes.

## 👥 Contributing

This is a portfolio project. For suggestions or issues, please create an issue.

## 🙏 Acknowledgments

Built with Next.js, TypeScript, and Tailwind CSS.

---

**Status**: ✅ Full-featured frontend complete with local data  
**Next Step**: Backend API integration for production-ready features
