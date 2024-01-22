// src/features/tableSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk('table/fetchData', async (params) => {
    console.log("params", params)
    let filterParams = {
        startDate: params?.startDate,
        endDate: params?.endDate,
        orderBy: params?.orderBy,
        typeBy: params?.typeBy,
        page: params?.page,
        field: params?.field,
        pageSize: params?.pageSize,
        search: params?.search
    }

    // Replace this with your actual API call or data fetching logic
    const response = await fetch(
        process.env.REACT_APP_BASE_URL +
        `/report?${new URLSearchParams(filterParams)}`
    );
    const data = await response.json();
    return data;
});

const tableSlice = createSlice({
    name: 'table',
    initialState: {
        data: [],
        status: 'idle',
        error: null,
        startDate: null,
        endDate: null,
        orderBy: 'asc',
        typeBy: 'user',
        currentPage: 1,
        totalPages: 1,
        field: null,
        countFiltered: null,
        pageSize: 10,
        search: ''
    },
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        },
        setOrderBy: (state, action) => {
            state.orderBy = action.payload;
        },
        setTypeBy: (state, action) => {
            state.typeBy = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.countFiltered = action.payload.countFiltered;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setStartDate, setEndDate, setOrderBy, setTypeBy } = tableSlice.actions;

export default tableSlice.reducer;
