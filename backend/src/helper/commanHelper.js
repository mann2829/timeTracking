const moment = require('moment');

function removeDuplicates(arr, prop) {
    return arr.filter(
        (obj, index, self) =>
            self.findIndex((o) => o[prop] === obj[prop]) === index
    );
}

function removeBlankData(array) {
    return array.filter(value => value.name !== "" && value.name !== null && value.name !== undefined);
};

function excludeWeekends(startDate, endDate) {
    const result = [];
    const currentDate = moment(startDate);

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        const dayOfWeek = currentDate.day();
        // 0 is Sunday, 6 is Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            result.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate.add(1, 'day');
    }

    return {
        result: result,
        totalWorkingHours: result.length * 7.5
    }
}

module.exports = {
    removeDuplicates,
    removeBlankData,
    excludeWeekends,
};