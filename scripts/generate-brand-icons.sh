#!/usr/bin/env bash
# Regenerate toolbar/store PNGs from logo-dark.webp
set -euo pipefail
cd "$(dirname "$0")/../assets/brand"

for size in 16 24 32 48 128; do
  ffmpeg -y -i logo-dark.webp -vf "scale=${size}:${size}" -frames:v 1 "icon-${size}.png"
done
echo "Brand icons updated."
