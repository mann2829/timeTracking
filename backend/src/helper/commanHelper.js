const moment = require('moment');
const { getHolidayList } = require('./zohoApiHelper');

function removeDuplicates(arr, prop) {
    return arr.filter(
        (obj, index, self) =>
            self.findIndex((o) => o[prop] === obj[prop]) === index
    );
}

function removeBlankData(array) {
    return array.filter(value => value.name !== "" && value.name !== null && value.name !== undefined);
};

function removeMatchingRecords(arr1, arr2) {
    const filteredArr1 = arr1.filter(item1 => {
        return !arr2.some(item2 => item2.fromDate === item1) && !arr2.some(item2 => item2.toDate === item1);
    });

    return filteredArr1;
}

function filterObjectByKeys(originalObject, keysToKeep) {
    return Object.keys(originalObject)
        .filter(key => keysToKeep.includes(key))
        .reduce((filteredObject, key) => {
            filteredObject[key] = originalObject[key];
            return filteredObject;
        }, {});
}

async function excludeWeekends(startDate, endDate) {
    const result = [];
    const currentDate = moment(startDate);


    const holidayList = await getHolidayList();

    const matchingRecords = holidayList.filter(record => {
        const recordStartDate = moment(record.fromDate);
        const recordEndDate = moment(record.toDate);

        return (
            (recordStartDate.isSameOrBefore(endDate) && recordEndDate.isSameOrAfter(startDate)) ||
            (recordStartDate.isSameOrAfter(startDate) && recordStartDate.isSameOrBefore(endDate))
        );
    });

    while (currentDate.isSameOrBefore(endDate, 'day')) {
        const dayOfWeek = currentDate.day();
        // 0 is Sunday, 6 is Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            result.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate.add(1, 'day');
    }

    let finalResult = removeMatchingRecords(result, matchingRecords);

    return {
        result: finalResult,
        totalWorkingHours: finalResult.length * process.env.DAILY_WROKING_HOURS
    }
}

module.exports = {
    removeDuplicates,
    removeBlankData,
    excludeWeekends,
    removeMatchingRecords,
    filterObjectByKeys
};