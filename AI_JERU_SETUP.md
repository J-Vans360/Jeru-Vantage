# AI Jeru - Setup Guide

## Overview
AI Jeru is an AI-powered university and career guidance counselor that provides personalized recommendations based on a student's complete assessment profile.

## Prerequisites
- Completed student profile
- Completed assessments (ideally all 10 sections for best results)
- OpenAI API key

## Setup Instructions

### 1. Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again)

### 2. Add API Key to Environment
Add your OpenAI API key to the `.env` file:

```bash
OPENAI_API_KEY=sk-...your-key-here
```

### 3. Restart Development Server
If your dev server is running, restart it to pick up the new environment variable:

```bash
npm run dev
```

## Usage

### For Students
1. Complete your profile at `/profile`
2. Complete all assessment sections (Parts A, B, and C)
3. Go to `/results` to view your complete assessment results
4. Click the "🧙‍♂️ Get AI Guidance" button
5. Click "Ask Jeru for Guidance" to generate your personalized report
6. Wait 30-60 seconds for AI processing
7. Review your comprehensive guidance report
8. Print or save the report for future reference

### Direct Access
You can also access AI Jeru directly at `/ai-jeru` once you've completed your assessments.

## What AI Jeru Analyzes

### Student Profile Data
- Demographics (name, grade, target year, citizenship)
- Financial situation (budget, aid needs)
- Academic background (curriculum, subjects, grades)
- Test scores (SAT, ACT, IELTS, TOEFL)
- Career interests
- Destination preferences

### Assessment Results
- **Part A: The Internal You**
  - Personality Architecture (Big Five)
  - Core Values & Interests
  - Career Interests (Holland Code)
  - Multiple Intelligences

- **Part B: Your Operating System**
  - Cognitive Style
  - Stress Response
  - 21st Century Skills
  - Social Check (Authenticity)

- **Part C: The Reality Check**
  - Environment & Preferences
  - Execution & Grit

## AI Jeru Report Sections (COMPREHENSIVE VERSION)

The report is 3000-4000 words and takes 60-90 seconds to generate.

### 1. **Executive Summary**
   - Your unique archetype (2-3 sentences with personality depth)
   - The Big Picture (full paragraph on your unique profile)
   - Top 3 Career Pathways with detailed WHY explanations

### 2. **Deep Dive: Assessment Analysis**
   Comprehensive analysis of ALL 10 assessment sections:

   **Part A: The Internal You**
   - Personality Architecture (all 5 Big Five traits with interpretations)
   - Core Values & Interests (top values + what drives you + career fit)
   - Holland Code (full RIASEC breakdown + 5-7 matching majors)
   - Multiple Intelligences (top intelligences + learning style + major selection)

   **Part B: Your Operating System**
   - Cognitive Style (all dimensions + problem-solving approach)
   - Stress Response (patterns + university environment fit)
   - 21st Century Skills (competitive edge + development areas)
   - Social Check (authenticity assessment + self-awareness analysis)

   **Part C: The Reality Check**
   - Environment & Preferences (ideal campus description + deal breakers)
   - Execution & Grit (academic readiness + growth areas)

### 3. **The Ikigai Blueprint (Deep Integration)**
   Connects EVERYTHING to find your calling:

   - ❤️ **What You Love** - 2-3 paragraphs synthesizing passions + 5-7 career implications
   - ⭐ **What You're Good At** - 2-3 paragraphs on talents + 5-7 major recommendations
   - 🌍 **What the World Needs** - 2-3 paragraphs on impact + 5-7 careers for difference-making
   - 💰 **What You Can Be Paid For** - 2-3 paragraphs on market viability + salary ranges
   - 🎯 **Your Ikigai Sweet Spot** - Comprehensive paragraph on where all 4 circles overlap

### 4. **University Strategy (Detailed Recommendations)**
   - Dream Schools Analysis (fit + financial viability + competitiveness)
   - **12-15 Specific University Recommendations:**
     - REACH Schools (3-4): Why it's a reach + why it could work + how to improve odds
     - TARGET Schools (5-6): Detailed fit analysis + program highlights + financial aid
     - SAFETY Schools (3-4): Why it's safe + why it's still great + unique advantages
   - Geographic Strategy (home country + regional + international with rationale)
   - Financial Strategy (budget analysis + aid opportunities + ROI + cost-saving)

### 5. **Career Pathway Recommendations (Three Detailed Paths)**
   For EACH pathway:
   - Why This Fits (2-3 paragraphs connecting to assessment data)
   - Recommended Majors (3-5 specific majors with explanations)
   - Career Progression (Entry → Mid → Senior roles)
   - Salary Expectations (realistic ranges by career stage)
   - Day-in-the-Life (what you'd actually DO daily)
   - Required Skills (what you have vs need to build)
   - University Picks (2-3 universities strong in this area)

### 6. **Gap Analysis & 12-Month Action Plan**
   - Academic Gaps (what's missing + impact + fix + timeline)
   - Extracurricular Gaps (what's missing + which schools care + fix + milestones)
   - Testing Gaps (scores needed + test prep strategy + dates)
   - Application Strategy (ED/EA decisions + essay themes + recommendations + supplements)
   - **Month-by-Month Plan** (detailed timeline from NOW to application deadlines)

### 7. **Well-Being & Final Thoughts**
   - A Word to the Student (2-3 paragraphs acknowledging strengths + addressing anxieties)
   - A Word to the Family (2-3 paragraphs for parents on support + financial realities)
   - The Long View (final paragraph on success beyond admissions)

---

## Report Characteristics

- **Length**: 3000-4000 words (comprehensive, not summary)
- **Processing Time**: 60-90 seconds (longer due to depth)
- **Focus**: Explains WHY behind every recommendation
- **Approach**: Connects personality → values → skills → career fit
- **Citations**: Every recommendation backed by specific assessment data

## Cost Considerations

### OpenAI API Pricing (as of Dec 2024)
- Model: GPT-4 Turbo
- Input: ~$0.01 per 1K tokens
- Output: ~$0.03 per 1K tokens
- **Average cost per comprehensive report: $0.50 - $1.00** (increased due to 4x length)

### Tips to Manage Costs
1. Only generate reports when assessments are complete
2. Save generated reports (print to PDF)
3. Consider rate limiting in production
4. Monitor usage in OpenAI dashboard

## Technical Details

### Files
- `lib/ai-jeru.ts` - OpenAI service with system prompt
- `app/api/ai-jeru/route.ts` - API endpoint
- `app/ai-jeru/page.tsx` - User interface
- `components/results/ResultsDashboard.tsx` - Navigation link

### API Endpoint
- **Route**: `POST /api/ai-jeru`
- **Auth**: Required (NextAuth session)
- **Response**: JSON with markdown-formatted recommendations
- **Timeout**: ~30-60 seconds (OpenAI processing time)

### Error Handling
The system handles:
- Missing profile data
- Incomplete assessments
- OpenAI API errors
- Authentication failures

## Troubleshooting

### "Profile not found" Error
- Make sure you've completed your student profile
- Navigate to `/profile` to create one

### "No assessments found" Error
- Complete at least one assessment section
- Ideally complete all 10 sections for best results

### "Failed to get recommendations" Error
- Check that your OpenAI API key is correct
- Verify the key has sufficient credits
- Check browser console for detailed errors

### Loading Takes Too Long
- Normal processing time is 30-60 seconds
- If it takes longer, try refreshing and re-submitting
- Check OpenAI status page for service issues

## Privacy & Security

### Data Handling
- Student data is sent to OpenAI for analysis
- OpenAI does NOT use API data for training (as of their policy)
- Data is transmitted over HTTPS
- No data is stored by AI Jeru beyond your existing database

### Recommendations
- Review OpenAI's data usage policy
- Consider adding data processing agreements for school use
- Inform students that AI analysis is being used
- Store generated reports locally (print to PDF)

## Future Enhancements

### Potential Improvements
1. **Caching**: Store generated reports to avoid re-processing
2. **Export Options**: PDF generation, email delivery
3. **Follow-up Questions**: Interactive Q&A with Jeru
4. **Progress Tracking**: Monitor action plan completion
5. **University Database Integration**: Real-time admissions data
6. **Multi-language Support**: Translate reports
7. **Streaming Responses**: Show report as it's being generated

### Production Considerations
1. Implement rate limiting (e.g., 1 request per hour per user)
2. Add usage tracking and analytics
3. Create admin dashboard for monitoring costs
4. Consider fine-tuned models for better consistency
5. Add report versioning (save multiple versions)

## Support

For issues or questions:
1. Check this documentation first
2. Review OpenAI API documentation
3. Check application logs for errors
4. Verify environment variables are set correctly

## License & Attribution

This feature uses:
- OpenAI GPT-4 API
- React Markdown for rendering
- Next.js API routes
- NextAuth for authentication
