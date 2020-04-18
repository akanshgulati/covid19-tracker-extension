import React, {useEffect, useRef, useState} from 'react';
import Chart from 'chart.js';
function shorten(n, d) {
    if (n < 1000) {
        return n + '';
    }
    if (n > 1e7) {
        return "10M+"
    }
    var x = ('' + n).length;
    var p = Math.pow;
    d = p(10, d);
    x -= x % 3;
    return Math.round(n * d / p(10, x)) / d + " KMBTPE"[x / 3];
}
function customToolTip(tooltipModel) {
    console.log("Custom", tooltipModel);
    // Tooltip Element
    const tooltipEl = document.getElementById('tooltip');

    // Hide if no tooltip
    console.log(this);
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
       this._chart.canvas.style.cursor = 'default';
        return;
    }
    
    // add cursor
    this._chart.canvas.style.cursor = 'pointer';

    // Set caret Position
    tooltipEl.classList.remove('above', 'below', 'no-transform');
    if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
    } else {
        tooltipEl.classList.add('no-transform');
    }

    function getBody(bodyItem) {
        console.log(bodyItem);
        return bodyItem.lines;
    }

    // Set Text
    if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map(getBody);

        let innerHtml = '<thead class="tooltip-head">';

        titleLines.forEach(function (title) {
            innerHtml += '<tr><th>' + title + '</th></tr>';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function (body, i) {
            const colors = tooltipModel.labelColors[i];
            const style = 'background:' + colors.backgroundColor;
            const span = `<div class="tooltip-legend" style="${style}"></div>`;
            const bodyEl = `<div class="tooltip-text bolder">${Number(body).toLocaleString()}</div>`;
            innerHtml += `<tr><td class="align-middle flex">${span}${bodyEl}</td></tr>`;
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var position = this._chart.canvas.getBoundingClientRect();

    // Display, position, and set styles for font
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left =
        position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top =
        position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
    tooltipEl.style.padding =
        tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
    tooltipEl.style.pointerEvents = 'none';
}

function formatLegends(dataset) {
    return dataset.map((item) => {
        return {
            label: item.label,
            color: item.borderColor,
            hidden: item._meta[0] && item._meta[0].hidden
        };
    });
}

function Charting(props) {
    console.log(props.data);
    const canvas = useRef();
    const [chartDataset, setChartDataset] = useState();
    const [chartInstance, setChartInstance] = useState(null);
    const [legends, setLegends] = useState();

    const legendClickHandler = (e, index, ci) => {
        const legendItem = ci.legend.legendItems[index];
        Chart.defaults.global.legend.onClick.call(ci, e, legendItem);
        // setChartInstance(Object.assign({}, ci));
        setLegends(formatLegends(ci.data.datasets));
    };

    useEffect(() => {
        var ctx = canvas.current.getContext('2d');
        // console.log(Chart.defaults);
        Chart.defaults.fontFamily = 'Lato';
        
        Chart.defaults.global.elements.point = Object.assign(Chart.defaults.global.elements.point, {
            radius: 2,
            hoverRadius: 4
        });
        // console.log("Entered");
        const chartInstance = new Chart(ctx, {
            type: 'line',
            data: props.data,
            options: {
                lineTension: 0.8,
                responsive: true,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: false,
                                autoSkipPadding: 10,
                                callback(value, index, values) {
                                    return shorten(value, 1);
                                }
                            },
                            gridLines: {
                                borderDash: [5, 5],
                            },
                        },
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                            },
                            ticks: {
                                autoSkipPadding: 30,
                                maxRotation: 0
                            }
                        },
                    ],
                },
                hover: {
                    mode: 'nearest',
                    intersect: false,
                    axis: 'x',
                    animationDuration: '100'
                },
                tooltips: {
                    enabled: false,
                    mode: 'x',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    bodySpacing: 5,
                    position: 'nearest',
                    titleFontColor: '#CCCCCC',
                    titleFontStyle: 'bold',
                    bodyFontSize: 11,
                    xPadding: 10,
                    cornerRadius: 2,
                    boxHeight: 3,
                    boxWidth: 10,
                    custom: customToolTip,
                    callbacks: {
                        label(tooltipItem, data) {
                            console.log('tooltip item', tooltipItem);
                            return tooltipItem.value;
                        },
                    },
                },
                legend: {
                    display: false,
                },
                legendCallback: function (chart) {
                    console.log('data', chart.data);
                    setChartDataset(chart.data.datasets);
                    setChartInstance(chart);
                    setLegends(formatLegends(chart.data.datasets));
                },
            },
        });
        chartInstance.generateLegend();
        console.log(chartInstance);
        return () => {
            chartInstance.destroy();
        }
    }, []);
    
    const mounted = useRef();

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
        } else {
            chartInstance.data = props.data;
            chartInstance.update();
            
            setLegends(formatLegends(chartInstance.data.datasets));
        }
    }, [props.data]);

    return (
        <div className='chart'>
            <canvas ref={canvas} id='myChart' width='400' height='300'/>
            {chartDataset ? (
                <div className='legend-cntr'>
                    <ul className='legends flex justify-center mar-0'>
                        {legends.map((legend, index) => {
                            // console.log('dataItem', dataItem);
                            const style = {};
                            style.opacity = legend.hidden ? '0.7' : '1';

                            return (
                                <div
                                    className='legend flex align-middle cursor'
                                    style={style}
                                    key={index}
                                    onClick={(e) =>
                                        legendClickHandler(
                                            e,
                                            index,
                                            chartInstance
                                        )
                                    }>
                                    <div
                                        className='legend-color'
                                        style={{
                                            backgroundColor: legend.color,
                                        }}
                                    />
                                    <span className='legend-text'>
                                        {legend.label}
                                    </span>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                ''
            )}
            <div id='tooltip'>
                <table></table>
            </div>
        </div>
    );
}

export default Charting;