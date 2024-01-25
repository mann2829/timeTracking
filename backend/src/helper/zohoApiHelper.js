const axios = require('axios');
const FormData = require('form-data');
const moment = require('moment');

let access_token = null;

const checkTokenExpiry = () => {
    // Check if the token needs refreshing (e.g., within the last 5 minutes of expiration)
    const expiryThreshold = 5 * 60; // 5 minutes in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Assume tokenExpiresIn is the expiration time of the current access token
    const tokenExpiresIn = 3600; // Example: 1 hour in seconds

    if (tokenExpiresIn - currentTimestamp <= expiryThreshold) {
        return true;
    }

    return false;
};

const refreshToken = async () => {
    try {
        if (checkTokenExpiry()) {
            let data = new FormData();

            data.append('client_id', process.env.ZOHO_CLIENT_ID);
            data.append('client_secret', process.env.ZOHO_CLIENT_SECRET);
            data.append('refresh_token', process.env.ZOHO_REFRESH_TOKEN);
            data.append('grant_type', 'refresh_token');

            let config = {
                method: 'post',
                url: `${process.env.ZOHO_ACCOUNTS_URL}/oauth/v2/token`,
                headers: {
                    ...data.getHeaders()
                },
                data: data
            };

            await axios.request(config)
                .then((response) => {
                    access_token = response?.data?.access_token;
                })
                .catch((error) => {
                    console.log(error);
                });

            return access_token;
        }
    } catch (error) {
        console.log(error);
    }
}

const getEmployeeRecords = async () => {
    if (!access_token) {
        // Refresh the token if it's not available or expired
        await refreshToken();
    }

    let employeeRecords = [];

    let config = {
        method: 'get',
        url: `${process.env.ZOHO_PEOPLE_URL}/people/api/forms/employee1/records`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${access_token}`
        }
    };

    await axios.request(config)
        .then((response) => {
            employeeRecords = response?.data;
        })
        .catch((error) => {
            console.log(error);
        });

    return employeeRecords;

}

const getLeaveBookedAndBalance = async (startDate, endDateDate) => {
    if (!access_token) {
        // Refresh the token if it's not available or expired
        await refreshToken();
    }

    let formatDate = "DD-MMM-YYYY";
    let from = moment(startDate).format(formatDate);
    let to = moment(endDateDate).format(formatDate);

    let data = {};

    let config = {
        method: 'get',
        url: `${process.env.ZOHO_PEOPLE_URL}/people/api/v2/leavetracker/reports/bookedAndBalance?from=${from}&to=${to}&unit=Day`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${access_token}`
        }
    };

    await axios.request(config)
        .then((response) => {
            data = response?.data;
        })
        .catch((error) => {
            console.log(error);
        });

    return data;
}

const getHolidayList = async () => {
    if (!access_token) {
        // Refresh the token if it's not available or expired
        await refreshToken();
    }

    const userId = process.env.USER_ID
    let data = {};

    let config = {
        method: 'get',
        url: `${process.env.ZOHO_PEOPLE_URL}/people/api/leave/getHolidays?userId=${userId}`,
        headers: {
            'Authorization': `Zoho-oauthtoken ${access_token}`
        }
    };

    await axios.request(config)
        .then((response) => {
            data = response?.data?.response?.result;
        })
        .catch((error) => {
            console.log(error);
        });

    return data;
}

module.exports = {
    refreshToken,
    getEmployeeRecords,
    getLeaveBookedAndBalance,
    getHolidayList
};