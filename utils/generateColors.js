export function generateColors(num = 10){
    const colors = []
    for (let i = 0; i < num; i++) {
        const color = "#" + Math.floor(Math.random() * 16777215).toString(16)
        colors.push(color)
    }
    return colors
}