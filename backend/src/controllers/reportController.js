const express = require('express');
const router = express.Router();
const responseHelper = require('../helper/responseHelper');
const commanHelper = require('../helper/commanHelper');
const { getReportData } = require('../models/reportModel');
const moment = require('moment');

/**
 * @swagger
 * /report:
 *   get:
 *     summary: Get report with filters
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *         description: Filter report by startDate
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *         description: Filter report by endDate
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: Filter report by orderBy
 *       - in: query
 *         name: typeBy
 *         schema:
 *           type: string
 *         description: Filter report by typeBy
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter report by search
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: Filter report by field
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Filter report by page
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *         description: Filter report by pageSize
 *     responses:
 *       '200':
 *         description: A list of filtered report
 */
router.get('/report', (req, res) => {
    try {
        const startDate = req.query.startDate ? moment(req.query.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : "";
        const endDate = req.query.endDate ? moment(req.query.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : "";

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;

        let orderBy = req.query.orderBy || 'asc';

        let type = req.query.typeBy || 'user';

        let field = req.query.field || 'totalHours';

        let search = req.query.search?.trim() || '';

        if (page < 1 || pageSize < 1) {
            responseHelper.sendError(res, 400, 'Invalid page or pageSize ');
        }

        // Validate the input dates
        if (!startDate || !endDate) {
            responseHelper.sendError(res, 400, 'Start date and end date are required.');
        }

        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        const params = { startDate, endDate, orderBy, type, startIndex, endIndex, page, pageSize, search };

        // const totalWorkingDaysExcludeWeekends = commanHelper.excludeWeekends(startDate, endDate);
        const totalWorkingDaysExcludeWeekends = commanHelper.excludeWeekends(startDate, moment().format('MMMM') === moment(endDate).format('MMMM') ? moment().format('YYYY-MM-DD') : endDate);

        getReportData(params, (err, arr) => {
            if (err) {
                responseHelper.sendError(res, 500, err.message);
            }
            else {
                let data = [];
                let hours = 0;
                let results = arr;

                results.map((item) => {
                    hours = parseInt(item.hours);
                    var object = data.find((u) => u.ID === item.ID);

                    if (!!object) {
                        object.totalHours += hours;
                        object.missingWorkingHours = totalWorkingDaysExcludeWeekends.totalWorkingHours - object.totalHours,
                            object.array.push({
                                id: type === 'user' ? item.project_id : item.user_id,
                                name: type === 'user' ? item.project_name : item.name,
                                hours,
                                percentage: item.percentage,
                            });
                    } else {
                        object = {
                            ID: item.ID,
                            name: type === 'user' ? item.name : item.project_name,
                            totalHours: hours,
                            missingWorkingHours: totalWorkingDaysExcludeWeekends.totalWorkingHours - hours,
                            array: [
                                {
                                    id: type === 'user' ? item.project_id : item.user_id,
                                    name: type === 'user' ? item.project_name : item.name,
                                    hours,
                                    percentage: item.percentage,
                                },
                            ],
                        };
                    }

                    data.push(object);
                });

                data = commanHelper.removeDuplicates(data, "ID");

                data = commanHelper.removeBlankData(data);

                if (orderBy === 'asc') {
                    if (field === 'totalHours')
                        data = data.slice().sort((a, b) => a.totalHours - b.totalHours);

                    if (field === 'missingHours')
                        data = data.slice().sort((a, b) => a.missingWorkingHours - b.missingWorkingHours);

                    if (field === 'name')
                        data = data.slice().sort((a, b) => a.name - b.name);
                }

                if (orderBy === 'desc') {
                    if (field === 'totalHours')
                        data = data.slice().sort((a, b) => b.totalHours - a.totalHours);

                    if (field === 'missingHours')
                        data = data.slice().sort((a, b) => b.missingWorkingHours - a.missingWorkingHours);

                    if (field === 'name')
                        data = data.slice().sort((a, b) => b.name - a.name);
                }

                //put all 0 totalHours records at last 
                data = data.sort((a, b) => (a.totalHours === 0 ? 1 : b.totalHours === 0 ? -1 : 0));

                const paginatedData = data.slice(startIndex, endIndex);
                const totalPages = Math.ceil(data.length / pageSize);

                const endShowingIndex = Math.min(startIndex + pageSize - 1, data.length - 1);

                responseHelper.sendSuccess(res, {
                    count: data.length,
                    message: "Data retrived successfully.",
                    data: paginatedData,
                    currentPage: page,
                    totalPages: totalPages,
                    countFiltered: `Showing ${startIndex + 1} to ${endShowingIndex + 1} of ${data.length} entries`
                });
            }
        });
    } catch (error) {
        // Handle errors and respond with an error message
        responseHelper.sendError(res, 500, error.message);
    }
});

module.exports = router;