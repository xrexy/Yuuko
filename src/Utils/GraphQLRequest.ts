import axios from "axios";

export function GraphQLRequest(query, vars: Object, token?: string, url: string = process.env.ANILIST_API || "https://graphql.anilist.co") {
    if (token?.length > 1000) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return new Promise((resolve: any, reject) => {
        axios.post(url, {
            query,
            variables: vars
        }).then(res => {
            resolve(res.data.data, res.headers);
        }).catch(err => {
            reject("GraphQL Request Rejected\n\n" + err?.response?.data?.errors.map(e => `> ${e.message}\n`) || err);
        });
    });
}