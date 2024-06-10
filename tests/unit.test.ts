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

    test('can mirror nested file system', async () => {
        vol.fromJSON(
            {
                './file1.txt': 'Hello, world!',
                './sub/file2.txt': 'Hello, sub-file!',
            },
            '/memfs-mirror-test',
        );

        const tmpDir = tmp.dirSync();

        await mirror('/memfs-mirror-test', tmpDir.name, vol);

        const contents1 = fs.readFileSync(path.join(tmpDir.name, 'file1.txt'), {
            encoding: 'utf8',
        });
        expect(contents1).toBe('Hello, world!');

        const contents2 = fs.readFileSync(
            path.join(tmpDir.name, 'sub', 'file2.txt'),
            {
                encoding: 'utf8',
            },
        );
        expect(contents2).toBe('Hello, sub-file!');
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

    test('can mirror nested file system', () => {
        vol.fromJSON(
            {
                './file1.txt': 'Hello, world!',
                './sub/file2.txt': 'Hello, sub-file!',
            },
            '/memfs-mirror-test',
        );

        const tmpDir = tmp.dirSync();

        mirrorSync('/memfs-mirror-test', tmpDir.name, vol);

        const contents1 = fs.readFileSync(path.join(tmpDir.name, 'file1.txt'), {
            encoding: 'utf8',
        });
        expect(contents1).toBe('Hello, world!');

        const contents2 = fs.readFileSync(
            path.join(tmpDir.name, 'sub', 'file2.txt'),
            {
                encoding: 'utf8',
            },
        );
        expect(contents2).toBe('Hello, sub-file!');
    });
});
