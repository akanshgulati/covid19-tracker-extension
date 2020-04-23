import React from 'react';
import '../css/StatusList.css';
import Checkbox from './checkbox';

function statusList(props) {
    const stats = props.stats.sort((a, b) => b.all.total - a.all.total);
    return (
        <ul className='status-list scroll-bar'>
            {stats.map((stat, index) => (
                <li key={index}>
                    <div
                        className={'value region flex align-middle' + (props.isSelectionMode && stat.hasHistoricData ? ' pointer' : '')}
                        onClick={() => stat.hasHistoricData && props.onCheckboxClick(stat.code)}>
                        {/*<div className="total today">{props.format(stat.all.total)}</div>*/}
                        <div className={'checkbox' + (props.isSelectionMode && stat.hasHistoricData ? ' show' : '')}>
                            <Checkbox isChecked={props.checkedIndex.includes(stat.code)}/>
                        </div>
                        <div className='label'>{stat.label}</div>
                    </div>
                    <div className='value total1'>
                        <div className='today brown bolder'>
                            {props.format(stat.delta.total, stat.delta.totalSymbol, true)}
                        </div>
                        <div className='total'>{props.format(stat.all.total)}</div>
                    </div>
                    <div className='value active'>
                        <div className='today orange bolder'>
                            {props.format(stat.delta.active, stat.delta.activeSymbol, true)}
                        </div>
                        <div className='total'>{props.format(stat.all.active)}</div>
                    </div>
                    <div className='value recovered'>
                        <div className='today green bolder'>
                            {props.format(stat.delta.recover, stat.delta.recoverSymbol, true)}
                        </div>
                        <div className='total'>{props.format(stat.all.recover)}</div>
                    </div>
                    <div className='value death'>
                        <div className='today red bolder'>
                            {props.format(stat.delta.fatal, stat.delta.recoverSymbol, true)}
                        </div>
                        <div className='total'>{props.format(stat.all.fatal)}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default statusList;
