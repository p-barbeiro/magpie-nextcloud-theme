#!/bin/sh
# Patches the Files app bundle (two substitutions, each must match exactly once):
#  1. virtual list row height from localStorage ("nc-compact" = "1" -> 28px, else 44px),
#     so compact rows scroll correctly
#  2. selection bar shows every batch action inline on wide windows (was 3 + a "..." menu)
# Idempotent. Run again after every Nextcloud update (it replaces dist/).
# Usage: patch-files-main.sh /var/www/html/dist/files-main.js
set -eu
f=${1:?path to dist/files-main.js}

patch() { # patch <original> <replacement>
	if grep -qF -- "$2" "$f"; then echo "already patched: $2"; return; fi
	[ "$(grep -oF -- "$1" "$f" | wc -l)" -eq 1 ] || { echo "ERROR: expected exactly one match for '$1' in $f (Nextcloud changed?)" >&2; exit 1; }
	cp -n "$f" "$f.orig"
	python3 - "$f" "$1" "$2" <<'PY'
import sys
p, a, b = sys.argv[1:]
s = open(p).read()
open(p, "w").write(s.replace(a, b, 1))
PY
	grep -qF -- "$2" "$f" && echo "patched: $2"
}

patch 'itemHeight(){return this.gridMode?246:44}' \
      'itemHeight(){return this.gridMode?246:"1"===localStorage.getItem("nc-compact")?28:44}'
patch 'a.value?0:n.value?1:3)' \
      'a.value?0:n.value?1:99)'
