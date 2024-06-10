import fs from 'node:fs';
import path from 'node:path';
import type { Volume } from 'memfs/lib/volume.js';
import { ufs } from 'unionfs';
import type { IFS } from 'unionfs';

type FileSystem = IFS | Volume;

export async function mirror(
    source: fs.PathLike,
    destination: fs.PathLike,
    fileSystem: FileSystem,
): Promise<void> {
    ufs.use(fs).use(fileSystem as IFS);

    // TODO: async API times out here - figure out why
    const directoryContents = ufs.readdirSync(source, {
        encoding: 'utf8',
        recursive: true,
    });

    for await (const item of directoryContents) {
        // Ignore this and parent directories
        if (/^\.\.?$/.test(item)) continue;

        // Get the absolute path to the item
        const itemPath = path.join(source.toString(), item);

        // Ignore directories - they'll be handled during the file writing
        const itemStat = await new Promise<fs.Stats>((resolve, reject) =>
            ufs.stat(itemPath, (err, stat) =>
                err ? reject(err) : resolve(stat),
            ),
        );

        if (!itemStat.isFile()) continue;

        // Get the file contents
        const contents = await new Promise<string>((resolve, reject) =>
            ufs.readFile(
                itemPath,
                {
                    encoding: 'utf8',
                },
                (err, data) => (err ? reject(err) : resolve(data)),
            ),
        );

        // Write the contents to disk
        const destinationFilePath = path.join(destination.toString(), item);
        const destinationDirPath = path.dirname(destinationFilePath);

        if (!ufs.existsSync(destinationDirPath)) {
            await new Promise<void>((resolve, reject) =>
                ufs.mkdir(destinationDirPath, (err) =>
                    err ? reject(err) : resolve(),
                ),
            );
        }

        await new Promise<void>((resolve, reject) =>
            ufs.writeFile(destinationFilePath, contents, (err) =>
                err ? reject(err) : resolve(),
            ),
        );
    }
}

export function mirrorSync(
    source: fs.PathLike,
    destination: fs.PathLike,
    fileSystem: FileSystem,
): void {
    ufs.use(fs).use(fileSystem as IFS);
    const directoryContents = ufs.readdirSync(source, {
        encoding: 'utf8',
        recursive: true,
    });

    for (const item of directoryContents) {
        // Ignore this and parent directories
        if (/^\.\.?$/.test(item)) continue;

        // Get the absolute path to the item
        const itemPath = path.join(source.toString(), item);

        // Ignore directories - they'll be handled during the file writing
        const itemStat = ufs.statSync(itemPath);
        if (!itemStat.isFile()) continue;

        // Get the file contents
        const contents = ufs.readFileSync(itemPath, { encoding: 'utf8' });

        // Write the contents to disk
        const destinationFilePath = path.join(destination.toString(), item);
        const destinationDirPath = path.dirname(destinationFilePath);

        if (!ufs.existsSync(destinationDirPath)) {
            ufs.mkdirSync(destinationDirPath);
        }
        ufs.writeFileSync(destinationFilePath, contents);
    }
}
