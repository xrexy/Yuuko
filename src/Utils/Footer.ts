export function Footer(headers?: any): Object {
    const footerString = headers
        ? `Yuuko Beta (${headers["x-ratelimit-remaining"] + "/" + headers["x-ratelimit-limit"]}) | ${new Date().getHours() + ':' + new Date().getMinutes()}`
        : `Yuuko Beta | ${new Date().getHours() + ':' + new Date().getMinutes()}`
    return { text: footerString }
}