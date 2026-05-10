import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { OpenSpecData } from './index.js';
import { searchOpenSpec } from './index.js';

function createOpenSpecData(): OpenSpecData {
  return {
    project: {
      name: 'Demo Workspace',
      description: 'Demo workspace',
      path: '/workspace/demo/openspec/config.yaml',
      content: '# OpenSpec Planning Context\n\nWorkspace planning context.',
      planningContext: {
        source: {
          path: '/workspace/demo/openspec/config.yaml',
          type: 'config',
        },
        status: 'parsed',
        aiContext: 'Workspace planning context.',
        artifactRules: [],
        workflowSchema: 'spec-driven',
      },
      legacyProjectDoc: null,
      migrationState: 'config-only',
    },
    specs: [
      {
        name: 'dashboard-change-sorting',
        path: '/workspace/demo/openspec/specs/dashboard-change-sorting',
        specContent: '## Purpose\n\nSort dashboard cards by date.',
        lastModified: null,
      },
      {
        name: 'priority-check',
        path: '/workspace/demo/openspec/specs/priority-check',
        specContent: '## Purpose\n\nPriority search content should win over metadata matches.',
        lastModified: null,
      },
    ],
    changes: {
      active: [
        {
          name: 'active-search',
          path: '/workspace/demo/openspec/changes/active-search',
          isArchived: false,
          archivedDate: null,
          proposal: '## Why\n\nThis change updates navigation behavior.',
          tasks: [],
          tasksRaw: null,
          taskProgress: {
            done: 0,
            total: 0,
            percentage: 0,
          },
          design: null,
          specDeltas: [],
          lastModified: null,
          files: [],
          fileGroups: [],
        },
      ],
      archived: [],
    },
    stats: {
      totalSpecs: 2,
      activeChanges: 1,
      archivedChanges: 0,
      overallTaskProgress: {
        done: 0,
        total: 0,
        percentage: 0,
      },
    },
  };
}

test('searchOpenSpec returns a spec for metadata name matches', () => {
  const results = searchOpenSpec(createOpenSpecData(), 'dashboard-change-sorting');

  assert.deepEqual(results, [
    {
      type: 'spec',
      name: 'dashboard-change-sorting',
      path: '/workspace/demo/openspec/specs/dashboard-change-sorting',
      excerpt: 'dashboard-change-sorting',
      matchLine: 0,
      matchSource: 'name',
    },
  ]);
});

test('searchOpenSpec returns a change for metadata path matches', () => {
  const results = searchOpenSpec(createOpenSpecData(), 'openspec/changes/active-search/proposal.md');

  assert.deepEqual(results, [
    {
      type: 'change',
      name: 'active-search',
      path: '/workspace/demo/openspec/changes/active-search',
      excerpt: 'openspec/changes/active-search/proposal.md',
      matchLine: 0,
      matchSource: 'path',
    },
  ]);
});

test('searchOpenSpec prefers content excerpts and does not duplicate metadata matches', () => {
  const results = searchOpenSpec(createOpenSpecData(), 'priority');

  assert.equal(results.length, 1);
  assert.equal(results[0]?.name, 'priority-check');
  assert.equal(results[0]?.matchSource, 'content');
  assert.match(results[0]?.excerpt ?? '', /Priority search content should win/);
});
