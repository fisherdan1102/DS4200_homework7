var globalData = [];
d3.csv("/ExampleData.csv", function(data) {
    globalData.push(data);
});

function sort(compareObject,display) {
    var table = document.getElementById("recordsTable"),
    tbody = table.getElementsByTagName("tbody")[0];
    
    if(display)
        tbody.innerHTML = "";

    let tempArray = globalData.slice();

    if(compareObject == "Date"){
        tempArray.sort(compareDate);
    } else if(compareObject == "Amount"){
        tempArray.sort(compareAmount);
    } else if(compareObject == "Name"){
        tempArray.sort(compareName);
    }



    if(display==true){
        for (var i=0;i<tempArray.length;i++) {
            var row = document.createElement("tr");
            row.id = tempArray[i].ID
            var cell1 = document.createElement("td");
            var cell2 = document.createElement("td");
            var cell3 = document.createElement("td");
            cell1.innerHTML = tempArray[i].Customer
            cell2.innerHTML = tempArray[i].PurchaseDate
            cell3.innerHTML = tempArray[i].PurchaseAmount
            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);
            tbody.appendChild(row);  
        }
    } else {
        return tempArray;
    }
}

function highlightHighest(compareObject){
    let id = sort(compareObject,false)[0].ID;
    possibleCurrentHighlight = document.getElementsByClassName("highlighter")[0]
    if(possibleCurrentHighlight != undefined)
        possibleCurrentHighlight.classList.remove("highlighter")

    document.getElementById(id).classList.add("highlighter")
}

function dropLowest(compareObject){
    let id = sort(compareObject,false)[globalData.length-1].ID;
    var idColumn = globalData.map(function(value,index) { return value.ID; });
    globalData.splice(idColumn.indexOf(id),1)
    document.getElementById(id).remove();
}


function compareDate(a, b){
    var aDate = new Date(a.PurchaseDate)
    var bDate = new Date(b.PurchaseDate)

    if (aDate < bDate) {
        return -1;
    } else if (aDate > bDate) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function compareAmount(a,b){
    var aAmount = parseFloat(a.PurchaseAmount.replace("$", ""))
    var bAmount = parseFloat(b.PurchaseAmount.replace("$", "")) 
    if (aAmount < bAmount) {
        return -1;
    } else if (aAmount > bAmount) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function compareName(a,b){
    if (a.Customer < b.Customer) {
        return -1;
    } else if (a.Customer > b.Customer) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function inClassExampleOfStaticAddD3VisToPage(){

    // Set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Append the SVG object
    const svg = d3.select("#in_class_walkthrough_viz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    d3.csv("TennisData.csv").then(function(data) {

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(d => d.Surface))
            .padding(0.2);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        
        // Y axis
        const y = d3.scaleLinear()
            .domain([0, 2.5])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y)
                .tickValues([0, 1, 2])
                .tickFormat(d3.format(".1f")));

        // X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + margin.top + 20)
            .text("Court Surface");

        // Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -height/2)
            .text("Number of Tournaments");

        // Bars
        const bars = svg.selectAll("mybar")
            .data(data)
            .join("rect")
                .attr("x", d => x(d.Surface))
                .attr("y", d => y(parseFloat(d.Count)))
                .attr("width", x.bandwidth())
                .attr("height", d => height - y(parseFloat(d.Count)))
                .attr("fill", "#69b3a2");

    });
}
