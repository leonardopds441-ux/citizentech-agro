# Local security patch

This directory contains the MIT-licensed `picomatch` 4.0.7 package source with a local security change for GHSA-fc5q-39xc-vjpf.

`lib/parse.js` now marks a single-branch repeated extglob containing `*` or `?` as risky. Picomatch's existing `extglobClose` path then escapes that entire extglob and treats it as a literal string. This covers the advisory examples `+(*)` and `+(*a)` and avoids compiling their nested backtracking expressions.

The local package version is `4.0.8-local.0` so dependency scanners do not mistake the patched copy for upstream 4.0.7. This is not an upstream release. Revisit or remove the override when the official package publishes a fix.
