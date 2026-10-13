#!/bin/bash
set -euo pipefail
bash "$(dirname "$0")/prepare-ruby-tool.sh" "${1:?Pass the pipeline Ruby tools directory}" cocoapods 1.15.2 pod
