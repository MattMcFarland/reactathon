import React from 'react';
import { Collapse } from 'react-bootstrap';

export const Logo = () => (
  <span style={{fontWeight: 'bold', fontFamily: 'Hack'}}>
    <span style={{color: '#E26262'}}>
      React
    </span>
    <span style={{color: 'grey'}}>
      athon
    </span>
  </span>
);

export const Button = ({
  children,
  onClick,
  kind = 'info'
  }) => (
  <button onClick={onClick} type='button' className={'btn btn-' + kind}>
    {children}
  </button>
);

export const Icon = ({
  name
  }) => (
  <span className={'icon icon-' + name}/>
);

export const Alert = ({
  children,
  kind = 'info'
  }) => (
  <div className={'alert alert-' + kind}>
    {children}
  </div>
);

const selectAll = (e) => {
  let target = e.target;
  target.setSelectionRange(0, target.value.length);
};

export const PastaLink = ({
  label,
  value
}) => (
  <div className='form-group'>
    <label>{label}</label>
    <input
      className='form-control'
      readOnly
      type='text' value={value} onClick={selectAll} />
  </div>
);

const Title = ({
  children
}) => (
  <strong>
    {children}
  </strong>
);


export const Radio = ({
  name,
  value,
  children,
  onChange,
  set
}) => (
  <label className="radio-inline">
  <input
    onChange = {onChange}
    checked = {set === value}
    type = 'radio'
    name = {name}
    id = {name}
    value = {value} />
    {children}
  </label>
);

export const Expander = ({
  isExpanded = false,
  title,
  children,
  onToggle
}) => (
  <span>
    <Title>
      <Button kind="link btn-sm" onClick={onToggle}>
        {title}
        &nbsp;
        <Icon name={isExpanded ? 'caret-down' : 'caret-right'}/>
      </Button>
    </Title>
    <Collapse in={isExpanded}>
      <div>
        {children}
      </div>
    </Collapse>
  </span>
);
