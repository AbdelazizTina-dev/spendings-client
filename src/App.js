import React, { useState } from 'react';
import Form from './components/Form';
import FiltersAndOrderings from './components/FiltersAndOrderings';
import SpendingList from './components/SpendingList';
import Layout from './components/Layout';

export default function App() {
  const [spendings, setSpendings] = useState([]);
  const [sortType, setSortType] = useState("-date")
  return (
    <>
      <Layout>
        <Form setSpendings={setSpendings}/>
        <FiltersAndOrderings setSortType={setSortType}/>
        <SpendingList
          spendings={spendings}
          setSpendings={setSpendings}
          sortType={sortType}
        />
      </Layout>
    </>
  );
}
