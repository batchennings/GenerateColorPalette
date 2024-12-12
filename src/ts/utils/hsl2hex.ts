interface hslArgs{
    h:number;
    s:number;
    l:number;
}

export default function hsl2hex(args:hslArgs) {
    args.s /= 100;
    args.l /= 100;

    let c = (1 - Math.abs(2 * args.l - 1)) * args.s,
        x = c * (1 - Math.abs((args.h / 60) % 2 - 1)),
        m = args.l - c / 2,
        r = 0,
        g = 0,
        b = 0;

    if (0 <= args.h && args.h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= args.h && args.h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= args.h && args.h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= args.h && args.h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= args.h && args.h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= args.h && args.h < 360) {
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