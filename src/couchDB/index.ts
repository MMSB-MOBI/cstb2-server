const nano = require('nano')('http://admin:admin@localhost:5984');
nano.request({ db: "tree", doc: "maxi_tree" }, (err, data) => {
    try {
        console.log("get tree", data)
    } catch (e) {
        console.log("error", err);
    }
})