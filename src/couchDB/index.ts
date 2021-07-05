const nano = require('nano')('http://admin:admin@localhost:5984');

function treeRequest(): Promise<string> {
    const doc = "maxi_tree";
    const db = "tree";
    return new Promise((res, rej) => {
        nano.request({ db, doc }, (err, data) => {
            if (err) { rej(err); return }
            res(data)
        })
    })
}

// (async () => {
//     try {
//         const result = await treeRequest();
//         return result       
//     } catch (e) {
//         console.log(e);
//     }
// })()

treeRequest().then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
})