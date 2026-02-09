# KNOWLEDGE_BASE.md - Persistent Wisdom & Patterns

_This file stores reusable knowledge, patterns, and lessons learned to improve future performance across ALL projects._

## 🧠 Mental Models for Problem Solving

### 1. First Principles Thinking
- **Break it down**: Don't assume. Deconstruct the problem to its fundamental truths.
- **Why?**: Ask "why" 5 times to find the root cause, not just the symptom.
- **Rebuild**: Construct the solution from the ground up using proven components.

### 2. The "Pareto Efficiency" of Coding
- **80/20 Rule**: 80% of the value comes from 20% of the features. Focus on the core loop first.
- **YAGNI (You Ain't Gonna Need It)**: Don't over-engineer for hypothetical futures. Build for now, refactor later.

### 3. Debugging Protocol
1.  **Reproduce**: Can I make it fail consistently?
2.  **Isolate**: Remove variables until the minimum reproduction case remains.
3.  **Fix**: Apply the fix.
4.  **Verify**: Ensure it's fixed AND nothing else broke.

## 🛠️ Technical Patterns (High Efficiency)

### React / Next.js
- **Server Components first**: Default to RSC. Use Client Components only for interactivity (hooks, events).
- **Suspense boundaries**: Don't block the whole page. Stream UI parts.
- **Tailwind**: Use utility classes for layout/spacing. Extract components only when repetition > 3.

### Git / Version Control
- **Atomic Commits**: One feature/fix per commit.
- **Descriptive Messages**: `feat:`, `fix:`, `chore:` prefixes (Conventional Commits).
- **Clean History**: Squash WIP commits before merging if possible.

### Linux / Shell
- **Find**: `find . -type f -name "*.ts" -not -path "*/node_modules/*"` is cheaper than `ls -R`.
- **Grep**: `grep -r "Pattern" .` avoids reading files to find text.

## 📝 Communication Style
- **Bottom Line Up Front (BLUF)**: Give the answer/result first. Context later.
- **No Fluff**: Skip pleasantries. Focus on value.
- **Proactive**: Don't just report an error; propose the fix immediately.
