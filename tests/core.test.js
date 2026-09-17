import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCommand } from '../src/commands/registry.js';

test('parses prefixed command', () => { const result = parseCommand('/ping now'); assert.equal(result.name, 'ping'); assert.deepEqual(result.args, ['now']); });
test('ignores non-command text', () => { assert.equal(parseCommand('hello'), null); });
