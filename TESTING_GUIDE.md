# 🧪 Testing Guide - Resume Parsing Backend

## Quick Start Testing

### 1. Start Development Server

```bash
npm run dev
```

The server should start at `http://localhost:3000`

---

## Test Scenarios

### ✅ Scenario 1: Upload PDF Resume

**Steps:**

1. Navigate to `http://localhost:3000/dashboard/upload`
2. Click "Choose File" or drag & drop a PDF resume
3. Wait for processing (3-5 seconds)
4. Should redirect to `/dashboard/score`

**Expected Results:**

- ✅ Personal info extracted (name, email, phone)
- ✅ Experience section parsed with bullets
- ✅ Education details extracted
- ✅ Skills list populated
- ✅ ATS Score calculated (0-100)
- ✅ Recommendations displayed

**Check Browser Console:**

```
Should see successful API response:
{
  "success": true,
  "data": {
    "rawText": "...",
    "content": { ... },
    "fileName": "resume.pdf"
  }
}
```

---

### ✅ Scenario 2: Upload DOCX Resume

**Steps:**

1. Go to upload page
2. Upload a `.docx` file
3. Wait for processing

**Expected Results:**

- ✅ Text extracted from Word document
- ✅ Same structured parsing as PDF
- ✅ Score calculated correctly

---

### ✅ Scenario 3: Invalid File Type

**Steps:**

1. Try uploading a `.txt` or `.jpg` file

**Expected Results:**

- ❌ Error message: "Invalid file type. Only PDF and DOCX files are supported."
- ❌ Upload should be rejected

---

### ✅ Scenario 4: Large File

**Steps:**

1. Try uploading a file > 5MB

**Expected Results:**

- ❌ Error message: "File too large. Maximum size is 5MB."
- ❌ Upload should be rejected

---

### ✅ Scenario 5: Job Description Matching

**Steps:**

1. Upload resume and view score
2. Navigate to `/dashboard/jd-match`
3. Paste a job description
4. Click "Analyze Match"

**Expected Results:**

- ✅ Match score calculated (0-100%)
- ✅ Matched skills displayed (green)
- ✅ Missing skills displayed (red)
- ✅ Suggestions generated

---

## API Endpoint Testing

### Test Parse Endpoint Directly

**Using curl (PowerShell):**

```powershell
$file = "C:\path\to\resume.pdf"
curl.exe -X POST http://localhost:3000/api/resume/parse -F "file=@$file"
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "rawText": "John Doe\njohn@email.com\n...",
    "content": {
      "personalInfo": {
        "name": "John Doe",
        "email": "john@email.com",
        ...
      },
      "experience": [...],
      "education": [...],
      "skills": [...]
    },
    "formattingIssues": [],
    "fileName": "resume.pdf"
  }
}
```

---

### Test Score Endpoint Directly

**Using PowerShell:**

```powershell
$body = @{
  resume = @{
    id = "test123"
    fileName = "test.pdf"
    rawText = "John Doe Software Engineer"
    content = @{
      personalInfo = @{
        name = "John Doe"
        email = "john@example.com"
      }
      experience = @()
      education = @()
      skills = @("JavaScript", "React")
    }
  }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri http://localhost:3000/api/resume/score -Method POST -Body $body -ContentType "application/json"
```

---

## Common Issues & Solutions

### Issue 1: "Cannot find module 'pdf-parse'"

**Solution:**

```bash
npm install pdf-parse mammoth
```

### Issue 2: PDF parsing fails

**Possible causes:**

- Password-protected PDF
- Scanned/image-based PDF (no text layer)
- Corrupted file

**Solution:** Try a different PDF or use standard text-based resume

### Issue 3: Score shows 0 or very low

**Possible causes:**

- Resume has non-standard layout
- Missing key sections
- Parser couldn't detect sections

**Solution:** Check console logs for parsing output, verify sections were detected

### Issue 4: Skills list empty

**Possible causes:**

- No "Skills" section in resume
- Skills not recognized by common keywords

**Solution:** Add a clear "Skills" section with common tech keywords

---

## Browser Console Debugging

### Enable Detailed Logging

**In Upload Page:**

```typescript
const result = await response.json();
console.log("Parse result:", result);
console.log("Extracted text:", result.data.rawText);
console.log("Personal info:", result.data.content.personalInfo);
console.log("Experience:", result.data.content.experience);
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Upload a file
4. Look for `/api/resume/parse` request
5. Check request payload and response

---

## Sample Test Resumes

### Create a Simple Test PDF

**Content:**

```
John Doe
john.doe@email.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development.

EXPERIENCE

Software Engineer
Tech Company Inc.
Jan 2020 - Present
• Developed and maintained React applications serving 1M+ users
• Improved application performance by 40% through code optimization
• Led a team of 3 junior developers on key projects

EDUCATION

Bachelor of Science in Computer Science
University of California
Sep 2015 - May 2019

SKILLS
JavaScript, TypeScript, React, Node.js, Python, SQL, AWS, Docker
```

Save this as a PDF and use for testing!

---

## Success Indicators

### ✅ Everything Working If:

1. PDFs upload and parse successfully
2. Personal info extracted correctly
3. Experience bullets appear in results
4. Education details shown
5. Skills list populated
6. ATS Score calculated (realistic number, not 0 or 100)
7. Recommendations specific to parsed content
8. No console errors

### ⚠️ Needs Attention If:

- Sections not detected properly
- Personal info missing
- Score always same number
- Generic recommendations only
- Console shows parsing errors

---

## Performance Benchmarks

**Expected Processing Times:**

- Small PDF (1 page): 1-2 seconds
- Medium PDF (2-3 pages): 2-4 seconds
- Large PDF (4+ pages): 3-6 seconds
- DOCX files: 1-3 seconds

**If slower:** Check file size, server resources, or network

---

## Next: Test with Real Resumes!

1. Upload your actual resume
2. Check what data was extracted
3. Note any parsing issues
4. Adjust parser logic if needed
5. Test with friends' resumes for variety

**Goal:** 80%+ accuracy on standard resume formats!
