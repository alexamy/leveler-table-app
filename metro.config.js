const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const config = getDefaultConfig(__dirname);

// git worktrees sit under .claude/, and their package.json collides with the
// one at the root under the same haste name. Anchored to this project root, so
// metro started inside a worktree blocks nothing.
const worktrees = path.join(__dirname, '.claude', 'worktrees');
config.resolver.blockList = exclusionList([
  new RegExp(`^${escape(worktrees)}/.*`),
]);

function escape(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = config;
