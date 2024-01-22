const responseStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

function sendSuccess(res, data) {
  res.status(responseStatus.OK).json({
    count: data.count,
    status: 'success',
    message: data.message,
    data: data.data,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    countFiltered: data.countFiltered
  });
}

function sendError(res, statusCode, message) {
  res.status(statusCode).json({
    status: 'error',
    message,
  });
}

module.exports = {
  sendSuccess,
  sendError,
};