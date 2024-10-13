// @ts-expect-error blah blah blah
export const fetcher = (...args) => fetch(...args).then(res => res.json())