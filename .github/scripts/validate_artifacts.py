#!/usr/bin/env python3
"""
BA Toolkit — Artifact Structure Validator
Checks that generated artifacts in output/ contain required sections.
Exits with code 1 if any critical issues are found.
"""

import os
import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Required sections per artifact type (matched by filename prefix)
# ---------------------------------------------------------------------------

RULES: dict[str, dict] = {
    "00_principles": {
        "required": ["## 1.", "## 2.", "## 3.", "## 4."],
        "description": "Principles",
    },
    "01_brief": {
        "required": [
            "## 1. Project Summary",
            "## 2. Business Goals",
            "## 3. Target Audience",
            "## 5. Stakeholders",
            "## 7. Risks",
        ],
        "description": "Project Brief",
    },
    "02_srs": {
        "required": [
            "## 2. General Description",
            "## 3. Functional Requirements",
            "FR-",
            "## 6. Priority Matrix",
        ],
        "description": "SRS",
    },
    "03_stories": {
        "required": ["## E-", "US-", "**As a**", "**Priority:**"],
        "description": "User Stories",
    },
    "04_usecases": {
        "required": ["UC-", "**Primary Actor:**", "### Main Success Scenario"],
        "description": "Use Cases",
    },
    "05_ac": {
        "required": ["US-", "**Given**", "**When**", "**Then**"],
        "description": "Acceptance Criteria",
    },
    "06_nfr": {
        "required": ["NFR-", "**Rationale:**"],
        "description": "NFR",
    },
    "07_datadict": {
        "required": ["## Entity:", "| Field |", "**Relationships:**"],
        "description": "Data Dictionary",
    },
    "07a_research": {
        "required": ["ADR-", "**Status:**", "**Decision:**", "## Integration Map"],
        "description": "Research / ADRs",
    },
    "08_apicontract": {
        "required": ["**Base URL:**", "**Auth:**", "### POST", "## Error Code Reference"],
        "description": "API Contract",
    },
    "09_wireframes": {
        "required": ["WF-", "### Layout", "### States", "### Interactions"],
        "description": "Wireframes",
    },
    "10_scenarios": {
        "required": ["SC-", "**Persona:**", "### Steps", "### Expected Outcome"],
        "description": "Validation Scenarios",
    },
    "11_handoff": {
        "required": [
            "## Artifact Inventory",
            "## MVP Scope",
            "## Open Items",
            "## Top Risks",
        ],
        "description": "Handoff Package",
    },
    "00_analyze": {
        "required": ["## Finding Summary", "## Findings", "## Priority Actions"],
        "description": "Quality Analysis Report",
    },
    "00_glossary": {
        "required": ["## Terms", "| Term |"],
        "description": "Project Glossary",
    },
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SEVERITY_ERROR = "error"
SEVERITY_WARNING = "warning"


def get_rule_key(filename: str) -> str | None:
    """Return the rule key matching a filename prefix, or None."""
    for key in RULES:
        if filename.startswith(key + "_") or filename == key + ".md":
            return key
    return None


def validate_file(path: Path) -> list[dict]:
    """Validate a single artifact file. Returns a list of findings."""
    findings = []
    content = path.read_text(encoding="utf-8")
    rule_key = get_rule_key(path.stem)

    if rule_key is None:
        return findings  # Unknown artifact type — skip silently

    rule = RULES[rule_key]

    # Check required sections
    for section in rule["required"]:
        if section not in content:
            findings.append(
                {
                    "severity": SEVERITY_ERROR,
                    "file": str(path),
                    "message": f"Missing required content: '{section}' in {rule['description']}",
                }
            )

    # Check for unfilled template tokens
    tokens = re.findall(r"\[(?:PROJECT_NAME|SLUG|DOMAIN|DATE|TOKEN)[^\]]*\]", content)
    if tokens:
        findings.append(
            {
                "severity": SEVERITY_WARNING,
                "file": str(path),
                "message": f"Unfilled template placeholders found: {', '.join(set(tokens[:5]))}",
            }
        )

    # Check minimum length (artifacts shorter than 200 chars are likely stubs)
    if len(content.strip()) < 200:
        findings.append(
            {
                "severity": SEVERITY_WARNING,
                "file": str(path),
                "message": f"Artifact appears to be a stub (< 200 characters)",
            }
        )

    return findings


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> int:
    output_dir = Path("output")

    if not output_dir.exists():
        print("No output/ directory found. Nothing to validate.")
        return 0

    artifact_files = sorted(output_dir.rglob("*.md"))

    if not artifact_files:
        print("No artifact files found in output/. Nothing to validate.")
        return 0

    all_findings: list[dict] = []

    for artifact_path in artifact_files:
        findings = validate_file(artifact_path)
        all_findings.extend(findings)

    # Print findings in GitHub Actions annotation format
    errors = 0
    warnings = 0

    for finding in all_findings:
        if finding["severity"] == SEVERITY_ERROR:
            print(f"::error file={finding['file']}::{finding['message']}")
            errors += 1
        else:
            print(f"::warning file={finding['file']}::{finding['message']}")
            warnings += 1

    # Summary
    total = len(artifact_files)
    print(f"\nValidated {total} artifact(s): {errors} error(s), {warnings} warning(s).")

    if errors > 0:
        print("Validation failed — fix errors above before merging.")
        return 1

    print("Validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
