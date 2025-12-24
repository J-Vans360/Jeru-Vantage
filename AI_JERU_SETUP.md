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

## AI Jeru Report Sections

1. **Executive Summary**
   - Your unique archetype (1 sentence profile)
   - Verdict on current aspirations
   - Top 3 AI recommendations

2. **The Ikigai Blueprint**
   - ❤️ What You Love (passions, interests)
   - ⭐ What You're Good At (skills, strengths)
   - 🌍 What the World Needs (values, impact)
   - 💰 What You Can Be Paid For (economic reality)

3. **Dream vs. Data**
   - Reality check on university choices
   - Safety/Target/Reach categorization
   - Admission probability insights

4. **Recommendation Pathways**
   - Pathway A: Ideal Fit (best alignment)
   - Pathway B: Pragmatic Choice (balanced)
   - Pathway C: Wildcard (unexpected opportunity)

5. **University Strategy**
   - Home country options
   - International options
   - Financial aid strategy
   - Application timeline

6. **Gap Analysis & Action Plan**
   - Current gaps in profile
   - Impact on admissions
   - Specific actions to close gaps
   - Priority recommendations

7. **Well-Being Note**
   - Encouraging message
   - Long-term perspective
   - Support resources

## Cost Considerations

### OpenAI API Pricing (as of Dec 2024)
- Model: GPT-4 Turbo
- Input: ~$0.01 per 1K tokens
- Output: ~$0.03 per 1K tokens
- Average cost per guidance report: **$0.20 - $0.50**

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
