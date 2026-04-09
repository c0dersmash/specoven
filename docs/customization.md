# Customization Guide

## Configuration File

The main configuration file is `.agents/config.yaml`. Edit it to customize the workflow for your team.

## Changing Scoring Weights

Adjust category weights to match your priorities:

```yaml
scoring:
  categories:
    clarity:
      weight: 0.20  # increased from 0.15
    release_readiness:
      weight: 0.10  # decreased from 0.15
```

Weights don't need to sum to 1.0 — the system normalizes automatically.

## Changing Thresholds

Lower thresholds for faster iteration, higher for stricter quality gates:

```yaml
scoring:
  thresholds:
    validate_to_design: 55   # less strict
    code_to_verify: 85       # more strict
```

## Adding Custom Skills

Create a new skill in `.agents/skills/my-skill/SKILL.md` following the existing format.

## Adding Custom Commands

Create `.agents/commands/my-command.md` and reference your skill.

## Customizing Templates

Edit files in `.agents/templates/` to change the structure of work item artifacts.

## Removing Phases

If your team doesn't need all phases, you can comment them out in `config.yaml` and document the shortcut in `AGENTS.md`.
