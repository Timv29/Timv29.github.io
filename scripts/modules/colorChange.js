export const adjustColor = (hexColor, magnitude) => {
    hexColor = hexColor.replace('#', '');

    if (hexColor.length === 6) {
        let r = parseInt(hexColor.slice(0, 2), 16);
        let g = parseInt(hexColor.slice(2, 4), 16);
        let b = parseInt(hexColor.slice(4, 6), 16);
        
        r = Math.max(0, Math.min(255, r + magnitude));
        g = Math.max(0, Math.min(255, g + magnitude));
        b = Math.max(0, Math.min(255, b + magnitude));
        const newColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

        return newColor;
    } else {
        return hexColor;
    }
};