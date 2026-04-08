# Quality Analysis Report: [PROJECT_NAME]

**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Artifacts Analysed:** [List of artifact files included in this analysis]

---

## Finding Summary

| Severity | Count |
|---------|-------|
| 🔴 Critical | [N] |
| 🟠 High | [N] |
| 🟡 Medium | [N] |
| 🟢 Low | [N] |
| **Total** | **[N]** |

---

## Findings

| # | Severity | Category | Location | Description | Recommendation |
|---|---------|---------|---------|-------------|---------------|
| 1 | 🔴 Critical | [Duplication \| Ambiguity \| Coverage Gap \| Terminology Drift \| Invalid Reference] | [Artifact + section] | [What the issue is] | [How to fix it] |
| 2 | 🟠 High | [Category] | [Location] | [Description] | [Recommendation] |
| 3 | 🟡 Medium | [Category] | [Location] | [Description] | [Recommendation] |
| 4 | 🟢 Low | [Category] | [Location] | [Description] | [Recommendation] |

### Finding Categories

- **Duplication** — same requirement, entity, or AC scenario defined in more than one artifact.
- **Ambiguity** — undefined terms, metrics-free adjectives ("fast", "user-friendly"), or unclear actors.
- **Coverage Gap** — FR with no US, US with no AC, or endpoint with no FR reference.
- **Terminology Drift** — same concept called different names across artifacts (e.g. "user" vs "customer" vs "account").
- **Invalid Reference** — cross-reference points to an ID that does not exist in the linked artifact.

---

## Coverage Summary

| Link | Coverage |
|------|---------|
| FR → US | [N] / [Total] FR covered |
| US → AC | [N] / [Total] US with AC |
| FR → NFR | [N] / [Total] FR with NFR reference |
| FR → API | [N] / [Total] FR with API endpoint |
| US → WF | [N] / [Total] US with wireframe |

---

## Priority Actions

1. **[Action]** — addresses finding #[N] ([severity]). Estimated effort: [low / medium / high].
2. **[Action]** — addresses findings #[N], #[N]. Estimated effort: [low / medium / high].
3. **[Action]** — addresses finding #[N]. Estimated effort: [low / medium / high].

---

## Next Steps

- Run `/clarify [focus]` on artifacts with ambiguity findings.
- Run `/trace` to rebuild the traceability matrix after gaps are resolved.
- Re-run `/analyze` after fixes to verify resolution.
