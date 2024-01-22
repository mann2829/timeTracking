// src/components/CollapsibleTable.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Select, MenuItem, InputLabel } from "@mui/material";
import {
  fetchData,
  setStartDate,
  setEndDate,
  setOrderBy,
  setTypeBy,
} from "../redux/tableSlice";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import SkeletonLoader from "./SkeletonLoader";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const CollapsibleTable = () => {
  // const dateFormat = "YYYY/MM/DD";
  const dateFormat = "DD/MM/YYYY";

  const dispatch = useDispatch();
  const data = useSelector((state) => state.table.data);
  const status = useSelector((state) => state.table.status);
  const error = useSelector((state) => state.table.error);
  const startDate = useSelector((state) => state.table.startDate);
  const endDate = useSelector((state) => state.table.endDate);
  const orderBy = useSelector((state) => state.table.orderBy);
  const typeBy = useSelector((state) => state.table.setTypeBy);
  const currentPage = useSelector((state) => state.table.currentPage);
  const totalPages = useSelector((state) => state.table.totalPages);
  const countFiltered = useSelector((state) => state.table.countFiltered);

  const [currentStartDate, setCurrentStartDate] = useState(
    moment().startOf("month").format(dateFormat)
  );
  const [currentEndDate, setCurrentEndDate] = useState(
    moment().endOf("month").format(dateFormat)
  );

  const [sortByField, setSortField] = useState("totalHours");
  const [sortBy, setSort] = useState("asc");
  const [type, setType] = useState("user");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(
      fetchData({
        startDate: currentStartDate,
        endDate: currentEndDate,
        orderBy: orderBy,
        typeBy: type,
        page: currentPage,
        field: sortByField,
        pageSize: pageSize,
        search: searchTerm
      })
    );
    setCurrentStartDate(currentStartDate);
    setCurrentEndDate(currentEndDate);
  }, [dispatch]);

  const handleSearch = (params = {}) => {
    params.startDate = startDate ?? currentStartDate;
    params.endDate = endDate ?? currentEndDate;
    params.orderBy = sortBy;
    params.typeBy = typeBy ?? type;
    params.page = page;
    params.field = sortByField
    params.pageSize = pageSize;
    params.search = searchTerm;
    dispatch(fetchData(params));
  };

  const handlePreviousMonth = (params = {}) => {

    setCurrentStartDate(moment()
      .subtract(1, "months")
      .startOf("month")
      .format(dateFormat));

    setCurrentEndDate(moment()
      .subtract(1, "months")
      .endOf("month")
      .format(dateFormat));

    dispatch(
      setStartDate(
        moment().subtract(1, "months").startOf("month").format(dateFormat)
      )
    );
    dispatch(
      setEndDate(
        moment().subtract(1, "months").endOf("month").format(dateFormat)
      )
    );

    params.startDate = moment()
      .subtract(1, "months")
      .startOf("month")
      .format(dateFormat);

    params.endDate = moment()
      .subtract(1, "months")
      .endOf("month")
      .format(dateFormat);

    params.orderBy = sortBy;
    params.typeBy = typeBy ?? type;
    params.page = currentPage ?? page;
    params.field = sortByField;
    params.pageSize = pageSize;
    params.search = searchTerm;
    dispatch(fetchData(params));
  };

  const handleCurrentMonth = (params = {}) => {

    setCurrentStartDate(moment().startOf("month").format(dateFormat));
    setCurrentEndDate(moment().endOf("month").format(dateFormat));

    dispatch(setStartDate(currentStartDate));
    dispatch(setEndDate(currentEndDate));

    params.startDate = moment().startOf("month").format(dateFormat);
    params.endDate = moment().endOf("month").format(dateFormat);
    params.orderBy = sortBy;
    params.typeBy = typeBy ?? type;
    params.page = currentPage ?? page;
    params.field = sortByField;
    params.pageSize = pageSize;
    params.search = searchTerm;
    dispatch(fetchData(params));
  };

  const handleSort = (field) => {
    setSortField(field);
    if (sortBy === 'asc') {
      setSort('desc');
      dispatch(
        fetchData({
          startDate: currentStartDate,
          endDate: currentEndDate,
          orderBy: 'desc',
          typeBy: type,
          page: page,
          field: field,
          pageSize: pageSize,
          search: searchTerm
        })
      );
    } else {
      setSort('asc');
      dispatch(
        fetchData({
          startDate: currentStartDate,
          endDate: currentEndDate,
          orderBy: 'asc',
          typeBy: type,
          page: page,
          field: field,
          pageSize: pageSize,
          search: searchTerm
        })
      );
    }
  };

  const handleType = (e) => {
    setType(e);
    dispatch(setTypeBy(e));
    setSearchTerm("");
    dispatch(
      fetchData({
        startDate: currentStartDate,
        endDate: currentEndDate,
        orderBy: sortBy,
        typeBy: e,
        page: page,
        field: sortByField,
        pageSize: pageSize,
        search: ""
      })
    );
  };

  const handleDateChange = (event, picker) => {
    console.log("picker.startDate.format(dateFormat)", picker.startDate.format(dateFormat))
    console.log("picker.startDate.format(dateFormat)", picker.endDate.format(dateFormat))

    setCurrentStartDate(picker.startDate.format(dateFormat));
    setCurrentEndDate(picker.endDate.format(dateFormat));

    dispatch(
      setStartDate(
        picker.startDate.format(dateFormat)
      )
    );
    dispatch(
      setEndDate(
        picker.endDate.format(dateFormat)
      )
    );
  };

  const handlePageChange = (newPage) => {
    // setPage(newPage);
    setOrderBy(sortBy);
    dispatch(fetchData({
      startDate: currentStartDate,
      endDate: currentEndDate,
      orderBy: sortBy,
      typeBy: typeBy ?? type,
      page: newPage,
      field: sortByField,
      pageSize: pageSize,
      search: searchTerm
    }));
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    dispatch(fetchData({
      startDate: currentStartDate,
      endDate: currentEndDate,
      orderBy: sortBy,
      typeBy: typeBy ?? type,
      page: page,
      field: sortByField,
      pageSize: event.target.value,
      search: searchTerm
    }));
  };

  const handleSearchItem = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // Perform search when the search term is at least 3 characters
    if (newSearchTerm.length >= 3) {
      dispatch(fetchData({
        startDate: currentStartDate,
        endDate: currentEndDate,
        orderBy: sortBy,
        typeBy: typeBy ?? type,
        page: page,
        field: sortByField,
        pageSize: pageSize,
        search: newSearchTerm
      }));
    } else {
      dispatch(fetchData({
        startDate: currentStartDate,
        endDate: currentEndDate,
        orderBy: sortBy,
        typeBy: typeBy ?? type,
        page: page,
        field: sortByField,
        pageSize: pageSize,
        search: ""
      }));
    }
  };

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <div className="date-range-container table-container">
        <div className="date-items date-change-month">
          <div>
            <Button
              className="btn-default btn-primary"
              onClick={handlePreviousMonth}
            >
              Previous Month
            </Button>
          </div>
          <div>
            <Button
              className="btn-default btn-primary"
              onClick={handleCurrentMonth}
            >
              Current Month
            </Button>
          </div>
        </div>
        <div className="date-items date-range-content">
          <div className="form-group">
            <DateRangePicker
              startDate={currentStartDate}
              endDate={currentEndDate}
              onApply={handleDateChange}
            >
              <input
                type="text"
                value={currentStartDate + " - " + currentEndDate}
                className="form-control"
              />
            </DateRangePicker>
          </div>
          <div className="search-btn">
            <Button
              variant="contained"
              onClick={handleSearch}
              className="btn-default btn-primary"
            >
              Serach
            </Button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="filter-table">
          <div className="form-group">
            <InputLabel>Group By:</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={type}
              onChange={(e) => handleType(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="project">Project</MenuItem>
            </Select>
          </div>
          <div className="form-group col-right">
            <div>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchItem} className="form-control" />
            </div>
           <div>
           <InputLabel id="demo-simple-select-label">Show entries:</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
           </div>
          </div>
        </div>
        {status === 'succeeded' ?
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  <div>
                    {sortBy === 'asc' && sortByField === 'name' ? '▼ ' : '▲ '}{type === "user" ? `Employee Name` : `Project Name`}
                  </div>
                </th>
                <th className="sortable" onClick={() => handleSort('totalHours')}>{sortBy === 'asc' && sortByField === 'totalHours' ? '▼ ' : '▲ '}Total Hours</th>
                {
                  type === "user" && <th className="sortable" onClick={() => handleSort('missingHours')}><div> {sortBy === 'asc' && sortByField === 'missingHours' ? '▼ ' : '▲ '}Missing Hours</div></th>
                }
                <th><div>{type === "user" ? `Project Name` : `Employee Name`}</div></th>
                <th><div>Hours</div></th>
                <th><div>Percentage</div></th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.ID}>
                  <td>{row.name}</td>
                  <td>{row.totalHours}</td>
                  {
                    type === "user" && <td style={{ color: "red" }}>{row.missingWorkingHours}</td>
                  }
                  <td>
                    <div className="inner-table-content">
                      {row.array.map((x) => {
                        return (
                          <div key={x.id}>
                            <p>{x.name !== "" ? x.name : "-"}</p>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="inner-table-content">
                      {row.array.map((x) => {
                        return (
                          <div key={x.id}>
                            <p>{x.hours}</p>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="inner-table-content">
                      {row.array.map((x) => {
                        return (
                          <div key={x.id}>
                            <p>{x.percentage}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> :
          <SkeletonLoader height={"43px"} width={1049} count={11} />
        }
        <div className="pagination">
          <div>
            <span className="countFiltered">{`${countFiltered}`}</span>
          </div>
          <div className="pagination-content">
            <button className="btn-default" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <KeyboardArrowLeftIcon />
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button className="btn-default" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <KeyboardArrowRightIcon />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CollapsibleTable;
