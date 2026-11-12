#!/usr/bin/env bash
set -euo pipefail
# Login shells (including T3's SSH launcher) reset the Docker image's PATH.
# This file belongs only to this development container, never the host machine.
printf '%s\n' 'export PATH="/opt/vibecda/tools/bin:$PATH"' \
  | sudo -n tee /etc/profile.d/vibecda-tools.sh > /dev/null
