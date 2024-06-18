import path from 'node:path';
import { describe, expect, test } from '@jest/globals';
import 'jest-extended-fs';
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
        const filePath = path.join(tmpDir.name, 'file.txt');
        expect(filePath).toBeAFileContaining('Hello, world!');
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

        const filePath1 = path.join(tmpDir.name, 'file1.txt');
        expect(filePath1).toBeAFileContaining('Hello, world!');

        const filePath2 = path.join(tmpDir.name, 'sub', 'file2.txt');
        expect(filePath2).toBeAFileContaining('Hello, sub-file!');
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
        const filePath = path.join(tmpDir.name, 'file.txt');
        expect(filePath).toBeAFileContaining('Hello, world!');
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

        const filePath1 = path.join(tmpDir.name, 'file1.txt');
        expect(filePath1).toBeAFileContaining('Hello, world!');

        const filePath2 = path.join(tmpDir.name, 'sub', 'file2.txt');
        expect(filePath2).toBeAFileContaining('Hello, sub-file!');
    });
});
