
class AdminView{
    sendSuccessResponse(res, message, data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message, data }));
    }

    sendErrorResponse(res, statusCode, error) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error }));
    }
}

module.exports =AdminView;