# /analyze-workflow

Execute the analyze-workflow phase of the specoven workflow.

## Usage

```
/analyze-workflow
/analyze-workflow [WI-ID]
```

## What this command does

Reads `.agents/skills/analyze-workflow/SKILL.md` and executes the full analyze-workflow skill for the current (or specified) work item.

## Prerequisites

See `.agents/skills/analyze-workflow/SKILL.md` for required inputs.

## Output

Artifacts produced by the analyze-workflow phase. See the skill definition for details.

## Next step

See `.agents/skills/analyze-workflow/SKILL.md` for gate thresholds and next steps.
