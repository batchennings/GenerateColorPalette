import controlColorInput from "../src/utils/controlColorInput";
import {describe, expect, test}  from "@jest/globals"

test('Non hexa value return false', () => {
    expect(controlColorInput("ffcc0")).toBeFalsy
    expect(controlColorInput("blue")).toBeFalsy

})

test('hexa value return true', () => {
    expect(controlColorInput("#FFCC00")).toBeTruthy
    expect(controlColorInput("#ffcc00")).toBeTruthy

})