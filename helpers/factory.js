module.exports.createElement = function (ElementModel) {
    return async function (req, res) {
        try {
            let input = req.body;
            if (input) {
                let element = await ElementModel.create(input);
                res.status(200).json({
                    element
                })
            } else {
                res.status(500).json({
                    message: "Please enter data"
                })
            }
        } catch (err) {
            res.status(500).json({
                error: err.message,
                "message": "error in creation"
            })
        }
    }
}
module.exports.getElement = function (ElementModel) {
    return async function (req, res) {
        try {
            //example : localhost:8080/api/plan?select=price%name&page=1&sort=price&myquery={price:{$gt:200}}
            // console.log(req)
            //sort
            //filter
            //pagination
            //custom query

            let queryPromise;

            //query
            if (req.query.myquery) {
                const query = JSON.parse(req.query.myquery);
                queryPromise = ElementModel.find(query);
            } else {
                queryPromise = ElementModel.find();
            }
            
            //sort
            if (req.query.sort) {
                const sortField = req.query.sort;
                queryPromise = queryPromise.sort(`-${sortField}`);
            }

            //filter
            if (req.query.select) {
                const params = req.query.select.split("%").join(" ")
                queryPromise = queryPromise.select(`${params}-_id`);
            }

            //pagination .. skip and limit 
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 3;
            const toSkip = (page - 1) * limit
            const paginatedResultPromise = await queryPromise
                .skip(toSkip)
                .limit(limit);
            let result = await paginatedResultPromise;

            res.status(200).json({
                "message": "List of all the plans ",
                "Element": result
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                error: err.message,
                full_err: err,
                "message": "can't get elements"
            })
        }
    }
}
module.exports.updateElement = function (ElementModel) {
    return async function (req, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.findById(id);
            if (element) {
                delete req.body.id
                for (let key in req.body) {
                    element[key] = req.body[key];
                }
                await element.save();
                res.status(200).json(element);
            } else {
                res.status(404).json({
                    message: "resource not found"
                })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }
    }
}
module.exports.deleteElement = function (ElementModel) {
    return async function (req, res) {
        let { id } = req.body;
        try {
            let element = await ElementModel.finByIdAndDelete(id, req.body);
            // let element = await ElementModel.findOne({ _id: id });
            if (!element) {
                res.status(404).json({
                    message: "resource not found"
                })
            } else {
                res.status(200).json(element);
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });

        }
    }
}
module.exports.getElementById = function (ElementModel) {
    return async function (req, res) {
        try {
            let id = req.params.id;
            let element = await ElementModel.getElementById(id);

            res.status(200).json({
                element: element
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Server error"
            });
        }

    }
}