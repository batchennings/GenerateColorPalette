interface rgbChannels {
    r: number;
    g: number;
    b: number;
}

declare function generatePalette(color: string): Object[];
declare function checkContrast(color1: rgbChannels, color2: rgbChannels): number;

export { checkContrast, generatePalette as default };
