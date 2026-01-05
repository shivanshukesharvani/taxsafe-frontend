## Packages
framer-motion | Essential for the smooth page transitions and 3D card effects requested
clsx | Utility for conditional class names
tailwind-merge | Utility for merging tailwind classes safely

## Notes
The application follows a linear flow: Landing -> Wizard -> Upload -> Processing -> Result.
Submission creation happens after the wizard questions are answered.
File upload is optional but linked to the created submission.
Processing simulates analysis and then shows results.
Images are abstract SVGs or CSS-generated shapes, no external assets needed.
