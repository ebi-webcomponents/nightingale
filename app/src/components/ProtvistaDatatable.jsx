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

// const columnConfig = {
//   consequence: {
//     label: "Evidences",
//     child: true,
//     resolver: (d) => {
//     },
//   },
//   ftId: {
//     label: "Feature ID",
//     child: true,
//     resolver: (d) => d.ftId,
//   },
// };
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

  // console.log(data);

  return (
    <>
      <Readme content={readmeContent} />
      <h2>Track with data-loader</h2>
      <protvista-manager attributes="length displaystart displayend variantfilters highlight selectedid">
        {/* <protvista-navigation length="770" />
        <protvista-track
          id="my-protvista-track"
          length="770"
          layout="non-overlapping"
        ></protvista-track> */}
        <protvista-datatable>
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
                <tr
                  key={i}
                  data-start={row.start}
                  data-end={row.end}
                  data-id={`${row.start}-${row.end}`}
                >
                  <td data-filter="ft_key">{row.type}</td>
                  <td>{row.description}</td>
                  <td>
                    {row.start}-{row.end}
                  </td>
                  {/* <td data-collapsed>{row.type}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </protvista-datatable>
      </protvista-manager>
    </>
  );
};

export default ProtvistaDatatableWrapper;
