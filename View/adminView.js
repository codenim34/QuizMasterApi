// adminView.js

class AdminView{
    sendSuccessResponse(res, message, data) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message, data }));
    }

    sendLogInSuccessResponse(res,message,data){
        const token = "jun7h7y77b6b6t";
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `access_token=${token}`
        });
        res.end(JSON.stringify({ message, data }));
    }

    sendErrorResponse(res, statusCode, error) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error }));
    }
}

module.exports =AdminView;