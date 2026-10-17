# prayticland-ui-libs — a library, not an app: no deploy targets.
# Gates are the local deterministic ones: typecheck + showcase build.

.PHONY: help check showcase inventory

help:
	@printf '%s\n' \
		'make check     Typecheck the library + showcase (tsc --noEmit)' \
		'make showcase  Build the showcase page (visual regression surface)' \
		'make inventory Run the override/hex inventory across the fleet'

check:
	npx tsc --noEmit

showcase:
	npm run build-showcase

inventory:
	python3 tools/override-inventory.py
