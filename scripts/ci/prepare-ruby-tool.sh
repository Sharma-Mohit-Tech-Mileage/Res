#!/bin/bash
set -euo pipefail

# Use one Ruby interpreter and a separate gem directory for each Ruby ABI.
# Inherited agent GEM_HOME/GEM_PATH may belong to an older Ruby installation.
TOOLS_ROOT="${1:?Pass the pipeline Ruby tools directory}"
TOOL_NAME="${2:?Pass the gem name}"
TOOL_VERSION="${3:?Pass the gem version}"
TOOL_EXECUTABLE="${4:?Pass the gem executable}"
unset RUBYOPT RUBYLIB
RUBY_BIN="$(ruby -rrbconfig -e 'print RbConfig.ruby')"
RUBY_ABI="$("$RUBY_BIN" -rrbconfig -e 'print RbConfig::CONFIG["ruby_version"]')"
RUBY_GEMS="$TOOLS_ROOT/$RUBY_ABI"
export GEM_HOME="$RUBY_GEMS"
export GEM_PATH="$RUBY_GEMS:$("$RUBY_BIN" -rrubygems -e 'print Gem.default_dir')"
export PATH="$(dirname "$RUBY_BIN"):$GEM_HOME/bin:$PATH"
unset RUBYOPT RUBYLIB
mkdir -p "$GEM_HOME"

export FASTLANE_SKIP_UPDATE_CHECK=1
export FASTLANE_HIDE_CHANGELOG=1
"$RUBY_BIN" -v
if ! "$RUBY_BIN" -rrubygems -e 'gem ARGV[0], ARGV[1]' "$TOOL_NAME" "$TOOL_VERSION" 2>/dev/null || [ ! -f "$GEM_HOME/bin/$TOOL_EXECUTABLE" ]; then
  "$RUBY_BIN" -S gem install --install-dir "$GEM_HOME" --no-document "$TOOL_NAME" --version "$TOOL_VERSION"
fi
# Invoke the launcher with the selected interpreter, not its stored shebang.
"$RUBY_BIN" "$GEM_HOME/bin/$TOOL_EXECUTABLE" --version
echo "##vso[task.setvariable variable=GEM_HOME]$GEM_HOME"
echo "##vso[task.setvariable variable=GEM_PATH]$GEM_PATH"
echo "##vso[task.prependpath]$GEM_HOME/bin"
echo "##vso[task.prependpath]$(dirname "$RUBY_BIN")"
