/**
 * Returns the footer string.
 * @param {any} Optional HTTP headers to get the ratelimit values.
 * @returns {Object} The footer object.
 */
module.exports = (headers?: any) => {
    const footerString = headers
        ? `Yuuko Beta (${headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}`
        : `Yuuko Beta | ${new Date().getHours() + ':' + new Date().getMinutes()}`
    return { text: footerString }
}