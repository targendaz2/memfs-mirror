import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { vol } from 'memfs';
import tmp from 'tmp';
import { mirror, mirrorSync } from '../src/main.js';

describe('asynchronous mirroring tests', () => {
    test('can mirror flat file system', async () => {
        vol.fromJSON(
            {
                './file.txt': 'Hello, world!',
            },
            '/memfs-mirror-test',
        );

        const tmpDir = tmp.dirSync();

        await mirror('/memfs-mirror-test', tmpDir.name, vol);
        const contents = fs.readFileSync(path.join(tmpDir.name, 'file.txt'), {
            encoding: 'utf8',
        });
        expect(contents).toBe('Hello, world!');
    });
});

describe('synchronous mirroring tests', () => {
    test('can mirror flat file system', () => {
        vol.fromJSON(
            {
                './file.txt': 'Hello, world!',
            },
            '/memfs-mirror-test',
        );

        const tmpDir = tmp.dirSync();

        mirrorSync('/memfs-mirror-test', tmpDir.name, vol);
        const contents = fs.readFileSync(path.join(tmpDir.name, 'file.txt'), {
            encoding: 'utf8',
        });
        expect(contents).toBe('Hello, world!');
    });
});
