/**
 * Available font families for Bible verse display.
 * Web fonts are loaded in browser-source.html via Google Fonts.
 */
const BIBLE_FONT_FAMILIES = {
    theme:   { stack: '', labelKey: 'fontTheme' },
    segoe:   { stack: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", labelKey: 'fontSegoe' },
    arial:   { stack: "Arial, Helvetica, sans-serif", labelKey: 'fontArial' },
    verdana: { stack: "Verdana, Geneva, sans-serif", labelKey: 'fontVerdana' },
    tahoma:  { stack: "Tahoma, Geneva, sans-serif", labelKey: 'fontTahoma' },
    trebuchet: { stack: "'Trebuchet MS', Helvetica, sans-serif", labelKey: 'fontTrebuchet' },
    georgia: { stack: "Georgia, 'Times New Roman', serif", labelKey: 'fontGeorgia' },
    times:   { stack: "'Times New Roman', Times, serif", labelKey: 'fontTimes' },
    opensans: { stack: "'Open Sans', sans-serif", labelKey: 'fontOpenSans' },
    roboto:  { stack: "'Roboto', sans-serif", labelKey: 'fontRoboto' },
    lato:    { stack: "'Lato', sans-serif", labelKey: 'fontLato' },
    montserrat: { stack: "'Montserrat', sans-serif", labelKey: 'fontMontserrat' },
    sourcesans: { stack: "'Source Sans 3', sans-serif", labelKey: 'fontSourceSans' },
    oswald:  { stack: "'Oswald', sans-serif", labelKey: 'fontOswald' },
    merriweather: { stack: "'Merriweather', Georgia, serif", labelKey: 'fontMerriweather' },
    playfair: { stack: "'Playfair Display', Georgia, serif", labelKey: 'fontPlayfair' },
    cormorant: { stack: "'Cormorant Garamond', Georgia, serif", labelKey: 'fontCormorant' },
    courier: { stack: "'Courier New', Courier, monospace", labelKey: 'fontCourier' }
};

function getBibleFontStack(fontKey) {
    const entry = BIBLE_FONT_FAMILIES[fontKey];
    return entry ? entry.stack : '';
}
