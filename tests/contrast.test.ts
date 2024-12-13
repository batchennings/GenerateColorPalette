import { checkContrast } from "..";
import {describe, expect, test}  from "@jest/globals"

test('Check contrast return consistent value', () => {
    expect(checkContrast({r:255, g:255, b:255}, {r:0, g:0, b:0})).toBeGreaterThan(9)
})

// const contrast = checkContrast(palette[0].rgb, palette[9].rgb);
// console.log(contrast);