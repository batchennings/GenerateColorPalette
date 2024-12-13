import scale from "../src/utils/scale"
import {describe, expect, test}  from "@jest/globals"

test('scale from a 0-10 range to a 100-200 range', () => {
    expect(scale({number: 5, inMin:0, inMax:10, outMin:100, outMax: 200})).toBe(150)
})