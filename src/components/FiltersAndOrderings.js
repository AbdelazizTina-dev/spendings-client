import React from "react";

import {
  FiltersWrapper,
  Orderings,
  CurrencyFilters,
  CurrencyButton,
} from "../styles/ComponentStyles";

export default function CurrencyFilter({ setSortType, setCurrencyFilter }) {
  function sortChangeHandler(e) {
    setSortType(e.target.value);
  }

  return (
    <>
      <FiltersWrapper>
        <Orderings>
          <select onChange={sortChangeHandler}>
            <option value="-date">Sort by Date descending (default)</option>
            <option value="date">Sort by Date ascending</option>
            <option value="-amount_in_huf">Sort by Amount descending</option>
            <option value="amount_in_huf">Sort by Amount ascending</option>
          </select>
        </Orderings>
        <CurrencyFilters>
          <li>
            <CurrencyButton onClick={() => setCurrencyFilter("None")} name="">ALL</CurrencyButton>
          </li>
          <li>
            <CurrencyButton onClick={() => setCurrencyFilter("HUF")} name="HUF">HUF</CurrencyButton>
          </li>
          <li>
            <CurrencyButton onClick={() => setCurrencyFilter("USD")} name="USD">USD</CurrencyButton>
          </li>
        </CurrencyFilters>
      </FiltersWrapper>
    </>
  );
}
