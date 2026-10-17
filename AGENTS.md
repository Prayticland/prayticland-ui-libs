# AGENTS.md—prayticland-ui-libs

This repository is public. Everything in it—files, code comments,
commit messages, pull requests, issues—is written for a public
audience.

## No decision references

- Never reference internal decisions in this repository: no decision
  numbers, no decision titles, no citations of internal documents or
  their sections, no dated ruling notes—in files, in code comments,
  in commit messages, anywhere.
- Decisions are not stored in this repository. Decision records are
  kept locally by the maintainers and are gitignored (see `.gitignore`).
- State the engineering reason for a change in plain prose, in the
  commit message or the documentation, without pointing at an internal
  record.

## Prose

- All prose in this repository (Markdown, documentation, code comments,
  commit messages) follows the Vale rules (vale.sh) configured in
  `.vale.ini`. Run `vale .` before committing; it must report no errors.

## Library rules

- This is the shared UI library. The theme is created here, never in an
  app; fonts ship from here; overrides used by two or more apps are
  catalogued here with intent names.
- Native Base Web constructs only; no fallback chains; no hex literals
  outside token definitions (tokens.css and tokens.json are the
  palette's one home).
- Semver; apps pin exact versions. A library change is not done until
  the showcase builds (`make showcase`) and typechecks (`make check`).
- Design verification is screenshot-based (headless Firefox);
  screenshot evidence outranks code reading.
- Consumption is the versioned release tarball attached to this repo's
  GitHub Releases; never publish to a public registry.
