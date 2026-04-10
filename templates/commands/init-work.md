# /init-work

Initialize a new work item in the specoven workflow.

## Usage

```
/init-work
/init-work [brief description of what you want to build]
```

## What this command does

1. Reads `.agents/skills/init-work/SKILL.md` for instructions
2. Generates a unique work item ID (`WI-YYYY-MMDD-NNN`)
3. Creates `work-items/WI-ID/` directory
4. Fills out `brief.md` based on your description
5. Initializes `status.yaml`
6. Computes confidence score and checks the gate (score ≥ 30)

## Output

- `work-items/WI-ID/brief.md`
- `work-items/WI-ID/status.yaml`

## Next step

If score ≥ 30: Run `/propose-work`
If score < 30: Provide more detail about the work item

## Example

```
/init-work Add OAuth2 login to the API
```
