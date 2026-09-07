const ErrorHandler = (err, req, res, next) => {
    console.error('Internal Server Error', err.message);
    res.status(500).json({
        error: 'Something went wrong'

    });

};

module.exports = ErrorHandler;