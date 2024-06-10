import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import { vol } from 'memfs';
import tmp from 'tmp';
import { mirrorSync } from '../src/main.js';

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
