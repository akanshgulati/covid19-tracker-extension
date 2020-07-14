import React, {useEffect, useRef, useState} from 'react';
import NumberUtil from "../utils/numberUtil";
import Chart from 'chart.js';

function customToolTip(tooltipModel) {
    // Tooltip Element
    const tooltipEl = document.getElementById('tooltip');

    // Hide if no tooltip
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
            const label = `<div class="tooltip-legend-text">${body[1]}:</div>`;
            const bodyEl = `<div class="tooltip-text bolder">${Number(body[0]).toLocaleString()}</div>`;
            innerHtml += `<tr><td class="align-middle flex">${span}${label}${bodyEl}</td></tr>`;
        });
        innerHtml += '</tbody>';

        var tableRoot = tooltipEl.querySelector('table');
        tableRoot.innerHTML = innerHtml;
    }

    // `this` will be the overall tooltip
    var chartPosition = this._chart.canvas.getBoundingClientRect();
    const tooltipPosition = tooltipEl.getBoundingClientRect();
    let positionLeft = tooltipModel.caretX + chartPosition.left + window.pageXOffset - tooltipPosition.width + 10;
    let positionTop = window.pageYOffset + tooltipModel.caretY - (tooltipPosition.height/2);
    if (positionLeft + tooltipPosition.width < (chartPosition.width/2)) {
        positionLeft = positionLeft + tooltipPosition.width + 20 + chartPosition.left;
    }
    if (positionTop + tooltipPosition.height > (chartPosition.height/2)) {
        positionTop = positionTop - (tooltipPosition.height/2);
    }
    
    // Display, position, and set styles for font
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = positionLeft + 'px';
    tooltipEl.style.top = positionTop + 'px';
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
        Chart.defaults.fontFamily = 'Lato';
        
        Chart.defaults.global.elements.point = Object.assign(Chart.defaults.global.elements.point, {
            radius: 2,
            hoverRadius: 4
        });
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
                                    return NumberUtil.shorten(value, 1);
                                }
                            },
                            gridLines: {
                                borderDash: [5, 5],
                                drawBorder: false,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            gridLines: {
                                display: false,
                                drawBorder: false,
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
                            const label = data.datasets[tooltipItem.datasetIndex].label;
                            return [tooltipItem.value, label];
                        },
                    },
                },
                legend: {
                    display: false,
                },
                legendCallback: function (chart) {
                    setChartDataset(chart.data.datasets);
                    setChartInstance(chart);
                    setLegends(formatLegends(chart.data.datasets));
                },
            },
        });
        chartInstance.generateLegend();
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
        <div className='chart' style={{position: "relative"}}>
            <canvas ref={canvas} id='chart' width='400' height='300'/>
            {chartDataset ? (
                <div className='legend-cntr flex justify-center mar-0'>
                        {legends.map((legend, index) => {
                            const style = {};
                            style.opacity = legend.hidden ? '0.7' : '1';

                            return (
                                <div
                                    className='legend flex align-middle pointer'
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