import {
    select,
    selectAll,
    mouse
} from "d3-selection";
import {
    scaleBand,
    scaleLinear
} from "d3-scale";
import _union from "lodash-es/union";
import _intersection from "lodash-es/intersection";
import {
    load,
    getFilters
} from "./apiLoader";
import {
    addStringItem,
    traverseTree,
    getPath
} from "./treeMenu";
import "../styles/main.css";

let filters = [];
let nodes;

function render({
    el = required("el"),
    accession = "P05067"
}) {
    el.style.display = "block";
    el.style.minHeight = "6em";

    // clear all previous vis
    select(el)
        .select(".interaction-title")
        .remove();
    select(el)
        .select("svg")
        .remove();
    select(el)
        .select(".interaction-tooltip")
        .remove();

    // show spinner until data is loaded
    select(el)
        .append("div")
        .attr("class", "loader");

    load(accession).then(data => {
        draw(el, accession, data);
    });
}

function formatDiseaseInfo(data, acc) {
    if (data) {
        let formatedString = "";
        for (var disease of data) {
            if (disease.dbReference) {
                //Some have only text
                formatedString += `<p><a href="//www.uniprot.org/uniprot/${acc}#${
          disease.acronym
        }" target="_blank">${disease.diseaseId}</a></p>`;
            }
        }
        return formatedString;
    } else {
        return "N/A";
    }
}

function formatSubcellularLocationInfo(data) {
    if (data) {
        let formatedString = '<ul class="tree-list">';
        let tree = [];
        for (var interactionType of data) {
            if (!interactionType.locations) {
                continue;
            }
            for (var location of interactionType.locations) {
                addStringItem(location.location.value, tree);
                // formatedString += `<p>${location.location.value}</p>`;
            }
        }
        traverseTree(
            tree,
            d =>
            (formatedString += `<li style="margin-left:${d.depth}em">${
          d.name
        }</li>`)
        );
        return `${formatedString}</ul>`;
    } else {
        return "N/A";
    }
}

function draw(el, accession, data) {
    select(el)
        .select(".loader")
        .remove();

    nodes = data;

    var tooltip = select(el)
        .append("div")
        .attr("class", "interaction-tooltip")
        .style("display", "none")
        .style("opacity", 0);
    tooltip
        .append("span")
        .attr("class", "close-interaction-tooltip")
        .text("Close ✖")
        .on("click", closeTooltip);
    tooltip.append("div").attr("class", "tooltip-content");

    select(el)
        .append("p")
        .attr("class", "interaction-title")
        .text(
            `${accession} has binary interactions with ${nodes.length - 1} proteins`
        );

    createFilter(el, getFilters());

    const margin = {
            top: 100,
            right: 0,
            bottom: 10,
            left: 100
        },
        width = 18 * nodes.length;

    const height = width;

    const x = scaleBand().rangeRound([0, width]),
        intensity = scaleLinear().range([0.2, 1]);

    const svg = select(el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "interaction-viewer")
        .append("g")
        .attr("class", "interaction-viewer-group")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(nodes.map(entry => entry.accession));
    intensity.domain([0, 10]);

    // x.domain(nodes.map(entry => entry.accession)); intensity.domain([0,
    // d3.max(nodes.map(link => link.experiments))]);

    const row = svg
        .selectAll(".interaction-row")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "interaction-row")
        .attr("transform", d => `translate(0,${x(d.accession)})`)
        .each(processRow);

    row
        .append("rect")
        .attr("x", -margin.left)
        .attr("width", margin.left)
        .attr("height", x.bandwidth())
        .attr("class", "text-highlight");

    // left axis text
    row
        .append("text")
        .attr("y", x.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text((d, i) => {
            return nodes[i].name;
        })
        .attr(
            "class",
            (d, i) => (nodes[i].accession === accession ? "main-accession" : "")
        );

    const column = svg
        .selectAll(".column")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "column")
        .attr("transform", d => `translate(${x(d.accession)}, 0)rotate(-90)`);

    column
        .append("rect")
        .attr("x", 6)
        .attr("width", margin.top)
        .attr("height", x.bandwidth())
        .attr("class", "text-highlight");

    // top axis text
    column
        .append("text")
        .attr("x", 6)
        .attr("y", x.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "start")
        .text((d, i) => nodes[i].name)
        .attr(
            "class",
            (d, i) => (nodes[i].accession === accession ? "main-accession" : "")
        );

    var points = `${x(nodes[1].accession)} 0,${x(
    nodes[nodes.length - 1].accession
  )} 0,${x(nodes[nodes.length - 1].accession)} ${x(
    nodes[nodes.length - 1].accession
  )},${x(nodes[0].accession)} 0`;

    svg
        .append("polyline")
        .attr("points", points)
        .attr("class", "hidden-side")
        .attr("transform", d => `translate(${x(nodes[1].accession)}, 0)`);

    function processRow(row) {
        if (!row.interactions) {
            return;
        }

        var cell = select(this)
            .selectAll(".cell")
            .data(row.interactions);

        var circle = cell.enter().append("circle");

        circle
            .attr("class", "cell")
            .attr("cx", d => {
                return x(d.id) + x.bandwidth() / 2;
            })
            .attr("cy", d => x.bandwidth() / 2)
            .attr("r", x.bandwidth() / 3)
            .style("fill-opacity", d => intensity(d.experiments))
            .style("display", d => {
                //Only show left half of graph
                return x(row.accession) < x(d.id) ? "none" : "";
            })
            .on("click", mouseclick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        cell.exit().remove();
    }

    function mouseover(p) {
        select(this).classed("active-cell", true);
        selectAll(".interaction-row").classed("active", d => d.accession === p.id);
        // selectAll(".column").classed("active", d => d.accession === p.id);

        selectAll(".interaction-viewer-group")
            .append("line")
            .attr("class", "active-row")
            .attr("style", "opacity:0")
            .attr("x1", 0)
            .attr("y1", x(p.source) + x.bandwidth() / 2)
            .attr("x2", x(p.id))
            .attr("y2", x(p.source) + x.bandwidth() / 2);

        selectAll(".interaction-viewer-group")
            .append("line")
            .attr("class", "active-row")
            .attr("style", "opacity:0")
            .attr("x1", x(p.id) + x.bandwidth() / 2)
            .attr("y1", 0)
            .attr("x2", x(p.id) + x.bandwidth() / 2)
            .attr("y2", x(p.source));
    }

    function mouseclick(p) {
        populateTooltip(selectAll(".tooltip-content"), p);
        tooltip
            .style("opacity", 0.9)
            .style("display", "inline")
            .style("left", mouse(el)[0] + 10 + "px")
            .style("top", mouse(el)[1] - 15 + "px");
    }

    function populateTooltip(element, data) {
        element.html("");

        let source = nodes.find(d => d.accession === data.source);
        let target = nodes.find(d => d.accession === data.id);

        element.append("h3").text("Interaction");
        element
            .append("p")
            .append("a")
            .attr("href", getIntactLink(data.interactor1, data.interactor2))
            .attr("target", "_blank")
            .text(`Confirmed by ${data.experiments} experiment(s)`);

        var table = element
            .append("table")
            .attr("class", "interaction-viewer-table");
        var headerRow = table.append("tr");
        headerRow.append("th");
        headerRow.append("th").text("Interactor 1");
        headerRow.append("th").text("Interactor 2");

        var nameRow = table.append("tr");
        nameRow
            .append("td")
            .text("Name")
            .attr("class", "interaction-viewer-table_row-header");
        nameRow.append("td").text(`${source.name}`);
        nameRow.append("td").text(`${target.name}`);

        var uniprotRow = table.append("tr");
        uniprotRow
            .append("td")
            .text("UniProtKB")
            .attr("class", "interaction-viewer-table_row-header");
        uniprotRow
            .append("td")
            .append("a")
            .attr("href", `//uniprot.org/uniprot/${source.accession}`)
            .text(`${source.accession}`);
        uniprotRow
            .append("td")
            .append("a")
            .attr("href", `//uniprot.org/uniprot/${target.accession}`)
            .text(`${target.accession}`);

        var diseaseRow = table.append("tr");
        diseaseRow
            .append("td")
            .text("Pathology")
            .attr("class", "interaction-viewer-table_row-header");
        diseaseRow
            .append("td")
            .html(formatDiseaseInfo(source.diseases, source.accession));
        diseaseRow
            .append("td")
            .html(formatDiseaseInfo(target.diseases, target.accession));

        var subcellRow = table.append("tr");
        subcellRow
            .append("td")
            .text("Subcellular location")
            .attr("class", "interaction-viewer-table_row-header");
        subcellRow
            .append("td")
            .html(formatSubcellularLocationInfo(source.subcellularLocations));
        subcellRow
            .append("td")
            .html(formatSubcellularLocationInfo(target.subcellularLocations));

        var intactRow = table.append("tr");
        intactRow
            .append("td")
            .text("IntAct")
            .attr("class", "interaction-viewer-table_row-header");
        intactRow
            .append("td")
            .attr("colspan", 2)
            .append("a")
            .attr("href", getIntactLink(data.interactor1, data.interactor2))
            .attr("target", "_blank")
            .text(`${data.interactor1};${data.interactor2}`);
    }

    function getIntactLink(interactor1, interactor2) {
        return `//www.ebi.ac.uk/intact/query/id:${interactor1} AND id:${interactor2}`;
    }

    function mouseout() {
        selectAll("g").classed("active", false);
        selectAll("circle").classed("active-cell", false);
        selectAll(".active-row").remove();
    }

    function closeTooltip() {
        selectAll(".interaction-tooltip")
            .style("opacity", 0)
            .style("display", "none");
    }
}

function getNodeByAccession(accession) {
    return nodes.find(node => node.accession === accession);
}

// Check if either the source or the target contain one of the specified
// filters. returns true if no filters selected
function hasFilterMatch(source, target, filters) {
    if (filters.length <= 0) {
        return true;
    }
    const interactionFilters = _union(source.filterTerms, target.filterTerms);
    return (
        _intersection(interactionFilters, filters.map(item => item["name"]))
        .length === filters.length
    );
}

// Hide nodes and labels which don't belong to a visible filter
function filterData() {
    let activeFilters = filters.filter(d => d.selected);

    let visibleAccessions = [];
    selectAll(".cell").attr("opacity", d => {
        const source = getNodeByAccession(d.source);
        const target = getNodeByAccession(d.id);
        const visible = hasFilterMatch(source, target, activeFilters);
        if (visible) {
            visibleAccessions.push(source.accession);
            visibleAccessions.push(target.accession);
        }
        return visible ? 1 : 0.1;
    });
    selectAll(".interaction-viewer text").attr("fill-opacity", d => {
        return visibleAccessions.includes(d.accession) ? 1 : 0.1;
    });
}

function updateFilterSelection() {
    for (let filter of filters) {
        let item = select(`#${getNameAsHTMLId(filter.name)}`);
        item.classed("active", filter.selected);
    }
    filterData();
}

function getNameAsHTMLId(name) {
    return name.toLowerCase().replace(/\s|,|^\d/g, "_");
}

function removeFilter(d) {
    d.selected = false;
    updateFilterSelection();
}

function ellipsis(text) {
    const n = 25;
    return text.length > n ? text.substr(0, n - 1) + "..." : text;
}

function clickFilter(d, filterName) {
    selectAll(".dropdown-pane").style("visibility", "hidden");
    filters.filter(d => d.type === filterName).forEach(d => (d.selected = false));
    d.selected = !d.selected;
    select(`[data-toggle=iv_${filterName}]`).text(ellipsis(d.name));
    updateFilterSelection();
}

function resetFilter(filterName, filterLabel) {
    selectAll(".dropdown-pane").style("visibility", "hidden");
    filters.filter(d => d.type === filterName).forEach(d => (d.selected = false));
    select(`[data-toggle=iv_${filterName}]`).text(filterLabel);
    updateFilterSelection();
}

function resetAllFilters() {
    filters.filter(d => d.selected).forEach(d => (d.selected = false));
    getFilters().forEach(d => {
        select(`[data-toggle=iv_${d.name}]`).text(d.label);
    });
    updateFilterSelection();
}

function toggleFilterVisibility() {
    let id = `#${select(this).attr("data-toggle")}`;
    let visibility = select(id).style("visibility");
    select(".dropdown-pane").style("visibility", "hidden");
    select(id).style(
        "visibility",
        visibility === "hidden" ? "visible" : "hidden"
    );
}

// Add a filter to the interface
function createFilter(el, filtersToAdd) {
    select(el)
        .selectAll(".interaction-filter-container")
        .remove();
    const container = select(el)
        .append("div")
        .attr("class", "interaction-filter-container");

    // container.append("div").text('Show only interactions where one or both
    // interactors have:');
    for (let filter of filtersToAdd) {
        if (filter.items.length > 0) {
            var filterContainer = container
                .append("div")
                .attr("class", "interaction-filter");
            filterContainer
                .append("a")
                .text(filter.label)
                .attr("class", "button dropdown")
                .attr("data-toggle", `iv_${filter.name}`)
                .on("click", toggleFilterVisibility);

            var ul = filterContainer
                .append("ul")
                .attr("id", `iv_${filter.name}`)
                .attr("class", "dropdown-pane");

            ul.append("li")
                .text("None")
                .on("click", () => resetFilter(filter.name, filter.label));
            if (filter.type === "tree") {
                traverseTree(filter.items, function (d) {
                    d.type = filter.name;
                    filters.push(d);
                    ul.datum(d)
                        .append("li")
                        .style("padding-left", d.depth + "em")
                        .attr("id", d => getNameAsHTMLId(d.name))
                        .text(d => d.name)
                        .on("click", d => clickFilter(d, filter.name));
                });
            } else {
                for (let d of filter.items) {
                    d.type = filter.name;
                    filters.push(d);
                }

                ul.selectAll("li")
                    .data(filter.items)
                    .enter()
                    .append("li")
                    .attr("id", d => getNameAsHTMLId(d.name))
                    .text(d => d.name.toLowerCase())
                    .on("click", d => {
                        clickFilter(d, filter.name);
                    });
            }
        }
    }
    container
        .append("button")
        .attr("class", "iv_reset")
        .text("Reset filters")
        .on("click", d => {
            resetAllFilters();
            return false;
        });
}

function required(name) {
    throw Error(`missing option: ${name}`);
}

export {
    render
};