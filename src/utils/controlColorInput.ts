export default function controlColorInput(value: string) {
    return Boolean(value.match(/^#[0-9a-f]+$/i))
    // return true;
}
