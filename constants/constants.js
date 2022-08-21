const BANDORI = {
    FIST_POPUP: '#app > div.modal.is-active > div.modal-card > div.modal-card-foot > a > span:nth-child(2)',
    VIEW_TYPE: ".fas.fa-grip-horizontal",
    FILTER: '.fas.fa-filter',
    FILTER2: '#app > div:nth-child(4) > div.column.bg-white > div.p-lr-l.p-tb-l.bg-background > div:nth-child(2) > div.m-b-l > div:nth-child(3) > div.field-body > div > div > div > a.button.is-rounded.button-all.is-focused',
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


module.exports = { BANDORI, LOVELIVE }