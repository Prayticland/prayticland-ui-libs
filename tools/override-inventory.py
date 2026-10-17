#!/usr/bin/env python3
"""Override + hex inventory — the extraction backlog, regenerated on
demand, never hand-maintained.

Scans each Prayticland app's UI sources for: files using Base Web overrides,
withStyle calls, raw .css files, inline style={{}} props, and hex color
literals (with the files carrying them). Output IS the inventory.

Usage: override-inventory.py [repo-root ...]
Default roots: the fleet apps under $PRAYTICLAND_REPOS_ROOT.
"""
import os, re, sys

DEFAULT = {
    "Gallery": "Gallery/src",
    "Stamps": "Stamps/src",
    "Otgymanya": "gym-routine-tracker/src",
    "Lifegame": "lifegame/src",
    "Homunculus": "homunculus-icons/src",
    "Networker": "Networker/web/src",
}
BASE = os.environ.get("PRAYTICLAND_REPOS_ROOT", "")
HEX = re.compile(r"#[0-9a-fA-F]{3,8}\b")

def scan(root):
    files = []
    for dp, dn, fn in os.walk(root):
        dn[:] = [x for x in dn if x not in ("node_modules", "dist", ".git")]
        for f in fn:
            if f.endswith((".ts", ".tsx", ".js", ".jsx", ".css")):
                files.append(os.path.join(dp, f))
    hex_by_file, ovr, css, inline, ws = {}, 0, 0, 0, 0
    for f in files:
        t = open(f, encoding="utf-8", errors="replace").read()
        h = len(HEX.findall(t))
        if h:
            hex_by_file[os.path.relpath(f, root)] = h
        if "overrides" in t and not f.endswith(".css"):
            ovr += 1
        if f.endswith(".css"):
            css += 1
        inline += len(re.findall(r"style=\{\{", t))
        ws += t.count("withStyle")
    return files, hex_by_file, ovr, css, inline, ws

def main():
    roots = DEFAULT
    if len(sys.argv) > 1:
        roots = {os.path.basename(os.path.abspath(p)): p for p in sys.argv[1:]}
        items = [(name, path if os.path.isabs(path) else os.path.join(BASE, path)) for name, path in roots.items()]
    else:
        items = [(name, os.path.join(BASE, rel)) for name, rel in roots.items()]
    print(f"{'app':<12} {'files':>5} {'hex':>5} {'ovrFiles':>8} {'css':>4} {'inline':>6} {'withStyle':>9}  top hex files")
    total = 0
    for name, root in items:
        files, hex_by_file, ovr, css, inline, ws = scan(root)
        hex_total = sum(hex_by_file.values())
        total += hex_total
        top = ", ".join(f"{f}:{n}" for f, n in sorted(hex_by_file.items(), key=lambda kv: -kv[1])[:3])
        print(f"{name:<12} {len(files):>5} {hex_total:>5} {ovr:>8} {css:>4} {inline:>6} {ws:>9}  {top}")
    print(f"{'TOTAL':<12} {'':>5} {total:>5}")

if __name__ == "__main__":
    main()
