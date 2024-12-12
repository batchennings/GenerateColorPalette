interface scaleInput{
    number: number;
    inMin: number;
    inMax: number;
    outMin: number;
    outMax: number;
}
export default function scale(args:scaleInput) {
    return (args.number - args.inMin) * (args.outMax - args.outMin) / (args.inMax - args.inMin) + args.outMin;
}