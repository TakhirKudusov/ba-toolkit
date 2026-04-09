# Quality Analysis Report: [PROJECT_NAME]

**Version:** 0.1
**Status:** Draft
**Domain:** [DOMAIN]
**Date:** [DATE]
**Slug:** [SLUG]
**Artifacts Analysed:** [List of artifact files included in this analysis]
**Severity threshold (blocks /done):** [CRITICAL / HIGH / per `00_principles_[SLUG].md` §6]

---

## Finding Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | [N] |
| 🟠 High | [N] |
| 🟡 Medium | [N] |
| 🟢 Low | [N] |
| **Total** | **[N]** |

---

## Findings

| # | Severity | Category | Location | Description | Recommendation | Owner |
|---|----------|----------|----------|-------------|----------------|-------|
| 1 | 🔴 Critical | Coverage Gap | [Artifact + section] | [What the issue is] | [How to fix it] | BA |
| 2 | 🟠 High | Duplication | [Location] | [Description] | [Recommendation] | BA |
| 3 | 🟡 Medium | Ambiguity | [Location] | [Description] | [Recommendation] | BA |
| 4 | 🟠 High | Underspecified Source | [Location] | [Description] | [Recommendation] | BA |
| 5 | 🟠 High | Stakeholder Validation Gap | [Location] | [Description] | [Recommendation] | PM |
| 6 | 🟢 Low | Terminology Drift | [Location] | [Description] | [Recommendation] | BA |

### Finding Categories *(8 canonical, mapped to IEEE 830 §4.3 SRS quality attributes)*

- **Duplication** *(IEEE 830: consistency)* — same requirement, entity, or AC scenario defined in more than one artifact.
- **Ambiguity** *(IEEE 830: unambiguous)* — undefined terms, metrics-free adjectives ("fast", "user-friendly"), unclear actors, modal verb confusion (must / shall / should / may).
- **Coverage Gap** *(IEEE 830: complete + traceable)* — FR with no US, US with no AC, endpoint with no FR reference, Task with no upstream reference.
- **Terminology Drift** *(IEEE 830: consistent)* — same concept called different names across artifacts (e.g. "user" vs "customer" vs "account").
- **Invalid Reference** *(IEEE 830: traceable)* — cross-reference points to an ID that does not exist in the linked artifact.
- **Inconsistency** *(IEEE 830: consistent)* — same fact stated differently across artifacts (e.g. brief says €1.5M GMV, srs says €2M).
- **Underspecified Source** *(post-v3.5.0 provenance discipline)* — FR / UC / AC / Entity / Endpoint missing the `Source` field that the v3.5.0+ template requires.
- **Stakeholder Validation Gap** *(post-v3.5.0 assumption discipline)* — assumption with no Owner, or past its Validate by date and not converted to fact or risk.

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
