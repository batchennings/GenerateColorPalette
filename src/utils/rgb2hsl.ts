interface rgbArgs{
    r:number;
    g:number;
    b:number;
}
export default function rgb2hsl(args:rgbArgs) {
    // Make r, g, and b fractions of 1
    args.r /= 255;
    args.g /= 255;
    args.b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(args.r, args.g, args.b),
        cmax = Math.max(args.r, args.g, args.b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta === 0)
        h = 0;
    // Red is max
    else if (cmax === args.r)
        h = ((args.g - args.b) / delta) % 6;
    // Green is max
    else if (cmax === args.g)
        h = (args.b - args.r) / delta + 2;
    // Blue is max
    else
        h = (args.r - args.g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {
        h: h,
        s: s,
        l: l
    }
}