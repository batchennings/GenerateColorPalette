import { log } from "console";
import { rgbChannels } from "../interfaces/rgbChannels";

const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(channels: rgbChannels) {
    let a:number[] = [] 
    Object.entries(channels).forEach(([key, value], index) => {
        value /= 255;
        a[index] = value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

export default function contrast(rgb1: rgbChannels, rgb2: rgbChannels) {
    var lum1 = luminance(rgb1);
    var lum2 = luminance(rgb2);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}
