const database = require('../../config/database');

const getReportData = (parameter, callback) => {

    let query = `SELECT`;

    parameter.type === 'user' ? query += ` u.id AS ID,` : query += ` p.id AS ID,`;

    query += ` CONCAT(u.firstname, ' ', u.lastname) AS name,
                        IFNULL(p.name, '') AS project_name,
                        IFNULL(FORMAT(SUM(te.hours), 2), 0) AS hours,
                        IFNULL(FORMAT(((SUM(te.hours) * 100) / te2.hours), 2), 0) AS percentage,
                        p.id AS project_id,
                        u.id AS user_id,
                        DATE_FORMAT(te.spent_on,'%Y-%m-%d') AS date`;

    query += ` FROM users AS u`;

    query += ` LEFT JOIN time_entries AS te ON te.user_id = u.id AND spent_on BETWEEN '${parameter.startDate}' AND '${parameter.endDate}'`;

    query += ` LEFT JOIN projects AS p ON p.id = te.project_id`;

    if (parameter.type === 'user') {
        query += ` LEFT JOIN(SELECT user_id, SUM(hours) AS hours FROM time_entries WHERE spent_on BETWEEN '${parameter.startDate}' AND '${parameter.endDate}' GROUP BY user_id) AS te2 ON u.id = te2.user_id`;
    } else {
        query += ` LEFT JOIN (SELECT project_id, SUM(hours) AS hours FROM time_entries WHERE spent_on BETWEEN '${parameter.startDate}' AND '${parameter.endDate}' GROUP BY project_id) AS te2 ON p.id = te2.project_id `
    }

    query += ` WHERE u.status = 1 AND u.type = 'User'`;

    parameter.type === 'user' ? query += ` AND CONCAT(u.firstname, ' ', u.lastname) LIKE '%${parameter.search}%'` : query += ` AND p.name LIKE '%${parameter.search}%'`;

    query += ` GROUP BY user_id, project_id`;

    parameter.type === 'user' ? query += ` ORDER BY percentage ${parameter.orderBy}` : query += ` ORDER BY project_name ${parameter.orderBy}`;

    // if (!isNaN(parameter.startIndex) && !isNaN(parameter.endIndex))
    //     query += ` LIMIT  ${parameter.startIndex}, ${parameter.endIndex}`;

    database.query(query, [], (error, results) => {
        if (error) {
            console.error("Error executing query: ", error);
            callback(error, null);
        } else {
            callback(null, results);
        }
    });
};

module.exports = { getReportData };