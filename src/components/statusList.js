import React from 'react';
import '../css/StatusList.css';
import Checkbox from './checkbox';
import {CSSTransition, SwitchTransition} from "react-transition-group";

function statusList(props) {
    const stats = props.stats.sort((a, b) => b.all.total - a.all.total);
    const statsHash = stats.length + stats && stats[0];
    return (
        <SwitchTransition mode="out-in">
            <CSSTransition
                in={true}
                key={statsHash}
                classNames='fade'
                timeout={{appear: 500, enter: 500, exit: 100}}
            >
                <ul className='status-list scroll-bar'>
                    {stats.map((stat, index) => (
                        <li key={index}>
                            <div
                                className={
                                    'value region flex align-middle' +
                                    (props.isSelectionMode && stat.hasHistoricData ? ' pointer' : '')
                                }
                                onClick={(event) => {
                                    event.stopPropagation();
                                    stat.hasHistoricData && props.onCheckboxClick(stat.code)
                                }}>
                                {/*<div className="total today">{props.format(stat.all.total)}</div>*/}
                                <div
                                    className={
                                        'checkbox' +
                                        (props.isSelectionMode && stat.hasHistoricData ? ' show' : '')
                                    }>
                                    <Checkbox isChecked={props.checkedIndex.includes(stat.code)}/>
                                </div>
                                <div className='label'>
                                    {stat.hasDistrictInfo && !props.isSelectionMode ? (
                                        <>
                                            {!props.loadingDistrictStats ? (
                                                <div
                                                    className='district-info pointer'
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        props.onDistrictViewSelect(stat.code)
                                                    }}>
                                                    {' '}
                                                    District View
                                                    <span className='arrow' style={{marginLeft: '3px'}}>
                                                        →
                                                    </span>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                            {props.loadingDistrictStats &&
                                            props.loadingDistrictStats === stat.code ? (
                                                <div className='spinner'>
                                                    <div className='bounce1'/>
                                                    <div className='bounce2'/>
                                                    <div className='bounce3'/>
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                    {stat.label}
                                </div>
                            </div>
                            <div className='value total1'>
                                <div className='today brown bolder'>
                                    {props.format(stat.delta.total, stat.delta.totalSymbol, true)}
                                </div>
                                <div className='total' title={props.humanise(stat.all.total)}>{props.format(stat.all.total)}</div>
                            </div>
                            <div className='value active'>
                                <div className='today orange bolder'>
                                    {props.format(stat.delta.active, stat.delta.activeSymbol, true)}
                                </div>
                                <div className='total' title={props.humanise(stat.all.active)}>{props.format(stat.all.active)}</div>
                            </div>
                            <div className='value recovered'>
                                <div className='today green bolder'>
                                    {props.format(stat.delta.recover, stat.delta.recoverSymbol, true)}
                                </div>
                                <div className='total' title={props.humanise(stat.all.recover)}>{props.format(stat.all.recover)}</div>
                            </div>
                            <div className='value death'>
                                <div className='today red bolder'>
                                    {props.format(stat.delta.fatal, stat.delta.recoverSymbol, true)}
                                </div>
                                <div className='total' title={props.humanise(stat.all.fatal)}>{props.format(stat.all.fatal)}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CSSTransition>
        </SwitchTransition>
    );
}
const arraysMatch = function (arr1, arr2) {

    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
};
const checkMemoize = (prevProps = [], nextProps = []) => {
    return prevProps && nextProps && arraysMatch(prevProps.stats, nextProps.stats);
}

const memoizedStatusList = React.memo(statusList);

export default memoizedStatusList;
