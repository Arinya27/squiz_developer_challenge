import "./App.scss";
//

import { useEffect, useReducer, useState } from "react";

const initialForm = {
  filter: {
    country: "",
    industry: "",
  },
  sorting: {
    by: "name",
    order: "a",
  },
};

// type: "filter" | "sort"
// payload: { filed: "country" | "industry" | "name" | "employee", value: "any" }

function formReducer(state, action) {
  const {
    type,
    payload: { field, value },
  } = action;
  if (type === "filter") {
    return { ...state, filter: { ...state.filter, [field]: value } };
  } else if (type === "sort") {
    return { ...state, sorting: { ...state.sorting, [field]: value } };
  }
  return state;
}

function App() {
  const [data, setData] = useState([]);
  const [form, dispatch] = useReducer(formReducer, initialForm);

  useEffect(() => {
    const url = "https://dujour.squiz.cloud/developer-challenge/data";
    fetch(url)
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const {
    filter: { country, industry },
    sorting: { by, order },
  } = form;

  const handleFilterChange = (e) => {
    const field = e.target.id;
    const value = e.target.value;
    dispatch({
      type: "filter",
      payload: {
        field,
        value,
      },
    });
  };

  const handleSortChnage = (e) => {
    const field = e.target.id;
    const value = e.target.value;
    dispatch({
      type: "sort",
      payload: {
        field,
        value,
      },
    });
  };

  const applySortAndFilter = (data) => {
    data = data.filter((info) => {
      return (
        info.country.toLowerCase().includes(country.toLowerCase()) &&
        info.industry.toLowerCase().includes(industry.toLowerCase())
      );
    });

    const sortField = by;

    data = data.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const orderFlip = {
        a: 1,
        d: -1,
      };
      if (sortField === "name") {
        return aValue.localeCompare(bValue) * orderFlip[order];
      } else if (sortField === "numberOfEmployees") {
        return (aValue - bValue) * orderFlip[order];
      } else {
        return 0;
      }
    });

    return data;
  };

  return (
    <div className="App">
      <header className="Header">
        <h1>Employee Details</h1>
      </header>
      <div className="dashboard">
        <div className="options">
          <div className="Form FilterForm">
            <header>
              <h5>Filter</h5>
            </header>
            <div className="FormItem">
              <label>Country</label>
              <input
                id="country"
                value={country}
                onChange={handleFilterChange}
              />
            </div>
            <div className="FormItem">
              <label>Industry</label>
              <input
                id="industry"
                value={industry}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="Form SortForm">
            <header>
              <h5>Sorting</h5>
            </header>
            <div className="FormItem">
              <label>By</label>
              <select id="by" value={by} onChange={handleSortChnage}>
                <option value="name">Name</option>
                <option value="numberOfEmployees">Employee Count</option>
              </select>
            </div>
            <div className="FormItem">
              <label>Order</label>
              <select id="order" value={order} onChange={handleSortChnage}>
                <option value="a">Ascending</option>
                <option value="d">Descending</option>
              </select>
            </div>
          </div>
        </div>
        <div className="records">
          {applySortAndFilter(data).map((data) => (
            <Company data={data} key={data.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Company({ data: { id, name, country, industry, numberOfEmployees } }) {
  return (
    <div className="Company">
      <div className="Info">
        <label>ID</label><strong>:</strong>
        <span>{id}</span>
      </div>
      <div className="Info">
        <label>Name</label><strong>:</strong>
        <span>{name}</span>
      </div>
      <div className="Info">
        <label>Country</label><strong>:</strong>
        <span>{country}</span>
      </div>
      <div className="Info">
        <label>Industry</label><strong>:</strong>
        <span>{industry}</span>
      </div>
      <div className="Info">
        <label>Employees</label><strong>:</strong>
        <span>{numberOfEmployees}</span>
      </div>
    </div>
  );
}

export default App;
