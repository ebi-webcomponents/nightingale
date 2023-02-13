import React, { useEffect, useState } from "react";
import ProtvistaDatatable from "protvista-datatable";
import ProtvistaTrack from "protvista-track";
import ProtvistaManager from "protvista-manager";
import ProtvistaNavigation from "protvista-navigation";
import { transformData } from "protvista-feature-adapter";
import { load } from "data-loader";
import loadWebComponent from "../utils/load-web-component";
import readmeContent from "../../../packages/protvista-datatable/README.md";
import Readme from "./Readme";
import { Fragment } from "react";

const ProtvistaDatatableWrapper = () => {
  const [data, setData] = useState();

  loadWebComponent("protvista-datatable", ProtvistaDatatable);
  loadWebComponent("protvista-manager", ProtvistaManager);
  loadWebComponent("protvista-track", ProtvistaTrack);
  loadWebComponent("protvista-navigation", ProtvistaNavigation);

  useEffect(() => {
    async function fetchData() {
      const loadedData = await load(
        "https://www.ebi.ac.uk/proteins/api/features/P05067?categories=MOLECULE_PROCESSING"
      );
      const transformedData = transformData(loadedData?.payload);
      setData(transformedData);
    }
    fetchData();
  }, []);

  return (
    <>
      <Readme content={readmeContent} />
      <h2>Track with data-loader</h2>
      <protvista-manager attributes="length displaystart displayend variantfilters highlight selectedid">
        <protvista-datatable displaystart="0" displayend="600">
          <table>
            <thead>
              <tr>
                <th data-filter="ft_key">Feature key</th>
                <th>Description</th>
                <th>Positions</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((row, i) => (
                <Fragment key={i}>
                  <tr
                    data-id={`${row.start}-${row.end}`}
                    data-start={row.start}
                    data-end={row.end}
                  >
                    <td data-filter="ft_key" data-filter-value={row.type}>
                      {row.type}
                    </td>
                    <td>{row.description}</td>
                    <td>
                      {row.start}-{row.end}
                    </td>
                  </tr>
                  <tr data-group-for={`${row.start}-${row.end}`}>
                    <td>Something hidden</td>
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </protvista-datatable>
      </protvista-manager>
    </>
  );
};

export default ProtvistaDatatableWrapper;
