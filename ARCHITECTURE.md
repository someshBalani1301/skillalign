# SkillAlign - Component Architecture Documentation

## 📁 New Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── dashboard/
│   │   ├── layout.tsx               # ✅ Refactored with new components
│   │   ├── score/page.tsx           # ✅ Refactored with new components
│   │   └── [other pages]            # Ready for refactoring
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                       # ✨ NEW - Reusable Components
│   ├── ui/                          # Generic UI Components
│   │   ├── Button.tsx              # Versatile button with variants
│   │   ├── Card.tsx                # Container card component
│   │   ├── Badge.tsx               # Status badges
│   │   ├── ProgressBar.tsx         # Progress indicators
│   │   ├── Alert.tsx               # Alert messages
│   │   ├── Spinner.tsx             # Loading indicators
│   │   ├── EmptyState.tsx          # Empty state placeholder
│   │   └── index.ts                # Barrel export
│   │
│   ├── score/                       # Score-specific components
│   │   ├── ScoreDisplay.tsx        # Score visualization
│   │   ├── ScoreBreakdown.tsx      # Category breakdown
│   │   ├── KeywordsDisplay.tsx     # Keywords analysis
│   │   └── RecommendationsList.tsx # Recommendations
│   │
│   ├── upload/
│   │   └── FileUploadZone.tsx      # Drag-drop upload
│   │
│   ├── layout/
│   │   └── PageHeader.tsx          # Page header with actions
│   │
│   └── icons/
│       └── NavigationIcons.tsx     # SVG icon components
│
├── hooks/                            # ✨ NEW - Custom React Hooks
│   ├── useResume.ts                # Resume operations hook
│   └── useJobDescription.ts        # Job description hook
│
├── utils/                            # ✨ NEW - Utility Functions
│   ├── scoreUtils.ts               # Score calculations
│   ├── formatUtils.ts              # Data formatting
│   ├── fileUtils.ts                # File operations
│   ├── storageUtils.ts             # LocalStorage helpers
│   └── index.ts                    # Barrel export
│
├── lib/
│   ├── constants.ts                # ✨ NEW - App constants
│   └── mockData.ts                 # Mock data & calculations
│
├── context/
│   └── AppContext.tsx              # ✅ Optimized with storage utils
│
└── types/
    └── index.ts                    # TypeScript interfaces
```

## 🎨 Component Library

### UI Components (`components/ui/`)

#### Button

```tsx
<Button
  variant="primary|secondary|outline|ghost|danger"
  size="sm|md|lg"
  isLoading={boolean}
  fullWidth={boolean}
>
  Click Me
</Button>
```

#### Card

```tsx
<Card variant="default|bordered|elevated" padding="none|sm|md|lg">
  Content
</Card>
```

#### Badge

```tsx
<Badge variant="success|warning|danger|info|neutral" size="sm|md|lg">
  Label
</Badge>
```

#### ProgressBar

```tsx
<ProgressBar value={75} max={100} height="sm|md|lg" showLabel={true} />
```

#### Alert

```tsx
<Alert variant="info|success|warning|danger" title="Optional Title">
  Message content
</Alert>
```

### Feature Components

#### ScoreDisplay

Displays ATS score with visual styling

```tsx
<ScoreDisplay score={85} maxScore={100} size="sm|md|lg" showLabel={true} />
```

#### ScoreBreakdown

Shows category-wise score breakdown

```tsx
<ScoreBreakdown
  breakdown={{
    formatting: 85,
    keywords: 90,
    experience: 80,
  }}
/>
```

#### KeywordsDisplay

Displays found and missing keywords

```tsx
<KeywordsDisplay
  foundKeywords={["React", "TypeScript"]}
  missingKeywords={["Docker", "AWS"]}
/>
```

#### FileUploadZone

Drag-and-drop file upload with validation

```tsx
<FileUploadZone
  onFileSelect={(file) => handleFile(file)}
  isProcessing={false}
/>
```

#### PageHeader

Consistent page header with optional action button

```tsx
<PageHeader
  title="Page Title"
  subtitle="Optional subtitle"
  action={{
    label: "Action",
    onClick: () => {},
    variant: "outline",
  }}
/>
```

## 🔧 Utility Functions

### Score Utils (`utils/scoreUtils.ts`)

- `getScoreColor(score)` - Get color class for score
- `getScoreBgColor(score)` - Get background color for score
- `getScoreLabel(score)` - Get label (Excellent/Good/etc)
- `getProgressColor(score)` - Get progress bar color
- `getImpactColor(impact)` - Get color for impact level

### Format Utils (`utils/formatUtils.ts`)

- `formatDate(date)` - Format date to readable string
- `formatDateShort(date)` - Short date format
- `truncateText(text, length)` - Truncate with ellipsis
- `formatFileSize(bytes)` - Human-readable file size
- `capitalize(str)` - Capitalize first letter
- `kebabToTitle(str)` - Convert kebab-case to Title Case
- `cn(...classes)` - Conditional class name joining

### File Utils (`utils/fileUtils.ts`)

- `isValidFileType(fileName)` - Validate file extension
- `isValidFileSize(fileSize)` - Validate file size
- `getFileExtension(fileName)` - Extract file extension
- `validateFile(file)` - Complete file validation
- `readFileAsText(file)` - Read file as text
- `downloadBlob(blob, fileName)` - Download file

### Storage Utils (`utils/storageUtils.ts`)

- `saveResume(resume)` - Save to localStorage
- `getResume()` - Get from localStorage
- `saveJobDescription(jd)` - Save JD to localStorage
- `getJobDescription()` - Get JD from localStorage
- `clearAllData()` - Clear all app data

## 🪝 Custom Hooks

### useResume

```tsx
const { resume, setResume, hasResume, redirectToUpload, updateResumeField } =
  useResume();
```

### useJobDescription

```tsx
const {
  jobDescription,
  setJobDescription,
  matchAnalysis,
  hasJobDescription,
  hasMatchAnalysis,
  updateJobDescription,
} = useJobDescription();
```

## 📦 Constants (`lib/constants.ts`)

### Routes

```tsx
ROUTES.HOME;
ROUTES.DASHBOARD.UPLOAD;
ROUTES.DASHBOARD.SCORE;
ROUTES.DASHBOARD.JD_MATCH;
ROUTES.DASHBOARD.BULLET_IMPROVER;
ROUTES.DASHBOARD.EXPORT;
```

### Storage Keys

```tsx
STORAGE_KEYS.RESUME;
STORAGE_KEYS.JOB_DESCRIPTION;
```

### Score Thresholds

```tsx
SCORE_THRESHOLDS.EXCELLENT; // 80
SCORE_THRESHOLDS.GOOD; // 60
SCORE_THRESHOLDS.NEEDS_IMPROVEMENT; // 0
```

### File Upload Settings

```tsx
FILE_UPLOAD.ACCEPTED_TYPES; // ['.pdf', '.docx', '.txt']
FILE_UPLOAD.MAX_SIZE_MB; // 5
FILE_UPLOAD.MAX_SIZE_BYTES; // 5 * 1024 * 1024
```

### UI Messages

```tsx
MESSAGES.NO_RESUME;
MESSAGES.UPLOAD_SUCCESS;
MESSAGES.INVALID_FILE_TYPE;
// ... and more
```

### Colors

```tsx
COLORS.SCORE.EXCELLENT; // 'text-green-600'
COLORS.BG.EXCELLENT; // 'bg-green-100'
COLORS.BADGE.SUCCESS; // 'bg-green-100 text-green-800'
// ... and more
```

## 🎯 Benefits of New Architecture

### 1. **Reusability**

- Components can be used across different pages
- Consistent UI/UX throughout the app
- DRY (Don't Repeat Yourself) principle

### 2. **Maintainability**

- Centralized utility functions
- Easy to update styling/behavior in one place
- Clear separation of concerns

### 3. **Testability**

- Isolated components are easier to test
- Pure utility functions can be unit tested
- Custom hooks can be tested independently

### 4. **Scalability**

- Easy to add new features
- New pages can quickly compose existing components
- Consistent patterns make onboarding easier

### 5. **Type Safety**

- All components have TypeScript interfaces
- Props are validated at compile time
- Better IDE autocomplete

### 6. **Performance**

- Smaller bundle sizes through tree-shaking
- Components can be lazy-loaded
- Optimized re-renders with proper memoization

## 📋 Migration Checklist

### ✅ Completed

- [x] Create utility functions (score, format, file, storage)
- [x] Create reusable UI components (Button, Card, Badge, etc.)
- [x] Create feature-specific components (Score, Upload, etc.)
- [x] Create custom hooks (useResume, useJobDescription)
- [x] Create constants file
- [x] Optimize AppContext with storage utils
- [x] Refactor dashboard layout with new icons
- [x] Refactor score page with new components

### 🔄 Ready to Migrate

- [ ] Upload page - use FileUploadZone component
- [ ] JD Match page - create match-specific components
- [ ] Bullet Improver page - create improvement components
- [ ] Export page - create export components
- [ ] Landing page - extract feature cards into components

## 🚀 Usage Examples

### Example 1: Creating a New Page

```tsx
import { useResume } from "@/hooks/useResume";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { ROUTES } from "@/lib/constants";

export default function NewPage() {
  const { resume, hasResume } = useResume();

  if (!hasResume) {
    return (
      <Alert variant="warning">
        Please upload a resume first.
        <Link href={ROUTES.DASHBOARD.UPLOAD}>
          <Button className="mt-4">Upload Now</Button>
        </Link>
      </Alert>
    );
  }

  return (
    <div>
      <PageHeader title="New Feature" subtitle="Description" />
      <Card variant="elevated" padding="lg">
        Your content here
      </Card>
    </div>
  );
}
```

### Example 2: Using Utility Functions

```tsx
import { getScoreColor, formatDate } from "@/utils";
import { SCORE_THRESHOLDS } from "@/lib/constants";

function MyComponent({ score, date }) {
  const colorClass = getScoreColor(score);
  const formattedDate = formatDate(date);
  const isExcellent = score >= SCORE_THRESHOLDS.EXCELLENT;

  return (
    <div className={colorClass}>
      Score: {score} - {formattedDate}
      {isExcellent && <span>🎉</span>}
    </div>
  );
}
```

## 📚 Best Practices

1. **Always use constants** instead of magic strings/numbers
2. **Use utility functions** for repeated logic
3. **Compose components** instead of duplicating code
4. **Use custom hooks** for shared stateful logic
5. **Keep components small** and focused on one thing
6. **Export components** through index files for cleaner imports
7. **Type everything** with TypeScript
8. **Document props** with JSDoc comments

## 🎓 Next Steps

1. Migrate remaining dashboard pages to use new components
2. Add Storybook for component documentation
3. Add unit tests for utilities
4. Add component tests with React Testing Library
5. Create more specialized components as needed
6. Implement proper error boundaries
7. Add accessibility features (ARIA labels, keyboard navigation)

---

**Architecture Status**: ✅ Foundation Complete  
**Code Quality**: Improved readability, reusability, and maintainability  
**Ready for**: Backend integration and feature expansion
