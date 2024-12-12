export default function hsl2hex(h:number, s:number, l:number) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    // Having obtained RGB, convert channels to hex
    let hexr = Math.round((r + m) * 255).toString(16) as string;
    let hexg = Math.round((g + m) * 255).toString(16) as string;
    let hexb = Math.round((b + m) * 255).toString(16) as string;

    // Prepend 0s, if necessary
    if (hexr.length == 1)
        hexr = "0" + hexr;
    if (hexg.length == 1)
        hexg = "0" + hexg;
    if (hexb.length == 1)
        hexb = "0" + hexb;

    return "#" + hexr + hexg + hexb;
}