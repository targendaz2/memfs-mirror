import { expect, test } from '@jest/globals';
import { mirror } from '../src/main.js';

test('can compile JXA code', async () => {
    const result = mirror('', '');
    expect(result).toBeDefined();
});
