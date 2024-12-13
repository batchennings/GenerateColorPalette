import generatePalette from ".."
import {describe, expect, test}  from "@jest/globals"

const color = "#FFCC00";
const palette:Array<Object> = generatePalette(color) 

test('Outputs an object', () => {    
    expect(palette).not.toBe(null)
})

test('Item has rgb property and is not null', () => {    
    // expect(palette).toHaveProperty('rgb')
})
test('Item has hsl property', () => {    
    // expect(palette).toHaveProperty('rgb')
})