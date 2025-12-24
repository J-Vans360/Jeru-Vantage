#!/bin/bash

# Script to update all assessment part files to use userId from session

FILES=(
  "app/assessment/part-a-s2/page.tsx"
  "app/assessment/part-a-s3/page.tsx"
  "app/assessment/part-a-s4/page.tsx"
  "app/assessment/part-b-s1/page.tsx"
  "app/assessment/part-b-s2/page.tsx"
  "app/assessment/part-b-s3/page.tsx"
  "app/assessment/part-b-s4/page.tsx"
  "app/assessment/part-c-s1/page.tsx"
  "app/assessment/part-c-s2/page.tsx"
)

for file in "${FILES[@]}"; do
  echo "Updating $file..."

  # Add import for useUserId
  sed -i.bak "s|import { useState } from 'react';|import { useState } from 'react';\nimport { useUserId } from '@/lib/get-user-id';|" "$file"

  # Remove USER_ID constant
  sed -i.bak "/^const USER_ID = 'test-user-123';$/d" "$file"

  # Add userId hook after router
  sed -i.bak "s|const router = useRouter();|const router = useRouter();\n  const userId = useUserId();|" "$file"

  # Replace USER_ID with userId in fetch calls
  sed -i.bak "s|userId: USER_ID,|userId,|g" "$file"

  # Add loading check after state declarations
  sed -i.bak "s|const \[isSaving, setIsSaving\] = useState(false);|const [isSaving, setIsSaving] = useState(false);\n\n  if (!userId) {\n    return <div className=\"min-h-screen flex items-center justify-center\">Loading...</div>;\n  }|" "$file"

  # Remove backup files
  rm -f "${file}.bak"

  echo "✓ Updated $file"
done

echo "All files updated successfully!"
