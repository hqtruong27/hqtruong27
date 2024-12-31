const BANDORI = {
    URL: 'https://bestdori.com/info/cards',
    FIST_POPUP: '#app > div.modal.is-active > div.modal-card > div.modal-card-foot > a > span:nth-child(2)',
    VIEW_TYPE: ".fas.fa-grip-horizontal",
    FILTER: '.fas.fa-filter',
    REMOVE_ALL_FILTER_STAR: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a.button.is-rounded.button-all.is-focused',
    FILTER_4_STAR: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a:nth-child(4) > span > img',
    FILTER_STAR: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a:nth-child({0}) > span > img',
    SHOW_MORE_CARD: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a.button.is-fullwidth > span:nth-child(2)',
    BLOCK_CARD: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div.has-text-centered > a',
    TRANSPARENT: {
        TAB: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.tab-container.m-b-l > div > ul > li:nth-child(2) > a',
        BLOCK_IMG: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.has-text-centered > div.art.is-inline-block.m-lr-s',
        IS_TAB_CLICKED: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.tab-container.m-b-l > div > ul > li.is-active',
        POPUP_IMG: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(16) > div.has-text-centered > div:nth-child({0}) > div > div.modal-card > div.modal-card-body.has-text-centered > div.image.is-inline-block',
    }
}

const LOVELIVE = {
    DIV_IMAGE: 'body > main > div.talking-character.hidden-sm.hidden-xs'
}

const DURATION = 5

const KIRARA = {
    URL_SEARCH: 'https://sif.kirara.ca/api/ds/neo-search/cards/results.json',
    DICTIONARY_URI: 'https://sif.kirara.ca/static/neo-search/dictionary.json',
    TRANSPARENT_IMG_CARD: 'https://lostone.kirara.ca/card/navi_{0}.png',
    TRANSPARENT_IMG_CARD_IDZ: 'https://lostone.kirara.ca/card/navi_{0}_t.png',
    CLEAR_IMG_CARD: 'https://lostone.kirara.ca/card/card_{0}_ct.png',
    DEFAULT_IMG_CARD: 'https://lostone.kirara.ca/card/card_{0}_st.png',
    SCT_IMG_CARD: 'https://lostone.kirara.ca/card/card_{0}_sct.png'
}
const QUOTES = {
    QUOTABLE_URL: 'https://api.quotable.io',
    ANIME_CHAN_URL: 'https://animechan.vercel.app/api',
    DUMMY_JSON_URL:'https://dummyjson.com/quotes/random'
}

module.exports = {
    BANDORI,
    LOVELIVE,
    KIRARA,
    DURATION,
    QUOTES
}