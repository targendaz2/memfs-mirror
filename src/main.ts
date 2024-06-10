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

    const directoryContents = await new Promise<string[] | Buffer[]>(
        (resolve, reject) =>
            ufs.readdir(source, {}, (err, data) => {
                if (err) reject(err);
                resolve(data);
            }),
    );

    return new Promise((resolve, reject) => {
        for (let item of directoryContents) {
            item = item.toString();

            // Ignore this and parent directories
            if (/^\.\.?$/.test(item)) continue;

            // Get the absolute path to the item
            const itemPath = path.join(source.toString(), item);

            // Ignore directories - they'll be handled during the file writing
            ufs.stat(itemPath, (err, itemStat) => {
                if (err) reject(err);
                if (!itemStat.isFile()) return;

                // Get the file contents
                ufs.readFile(
                    itemPath,
                    {
                        encoding: 'utf8',
                    },
                    (err, contents) => {
                        if (err) reject(err);

                        // Write the contents to disk
                        const destinationPath = path.join(
                            destination.toString(),
                            item,
                        );
                        ufs.writeFile(destinationPath, contents, (err) => {
                            if (err) reject(err);
                            resolve();
                        });
                    },
                );
            });
        }
    });
}

export function mirrorSync(
    source: fs.PathLike,
    destination: fs.PathLike,
    fileSystem: FileSystem,
): void {
    ufs.use(fs).use(fileSystem as IFS);
    const directoryContents = ufs.readdirSync(source, {
        recursive: true,
    });

    for (let item of directoryContents) {
        item = item.toString();

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
