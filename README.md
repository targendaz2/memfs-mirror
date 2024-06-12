# memfs-mirror

![GitHub License](https://img.shields.io/github/license/targendaz2/memfs-mirror)
![GitHub package.json version](https://img.shields.io/github/package-json/v/targendaz2/memfs-mirror)
![NPM Version](https://img.shields.io/npm/v/memfs-mirror?logo=npm&logoColor=%23999999)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/targendaz2/memfs-mirror/test.yml?logo=github&label=tests&logoColor=%23999999)

This package copies an in-memory file system created using [memfs](https://npmjs.com/package/memfs) or [unionfs](https://npmjs.com/package/unionfs) to a local file system.

## Installation

This package is available on the npm registry as `memfs-mirror`.

```bash
npm install memfs-mirror
```

## Usage

### Examples

```typescript
import { vol } from 'memfs';
import { mirror } from 'memfs-mirror';

vol.fromJSON(
  {
    './file1.txt': 'Hello, world!',
    './sub-folder/file2.txt': 'Hello, sub-folder!',
  },
  '/memfs-volume',
);

// Asynchronous usage
await mirror('/memfs-volume', '/tmp/local-folder', vol);

// Synchronous usage
mirrorSync('/memfs-volume', '/tmp/local-folder', vol);
```

### Notes

- Any missing directories in the destination path will be automatically created.
- The destination path will _not_ be automatically removed.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This package is licensed under the [Apache 2.0 License](https://github.com/targendaz2/memfs-mirror/blob/main/LICENSE).
