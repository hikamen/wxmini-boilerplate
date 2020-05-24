let Crypto = require('../libs/cryptojs/cryptojs.js').Crypto;
const moment = require('../libs/moment/we-moment');

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeRange = (startDate, endDate) => {
    let timeRange;
    if (startDate === '' && endDate === '') {
        timeRange = '不限';
    } else if (startDate === '') {
        timeRange = endDate + ' 截止';
    } else if (endDate === '') {
        timeRange = startDate + ' 开始';
    } else {
        timeRange = startDate + ' -- ' + endDate;
    }
    return timeRange;
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatDatetime(value) {
    value = trim(value);
    if (value !== '') {
        value = value.substring(0, 16);
    }
    return value;
}

function isBefore(value) {
    return moment(new Date()).isBefore(value);
}

function isAfter(value) {
    return moment(new Date()).isAfter(value);
}

function isEmail(value) {
    let emailReg = new RegExp("\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]{2,14}");
    return emailReg.test(value);
}

function isPassword(value) {
    let pwdReg = new RegExp("^[A-Za-z0-9]{6,30}$");
    return pwdReg.test(value);
}

function formatFloat(value) {
    return parseInt(Math.round(value * 10) + "") / 10;
}

function formatFloat2(value) {
    return parseInt(Math.round(value * 100) + "") / 100;
}

function trim(s) {
    if (s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    } else {
        return "";
    }
}

/**
 * 转换常用实体符号
 * @param str
 * @returns {string | *}
 */
function convertHtmlChar(str){
    // 加入常用解析
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&quot;/g, "'");
    str = str.replace(/&amp;/g, '&');

    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&#8226;/g, '•');

    return str;
}


function removeHtmlTag(value) {
    if (trim(value) !== '') {
        return value.replace(/<[^>]+>/g, '');
    }
    return '';
}

function showToast(title, success) {
    wx.showToast({
        title: title,
        icon: 'success',
        duration: 3000,
        success: success
    })
}

function showAlert(content, callback) {
    wx.showModal({
        title: '提示',
        content: content,
        showCancel: false,
        success: () => {
            if (typeof callback === 'function') {
                callback();
            }
        }
    });
}

function showConfirm(content, yesCallback, noCallback) {
    wx.showModal({
        title: '确认',
        content: content,
        success: res => {
            if (res.confirm && typeof yesCallback === 'function') {
                yesCallback();
            } else if (typeof  noCallback === 'function') {
                noCallback();
            }
        },
    });
}

function showLoading(title) {
    title = title || '加载中...';
    wx.showLoading({
        title: title,
        mask: true
    });
}

function hideLoading() {
    wx.hideLoading();
}

function redirectTo(url, success) {
    wx.redirectTo({
        url: url,
        success: success
    })
}

function navigateTo(url, success) {
    wx.navigateTo({
        url: url,
        success: success
    });
}

function aesEncrypt(word) {
    word = trim(word);
    let mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    let eb = Crypto.charenc.UTF8.stringToBytes(word);
    let kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    let vb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//IV
    let ub = Crypto.AES.encrypt(eb, kb, {iv: vb, mode: mode, asBytes: true});
    return Crypto.util.bytesToHex(Crypto.charenc.UTF8.stringToBytes(Crypto.util.bytesToBase64(ub)));
}

function aesDecrypt(word) {
    let mode = new Crypto.mode.CBC(Crypto.pad.pkcs7);
    let eb = Crypto.util.base64ToBytes(Crypto.charenc.UTF8.bytesToString(Crypto.util.hexToBytes(word)));
    let kb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//KEY
    let vb = Crypto.charenc.UTF8.stringToBytes("1234567812345678");//IV
    let ub = Crypto.AES.decrypt(eb, kb, {asBytes: true, mode: mode, iv: vb});
    return Crypto.charenc.UTF8.bytesToString(ub);
}

module.exports = {
    formatTime: formatTime,
    formatTimeRange: formatTimeRange,
    formatDatetime: formatDatetime,
    formatFloat: formatFloat,
    formatFloat2: formatFloat2,
    isBefore: isBefore,
    isAfter: isAfter,
    isEmail: isEmail,
    isPassword: isPassword,
    showToast: showToast,
    showAlert: showAlert,
    showConfirm: showConfirm,
    showLoading: showLoading,
    hideLoading: hideLoading,
    trim: trim,
    convertHtmlChar: convertHtmlChar,
    removeHtmlTag: removeHtmlTag,
    redirectTo: redirectTo,
    navigateTo: navigateTo,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt
}
